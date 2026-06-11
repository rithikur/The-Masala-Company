import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineSearch, HiOutlineDocumentText, HiOutlineShoppingBag, HiOutlineUsers, HiOutlineAdjustments, HiOutlineChartBar, HiX } from 'react-icons/hi'

const ADMIN_LINKS = [
  { label: 'Dashboard', to: '/admin', icon: HiOutlineChartBar },
  { label: 'Products', to: '/admin/products', icon: HiOutlineShoppingBag },
  { label: 'Add Product', to: '/admin/products/new', icon: HiOutlineShoppingBag },
  { label: 'Categories', to: '/admin/categories', icon: HiOutlineDocumentText },
  { label: 'Orders', to: '/admin/orders', icon: HiOutlineShoppingBag },
  { label: 'Inventory', to: '/admin/inventory', icon: HiOutlineAdjustments },
  { label: 'Coupons', to: '/admin/coupons', icon: HiOutlineDocumentText },
  { label: 'Customers', to: '/admin/customers', icon: HiOutlineUsers },
  { label: 'Settings', to: '/admin/settings', icon: HiOutlineAdjustments },
]

const AdminCommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus()
      }, 100)
    } else {
      setQuery('')
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const filteredLinks = ADMIN_LINKS.filter(link => 
    link.label.toLowerCase().includes(query.toLowerCase())
  )

  const handleSelect = (to) => {
    navigate(to)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-charcoal-dark/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl bg-white shadow-2xl rounded-lg overflow-hidden relative z-10"
          >
            <div className="flex items-center p-4 border-b border-gray-100">
              <HiOutlineSearch size={20} className="text-gray-400 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search admin pages... (e.g. Products, Settings)"
                className="w-full bg-transparent text-lg font-sans text-charcoal-dark outline-none placeholder:text-gray-300"
              />
              <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 transition-colors">
                <HiX size={20} />
              </button>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filteredLinks.length === 0 ? (
                <div className="py-12 text-center text-gray-400 font-sans text-sm">
                  No results found for "{query}"
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredLinks.map((link) => (
                    <button
                      key={link.to}
                      onClick={() => handleSelect(link.to)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <link.icon className="text-gray-400" size={18} />
                      <span className="font-sans text-charcoal-dark">{link.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-gray-50 border-t border-gray-100 p-3 text-xs text-gray-400 flex justify-between items-center">
              <span>Use <kbd className="bg-white border border-gray-200 rounded px-1.5 py-0.5 mx-1 font-mono text-[10px]">esc</kbd> to close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AdminCommandPalette
