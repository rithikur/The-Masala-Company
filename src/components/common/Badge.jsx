import React from 'react'

const variantClasses = {
  gold:   'bg-turmeric-pale text-spice-brown border border-turmeric',
  brown:  'bg-spice-brown text-cream',
  green:  'bg-emerald-100 text-emerald-800 border border-emerald-300',
  red:    'bg-red-100 text-red-800 border border-red-300',
  gray:   'bg-cream-dark text-charcoal-muted border border-cream-dark',
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-3 py-1 text-xs',
}

const Badge = ({
  variant = 'gold',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  return (
    <span
      className={[
        'inline-flex items-center justify-center rounded-full font-body font-medium',
        'uppercase tracking-widest',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge
