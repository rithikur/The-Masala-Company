import React from 'react'
import Spinner from './Spinner'

const variants = {
  primary:
    'bg-saffron text-cream hover:bg-saffron-dark active:scale-[0.98] shadow-sm',
  secondary:
    'bg-spice-brown text-cream hover:bg-spice-medium active:scale-[0.98]',
  outline:
    'bg-transparent border border-turmeric text-turmeric hover:bg-turmeric hover:text-cream active:scale-[0.98]',
  ghost:
    'bg-transparent text-charcoal hover:bg-cream-dark active:scale-[0.98]',
  danger:
    'bg-red-700 text-cream hover:bg-red-800 active:scale-[0.98]',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
  xl: 'px-9 py-4 text-lg',
}

const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled = false,
  children,
  className = '',
  ...props
}) => {
  const isDisabled = disabled || loading

  return (
    <button
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center gap-2 font-body font-medium tracking-wide',
        'rounded-xs transition-all duration-200 ease-in-out',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {loading ? (
        <Spinner size="sm" color={variant === 'outline' || variant === 'ghost' ? 'brown' : 'cream'} />
      ) : (
        Icon && iconPosition === 'left' && <Icon className="shrink-0" />
      )}
      {children}
      {!loading && Icon && iconPosition === 'right' && (
        <Icon className="shrink-0" />
      )}
    </button>
  )
}

export default Button
