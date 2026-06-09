import React from 'react'
import { Link } from 'react-router-dom'

const Breadcrumb = ({ items = [] }) => {
  if (!items.length) return null

  return (
    <nav className="flex items-center text-sm font-body" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            to="/admin"
            className="text-turmeric hover:underline transition-all font-medium"
          >
            Admin
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <React.Fragment key={index}>
              <span className="text-charcoal-soft/50 font-normal">/</span>
              <li>
                {isLast || !item.href ? (
                  <span className="text-charcoal font-medium" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.href}
                    className="text-turmeric hover:underline transition-all font-medium"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb
