import React, { useState, useEffect } from 'react'
import { HiArrowUp, HiArrowDown } from 'react-icons/hi'

const StatsCard = ({ title, value, change, changePeriod = 'vs last month', icon: Icon, color = 'bg-turmeric' }) => {
  const [displayValue, setDisplayValue] = useState(0)

  // Determine if value is numeric and animate it
  useEffect(() => {
    // Extract numbers from value if it's a string, e.g. "$12,450" -> 12450
    const numericMatch = typeof value === 'string' ? value.replace(/[^0-9.]/g, '') : value
    const endVal = parseFloat(numericMatch)

    if (isNaN(endVal)) {
      setDisplayValue(value)
      return
    }

    let start = 0
    const duration = 1000 // ms
    const incrementTime = 30
    const steps = Math.ceil(duration / incrementTime)
    const stepValue = endVal / steps
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      if (currentStep >= steps) {
        clearInterval(timer)
        setDisplayValue(value) // Set to final formatted value
      } else {
        const nextVal = start + stepValue * currentStep
        // Re-apply formatting if the original was a string
        if (typeof value === 'string') {
          const prefix = value.match(/^[^0-9.]+/)?.[0] || ''
          const suffix = value.match(/[^0-9.]+$/)?.[0] || ''
          const formatted = nextVal.toLocaleString(undefined, {
            maximumFractionDigits: nextVal % 1 === 0 ? 0 : 2
          })
          setDisplayValue(`${prefix}${formatted}${suffix}`)
        } else {
          setDisplayValue(Math.round(nextVal))
        }
      }
    }, incrementTime)

    return () => clearInterval(timer)
  }, [value])

  const isPositive = change >= 0

  return (
    <div className="bg-white p-6 rounded-xl border border-cream-dark shadow-card flex justify-between relative overflow-hidden transition-all duration-300 hover:shadow-hover">
      <div className="flex flex-col justify-between z-10">
        <div>
          <span className="text-charcoal-muted font-body text-xs font-medium uppercase tracking-wider block mb-1">
            {title}
          </span>
          <h3 className="font-body text-3xl font-bold text-spice-brown tracking-tight font-sans">
            {displayValue}
          </h3>
        </div>
        
        {change !== undefined && (
          <div className="flex items-center mt-4 gap-1.5 flex-wrap">
            <span
              className={[
                'inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold font-body',
                isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700',
              ].join(' ')}
            >
              {isPositive ? <HiArrowUp size={12} /> : <HiArrowDown size={12} />}
              {Math.abs(change)}%
            </span>
            <span className="text-charcoal-muted text-xs font-body">
              {changePeriod}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-start z-10">
        <div className={['p-3.5 rounded-xl text-cream', color].join(' ')}>
          {Icon && <Icon size={24} />}
        </div>
      </div>
      
      {/* Decorative background pulse */}
      <div className="absolute right-0 bottom-0 translate-y-1/3 translate-x-1/4 w-32 h-32 rounded-full bg-cream opacity-25 blur-xl pointer-events-none"></div>
    </div>
  )
}

export default StatsCard
