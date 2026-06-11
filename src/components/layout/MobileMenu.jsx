import React, { useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiX, HiOutlineSearch } from 'react-icons/hi'
import {
  RiInstagramLine,
  RiFacebookLine,
  RiTwitterXLine,
  RiYoutubeLine,
} from 'react-icons/ri'

const MobileMenu = ({ isOpen, onClose, links = [], onSearch }) => {
  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(26, 15, 10, 0.5)', backdropFilter: 'blur(2px)' }}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            key="mobile-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-0 right-0 h-full w-80 max-w-[85vw] z-50 bg-cream flex flex-col shadow-luxury"
            aria-label="Mobile navigation"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-cream-dark">
              <span className="font-display text-sm font-bold tracking-[0.15em] uppercase text-spice-brown">
                The Masala Company
              </span>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="p-2 rounded-xs text-charcoal-muted hover:text-spice-brown hover:bg-cream-dark transition-colors duration-150"
              >
                <HiX size={20} />
              </button>
            </div>

            {/* Search bar inside menu */}
            <div className="px-6 pb-2">
              <button
                onClick={() => { onClose(); onSearch?.() }}
                className="w-full flex items-center gap-3 px-4 py-3 bg-cream-dark/60 rounded-md text-charcoal-muted font-body text-sm hover:bg-cream-dark transition-colors"
              >
                <HiOutlineSearch size={16} />
                <span>Search spices...</span>
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-6 py-4 flex flex-col gap-1" aria-label="Mobile navigation links">
              {links.map(({ label, to }, i) => (
                <motion.div
                  key={to}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.25 }}
                >
                  <NavLink
                    to={to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      [
                        'block py-3 px-2 font-body text-base tracking-wide border-b border-cream-dark/60',
                        'transition-colors duration-150',
                        isActive
                          ? 'text-spice-brown font-medium'
                          : 'text-charcoal-soft hover:text-spice-brown',
                      ].join(' ')
                    }
                  >
                    {label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            {/* Footer area */}
            <div className="px-6 py-6 border-t border-cream-dark space-y-4">
              {/* Auth links */}
              <div className="flex gap-3">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="flex-1 text-center py-2.5 bg-spice-brown text-cream font-body text-xs uppercase tracking-widest hover:bg-turmeric transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/profile?tab=wishlist"
                  onClick={onClose}
                  className="flex-1 text-center py-2.5 border border-spice-brown/30 text-spice-brown font-body text-xs uppercase tracking-widest hover:border-spice-brown transition-colors"
                >
                  Wishlist
                </Link>
              </div>
              <p className="font-accent text-sm text-charcoal-muted italic">
                From Farm to Flavor
              </p>
              <div className="flex items-center gap-4">
                {[RiInstagramLine, RiFacebookLine, RiTwitterXLine, RiYoutubeLine].map((Icon, i) => (
                  <button
                    key={i}
                    aria-label="Social link"
                    className="text-charcoal-muted hover:text-spice-brown transition-colors duration-150"
                  >
                    <Icon size={18} />
                  </button>
                ))}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export default MobileMenu
