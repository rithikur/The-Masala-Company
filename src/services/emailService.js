/**
 * Email notification service using EmailJS (works entirely from the browser, no backend needed).
 *
 * SETUP INSTRUCTIONS (one-time):
 * 1. Sign up free at https://www.emailjs.com
 * 2. Create a service (Gmail / Outlook) — note the Service ID
 * 3. Create two email templates (Welcome + Order Confirmation) — note Template IDs
 * 4. Copy your Public Key from Account > API Keys
 * 5. Add these to your .env file:
 *    VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
 *    VITE_EMAILJS_WELCOME_TEMPLATE=template_xxxxxxx
 *    VITE_EMAILJS_ORDER_TEMPLATE=template_xxxxxxx
 *    VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
 *
 * Until then, emails are logged to console in dev mode.
 */

import emailjs from '@emailjs/browser'

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID
const WELCOME_TPL = import.meta.env.VITE_EMAILJS_WELCOME_TEMPLATE
const ORDER_TPL   = import.meta.env.VITE_EMAILJS_ORDER_TEMPLATE
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

const isConfigured = SERVICE_ID && WELCOME_TPL && ORDER_TPL && PUBLIC_KEY

/**
 * Send welcome email after sign-up or login.
 * @param {{ name: string, email: string, isNewUser?: boolean }} params
 */
export const sendWelcomeEmail = async ({ name, email, isNewUser = false }) => {
  const templateParams = {
    to_name:  name || 'Valued Customer',
    to_email: email,
    subject:  isNewUser ? 'Welcome to The Masala Company!' : 'Welcome back to The Masala Company!',
    message:  isNewUser
      ? `Thank you for joining The Masala Company, ${name}! Explore our premium single-origin spice collection and add some flavour to every dish.`
      : `Welcome back, ${name}! Great to see you again. Your cart and wishlist are waiting for you.`,
    company_name: 'The Masala Company',
    website_url:  window.location.origin,
  }

  if (isConfigured) {
    try {
      await emailjs.send(SERVICE_ID, WELCOME_TPL, templateParams, PUBLIC_KEY)
      console.log('[EmailJS] Welcome email sent to', email)
    } catch (err) {
      console.warn('[EmailJS] Failed to send welcome email:', err)
    }
  } else {
    // Dev mode — print to console so you can see what would be sent
    console.log('[Email — Dev Mode] Welcome email would be sent:', templateParams)
  }
}

/**
 * Send order confirmation email after a successful order.
 * @param {{ name: string, email: string, orderId: string, total: number, paymentMethod: string, address: object, items: Array }} params
 */
export const sendOrderConfirmationEmail = async ({ name, email, orderId, total, paymentMethod, address, items = [] }) => {
  const itemList = items
    .map(item => {
      const productName = item.product_variants?.products?.name || item.name || 'Product'
      const weight      = item.product_variants?.weight || item.weight || ''
      const qty         = item.quantity || 1
      const price       = item.price_at_time || 0
      return `• ${productName} ${weight ? `(${weight})` : ''} × ${qty} — ₹${(price * qty).toFixed(2)}`
    })
    .join('\n')

  const deliveryAddress = address
    ? `${address.address_line}, ${address.city}${address.state ? ', ' + address.state : ''} — ${address.postal_code}`
    : 'Will be confirmed shortly'

  const templateParams = {
    to_name:        name || 'Valued Customer',
    to_email:       email,
    order_id:       orderId,
    total_amount:   `₹${parseFloat(total).toFixed(2)}`,
    payment_method: paymentMethod || 'Standard',
    delivery_address: deliveryAddress,
    items_list:     itemList || 'See your order summary',
    company_name:   'The Masala Company',
    website_url:    window.location.origin,
    support_email:  'support@themasalacompany.com',
  }

  if (isConfigured) {
    try {
      await emailjs.send(SERVICE_ID, ORDER_TPL, templateParams, PUBLIC_KEY)
      console.log('[EmailJS] Order confirmation sent to', email, 'for order', orderId)
    } catch (err) {
      console.warn('[EmailJS] Failed to send order confirmation:', err)
    }
  } else {
    console.log('[Email — Dev Mode] Order confirmation would be sent:', templateParams)
  }
}
