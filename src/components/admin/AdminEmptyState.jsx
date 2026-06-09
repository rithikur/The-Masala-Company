import React from 'react'
import { RiInboxLine } from 'react-icons/ri'

const AdminEmptyState = ({
  icon: Icon = RiInboxLine,
  title = 'No records found',
  message = 'Get started by creating a new entry.',
  actionLabel = '',
  onAction = null,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-cream-dark rounded-xl shadow-card min-h-[40vh]">
      <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center text-charcoal-muted mb-4 border border-cream-dark/50">
        <Icon size={32} />
      </div>
      <h3 className="font-display text-lg font-bold text-spice-brown mb-2">
        {title}
      </h3>
      <p className="font-body text-sm text-charcoal-soft max-w-sm mb-6 leading-relaxed">
        {message}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 bg-spice-brown text-cream font-body text-sm font-semibold rounded-md hover:bg-opacity-95 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-turmeric focus:ring-offset-2"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default AdminEmptyState
