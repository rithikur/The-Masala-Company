import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Scrolls to top on route change — ONLY for public/storefront pages.
 * Admin panel pages (/admin/*) are excluded so their internal navigation
 * doesn't jump to the top. Footer links (/terms-of-service, /privacy-policy, etc.)
 * are included and always scroll to top.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    // Skip scroll-to-top for admin panel internal navigation
    if (pathname.startsWith('/admin')) return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

export default ScrollToTop
