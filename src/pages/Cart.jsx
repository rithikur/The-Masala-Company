import React from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineTrash, HiMinus, HiPlus, HiOutlineArrowLeft } from 'react-icons/hi'
import useCart from '../hooks/useCart'
import PageWrapper from '../components/layout/PageWrapper'
import SEOHead from '../components/seo/SEOHead'

const Cart = () => {
  const { items, subtotal, updateQuantity, removeFromCart } = useCart()

  return (
    <PageWrapper transparentNav={false} darkNavText={true}>
      <SEOHead title="Your Cart" />
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 mt-10">
        
        <Link 
          to="/products" 
          className="inline-flex items-center gap-2 font-serif text-xs uppercase tracking-[0.2em] text-ochre hover:text-earth transition-colors mb-12"
        >
          <HiOutlineArrowLeft /> Continue Shopping
        </Link>

        <h1 className="font-serif text-3xl text-earth mb-12">Your Selection</h1>

        {items.length === 0 ? (
          <div className="text-center py-32 border border-dashed border-earth/20 rounded-none bg-cream-dark">
            <p className="font-serif text-xl text-earth/60 italic mb-8">Your shopping bag is empty.</p>
            <Link to="/products" className="inline-block bg-earth text-cream font-serif text-xs uppercase tracking-[0.2em] px-10 py-5 hover:bg-transparent hover:text-earth border border-earth transition-all duration-300 rounded-none">
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left: Cart Items */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {items.map((item) => (
                <div key={item.variant.id} className="flex gap-6 pb-8 border-b border-earth/10">
                  <div className="w-32 h-40 bg-cream-dark border border-earth/5 overflow-hidden shrink-0">
                    <img
                      src={item.product.images?.[0]?.url || '/images/product_garam_masala.png'}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = '/images/product_garam_masala.png'
                      }}
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link to={`/products/${item.product.slug}`} className="font-serif text-lg text-earth leading-tight hover:text-ochre transition-colors">
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.variant.id)}
                          className="text-earth/40 hover:text-earth transition-colors ml-4 p-2"
                          aria-label="Remove item"
                        >
                          <HiOutlineTrash size={20} />
                        </button>
                      </div>
                      <span className="font-sans text-xs uppercase tracking-wider text-ochre mt-2 block">
                        Weight: {item.variant.weight}
                      </span>
                    </div>

                    <div className="flex items-end justify-between mt-6">
                      <div className="flex items-center border border-earth/20 rounded-none h-12">
                        <button
                          onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}
                          className="w-10 h-full flex items-center justify-center text-earth hover:bg-earth/5 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <HiMinus size={14} />
                        </button>
                        <span className="font-sans text-sm w-10 text-center text-earth font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                          className="w-10 h-full flex items-center justify-center text-earth hover:bg-earth/5 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <HiPlus size={14} />
                        </button>
                      </div>

                      <div className="font-['Outfit'] text-lg font-medium text-earth">
                        ₹{(parseFloat(item.variant.price) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Order Summary */}
            <aside className="lg:col-span-4 lg:sticky lg:top-32 bg-cream-dark border border-earth/10 p-8 rounded-none">
              <h2 className="font-serif text-sm uppercase tracking-[0.2em] text-earth mb-8 border-b border-earth/10 pb-4">
                Order Summary
              </h2>

              <div className="flex flex-col gap-4">
                <div className="flex justify-between font-serif text-base text-earth/70">
                  <span>Subtotal</span>
                  <span className="font-['Outfit'] font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-serif text-base text-earth/70">
                  <span>Shipping</span>
                  <span className="italic">Calculated at checkout</span>
                </div>
                
                <div className="border-t border-earth/10 mt-4 pt-6 flex justify-between items-end">
                  <span className="font-serif text-lg text-earth">Estimated Total</span>
                  <span className="font-['Outfit'] text-2xl font-medium text-earth">₹{subtotal.toFixed(2)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full block text-center py-5 mt-10 bg-earth text-cream font-serif text-sm uppercase tracking-[0.2em] border border-earth hover:bg-transparent hover:text-earth transition-all duration-300 rounded-none shadow-luxury"
              >
                Secure Checkout
              </Link>
              
              <div className="mt-6 flex items-center justify-center gap-4 text-earth/40 text-sm">
                <span>Secure SSL Encryption</span>
              </div>
            </aside>

          </div>
        )}
      </div>
    </PageWrapper>
  )
}

export default Cart
