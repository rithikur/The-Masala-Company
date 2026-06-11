import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import SEOHead from '../components/seo/SEOHead'
import useCart from '../hooks/useCart'
import useAuth from '../hooks/useAuth'
import api from '../services/api'
import { toast } from 'react-hot-toast'
import { HiOutlineArrowLeft, HiOutlineCheckCircle } from 'react-icons/hi'

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    addressLine: '',
    city: '',
    state: '',
    postalCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [createdOrder, setCreatedOrder] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (items.length === 0) {
      toast.error("Your cart is empty.")
      return
    }

    if (!formData.addressLine || !formData.city || !formData.postalCode) {
      toast.error("Please fill in shipping details.")
      return
    }

    setIsSubmitting(true)

    // Formulate shipping address structure
    const shippingAddress = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address_line: formData.addressLine,
      city: formData.city,
      state: formData.state,
      postal_code: formData.postalCode,
    }

    // Formulate cart items structure
    const orderItems = items.map((item) => ({
      variant_id: item.variant.id,
      quantity: item.quantity,
      price_at_time: parseFloat(item.variant.price),
    }))

    try {
      let orderData = null
      if (isAuthenticated) {
        // Post to backend API
        const response = await api.post('/api/orders', {
          total_amount: subtotal,
          shipping_address: shippingAddress,
          items: orderItems,
        })
        orderData = response.data.data
      } else {
        // Guest mode simulated checkout
        orderData = {
          id: Math.random().toString(36).substr(2, 9).toUpperCase(),
          total_amount: subtotal,
          shipping_address: shippingAddress,
          status: 'pending',
          created_at: new Date().toISOString(),
          items: items.map(item => ({
            product_variants: {
              weight: item.variant.weight,
              products: {
                name: item.product.name
              }
            },
            quantity: item.quantity,
            price_at_time: item.variant.price
          }))
        }
      }

      setCreatedOrder(orderData)
      setOrderSuccess(true)
      clearCart()
      toast.success("Order placed successfully!")
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to place order.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (orderSuccess && createdOrder) {
    return (
      <PageWrapper transparentNav={false} darkNavText={true}>
        <SEOHead title="Order Confirmed" />
        <div className="max-w-2xl mx-auto px-6 py-32 text-center flex flex-col items-center">
          <HiOutlineCheckCircle className="text-ochre text-6xl mb-6 animate-bounce" />
          <h1 className="font-serif text-3xl text-earth mb-4">Thank you for your order</h1>
          <p className="font-serif text-sm text-earth/60 mb-8 max-w-md">
            We are preparing your artisanal spice blend. Order reference ID: <strong>#{createdOrder.id}</strong>.
          </p>

          <div className="w-full border border-earth/10 p-6 bg-cream-dark mb-10 text-left rounded-none">
            <h3 className="font-serif text-xs uppercase tracking-wider text-ochre mb-4">Delivery Details</h3>
            <p className="font-serif text-sm text-earth">
              {createdOrder.shipping_address?.first_name} {createdOrder.shipping_address?.last_name}
            </p>
            <p className="font-serif text-sm text-earth/80 mt-1">
              {createdOrder.shipping_address?.address_line}, {createdOrder.shipping_address?.city}, {createdOrder.shipping_address?.postal_code}
            </p>
          </div>

          <div className="flex gap-4">
            <Link
              to="/products"
              className="font-serif text-xs uppercase tracking-[0.2em] border border-earth px-8 py-4 hover:bg-earth hover:text-cream transition-all duration-300 rounded-none"
            >
              Continue Shopping
            </Link>
            {isAuthenticated && (
              <Link
                to="/profile"
                className="font-serif text-xs uppercase tracking-[0.2em] bg-earth text-cream border border-earth px-8 py-4 hover:bg-transparent hover:text-earth transition-all duration-300 rounded-none"
              >
                View Orders
              </Link>
            )}
          </div>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper transparentNav={false} darkNavText={true}>
      <SEOHead title="Checkout" />
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 mt-10">
        
        <Link 
          to="/products" 
          className="inline-flex items-center gap-2 font-serif text-xs uppercase tracking-[0.2em] text-ochre hover:text-earth transition-colors mb-12"
        >
          <HiOutlineArrowLeft /> Cancel & Return
        </Link>

        <h1 className="font-serif text-3xl text-earth mb-12">Secured Checkout</h1>

        {items.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-earth/20 rounded-none">
            <p className="font-serif text-lg text-earth/60 italic">Your bag is empty. Add blends before checkout.</p>
            <Link to="/products" className="mt-6 inline-block bg-earth text-cream font-serif text-xs uppercase tracking-[0.2em] px-8 py-4 hover:bg-transparent hover:text-earth border border-earth transition-all rounded-none">
              Shop Spices
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left: Shipping/Payment Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 flex flex-col gap-10">
              
              {/* Shipping Address */}
              <div>
                <h2 className="font-serif text-xs uppercase tracking-[0.2em] text-ochre mb-6 border-b border-earth/10 pb-2">
                  1. Shipping Destination
                </h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-sans text-[10px] uppercase tracking-wider text-earth/60">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="border border-earth/20 p-3 font-serif text-sm bg-transparent outline-none focus:border-earth rounded-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-sans text-[10px] uppercase tracking-wider text-earth/60">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="border border-earth/20 p-3 font-serif text-sm bg-transparent outline-none focus:border-earth rounded-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-sans text-[10px] uppercase tracking-wider text-earth/60">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="border border-earth/20 p-3 font-serif text-sm bg-transparent outline-none focus:border-earth rounded-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-sans text-[10px] uppercase tracking-wider text-earth/60">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="border border-earth/20 p-3 font-serif text-sm bg-transparent outline-none focus:border-earth rounded-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1 mt-4">
                  <label className="font-sans text-[10px] uppercase tracking-wider text-earth/60">Street Address</label>
                  <input
                    type="text"
                    name="addressLine"
                    value={formData.addressLine}
                    onChange={handleInputChange}
                    required
                    placeholder="Apartment, suite, unit, building, street, etc."
                    className="border border-earth/20 p-3 font-serif text-sm bg-transparent outline-none focus:border-earth rounded-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="flex flex-col gap-1 col-span-2">
                    <label className="font-sans text-[10px] uppercase tracking-wider text-earth/60">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="border border-earth/20 p-3 font-serif text-sm bg-transparent outline-none focus:border-earth rounded-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-sans text-[10px] uppercase tracking-wider text-earth/60">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                      className="border border-earth/20 p-3 font-serif text-sm bg-transparent outline-none focus:border-earth rounded-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div>
                <h2 className="font-serif text-xs uppercase tracking-[0.2em] text-ochre mb-6 border-b border-earth/10 pb-2">
                  2. Payment Details (Simulated)
                </h2>

                <div className="flex flex-col gap-1">
                  <label className="font-sans text-[10px] uppercase tracking-wider text-earth/60">Cardholder Name</label>
                  <input
                    type="text"
                    required
                    defaultValue={`${formData.firstName} ${formData.lastName}`}
                    className="border border-earth/20 p-3 font-serif text-sm bg-transparent outline-none focus:border-earth rounded-none"
                  />
                </div>

                <div className="flex flex-col gap-1 mt-4">
                  <label className="font-sans text-[10px] uppercase tracking-wider text-earth/60">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                    placeholder="xxxx xxxx xxxx xxxx"
                    className="border border-earth/20 p-3 font-serif text-sm bg-transparent outline-none focus:border-earth rounded-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-sans text-[10px] uppercase tracking-wider text-earth/60">Expiry Date</label>
                    <input
                      type="text"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                      required
                      placeholder="MM/YY"
                      className="border border-earth/20 p-3 font-serif text-sm bg-transparent outline-none focus:border-earth rounded-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-sans text-[10px] uppercase tracking-wider text-earth/60">CVC / CVV</label>
                    <input
                      type="password"
                      name="cardCvc"
                      value={formData.cardCvc}
                      onChange={handleInputChange}
                      required
                      maxLength="3"
                      placeholder="•••"
                      className="border border-earth/20 p-3 font-serif text-sm bg-transparent outline-none focus:border-earth rounded-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-earth text-cream font-serif text-xs uppercase tracking-[0.2em] border border-earth hover:bg-transparent hover:text-earth transition-all duration-300 rounded-none cursor-pointer"
              >
                {isSubmitting ? "Processing Transaction..." : `Authorize Payment — ₹${subtotal.toFixed(2)}`}
              </button>

            </form>

            {/* Right: Sticky Order Summary */}
            <aside className="lg:col-span-5 lg:sticky lg:top-32 bg-cream-dark border border-earth/10 p-8 rounded-none">
              <h2 className="font-serif text-xs uppercase tracking-[0.2em] text-ochre mb-6 border-b border-earth/10 pb-2">
                Order Summary
              </h2>

              <div className="flex flex-col gap-4 max-h-96 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.variant.id} className="flex gap-4 items-center">
                    <div className="w-12 h-16 bg-cream border border-earth/5 overflow-hidden shrink-0">
                      <img
                        src={item.product.images?.[0]?.url || '/images/product_garam_masala.jpg'}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-serif text-sm text-earth leading-tight">{item.product.name}</h4>
                      <p className="font-sans text-[9px] uppercase tracking-wider text-ochre mt-1">
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
                <div className="flex justify-between font-serif text-sm text-earth/70">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-serif text-sm text-earth/70">
                  <span>Shipping</span>
                  <span className="italic">Complimentary</span>
                </div>
                <div className="flex justify-between border-t border-earth/10 pt-4 font-serif text-base text-earth">
                  <span>Total Amount</span>
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

export default Checkout
