import React, { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PageWrapper = ({ children, hideFooter = false, transparentNav = false, darkNavText = false, isPageLoading = false }) => {
  const lenisRef = useRef(null)
  const { pathname } = useLocation()

  useEffect(() => {
    // Only enable smooth scroll on capable desktop devices
    const isMobile = window.matchMedia('(max-width: 1023px)').matches
    const lowSpec = navigator.hardwareConcurrency <= 4
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (isMobile || lowSpec || prefersReduced) {
      // Native scroll for mobile/low-spec — no overhead
      return
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    })

    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(lenis.raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!lenisRef.current) return
    if (isPageLoading) {
      lenisRef.current.stop()
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
    } else {
      lenisRef.current.start()
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      // Ensure we start at the top of the viewport after loader is dissolved
      window.scrollTo(0, 0)
      setTimeout(() => {
        ScrollTrigger.refresh()
      }, 100)
    }
  }, [isPageLoading])

  // Scroll to top smoothly on route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { 
        duration: 1.5, 
        ease: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
      })
    }
  }, [pathname])

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar transparent={transparentNav} darkText={darkNavText} />
      <main className="flex-1" role="main">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  )
}

export default PageWrapper
