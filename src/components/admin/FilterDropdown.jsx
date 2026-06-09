import React, { useState, useEffect, useRef } from 'react'
import { HiChevronDown, HiCheck } from 'react-icons/hi'

const FilterDropdown = ({
  label,
  options = [], // [{ value, label }]
  value = '', // Selected option value
  onChange = () => {},
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const selectedOption = options.find((opt) => opt.value === value)

  return (
    <div className={['relative inline-block text-left', className].join(' ')} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex justify-between items-center w-full bg-cream border border-spice-brown/20 rounded-md px-4 py-2 font-body text-sm text-charcoal hover:bg-cream-dark/30 focus:outline-none focus:ring-2 focus:ring-turmeric focus:border-transparent transition-all gap-2"
        aria-expanded={isOpen}
      >
        <span>
          {label}: <strong className="font-semibold">{selectedOption ? selectedOption.label : 'All'}</strong>
        </span>
        <HiChevronDown size={16} className={['text-charcoal-muted transition-transform duration-200', isOpen ? 'rotate-180' : ''].join(' ')} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-48 bg-white border border-cream-dark rounded-lg shadow-luxury z-30 overflow-hidden divide-y divide-cream-dark/40 py-1 animate-fadeIn">
          {options.map((opt) => {
            const isSelected = opt.value === value
            return (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value)
                  setIsOpen(false)
                }}
                className={[
                  'flex items-center justify-between w-full px-4 py-2 text-sm font-body transition-colors text-left',
                  isSelected
                    ? 'bg-cream text-spice-brown font-semibold'
                    : 'text-charcoal hover:bg-cream/40 hover:text-spice-brown',
                ].join(' ')}
              >
                <span>{opt.label}</span>
                {isSelected && <HiCheck size={16} className="text-turmeric" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default FilterDropdown
