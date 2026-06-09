import React from 'react'

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 40,
}

const colorMap = {
  cream:  'border-cream/30 border-t-cream',
  gold:   'border-turmeric/30 border-t-turmeric',
  brown:  'border-spice-brown/30 border-t-spice-brown',
}

const Spinner = ({ size = 'md', color = 'gold', className = '' }) => {
  const px = sizeMap[size]

  return (
    <span
      role="status"
      aria-label="Loading"
      className={['inline-block rounded-full border-2 animate-spin', colorMap[color], className].join(' ')}
      style={{ width: px, height: px }}
    />
  )
}

export default Spinner
