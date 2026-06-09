import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { HiArrowRight } from 'react-icons/hi'
import PageWrapper from '../components/layout/PageWrapper'

gsap.registerPlugin(ScrollTrigger)

const LoadingScreen = () => {
  return (
    <motion.div
      key="loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.2, ease: "easeInOut" } }}
      className="fixed inset-0 z-[100] bg-cream flex flex-col items-center justify-center pointer-events-none"
    >
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        className="font-display text-2xl sm:text-4xl font-bold tracking-[0.2em] uppercase text-spice-brown"
      >
        The Masala Company
      </motion.h1>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.8 }}
        className="h-px w-24 bg-turmeric mt-6 origin-center"
      />
    </motion.div>
  )
}

const FEATURED_PRODUCTS = [
  { id: 1, name: "Kashmir Saffron", origin: "Pampore, Kashmir", price: "₹850", image: "/images/hero_spices_bg.png" },
  { id: 2, name: "Ceylon Cinnamon", origin: "Sri Lanka", price: "₹420", image: "/images/floating_cinnamon.png" },
  { id: 3, name: "Green Cardamom", origin: "Kerala, India", price: "₹650", image: "/images/floating_cardamom.png" },
  { id: 4, name: "Turmeric Powder", origin: "Erode, Tamil Nadu", price: "₹210", image: "/images/hero_spices_bg.png" }
]

