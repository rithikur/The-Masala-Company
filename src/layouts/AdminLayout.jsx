import React, { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Breadcrumb from '../components/admin/Breadcrumb'
import {
  HiOutlineViewGrid,
  HiOutlineCube,
  HiOutlineTag,
  HiOutlineShoppingBag,
  HiOutlineTicket,
  HiOutlineUsers,
  HiOutlineStar,
  HiOutlineChartBar,
  HiOutlineArchive,
  HiOutlineSearch,
  HiOutlineCog,
  HiOutlineShieldCheck,
  HiOutlineBell,
  HiChevronRight,
  HiChevronLeft,
  HiMenu,
  HiX,
  HiOutlineLogout,
  HiOutlineUser,
  HiOutlineGlobeAlt,
} from 'react-icons/hi'
import AdminCommandPalette from '../components/admin/AdminCommandPalette'

const NAV_GROUPS = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', to: '/admin', icon: HiOutlineViewGrid },
    ],
  },
  {
    title: 'Catalog',
    items: [
      { label: 'Products', to: '/admin/products', icon: HiOutlineCube },
      { label: 'Categories', to: '/admin/categories', icon: HiOutlineTag },
    ],
  },
  {
    title: 'Sales',
    items: [
      { label: 'Orders', to: '/admin/orders', icon: HiOutlineShoppingBag },
      { label: 'Coupons', to: '/admin/coupons', icon: HiOutlineTicket },
    ],
  },
  {
    title: 'People',
    items: [
      { label: 'Customers', to: '/admin/customers', icon: HiOutlineUsers },
      { label: 'Reviews', to: '/admin/reviews', icon: HiOutlineStar },
    ],
  },
  {
    title: 'Insights',
    items: [
      { label: 'Analytics', to: '/admin/analytics', icon: HiOutlineChartBar },
      { label: 'Inventory', to: '/admin/inventory', icon: HiOutlineArchive },
      { label: 'Search History', to: '/admin/search-history', icon: HiOutlineSearch },
    ],
  },
  {
    title: 'Settings',
    items: [
      { label: 'Settings', to: '/admin/settings', icon: HiOutlineCog },
      { label: 'Admin Users', to: '/admin/admin-users', icon: HiOutlineShieldCheck },
    ],
  },
]

