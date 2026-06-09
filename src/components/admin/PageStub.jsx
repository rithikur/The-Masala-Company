import React from 'react'

const PageStub = ({ name, icon: Icon }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white border border-cream-dark rounded-2xl p-12 text-center shadow-card">
      <div className="w-24 h-24 rounded-full bg-cream flex items-center justify-center text-turmeric mb-6 animate-pulse">
        {Icon ? (
          <Icon size={48} className="stroke-current" />
        ) : (
          <span className="font-display font-bold text-3xl">MC</span>
        )}
      </div>
      <h2 className="font-display text-3xl font-bold text-spice-brown mb-3">
        {name} Module
      </h2>
      <p className="font-body text-charcoal-soft max-w-md mb-6">
        The {name.toLowerCase()} management and interaction console is scheduled for implementation in the next phase.
      </p>
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-cream text-turmeric-dark font-body text-xs font-semibold rounded-full uppercase tracking-wider">
        Coming in Next Phase
      </div>
    </div>
  )
}

export default PageStub