const Home = () => {
  const [loading, setLoading] = useState(true)
  const container = useRef(null)
  
  // Hero section refs
  const heroPinRef = useRef(null)
  const heroImageRef = useRef(null)
  const cardamomRef = useRef(null)
  const cinnamonRef = useRef(null)
  const centerCardRef = useRef(null)
  const coverTextRef = useRef(null)
  const chapter1Ref = useRef(null)
  const chapter2Ref = useRef(null)
  const finalTextRef = useRef(null)
  const scrollIndicatorRef = useRef(null)

  // Horizontal scroll refs
  const horizontalWrapperRef = useRef(null)
  const horizontalContainerRef = useRef(null)

  useEffect(() => {
    // Simulate loading for the cinematic effect
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2800)
    return () => clearTimeout(timer)
  }, [])

  useGSAP(() => {
    if (loading) return

    // 0. Initial center positioning of all layers
    gsap.set(cardamomRef.current, { xPercent: -50, yPercent: -50, left: "50%", top: "50%" })
    gsap.set(cinnamonRef.current, { xPercent: -50, yPercent: -50, left: "50%", top: "50%" })
    gsap.set(centerCardRef.current, { xPercent: -50, yPercent: -50, left: "50%", top: "50%" })
    gsap.set(coverTextRef.current, { xPercent: -50, yPercent: -50, left: "50%", top: "50%" })
    gsap.set(chapter1Ref.current, { xPercent: -50, yPercent: -50, left: "50%", top: "50%" })
    gsap.set(chapter2Ref.current, { xPercent: -50, yPercent: -50, left: "50%", top: "50%" })
    gsap.set(finalTextRef.current, { xPercent: -50, yPercent: -50, left: "50%", top: "50%" })

    // Passive floating animations (bobbing physics)
    const floatCardamom = gsap.to('.hero-cardamom-img', {
      y: "-=12",
      rotation: "+=3",
      duration: 3.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1
    })
    const floatCinnamon = gsap.to('.hero-cinnamon-img', {
      y: "+=15",
      rotation: "-=2",
      duration: 4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1
    })

    const mm = gsap.matchMedia()

    // 1. Hero Pinned Story Sequence
    // DESKTOP TRIGGER (>= 768px)
    mm.add("(min-width: 768px)", () => {
      // Set initial desktop layout values (Load state)
      // Cover text on the left, botanical card on the right
      gsap.set(coverTextRef.current, { x: "-22vw", y: "0px", opacity: 1 })
      gsap.set(centerCardRef.current, { x: "18vw", y: "0px", opacity: 1, scale: 1 })
      gsap.set(cardamomRef.current, { x: "18vw", y: "0px", scale: 1, opacity: 1, rotation: 0 })
      gsap.set(cinnamonRef.current, { x: "-60vw", y: "10vh", scale: 1, opacity: 0, rotation: -65 })
      gsap.set(heroImageRef.current, { opacity: 0.08, scale: 1.1 })
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroPinRef.current,
          start: "top top",
          end: "+=300%", // Pin for 3 screen heights
          pin: true,
          scrub: 1,
        }
      })

      // Frame 1 -> Chapter 1 (Terroir)
      // Fade out cover text & botanical card frame
      tl.to(coverTextRef.current, { opacity: 0, y: "-10vh", duration: 1 }, 0)
      tl.to(centerCardRef.current, { opacity: 0, scale: 0.9, duration: 1 }, 0)
      tl.to(scrollIndicatorRef.current, { opacity: 0, duration: 0.5 }, 0)
      
      // Cardamom slides slightly more right, rotates and scales up
      tl.to(cardamomRef.current, { x: "24vw", y: "-3vh", scale: 1.25, rotation: 35, duration: 1.5 }, 0)
      
      // Background shifts to Cream Dark (soil) & texture fades slightly for text readability
      tl.to(heroPinRef.current, { backgroundColor: "#EDE7D9", duration: 1.5 }, 0)
      tl.to(heroImageRef.current, { opacity: 0.05, duration: 1.5 }, 0)
      
      // Chapter 1 text fades in on the left side
      tl.fromTo(chapter1Ref.current, { x: "-22vw", y: "30px", opacity: 0 }, { x: "-22vw", y: "0px", opacity: 1, duration: 1.2 }, 0.3)

      // Chapter 1 -> Chapter 2 (The Harvest)
      // Cardamom fades and glides off-screen right
      tl.to(cardamomRef.current, { x: "60vw", opacity: 0, rotation: 65, duration: 1.5 }, 1.5)
      
      // Chapter 1 text fades out
      tl.to(chapter1Ref.current, { opacity: 0, y: "-30px", duration: 1 }, 1.5)
      
      // Background shifts to Cream Warm (sun)
      tl.to(heroPinRef.current, { backgroundColor: "#F5EDD8", duration: 1.5 }, 1.5)
      
      // Cinnamon slides in from left and Chapter 2 text fades in on the right
      tl.to(cinnamonRef.current, { x: "-22vw", y: "3vh", opacity: 1, rotation: -25, duration: 1.8 }, 1.5)
      tl.fromTo(chapter2Ref.current, { x: "22vw", y: "30px", opacity: 0 }, { x: "22vw", y: "0px", opacity: 1, duration: 1.5 }, 1.8)

      // Chapter 2 -> Final Reveal
      // Cinnamon moves to its final left-center position (framing the title, no overlap)
      tl.to(cinnamonRef.current, { x: "-28vw", y: "10vh", scale: 0.95, rotation: -40, duration: 1.5 }, 3.0)
      
      // Cardamom slides back in from right to its final right-center position (framing the title, no overlap)
      tl.to(cardamomRef.current, { x: "28vw", y: "-12vh", scale: 0.95, rotation: 15, opacity: 1, duration: 1.5 }, 3.0)
      
      // Chapter 2 text fades out
      tl.to(chapter2Ref.current, { opacity: 0, y: "-30px", duration: 1 }, 3.0)
      
      // Background spices image fades in slightly more for visual texture
      tl.to(heroImageRef.current, { opacity: 0.09, scale: 1.2, duration: 2 }, 3.0)
      
      // Final centered text fades in
      tl.fromTo(finalTextRef.current, { x: 0, y: "40px", opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 1.8 }, 3.3)
      
      // Background shifts back to Cream
      tl.to(heroPinRef.current, { backgroundColor: "#FAF6EE", duration: 1.5 }, 3.0)
    })

    // MOBILE TRIGGER (< 768px)
    mm.add("(max-width: 767px)", () => {
      // Set initial mobile layout values (Load state)
      // Cover text top, botanical card bottom (spaced to prevent overlapping elements or navbar)
      gsap.set(coverTextRef.current, { x: 0, y: "-20vh", opacity: 1 })
      gsap.set(centerCardRef.current, { x: 0, y: "12vh", opacity: 1, scale: 1 })
      gsap.set(cardamomRef.current, { x: 0, y: "12vh", scale: 1, opacity: 1, rotation: 0 })
      gsap.set(cinnamonRef.current, { x: 0, y: "65vh", scale: 1, opacity: 0, rotation: -65 })
      gsap.set(heroImageRef.current, { opacity: 0.06, scale: 1.1 })
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroPinRef.current,
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 1,
        }
      })

      // Frame 1 -> Chapter 1 (Terroir)
      tl.to(coverTextRef.current, { opacity: 0, y: "-32vh", duration: 1 }, 0)
      tl.to(centerCardRef.current, { opacity: 0, scale: 0.95, duration: 1 }, 0)
      tl.to(scrollIndicatorRef.current, { opacity: 0, duration: 0.5 }, 0)
      
      // Cardamom slides upward
      tl.to(cardamomRef.current, { x: 0, y: "-20vh", scale: 0.85, rotation: 25, duration: 1.5 }, 0)
      
      // Background shifts to Cream Dark
      tl.to(heroPinRef.current, { backgroundColor: "#EDE7D9", duration: 1.5 }, 0)
      tl.to(heroImageRef.current, { opacity: 0.04, duration: 1.5 }, 0)
      
      // Chapter 1 text fades in below cardamom
      tl.fromTo(chapter1Ref.current, { x: 0, y: "18vh", opacity: 0 }, { x: 0, y: "11vh", opacity: 1, duration: 1.2 }, 0.3)

      // Chapter 1 -> Chapter 2 (The Harvest)
      // Cardamom slides out top
      tl.to(cardamomRef.current, { y: "-65vh", opacity: 0, duration: 1.5 }, 1.5)
      
      // Chapter 1 text fades out
      tl.to(chapter1Ref.current, { opacity: 0, y: "0vh", duration: 1 }, 1.5)
      
      // Background shifts to Cream Warm
      tl.to(heroPinRef.current, { backgroundColor: "#F5EDD8", duration: 1.5 }, 1.5)
      
      // Cinnamon slides in from bottom to top half
      tl.to(cinnamonRef.current, { x: 0, y: "-20vh", scale: 0.85, opacity: 1, rotation: -20, duration: 1.8 }, 1.5)
      // Chapter 2 text fades in below
      tl.fromTo(chapter2Ref.current, { x: 0, y: "18vh", opacity: 0 }, { x: 0, y: "11vh", opacity: 1, duration: 1.5 }, 1.8)

      // Chapter 2 -> Final Reveal
      // Cinnamon moves left-top (framing the title on mobile)
      tl.to(cinnamonRef.current, { x: "-25vw", y: "-24vh", scale: 0.7, rotation: -35, duration: 1.5 }, 3.0)
      
      // Cardamom slides back in from right to right-top (framing the title on mobile)
      tl.to(cardamomRef.current, { x: "25vw", y: "-20vh", scale: 0.7, rotation: 15, opacity: 1, duration: 1.5 }, 3.0)
      
      // Chapter 2 text fades out
      tl.to(chapter2Ref.current, { opacity: 0, y: "0vh", duration: 1 }, 3.0)
      
      // Background spices image fades in behind at low opacity
      tl.to(heroImageRef.current, { opacity: 0.07, scale: 1.15, duration: 2 }, 3.0)
      
      // Final centered text fades in in the bottom half
      tl.fromTo(finalTextRef.current, { x: 0, y: "18vh", opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 1.8 }, 3.3)
      
      // Background shifts to Cream
      tl.to(heroPinRef.current, { backgroundColor: "#FAF6EE", duration: 1.5 }, 3.0)
    })

    // 2. Horizontal Scroll Section (Chapter ingredients - refactored to container animation)
    if (horizontalWrapperRef.current && horizontalContainerRef.current) {
      gsap.to(horizontalContainerRef.current, {
        x: () => -(horizontalContainerRef.current.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: horizontalWrapperRef.current,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          end: () => "+=" + (horizontalContainerRef.current.scrollWidth - window.innerWidth)
        }
      })
    }

    // Refresh ScrollTrigger to calculate all layout bounds in order
    ScrollTrigger.refresh()

    return () => {
      floatCardamom.kill()
      floatCinnamon.kill()
      mm.revert()
    }
  }, { scope: container, dependencies: [loading] })

  return (
    <PageWrapper transparentNav darkNavText isPageLoading={loading}>
      <AnimatePresence>
        {loading && <LoadingScreen />}
      </AnimatePresence>

      <div ref={container} className="bg-cream overflow-hidden">
        
        {/* === STORYTELLING HERO SECTION === */}
        <section 
          ref={heroPinRef} 
          className="hero-section relative h-screen w-full overflow-hidden bg-cream flex items-center justify-center transition-colors duration-500"
        >
          {/* Background Textured Spice Image (Visible from start at low opacity) */}
          <div 
            ref={heroImageRef}
            className="absolute inset-0 w-full h-full opacity-[0.08] mix-blend-multiply pointer-events-none transform scale-110"
            style={{ 
              backgroundImage: "url('/images/hero_spices_bg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          />

          {/* Background Vignette or Overlay */}
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-cream/20 pointer-events-none" />

          {/* Interactive Floating Spices */}
          {/* Cardamom wrapper */}
          <div 
            ref={cardamomRef} 
            className="hero-cardamom absolute z-10 pointer-events-none mix-blend-multiply flex items-center justify-center"
          >
            <img 
              src="/images/floating_cardamom.png" 
              alt="Kerala Cardamom Pod" 
              className="hero-cardamom-img w-48 h-48 md:w-64 md:h-64 object-contain"
            />
          </div>

          {/* Cinnamon wrapper */}
          <div 
            ref={cinnamonRef} 
            className="hero-cinnamon absolute z-10 pointer-events-none mix-blend-multiply flex items-center justify-center opacity-0"
          >
            <img 
              src="/images/floating_cinnamon.png" 
              alt="Ceylon Cinnamon Bark" 
              className="hero-cinnamon-img w-48 h-48 md:w-64 md:h-64 object-contain"
            />
          </div>

          {/* Center Card Frame (Botanical Specimen Aesthetic - Absolute positioned to center correctly) */}
          <div 
            ref={centerCardRef} 
            className="hero-center-card absolute border border-spice-brown/15 bg-cream-warm/40 backdrop-blur-xs w-[280px] h-[380px] md:w-[320px] md:h-[440px] flex flex-col items-center justify-center p-6 z-5"
          >
            <div className="absolute top-4 left-4 text-[9px] md:text-[10px] tracking-[0.3em] font-body text-spice-brown/60 uppercase">Origin Select</div>
            {/* cardamom placeholder area inside the card initially */}
            <div className="w-40 h-40 md:w-56 md:h-56" /> 
            <div className="absolute bottom-4 text-[9px] md:text-[10px] tracking-[0.2em] font-accent italic text-spice-brown/80">Elettaria cardamomum</div>
          </div>

          {/* TEXT CONTENT LAYERS */}
          <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
            
            {/* COVER TEXT (Asymmetric left aligned on desktop, centered on mobile) */}
            <div 
              ref={coverTextRef}
              className="hero-cover-text absolute flex flex-col items-center md:items-start text-center md:text-left px-6 max-w-md"
            >
              <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold uppercase tracking-[0.2em] text-spice-brown leading-none mb-6 select-none">
                The Masala Company
              </h1>
              <p className="font-accent italic text-lg sm:text-xl md:text-2xl text-charcoal-soft max-w-xs select-none">
                Pure, unprocessed single-origin spices.
              </p>
            </div>

            {/* CHAPTER 1 TEXT (Terroir) */}
            <div 
              ref={chapter1Ref}
              className="hero-chapter-1-text absolute max-w-sm text-center md:text-left px-6 opacity-0 flex flex-col items-center md:items-start"
            >
              <p className="font-body text-[10px] md:text-xs tracking-[0.3em] uppercase text-turmeric mb-3 font-semibold">
                Chapter I
              </p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-spice-brown uppercase tracking-wider leading-tight mb-4 text-balance">
                The Soil of Kerala
              </h2>
              <p className="font-body text-charcoal-soft text-sm md:text-base leading-relaxed">
                Nurtured in the mist-kissed Western Ghats. Our green cardamom pods are harvested before dawn, capturing their intense, aromatic sweet-eucalyptus profile.
              </p>
            </div>

            {/* CHAPTER 2 TEXT (The Craft) */}
            <div 
              ref={chapter2Ref}
              className="hero-chapter-2-text absolute max-w-sm text-center md:text-right px-6 opacity-0 flex flex-col items-center md:items-end"
            >
              <p className="font-body text-[10px] md:text-xs tracking-[0.3em] uppercase text-turmeric mb-3 font-semibold">
                Chapter II
              </p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-spice-brown uppercase tracking-wider leading-tight mb-4 text-balance">
                The Ceylon Sun
              </h2>
              <p className="font-body text-charcoal-soft text-sm md:text-base leading-relaxed">
                True Ceylon Cinnamon from Sri Lanka, cured patiently under the tropical sun to lock in its complex, wood-floral sweetness.
              </p>
            </div>

            {/* FINAL REVEAL TEXT */}
            <div 
              ref={finalTextRef}
              className="hero-final-text absolute flex flex-col items-center text-center px-6 opacity-0"
            >
              <p className="font-body text-[10px] sm:text-xs tracking-[0.4em] uppercase text-turmeric mb-4 font-semibold">
                The Master Collection
              </p>
              <h2 className="font-display text-4xl sm:text-6xl md:text-8xl font-bold text-spice-brown uppercase leading-none tracking-wide mb-8 text-balance">
                From Farm <br/>
                <span className="italic font-accent lowercase text-3xl sm:text-5xl md:text-7xl text-turmeric-light">to</span> Flavor.
              </h2>
              <Link 
                to="/collections" 
                className="pointer-events-auto inline-flex items-center gap-4 px-8 py-3.5 border border-spice-brown text-spice-brown hover:bg-spice-brown hover:text-cream font-body text-xs uppercase tracking-widest transition-all duration-300"
              >
                Discover The Origin <HiArrowRight />
              </Link>
            </div>

          </div>

          {/* SCROLL INDICATOR */}
          <div 
            ref={scrollIndicatorRef}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-spice-brown/40 z-20 pointer-events-none"
          >
            <span className="font-body text-[9px] tracking-[0.3em] uppercase">Scroll to trace origin</span>
            <div className="w-px h-8 bg-spice-brown/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-spice-brown animate-[bounce_2s_infinite]" />
            </div>
          </div>
        </section>


        {/* === INGREDIENT REVEAL (Horizontal Scroll) === */}
        <section ref={horizontalWrapperRef} className="h-screen w-full overflow-hidden bg-cream-dark">
          <div ref={horizontalContainerRef} className="h-full flex w-[300vw]">
            
            {/* Panel 1 */}
            <div className="horizontal-panel w-screen shrink-0 h-full flex flex-col md:flex-row items-center justify-center p-6 md:p-24 gap-8 md:gap-16 relative bg-cream-dark">
              <div className="md:w-1/2 space-y-4 md:space-y-6 z-10 text-center md:text-left mt-16 md:mt-0">
                <p className="font-body text-[10px] md:text-xs tracking-[0.2em] uppercase text-turmeric">Chapter I</p>
                <h2 className="font-display text-4xl sm:text-5xl lg:text-7xl text-spice-brown uppercase">Kerala<br className="hidden md:block"/>Cardamom</h2>
                <p className="font-body text-charcoal-muted leading-relaxed max-w-md mx-auto md:mx-0 text-sm md:text-lg">
                  Hand-picked in the misty hills of the Western Ghats, our green cardamom pods are renowned for their intense, sweet-eucalyptus flavor and vibrant green hue.
                </p>
              </div>
              <div className="md:w-1/2 w-full h-[35vh] md:h-[70vh] relative overflow-hidden flex items-center justify-center">
                <img src="/images/floating_cardamom.png" alt="Cardamom origin" className="w-[80%] md:w-full h-full object-contain md:object-cover mix-blend-multiply opacity-90 md:scale-110" />
              </div>
            </div>

            {/* Panel 2 */}
            <div className="horizontal-panel w-screen shrink-0 h-full flex flex-col md:flex-row items-center justify-center p-6 md:p-24 gap-8 md:gap-16 relative bg-cream">
              <div className="md:w-1/2 w-full h-[35vh] md:h-[70vh] relative overflow-hidden flex items-center justify-center order-2 md:order-1">
                <img src="/images/floating_cinnamon.png" alt="Cinnamon origin" className="w-[80%] md:w-full h-full object-contain md:object-cover mix-blend-multiply opacity-90 md:scale-110" />
              </div>
              <div className="md:w-1/2 space-y-4 md:space-y-6 z-10 order-1 md:order-2 text-center md:text-left mt-16 md:mt-0">
                <p className="font-body text-[10px] md:text-xs tracking-[0.2em] uppercase text-turmeric">Chapter II</p>
                <h2 className="font-display text-4xl sm:text-5xl lg:text-7xl text-spice-brown uppercase">Ceylon<br className="hidden md:block"/>Cinnamon</h2>
                <p className="font-body text-charcoal-muted leading-relaxed max-w-md mx-auto md:mx-0 text-sm md:text-lg">
                  True cinnamon from the lush estates of Sri Lanka. With its delicate, brittle quills and complex floral sweetness, it elevates both savory and sweet dishes.
                </p>
              </div>
            </div>

            {/* Panel 3 */}
            <div className="horizontal-panel w-screen shrink-0 h-full flex flex-col items-center justify-center p-6 md:p-24 relative bg-cream-dark">
               <div className="text-center max-w-3xl space-y-6 md:space-y-8 px-4">
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-6xl text-spice-brown uppercase leading-tight">
                    Ethically Sourced.<br/>Masterfully Blended.
                  </h2>
                  <p className="font-body text-charcoal-muted text-base md:text-xl leading-relaxed">
                    We work directly with generational farmers to bring you spices that tell a story of terroir, tradition, and uncompromising quality.
                  </p>
                  <Link to="/about" className="inline-block border-b border-spice-brown text-spice-brown pb-1 font-body uppercase tracking-widest text-xs md:text-sm hover:text-turmeric hover:border-turmeric transition-colors mt-4">
                    Read Our Story
                  </Link>
               </div>
            </div>

          </div>
        </section>


        {/* === FEATURED PRODUCTS GRID === */}
        <section className="py-32 px-4 md:px-8 max-w-7xl mx-auto bg-cream">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <p className="font-body text-xs tracking-[0.2em] uppercase text-turmeric mb-4">Curated Selection</p>
              <h2 className="font-display text-4xl text-spice-brown uppercase">Featured Spices</h2>
            </div>
            <Link to="/collections" className="font-body text-sm uppercase tracking-widest text-spice-brown border-b border-spice-brown hover:text-turmeric hover:border-turmeric pb-1 transition-colors">
              View All Products
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-8">
            {FEATURED_PRODUCTS.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="group block cursor-pointer">
                <div className="aspect-[4/5] overflow-hidden mb-6 bg-cream-dark relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-spice-brown/0 group-hover:bg-spice-brown/10 transition-colors duration-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-lg text-spice-brown uppercase tracking-wide group-hover:text-turmeric transition-colors">{product.name}</h3>
                  <p className="font-accent italic text-charcoal-soft">{product.origin}</p>
                  <p className="font-body text-spice-brown">{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* === CUSTOMER REVIEWS SECTION === */}
        <section className="py-32 px-4 md:px-8 border-t border-spice-brown/10 bg-cream">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <p className="font-body text-xs tracking-[0.2em] uppercase text-turmeric mb-4">Customer Notes</p>
              <h2 className="font-display text-4xl text-spice-brown uppercase">Verified Reviews</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  id: 1,
                  name: "Aditya Sharma",
                  rating: 5,
                  product: "Royal Garam Masala",
                  comment: "Absolutely aromatic! Changed my curry game completely. The depth of flavor is unmatched by store-bought options."
                },
                {
                  id: 2,
                  name: "Meera Nair",
                  rating: 5,
                  product: "Erode Single-Origin Turmeric",
                  comment: "Very vibrant yellow and earthy. Tastes incredibly fresh. You can tell it's single-origin and premium quality."
                },
                {
                  id: 3,
                  name: "Rohan Sen",
                  rating: 4,
                  product: "Kashmiri Lal Mirch",
                  comment: "Beautiful deep red color without excessive heat. Perfect for getting that signature color in restaurant-style dishes."
                }
              ].map((rev) => (
                <div key={rev.id} className="bg-cream-dark/25 border border-spice-brown/10 p-8 flex flex-col justify-between rounded-none hover:border-spice-brown/30 transition-all duration-300">
                  <div className="space-y-4">
                    <div className="flex text-turmeric gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-sm">
                          {i < rev.rating ? "★" : "☆"}
                        </span>
                      ))}
                    </div>
                    <p className="font-body text-sm text-charcoal-muted leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-spice-brown/10">
                    <div className="font-display text-xs text-spice-brown uppercase tracking-wider font-bold">{rev.name}</div>
                    <div className="text-[10px] text-gray-400 font-accent italic mt-0.5">Verified Buyer — {rev.product}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </PageWrapper>
  )
}

export default Home
