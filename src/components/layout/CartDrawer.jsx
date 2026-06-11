import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HiOutlineX, HiOutlineTrash, HiMinus, HiPlus } from 'react-icons/hi'
import useCart from '../../hooks/useCart'

const CartDrawer = ({ isOpen, onClose }) => {
  const { items, subtotal, updateQuantity, removeFromCart } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-earth/40 z-[100]"
          />

          {/* Cart Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-cream z-[101] shadow-2xl border-l border-earth/10 flex flex-col rounded-none"
          >
            {/* Header */}
            <div className="p-6 border-b border-earth/10 flex items-center justify-between">
              <h2 className="font-serif text-lg tracking-wider text-earth uppercase">Your Selection</h2>
              <button
                onClick={onClose}
                className="p-1 text-earth/60 hover:text-earth transition-colors"
                aria-label="Close cart"
              >
                <HiOutlineX size={20} />
              </button>
            </div>

            {/* Item List */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                  <p className="font-serif text-earth/60 italic mb-6">Your shopping bag is empty.</p>
                  <button
                    onClick={onClose}
                    className="font-serif text-xs uppercase tracking-[0.2em] border border-earth px-6 py-3 hover:bg-earth hover:text-cream transition-all duration-300 rounded-none"
                  >
                    Continue Browsing
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.variant.id}
                    className="flex gap-4 pb-6 border-b border-earth/5 last:border-none"
                  >
                    <div className="w-20 h-24 bg-cream-dark border border-earth/5 overflow-hidden shrink-0">
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
                          <h3 className="font-serif text-sm text-earth leading-tight">
                            {item.product.name}
                          </h3>
                          <button
                            onClick={() => removeFromCart(item.variant.id)}
                            className="text-earth/40 hover:text-earth transition-colors ml-2"
                            aria-label="Remove item"
                          >
                            <HiOutlineTrash size={16} />
                          </button>
                        </div>
                        <span className="font-sans text-[10px] uppercase tracking-wider text-ochre mt-1 block">
                          Weight: {item.variant.weight}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity controls with sharp borders */}
                        <div className="flex items-center border border-earth/20 rounded-none">
                          <button
                            onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}
                            className="p-1 px-2 text-earth hover:bg-earth/5 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <HiMinus size={12} />
                          </button>
                          <span className="font-sans text-xs px-3 text-earth font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                            className="p-1 px-2 text-earth hover:bg-earth/5 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <HiPlus size={12} />
                          </button>
                        </div>

                        <div className="font-['Outfit'] text-sm text-earth">
                          ₹{(parseFloat(item.variant.price) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="p-6 border-t border-earth/10 bg-cream-dark">
                <div className="flex justify-between mb-4">
                  <span className="font-serif text-sm text-earth uppercase tracking-wider">Subtotal</span>
                  <span className="font-['Outfit'] font-medium text-lg text-earth">₹{subtotal.toFixed(2)}</span>
                </div>
                <p className="font-sans text-[10px] text-earth/50 italic mb-6">
                  Shipping, taxes, and discounts calculated at checkout.
                </p>

                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="w-full block py-4 text-center bg-earth text-cream font-serif text-xs uppercase tracking-[0.2em] border border-earth hover:bg-transparent hover:text-earth transition-all duration-300 rounded-none"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CartDrawer
