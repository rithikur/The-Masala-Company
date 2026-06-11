import React, { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { HiOutlineSearch, HiOutlineHeart, HiOutlineShoppingBag, HiMenu } from 'react-icons/hi'
import Badge from '../common/Badge'
import useCart from '../../hooks/useCart'
import useWishlist from '../../hooks/useWishlist'
import MobileMenu from './MobileMenu'
import { useAuth } from '../../context/AuthContext'
import SearchModal from '../common/SearchModal'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Collections', to: '/products' }, // Correct path to PLP
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

const Navbar = ({ transparent = false, darkText = false }) => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { itemCount: cartCount } = useCart()
  const { itemCount: wishCount } = useWishlist()
  const { isAuthenticated, user, logout } = useAuth()
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const isScrolled = scrolled || !transparent

  // Color theme overrides for transparent states with light backgrounds
  const textClass = isScrolled ? 'text-spice-brown' : (darkText ? 'text-spice-brown' : 'text-cream')
  
  const iconClass = isScrolled
    ? 'text-charcoal-soft hover:text-spice-brown hover:bg-cream-dark'
    : darkText
      ? 'text-charcoal-soft hover:text-spice-brown hover:bg-cream-dark/40'
      : 'text-cream/80 hover:text-cream'

  const borderBtnClass = isScrolled
    ? 'border-spice-brown text-spice-brown hover:bg-spice-brown hover:text-cream'
    : darkText
      ? 'border-spice-brown text-spice-brown hover:bg-spice-brown hover:text-cream'
      : 'border-cream/60 text-cream hover:bg-cream/10'

  const hamburgerClass = isScrolled
    ? 'text-charcoal-soft hover:text-spice-brown hover:bg-cream-dark'
    : darkText
      ? 'text-charcoal-soft hover:text-spice-brown hover:bg-cream-dark/40'
      : 'text-cream/80 hover:text-cream'

  return (
    <>
      <header
        className={[
          'fixed top-0 left-0 right-0 z-50',
          'transition-all duration-300 ease-in-out',
          isScrolled
            ? 'bg-cream shadow-luxury border-b border-cream-dark'
            : 'bg-transparent',
        ].join(' ')}
      >
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            aria-label="The Masala Company — Home"
          >
            <span
              className={[
                'font-display font-semibold text-lg tracking-widest uppercase',
                textClass,
                'transition-colors duration-300',
              ].join(' ')}
            >
              The Masala Company
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden lg:flex items-center gap-8" role="list">
            {NAV_LINKS.map(({ label, to }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    [
                      'font-body text-sm tracking-wide relative group',
                      'after:absolute after:bottom-0 after:left-0 after:h-px after:w-0',
                      'after:bg-turmeric after:transition-all after:duration-300 hover:after:w-full',
                      isScrolled
                        ? isActive
                          ? 'text-spice-brown after:w-full'
                          : 'text-charcoal-soft hover:text-spice-brown'
                        : darkText
                          ? isActive
                            ? 'text-spice-brown after:w-full'
                            : 'text-charcoal-soft hover:text-spice-brown'
                          : isActive
                            ? 'text-turmeric-light after:w-full'
                            : 'text-cream/80 hover:text-cream',
                    ].join(' ')
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right Icons */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className={[
                'p-2 rounded-xs transition-colors duration-200',
                iconClass,
              ].join(' ')}
            >
              <HiOutlineSearch size={20} />
            </button>

            {/* Wishlist */}
            <Link
              to="/profile?tab=wishlist"
              aria-label={`Wishlist${wishCount > 0 ? `, ${wishCount} items` : ''}`}
              className={[
                'relative p-2 rounded-xs transition-colors duration-200',
                iconClass,
              ].join(' ')}
            >
              <HiOutlineHeart size={20} />
              {wishCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-turmeric text-cream text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {wishCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ''}`}
              className={[
                'relative p-2 rounded-xs transition-colors duration-200',
                iconClass,
              ].join(' ')}
            >
              <HiOutlineShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-saffron text-cream text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Login / Profile */}
            {isAuthenticated ? (
              <div className="relative ml-2 hidden sm:block group flex items-center h-full">
                <button className="flex items-center gap-2 focus:outline-none py-2">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt={user.full_name} className="w-8 h-8 rounded-full object-cover border border-spice-brown/30" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-turmeric text-cream flex items-center justify-center font-bold text-xs uppercase">
                      {user?.first_name?.charAt(0) || 'U'}
                    </div>
                  )}
                </button>
                {/* Dropdown Menu with negative top margin and transparent padding to bridge hover gap perfectly */}
                <div className="absolute right-0 top-full -mt-2 pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white rounded-md shadow-lg border border-cream-dark py-1">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-charcoal-soft hover:bg-cream-dark hover:text-spice-brown">My Account</Link>
                    <Link to="/profile?tab=orders" className="block px-4 py-2 text-sm text-charcoal-soft hover:bg-cream-dark hover:text-spice-brown">Orders</Link>
                    <Link to="/profile?tab=wishlist" className="block px-4 py-2 text-sm text-charcoal-soft hover:bg-cream-dark hover:text-spice-brown">Wishlist</Link>
                    <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-cream-dark">Logout</button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                aria-label="Login"
                className={[
                  'hidden sm:inline-flex ml-2 px-4 py-1.5 text-xs font-body font-medium tracking-widest uppercase',
                  'border rounded-xs transition-all duration-200',
                  borderBtnClass,
                ].join(' ')}
              >
                Login
              </Link>
            )}

            {/* Hamburger */}
            <button
              aria-label="Open mobile menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
              className={[
                'lg:hidden ml-1 p-2 rounded-xs transition-colors duration-200',
                hamburgerClass,
              ].join(' ')}
            >
              <HiMenu size={22} />
            </button>
          </div>
        </nav>
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} links={NAV_LINKS} />
    </>
  )
}

export default Navbar
