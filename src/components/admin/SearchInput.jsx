import React, { useState, useEffect, useRef } from 'react'
import { HiOutlineSearch, HiX } from 'react-icons/hi'

const SearchInput = ({
  value = '',
  onChange = () => {},
  placeholder = 'Search...',
  className = '',
}) => {
  const [localValue, setLocalValue] = useState(value)
  const isFirstMount = useRef(true)

  // Sync with outer value changes
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  // Debounce the change callback
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }

    const timer = setTimeout(() => {
      onChange(localValue)
    }, 300)

    return () => clearTimeout(timer)
  }, [localValue, onChange])

  const handleClear = () => {
    setLocalValue('')
    onChange('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClear()
    }
  }

  return (
    <div className={['relative w-full max-w-xs', className].join(' ')}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-charcoal-muted">
        <HiOutlineSearch size={18} />
      </div>
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full bg-cream border border-spice-brown/20 rounded-md pl-10 pr-9 py-2 font-body text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-turmeric focus:border-transparent transition-all placeholder-charcoal-muted/50"
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-charcoal-muted hover:text-spice-brown transition-colors"
          aria-label="Clear search"
        >
          <HiX size={16} />
        </button>
      )}
    </div>
  )
}

export default SearchInput
