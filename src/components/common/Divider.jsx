import React from 'react'

const Divider = ({ label, className = '' }) => {
  if (label) {
    return (
      <div className={['flex items-center gap-4', className].join(' ')}>
        <div className="flex-1 h-px bg-turmeric/30" />
        <span className="font-body text-xs tracking-widest uppercase text-charcoal-muted px-2">
          {label}
        </span>
        <div className="flex-1 h-px bg-turmeric/30" />
      </div>
    )
  }

  return (
    <hr
      className={['border-0 h-px bg-turmeric/30', className].join(' ')}
      aria-hidden="true"
    />
  )
}

export default Divider
