import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import SEOHead from '../components/seo/SEOHead'
import useCart from '../hooks/useCart'
import useAuth from '../hooks/useAuth'
import api from '../services/api'
import { toast } from 'react-hot-toast'
import {
  HiOutlineArrowLeft, HiOutlineCheckCircle,
  HiOutlineCash, HiOutlineCreditCard, HiShieldCheck
} from 'react-icons/hi'

// Save order to localStorage so Profile/Orders page can display it
const saveOrderLocally = (order) => {
  try {
    const existing = JSON.parse(localStorage.getItem('masala_local_orders') || '[]')
    existing.unshift(order)
    localStorage.setItem('masala_local_orders', JSON.stringify(existing.slice(0, 50)))
  } catch (_) {}
}

const PAYMENT_METHODS = [
  { id: 'cod',  label: 'Cash on Delivery', icon: HiOutlineCash,       desc: 'Pay when your order arrives' },
  { id: 'card', label: 'Credit / Debit Card', icon: HiOutlineCreditCard, desc: 'Visa, Mastercard, RuPay' },
]

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [paymentMethod, setPaymentMethod] = useState('cod')

  const [formData, setFormData] = useState({
    firstName:  user?.first_name || '',
    lastName:   user?.last_name  || '',
    email:      user?.email      || '',
    phone:      user?.phone      || '',
    addressLine: '',
    city:        '',
    state:       '',
    postalCode:  '',
    // card fields
    cardName:   '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc:    '',
  })

  const [isSubmitting, setIsSubmitting]   = useState(false)
  const [orderSuccess, setOrderSuccess]   = useState(false)
  const [createdOrder, setCreatedOrder]   = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Basic card number formatting (groups of 4)
  const handleCardNumber = (e) => {
    const v = e.target.value.replace(/\D/g, '').slice(0, 16)
    const formatted = v.match(/.{1,4}/g)?.join(' ') || v
    setFormData(prev => ({ ...prev, cardNumber: formatted }))
  }

  const handleCardExpiry = (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 4)
    if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2)
    setFormData(prev => ({ ...prev, cardExpiry: v }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (items.length === 0) { toast.error('Your cart is empty.'); return }
    if (!formData.addressLine || !formData.city || !formData.postalCode) {
      toast.error('Please fill in your shipping details.'); return
    }
    if (!formData.phone) { toast.error('Phone number is required.'); return }
    if (paymentMethod === 'card') {
      if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCvc) {
        toast.error('Please enter your card details.'); return
      }
    }

    setIsSubmitting(true)

    const shippingAddress = {
      first_name:   formData.firstName,
      last_name:    formData.lastName,
      email:        formData.email,
      phone:        formData.phone,
      address_line: formData.addressLine,
      city:         formData.city,
      state:        formData.state,
      postal_code:  formData.postalCode,
    }

    const orderItems = items.map(item => ({
      variant_id:     item.variant.id,
      quantity:       item.quantity,
      price_at_time:  parseFloat(item.variant.price),
      product_variants: {
        weight: item.variant.weight,
        products: { name: item.product.name },
      }
    }))

    // Build the local order object (used both online and offline)
    const localOrder = {
      id:               `TMC-${Date.now().toString(36).toUpperCase().slice(-6)}`,
      total_amount:     subtotal,
      shipping_address: shippingAddress,
      payment_method:   paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card',
      status:           paymentMethod === 'cod' ? 'confirmed' : 'confirmed',
      created_at:       new Date().toISOString(),
      items:            orderItems,
    }

    try {
      // Try backend first if authenticated
      if (isAuthenticated) {
        try {
          const response = await api.post('/api/orders', {
            total_amount:     subtotal,
            shipping_address: shippingAddress,
            payment_method:   paymentMethod,
            items:            items.map(item => ({
              variant_id:    item.variant.id,
              quantity:      item.quantity,
              price_at_time: parseFloat(item.variant.price),
            })),
          })
          const serverOrder = response.data.data
          saveOrderLocally({ ...serverOrder, payment_method: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card' })
          setCreatedOrder(serverOrder)
        } catch (_backendErr) {
          // Backend offline — use local order
          saveOrderLocally(localOrder)
          setCreatedOrder(localOrder)
        }
      } else {
        // Guest mode
        saveOrderLocally(localOrder)
        setCreatedOrder(localOrder)
      }

      setOrderSuccess(true)
      clearCart()
      toast.success('Order placed successfully! 🎉')
    } catch (err) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Order Success Screen ────────────────────────────────────────────────────
  if (orderSuccess && createdOrder) {
    const isCOD = createdOrder.payment_method === 'Cash on Delivery' || paymentMethod === 'cod'
    return (
      <PageWrapper transparentNav={false} darkNavText={true}>
        <SEOHead title="Order Confirmed — The Masala Company" />
        <div className="max-w-2xl mx-auto px-6 py-32 text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-6">
            <HiOutlineCheckCircle className="text-green-500 text-5xl" />
          </div>
          <p className="font-body text-xs uppercase tracking-[0.3em] text-turmeric mb-2">Order Confirmed</p>
          <h1 className="font-serif text-3xl text-earth mb-3">Thank you for your order!</h1>
          <p className="font-body text-sm text-earth/60 mb-10 max-w-sm">
            Your order <strong className="text-earth">#{createdOrder.id}</strong> has been placed successfully.
            {isCOD && ' Please keep cash ready at the time of delivery.'}
          </p>

          {/* Order details card */}
          <div className="w-full border border-earth/10 p-6 bg-cream-dark mb-6 text-left">
            <p className="font-body text-[10px] uppercase tracking-widest text-turmeric mb-4">Delivery Details</p>
            <p className="font-serif text-sm text-earth font-medium">
              {createdOrder.shipping_address?.first_name} {createdOrder.shipping_address?.last_name}
            </p>
            <p className="font-body text-sm text-earth/70 mt-1 leading-relaxed">
              {createdOrder.shipping_address?.address_line},<br />
              {createdOrder.shipping_address?.city}{createdOrder.shipping_address?.state ? `, ${createdOrder.shipping_address.state}` : ''} — {createdOrder.shipping_address?.postal_code}
            </p>
            <p className="font-body text-xs text-earth/50 mt-2">📞 {createdOrder.shipping_address?.phone}</p>
          </div>

          <div className="w-full border border-earth/10 p-6 bg-cream-dark mb-10 text-left flex justify-between items-center">
            <div>
              <p className="font-body text-[10px] uppercase tracking-widest text-turmeric mb-1">Payment Method</p>
              <p className="font-serif text-sm text-earth">{createdOrder.payment_method || (isCOD ? 'Cash on Delivery' : 'Card')}</p>
            </div>
            <div className="text-right">
              <p className="font-body text-[10px] uppercase tracking-widest text-turmeric mb-1">Total Amount</p>
              <p className="font-serif text-lg text-earth font-medium">₹{parseFloat(createdOrder.total_amount).toFixed(2)}</p>
            </div>
          </div>

          <div className="flex gap-4 flex-wrap justify-center">
            <Link to="/products" className="font-body text-xs uppercase tracking-[0.2em] border border-earth px-8 py-4 hover:bg-earth hover:text-cream transition-all duration-300 rounded-none">
              Continue Shopping
            </Link>
            {isAuthenticated && (
              <Link to="/profile" className="font-body text-xs uppercase tracking-[0.2em] bg-earth text-cream border border-earth px-8 py-4 hover:bg-transparent hover:text-earth transition-all duration-300 rounded-none">
                View My Orders
              </Link>
            )}
          </div>
        </div>
      </PageWrapper>
    )
  }

  // ── Checkout Form ────────────────────────────────────────────────────────────
  return (
    <PageWrapper transparentNav={false} darkNavText={true}>
      <SEOHead title="Checkout — The Masala Company" />
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 mt-10">

        <Link to="/cart" className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.2em] text-turmeric hover:text-earth transition-colors mb-12">
          <HiOutlineArrowLeft /> Back to Cart
        </Link>

        <h1 className="font-serif text-3xl text-earth mb-12">Secure Checkout</h1>

        {items.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-earth/20">
            <p className="font-serif text-lg text-earth/60 italic mb-6">Your bag is empty.</p>
            <Link to="/products" className="inline-block bg-earth text-cream font-body text-xs uppercase tracking-[0.2em] px-8 py-4 hover:bg-transparent hover:text-earth border border-earth transition-all rounded-none">
              Shop Spices
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

            {/* LEFT: Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 flex flex-col gap-10">

              {/* 1. Shipping */}
              <section>
                <h2 className="font-body text-xs uppercase tracking-[0.2em] text-turmeric mb-6 border-b border-earth/10 pb-2">
                  1. Shipping Destination
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                  <Field label="Last Name"  name="lastName"  value={formData.lastName}  onChange={handleInputChange} required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <Field label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                  <Field label="Phone Number"  name="phone" type="tel"   value={formData.phone} onChange={handleInputChange} required placeholder="+91 98765 43210" />
                </div>
                <div className="mt-4">
                  <Field label="Street Address" name="addressLine" value={formData.addressLine} onChange={handleInputChange} required placeholder="House no., Street, Area" />
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="col-span-1">
                    <Field label="State" name="state" value={formData.state} onChange={handleInputChange} placeholder="e.g. Kerala" />
                  </div>
                  <div className="col-span-1">
                    <Field label="City" name="city" value={formData.city} onChange={handleInputChange} required />
                  </div>
                  <div className="col-span-1">
                    <Field label="PIN Code" name="postalCode" value={formData.postalCode} onChange={handleInputChange} required placeholder="6-digit PIN" />
                  </div>
                </div>
              </section>

              {/* 2. Payment Method */}
              <section>
                <h2 className="font-body text-xs uppercase tracking-[0.2em] text-turmeric mb-6 border-b border-earth/10 pb-2">
                  2. Payment Method
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {PAYMENT_METHODS.map(pm => {
                    const Icon = pm.icon
                    const active = paymentMethod === pm.id
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPaymentMethod(pm.id)}
                        className={`flex items-start gap-4 p-4 border-2 text-left transition-all rounded-none ${
                          active ? 'border-earth bg-cream-dark' : 'border-earth/15 hover:border-earth/40'
                        }`}
                      >
                        <div className={`p-2 rounded-full mt-0.5 ${active ? 'bg-earth text-cream' : 'bg-earth/10 text-earth'}`}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="font-body text-sm font-semibold text-earth">{pm.label}</p>
                          <p className="font-body text-[11px] text-earth/50 mt-0.5">{pm.desc}</p>
                        </div>
                        <div className={`ml-auto w-4 h-4 rounded-full border-2 mt-1 shrink-0 ${active ? 'border-earth bg-earth' : 'border-earth/30'}`} />
                      </button>
                    )
                  })}
                </div>

                {/* COD Info */}
                {paymentMethod === 'cod' && (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-none flex gap-3">
                    <HiOutlineCash className="text-amber-600 mt-0.5 shrink-0" size={20} />
                    <div>
                      <p className="font-body text-sm font-semibold text-amber-800">Cash on Delivery</p>
                      <p className="font-body text-xs text-amber-700 mt-1 leading-relaxed">
                        Keep the exact amount of <strong>₹{subtotal.toFixed(2)}</strong> ready at the time of delivery.
                        Our delivery partner will collect payment.
                      </p>
                    </div>
                  </div>
                )}

                {/* Card Fields */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4 border border-earth/10 p-6 bg-cream-dark/30">
                    <div className="flex items-center gap-2 mb-4">
                      <HiShieldCheck className="text-green-600" size={16} />
                      <span className="font-body text-[10px] text-earth/50 uppercase tracking-wider">256-bit SSL Encrypted (Simulated)</span>
                    </div>
                    <Field label="Cardholder Name" name="cardName" value={formData.cardName} onChange={handleInputChange} placeholder={`${formData.firstName} ${formData.lastName}`} />
                    <div>
                      <label className="font-body text-[10px] uppercase tracking-wider text-earth/60 block mb-1">Card Number</label>
                      <input
                        type="text"
                        value={formData.cardNumber}
                        onChange={handleCardNumber}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full border border-earth/20 p-3 font-body text-sm bg-transparent outline-none focus:border-earth rounded-none tracking-widest"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="font-body text-[10px] uppercase tracking-wider text-earth/60 block mb-1">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          value={formData.cardExpiry}
                          onChange={handleCardExpiry}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full border border-earth/20 p-3 font-body text-sm bg-transparent outline-none focus:border-earth rounded-none"
                        />
                      </div>
                      <div>
                        <label className="font-body text-[10px] uppercase tracking-wider text-earth/60 block mb-1">CVV</label>
                        <input
                          type="password"
                          name="cardCvc"
                          value={formData.cardCvc}
                          onChange={handleInputChange}
                          placeholder="•••"
                          maxLength={4}
                          className="w-full border border-earth/20 p-3 font-body text-sm bg-transparent outline-none focus:border-earth rounded-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-earth text-cream font-body text-xs uppercase tracking-[0.3em] border border-earth hover:bg-transparent hover:text-earth transition-all duration-300 rounded-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? 'Placing Order...'
                  : paymentMethod === 'cod'
                    ? `Place Order — ₹${subtotal.toFixed(2)} (Pay on Delivery)`
                    : `Pay Now — ₹${subtotal.toFixed(2)}`
                }
              </button>

            </form>

            {/* RIGHT: Order Summary */}
            <aside className="lg:col-span-5 lg:sticky lg:top-32 bg-cream-dark border border-earth/10 p-8 rounded-none">
              <h2 className="font-body text-xs uppercase tracking-[0.2em] text-turmeric mb-6 border-b border-earth/10 pb-2">
                Order Summary
              </h2>

              <div className="flex flex-col gap-4 max-h-80 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.variant.id} className="flex gap-4 items-center">
                    <div className="w-12 h-16 bg-cream border border-earth/5 overflow-hidden shrink-0">
                      <img
                        src={item.product.images?.[0]?.url || '/images/product_garam_masala.jpg'}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-sm text-earth leading-tight truncate">{item.product.name}</h4>
                      <p className="font-body text-[9px] uppercase tracking-wider text-turmeric mt-1">
                        {item.variant.weight} &times; {item.quantity}
                      </p>
                    </div>
                    <span className="font-serif text-sm text-earth shrink-0">
                      ₹{(parseFloat(item.variant.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-earth/10 mt-6 pt-6 flex flex-col gap-3">
                <div className="flex justify-between font-body text-sm text-earth/70">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-body text-sm text-earth/70">
                  <span>Shipping</span>
                  <span className="italic text-green-600">Free</span>
                </div>
                <div className="flex justify-between font-body text-sm text-earth/70">
                  <span>Payment</span>
                  <span>{paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card'}</span>
                </div>
                <div className="flex justify-between border-t border-earth/10 pt-4 font-serif text-base text-earth font-medium">
                  <span>Total</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
              </div>
            </aside>

          </div>
        )}
      </div>
    </PageWrapper>
  )
}

// Reusable field component
const Field = ({ label, name, type = 'text', value, onChange, required, placeholder }) => (
  <div className="flex flex-col gap-1">
    <label className="font-body text-[10px] uppercase tracking-wider text-earth/60">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="border border-earth/20 p-3 font-body text-sm bg-transparent outline-none focus:border-earth rounded-none w-full"
    />
  </div>
)

export default Checkout