const AdminLayout = ({ children, title = 'Admin Panel', breadcrumbs = [] }) => {
  const { user, logout } = useAuth()
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

  // Global hotkey for Command Palette (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  const navigate = useNavigate()
  const location = useLocation()

  // Collapsed state: localStorage key masala_admin_sidebar_collapsed
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('masala_admin_sidebar_collapsed')
    return saved === 'true'
  })

  // Mobile/Tablet sidebar visibility drawer
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  
  const dropdownRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('masala_admin_sidebar_collapsed', isCollapsed)
  }, [isCollapsed])

  // Close profile dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  // Helper to render user avatar or initials
  const renderAvatar = (userObj, sizeClass = 'w-8 h-8') => {
    if (userObj?.avatar_url) {
      return (
        <img
          src={userObj.avatar_url}
          alt={userObj.full_name || 'Admin'}
          className={`${sizeClass} rounded-full object-cover border border-cream/20`}
        />
      )
    }
    const initial = userObj?.full_name?.charAt(0) || 'A'
    return (
      <div className={`${sizeClass} rounded-full bg-turmeric text-cream flex items-center justify-center font-bold text-xs uppercase border border-cream/20`}>
        {initial}
      </div>
    )
  }

  return (
    <div className="admin-layout min-h-screen bg-[var(--admin-content-bg)] flex text-charcoal">
      {/* ─────────────────────────────────────────
         1. Sidebar Navigation (Desktop)
         ───────────────────────────────────────── */}
      <aside
        className={[
          'hidden lg:flex flex-col fixed top-0 bottom-0 left-0 z-40 bg-[var(--admin-sidebar-bg)] border-r border-cream-dark/10 transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-18' : 'w-[260px]',
        ].join(' ')}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-cream-dark/10">
          {!isCollapsed ? (
            <div className="flex flex-col">
              <span className="font-display font-bold text-xs tracking-[0.2em] uppercase text-cream">
                The Masala Company
              </span>
              <span className="text-[10px] font-semibold text-turmeric uppercase tracking-widest mt-0.5">
                Admin Console
              </span>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <span className="font-display font-black text-lg text-turmeric tracking-wider">
                MC
              </span>
            </div>
          )}

          {/* Collapse Toggle trigger */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1 rounded bg-cream/5 text-cream/70 hover:text-cream hover:bg-cream/10 transition-colors"
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? <HiChevronRight size={16} /> : <HiChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-6 no-scrollbar space-y-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1">
              {!isCollapsed ? (
                <h4 className="text-[10px] font-semibold text-cream/30 uppercase tracking-widest px-3 mb-2 mt-4 first:mt-0">
                  {group.title}
                </h4>
              ) : (
                <div className="h-px bg-cream-dark/10 my-4 first:hidden" />
              )}
              {group.items.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/admin'}
                    className={({ isActive }) =>
                      [
                        'flex items-center gap-3 py-2.5 px-3 rounded-lg font-body text-sm transition-all duration-200 group',
                        isActive
                          ? 'bg-[var(--admin-sidebar-active)]/10 border-l-[3px] border-[var(--admin-sidebar-active)] text-turmeric font-semibold'
                          : 'text-[var(--admin-sidebar-text)] hover:bg-cream/5 hover:text-cream border-l-[3px] border-transparent',
                        isCollapsed ? 'justify-center px-0' : '',
                      ].join(' ')
                    }
                  >
                    <Icon size={18} className="shrink-0 transition-transform duration-200 group-hover:scale-110" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </NavLink>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-cream-dark/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden">
            {renderAvatar(user, 'w-8 h-8')}
            {!isCollapsed && (
              <div className="flex flex-col text-left overflow-hidden">
                <span className="font-semibold text-xs text-cream truncate">
                  {user?.full_name || 'Admin'}
                </span>
                <span className="text-[10px] text-cream/50 truncate uppercase tracking-wider">
                  {user?.role || 'Administrator'}
                </span>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button
              onClick={handleLogout}
              className="p-1.5 rounded hover:bg-cream/5 text-red-400 hover:text-red-300 transition-colors"
              aria-label="Logout"
            >
              <HiOutlineLogout size={16} />
            </button>
          )}
        </div>
      </aside>

      {/* ─────────────────────────────────────────
         2. Sidebar Drawer (Mobile Overlay)
         ───────────────────────────────────────── */}
      <div className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-spice-dark/60 backdrop-blur-xs transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileOpen(false)}
        />
        
        {/* Drawer content */}
        <aside className={`absolute top-0 bottom-0 left-0 w-[260px] bg-[var(--admin-sidebar-bg)] border-r border-cream-dark/10 flex flex-col shadow-luxury transition-transform duration-300 ease-out transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="h-16 flex items-center justify-between px-6 border-b border-cream-dark/10">
            <div className="flex flex-col">
              <span className="font-display font-bold text-xs tracking-[0.2em] uppercase text-cream">
                The Masala Company
              </span>
              <span className="text-[10px] font-semibold text-turmeric uppercase tracking-widest mt-0.5">
                Admin Console
              </span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1 rounded bg-cream/5 text-cream/70 hover:text-cream"
              aria-label="Close menu"
            >
              <HiX size={18} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-6 no-scrollbar space-y-4">
            {NAV_GROUPS.map((group) => (
              <div key={group.title} className="space-y-1">
                <h4 className="text-[10px] font-semibold text-cream/30 uppercase tracking-widest px-3 mb-2 mt-4 first:mt-0">
                  {group.title}
                </h4>
                {group.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === '/admin'}
                      className={({ isActive }) =>
                        [
                          'flex items-center gap-3 py-2.5 px-3 rounded-lg font-body text-sm transition-all duration-200',
                          isActive
                            ? 'bg-[var(--admin-sidebar-active)]/10 border-l-[3px] border-[var(--admin-sidebar-active)] text-turmeric font-semibold'
                            : 'text-[var(--admin-sidebar-text)] hover:bg-cream/5 hover:text-cream border-l-[3px] border-transparent',
                        ].join(' ')
                      }
                    >
                      <Icon size={18} className="shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  )
                })}
              </div>
            ))}
          </nav>

          <div className="p-6 border-t border-cream-dark/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-hidden">
              {renderAvatar(user, 'w-8 h-8')}
              <div className="flex flex-col text-left overflow-hidden">
                <span className="font-semibold text-xs text-cream truncate">
                  {user?.full_name || 'Admin'}
                </span>
                <span className="text-[10px] text-cream/50 truncate uppercase tracking-wider">
                  {user?.role || 'Administrator'}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded hover:bg-cream/5 text-red-400 hover:text-red-300 transition-colors"
              aria-label="Logout"
            >
              <HiOutlineLogout size={16} />
            </button>
          </div>
        </aside>
      </div>

      {/* ─────────────────────────────────────────
         3. Main Content Workspace Area
         ───────────────────────────────────────── */}
      <div
        className={[
          'flex-1 flex flex-col min-w-0 transition-all duration-300',
          isCollapsed ? 'lg:pl-18' : 'lg:pl-[260px]',
        ].join(' ')}
      >
        {/* Top Header Bar */}
        <header className={[
          "h-16 bg-[var(--admin-header-bg)] border-b border-cream-dark/60 flex items-center justify-between px-4 sm:px-6 fixed top-0 right-0 left-0 z-30 transition-all duration-300",
          isCollapsed ? "lg:left-18" : "lg:left-[260px]"
        ].join(' ')}>
          {/* Left: Hamburger (mobile) or Breadcrumbs */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-charcoal hover:bg-cream rounded-md transition-colors"
              aria-label="Open sidebar drawer"
            >
              <HiMenu size={20} />
            </button>
            <div className="hidden sm:block">
              <Breadcrumb items={breadcrumbs} />
            </div>
            <div className="sm:hidden font-display font-bold text-base text-spice-brown truncate">
              {title}
            </div>
          </div>

          {/* Right Area */}
          <div className="flex items-center gap-3">
            {/* Search command palette trigger */}
            <div className="flex-1 max-w-md hidden md:block ml-8">
              <button 
                onClick={() => setCommandPaletteOpen(true)}
                className="w-full flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md text-gray-500 hover:bg-gray-200 transition-colors text-sm font-sans"
              >
                <HiOutlineSearch size={14} />
                <span>Search...</span>
                <div className="ml-auto flex items-center gap-1 opacity-60">
                  <kbd className="bg-white px-1.5 py-0.5 rounded text-[10px] shadow-sm">⌘</kbd>
                  <kbd className="bg-white px-1.5 py-0.5 rounded text-[10px] shadow-sm">K</kbd>
                </div>
              </button>
            </div>

            {/* Notification bell */}
            <button
              className="relative p-2 rounded-md hover:bg-cream text-charcoal-muted hover:text-spice-brown transition-colors"
              aria-label="Notifications"
            >
              <HiOutlineBell size={20} />
              <span className="absolute top-1 right-1 bg-saffron text-cream text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                3
              </span>
            </button>

            {/* Admin Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 focus:outline-none hover:opacity-85 transition-opacity"
                aria-haspopup="true"
                aria-expanded={profileDropdownOpen}
              >
                {renderAvatar(user, 'w-8 h-8')}
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-cream-dark rounded-lg shadow-luxury z-40 overflow-hidden divide-y divide-cream-dark/50 py-1 animate-fadeIn">
                  <div className="px-4 py-2 text-left">
                    <p className="font-semibold text-xs text-charcoal truncate">
                      {user?.full_name || 'Admin'}
                    </p>
                    <p className="text-[10px] text-charcoal-muted truncate">
                      {user?.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/admin/settings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-charcoal hover:bg-cream hover:text-spice-brown transition-colors text-left"
                    >
                      <HiOutlineUser size={14} />
                      My Settings
                    </Link>
                    <Link
                      to="/"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-charcoal hover:bg-cream hover:text-spice-brown transition-colors text-left"
                    >
                      <HiOutlineGlobeAlt size={14} />
                      View Website
                    </Link>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false)
                        handleLogout()
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <HiOutlineLogout size={14} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Workspace Area */}
        <main className="flex-1 p-6 sm:p-8 mt-16 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
      
      <AdminCommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
    </div>
  )
}

export default AdminLayout
