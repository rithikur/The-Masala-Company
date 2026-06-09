import React from 'react'
import { Link } from 'react-router-dom'
import {
  RiInstagramLine,
  RiFacebookLine,
  RiTwitterXLine,
  RiYoutubeLine,
} from 'react-icons/ri'
import Divider from '../common/Divider'

const COLLECTIONS = [
  'Whole Spices',
  'Ground Spices',
  'Spice Blends',
  'Seeds & Pods',
  'Exotic & Rare',
  'Gift Sets',
]

const CUSTOMER_CARE = [
  'Track Your Order',
  'Shipping Policy',
  'Returns & Refunds',
  'FAQ',
  'Bulk Orders',
]

const SOCIAL_LINKS = [
  { Icon: RiInstagramLine, label: 'Instagram' },
  { Icon: RiFacebookLine, label: 'Facebook' },
  { Icon: RiTwitterXLine, label: 'Twitter / X' },
  { Icon: RiYoutubeLine, label: 'YouTube' },
]

const Footer = () => {
  return (
    <footer className="bg-spice-dark text-cream/70" aria-label="Site footer">
      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="h-px w-6 bg-turmeric/60" />
                <p className="font-display text-xs tracking-[0.22em] uppercase text-turmeric font-semibold">
                  The Masala Company
                </p>
                <span className="h-px w-6 bg-turmeric/60" />
              </div>
              <p className="font-accent italic text-cream/50 text-sm mt-1">
                From Farm to Flavor
              </p>
            </div>
            <p className="font-body text-sm leading-relaxed text-cream/55">
              We source the finest spices directly from India's heartland — unprocessed, unadulterated, and delivered to your kitchen with care.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {SOCIAL_LINKS.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-8 h-8 rounded-xs border border-cream/10 flex items-center justify-center text-cream/50 hover:text-turmeric hover:border-turmeric/50 transition-all duration-200"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Collections */}
          <div className="space-y-4">
            <h3 className="font-body text-xs tracking-widest uppercase text-turmeric font-semibold">
              Collections
            </h3>
            <ul className="space-y-2.5" role="list">
              {COLLECTIONS.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="font-body text-sm text-cream/55 hover:text-cream transition-colors duration-150"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-4">
            <h3 className="font-body text-xs tracking-widest uppercase text-turmeric font-semibold">
              Customer Care
            </h3>
            <ul className="space-y-2.5" role="list">
              {CUSTOMER_CARE.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="font-body text-sm text-cream/55 hover:text-cream transition-colors duration-150"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect / Newsletter */}
          <div className="space-y-4">
            <h3 className="font-body text-xs tracking-widest uppercase text-turmeric font-semibold">
              Stay Connected
            </h3>
            <p className="font-body text-sm text-cream/55 leading-relaxed">
              Get recipes, harvest stories, and early access to new arrivals.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-2"
              aria-label="Newsletter signup"
            >
              <input
                type="email"
                placeholder="Your email address"
                aria-label="Email address"
                className="w-full px-3 py-2.5 bg-spice-medium/40 border border-cream/10 rounded-xs text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-turmeric/50 transition-colors duration-150 font-body"
              />
              <button
                type="submit"
                className="w-full px-4 py-2.5 bg-turmeric/90 hover:bg-turmeric text-spice-dark text-xs font-body font-semibold tracking-widest uppercase rounded-xs transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 mb-6 h-px bg-cream/10" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream/35 font-body">
          <p>© {new Date().getFullYear()} The Masala Company. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-cream/60 transition-colors duration-150">Privacy Policy</a>
            <span className="h-3 w-px bg-cream/20" />
            <a href="#" className="hover:text-cream/60 transition-colors duration-150">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
