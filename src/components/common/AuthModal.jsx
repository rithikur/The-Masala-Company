import React from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineX, HiOutlineHeart } from 'react-icons/hi'

const AuthModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-charcoal-dark/60 backdrop-blur-sm" />
      <div
        className="relative bg-cream w-full max-w-sm p-10 text-center shadow-2xl border border-earth/10"
        onClick={e => e.stopPropagation()}
      >
        {/* Accent bar */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-turmeric" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-earth/40 hover:text-earth transition-colors"
        >
          <HiOutlineX size={20} />
        </button>

        <div className="w-14 h-14 rounded-full bg-turmeric/10 flex items-center justify-center mx-auto mb-5">
          <HiOutlineHeart className="text-turmeric w-7 h-7" />
        </div>

        <h2 className="font-serif text-xl text-earth mb-2">Sign in to continue</h2>
        <p className="font-body text-sm text-earth/60 mb-8 leading-relaxed">
          Create an account or sign in to add products to your cart and wishlist.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            to="/login"
            onClick={onClose}
            className="w-full py-3.5 bg-earth text-cream font-body text-xs uppercase tracking-[0.25em] border border-earth hover:bg-transparent hover:text-earth transition-all duration-300 block text-center"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            onClick={onClose}
            className="w-full py-3.5 border border-earth/30 text-earth font-body text-xs uppercase tracking-[0.25em] hover:border-earth transition-all duration-300 block text-center"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AuthModal
