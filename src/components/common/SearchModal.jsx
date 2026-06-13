import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineSearch, HiX } from 'react-icons/hi'

const SearchModal = ({ isOpen, onClose }) => {
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

  const handleSubmit = (e) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return

    // Save to real search history in localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('masala_search_history') || '[]')
      const idx = existing.findIndex(s => s.term.toLowerCase() === q.toLowerCase())
      if (idx > -1) {
        existing[idx].frequency += 1
        existing[idx].last_searched = new Date().toISOString()
      } else {
        existing.unshift({ id: Date.now(), term: q, frequency: 1, last_searched: new Date().toISOString(), results_avg: 0 })
      }
      // Keep max 50 entries
      localStorage.setItem('masala_search_history', JSON.stringify(existing.slice(0, 50)))
    } catch (_) {}

    navigate(`/products?search=${encodeURIComponent(q)}`)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
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
            className="w-full max-w-2xl bg-cream shadow-2xl relative z-10 overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="flex items-center p-2 border-b border-earth/10">
              <div className="pl-4 text-earth/50">
                <HiOutlineSearch size={24} />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for spices, blends, or origins..."
                className="w-full bg-transparent p-4 text-lg font-serif text-charcoal-dark outline-none placeholder:text-earth/40"
              />
              <button
                type="button"
                onClick={onClose}
                className="p-4 text-earth/50 hover:text-charcoal-dark transition-colors"
                aria-label="Close search"
              >
                <HiX size={24} />
              </button>
            </form>
            
            <div className="bg-cream-dark p-6">
              <p className="font-sans text-[10px] uppercase tracking-widest text-earth/60 mb-4">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {['Cardamom', 'Cinnamon', 'Turmeric', 'Garam Masala', 'Kerala', 'Gift Box'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      navigate(`/products?search=${encodeURIComponent(term)}`)
                      onClose()
                    }}
                    className="px-4 py-2 bg-cream text-earth text-sm font-serif border border-earth/10 hover:border-earth/40 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default SearchModal
