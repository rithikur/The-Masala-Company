import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { HiArrowRight, HiHeart, HiOutlineHeart } from 'react-icons/hi'
import PageWrapper from '../components/layout/PageWrapper'
import useWishlist from '../hooks/useWishlist'

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

const SHOWCASE_SPICES = [
  { id: 1, name: "Green Cardamom", origin: "Kerala Highlands", farmer: "Traditional Family Estate", harvest: "2025 Season", image: "/images/floating_cardamom.png", chapter: "Chapter I", chapterTitle: "The Soil of Kerala", chapterDesc: "Nurtured in the mist-kissed Western Ghats. Harvested before dawn to capture its intense, aromatic sweet-eucalyptus profile." },
  { id: 2, name: "Ceylon Cinnamon", origin: "Sri Lanka", farmer: "Organic Cooperatives", harvest: "Winter 2024", image: "/images/floating_cinnamon.png", chapter: "Chapter II", chapterTitle: "The Ceylon Sun", chapterDesc: "True cinnamon cured patiently under the tropical sun to lock in its complex, wood-floral sweetness." },
  { id: 3, name: "Garam Masala", origin: "Punjab Valleys", farmer: "Master Blenders", harvest: "Small Batch 2025", image: "/images/product_garam_masala.png", chapter: "Chapter III", chapterTitle: "The Royal Blend", chapterDesc: "A masterfully crafted blend of roasted spices, carrying the warmth and heritage of northern culinary traditions." },
  { id: 4, name: "Turmeric Root", origin: "Erode, Tamil Nadu", farmer: "Heritage Farmers", harvest: "Spring 2025", image: "/images/product_turmeric.png", chapter: "Chapter IV", chapterTitle: "The Golden Root", chapterDesc: "Vibrant, earthy, and rich in curcumin. Grown in the nutrient-dense soils of the south for maximum potency." },
]

const FEATURED_PRODUCTS = [
  { id: 1, name: "Kashmir Saffron", origin: "Pampore, Kashmir", price: "₹850", image: "/images/hero_spices_bg.png", slug: "kashmir-saffron" },
  { id: 2, name: "Ceylon Cinnamon", origin: "Sri Lanka", price: "₹420", image: "/images/floating_cinnamon.png", slug: "ceylon-cinnamon" },
  { id: 3, name: "Green Cardamom", origin: "Kerala, India", price: "₹650", image: "/images/floating_cardamom.png", slug: "green-cardamom" },
  { id: 4, name: "Turmeric Powder", origin: "Erode, Tamil Nadu", price: "₹210", image: "/images/hero_spices_bg.png", slug: "turmeric-powder" }
]

const Home = () => {
  const [loading, setLoading] = useState(true)
  const { toggleWishlist, isWishlisted } = useWishlist()
  const container = useRef(null)
  
  // Luxury Hero Refs
  const heroRef = useRef(null)
  const bgImageRef = useRef(null)
  const [activeSpice, setActiveSpice] = useState(0)

  // Floating particles removed for performance

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

  useEffect(() => {
    // Only auto-rotate on mobile screens (less than 1024px)
    const mediaQuery = window.matchMedia('(max-width: 1023px)');
    let timer;
    
    const handleMediaChange = (e) => {
      if (e.matches) {
        timer = setInterval(() => {
          setActiveSpice((prev) => (prev + 1) % SHOWCASE_SPICES.length);
        }, 4000);
      } else {
        clearInterval(timer);
      }
    };
    
    handleMediaChange(mediaQuery);
    mediaQuery.addEventListener('change', handleMediaChange);
    
    return () => {
      clearInterval(timer);
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  useGSAP(() => {
    if (loading) return

    const mm = gsap.matchMedia()
    const totalSpices = SHOWCASE_SPICES.length

    mm.add("(min-width: 1024px)", () => {
      // 1. Pinned Scroll Sequence for Desktop Hero
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: `+=${totalSpices * 100}%`, // Scroll length equals 100vh per spice
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          let index = Math.floor(self.progress * totalSpices)
          if (index >= totalSpices) index = totalSpices - 1
          setActiveSpice((prev) => (prev !== index ? index : prev))
        }
      })

      // Subtitle timeline for background color shifts
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: `+=${totalSpices * 100}%`,
          scrub: 1,
        }
      })
      
      tl.to(heroRef.current, { backgroundColor: "#EDE7D9", duration: 1 })
        .to(heroRef.current, { backgroundColor: "#F5EDD8", duration: 1 })
        .to(heroRef.current, { backgroundColor: "#FAF6EE", duration: 1 })

      // Parallax background scroll for desktop
      gsap.to(bgImageRef.current, {
        y: "15%",
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: `+=${totalSpices * 100}%`,
          scrub: true
        }
      })
    })

    mm.add("(max-width: 1023px)", () => {
      // Normal parallax on mobile without pinning
      gsap.to(bgImageRef.current, {
        y: "10%",
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      })
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
      mm.revert()
    }
  }, { scope: container, dependencies: [loading] })

  // Counter animation logic
  const counterRef = useRef(null)
  const isCounterInView = useInView(counterRef, { once: true, margin: "-100px" })

  return (
    <PageWrapper transparentNav darkNavText isPageLoading={loading}>
      <AnimatePresence>
        {loading && <LoadingScreen />}
      </AnimatePresence>

      <div ref={container} className="bg-cream overflow-hidden">
        
        {/* === LUXURY HERO SECTION === */}
        <section 
          ref={heroRef} 
          className="relative min-h-[100dvh] lg:h-[100dvh] w-full overflow-hidden bg-cream flex flex-col justify-center"
        >
          {/* Parallax Background */}
          <div className="absolute inset-0 w-full h-[130%] -top-[15%] pointer-events-none">
            <div 
              ref={bgImageRef}
              className="absolute inset-0 w-full h-full bg-cover bg-center opacity-30 mix-blend-multiply"
              style={{ backgroundImage: "url('/images/hero_spices_bg.png')" }}
            />
            {/* Soft Warm Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-cream/40 via-transparent to-cream" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-cream/70" />
            {/* Grain overlay removed for performance */}
          </div>



          {/* Main Content Grid (Top/Center) */}
          <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-12 pt-24 pb-8 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            
            {/* ---------------- MOBILE HERO (< 1024px) ---------------- */}
            <div className="w-full lg:hidden flex flex-col items-center text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <h1 className="font-display text-5xl sm:text-6xl font-bold text-spice-brown uppercase leading-[0.85] tracking-tight mb-4 flex flex-col">
                  <span>The</span>
                  <span>Masala</span>
                  <span>Company</span>
                </h1>
                <p className="font-accent italic text-lg text-spice-brown/80 mb-6 px-4">
                  India's finest single-origin spices.
                </p>
              </motion.div>

              {/* Sleek Mobile Card */}
              <motion.div 
                className="w-full max-w-sm aspect-[4/5] relative rounded-2xl overflow-hidden shadow-luxury border border-spice-brown/10 mb-8 bg-cream-dark"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.2 }}
              >
                 <AnimatePresence mode="wait">
                   <motion.img
                      key={activeSpice}
                      src={SHOWCASE_SPICES[activeSpice].image}
                      alt={SHOWCASE_SPICES[activeSpice].name}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0 w-full h-full object-contain p-8 mix-blend-multiply"
                   />
                 </AnimatePresence>
                 
                 <div className="absolute inset-0 bg-gradient-to-t from-spice-brown via-spice-brown/40 to-transparent pointer-events-none" />
                 
                 <div className="absolute bottom-0 left-0 w-full p-6 text-left z-10">
                    <p className="font-body text-[10px] tracking-[0.3em] uppercase text-turmeric mb-1">{SHOWCASE_SPICES[activeSpice].origin}</p>
                    <h2 className="font-display text-3xl text-cream mb-2">{SHOWCASE_SPICES[activeSpice].name}</h2>
                    <p className="font-body text-xs text-cream/80 line-clamp-2">{SHOWCASE_SPICES[activeSpice].chapterDesc}</p>
                 </div>
              </motion.div>
              
              {/* Mobile controls/dots */}
              <div className="flex gap-2 mb-8">
                {SHOWCASE_SPICES.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveSpice(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${activeSpice === idx ? 'w-8 bg-spice-brown' : 'w-2 bg-spice-brown/20'}`}
                  />
                ))}
              </div>

              <Link 
                to="/collections" 
                className="w-full max-w-sm px-8 py-4 bg-spice-brown text-cream font-body text-xs uppercase tracking-widest hover:bg-turmeric transition-colors"
              >
                Explore Collection
              </Link>
            </div>

            {/* ---------------- DESKTOP HERO (>= 1024px) ---------------- */}
            {/* Left: Typography & CTAs */}
            <div className="hidden lg:flex w-full lg:w-1/3 flex-col items-start text-left pt-0">
              <AnimatePresence mode="wait">
                {activeSpice === 0 ? (
                  <motion.div
                    key="intro"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <h1 className="font-display text-5xl lg:text-[4rem] font-medium text-spice-brown uppercase leading-[0.85] tracking-tight mb-4 flex flex-col">
                      <span>The</span>
                      <span>Masala</span>
                      <span>Company</span>
                    </h1>
                    <p className="font-accent italic text-lg xl:text-xl text-spice-brown/80 mb-4">
                      Tracing the journey of India's finest single-origin spices from farm to table.
                    </p>
                    <p className="font-body text-sm xl:text-base text-charcoal-muted max-w-sm mb-6 leading-relaxed">
                      Hand-selected from trusted growers. Pure, traceable, and naturally processed.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`chapter-${activeSpice}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <p className="font-body text-xs tracking-[0.4em] uppercase text-turmeric mb-3 font-semibold">
                      {SHOWCASE_SPICES[activeSpice].chapter}
                    </p>
                    <h2 className="font-display text-5xl md:text-6xl lg:text-[4rem] font-bold text-spice-brown uppercase leading-[0.9] tracking-tight mb-4 text-balance">
                      {SHOWCASE_SPICES[activeSpice].chapterTitle}
                    </h2>
                    <p className="font-body text-sm xl:text-base text-charcoal-muted max-w-sm mb-6 leading-relaxed">
                      {SHOWCASE_SPICES[activeSpice].chapterDesc}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
                
              <motion.div 
                className="flex flex-row items-center justify-start gap-6 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                  <Link 
                    to="/collections" 
                    className="relative group overflow-hidden px-8 py-4 bg-spice-brown text-cream font-body text-xs uppercase tracking-widest transition-transform hover:scale-105 duration-300 shadow-luxury"
                  >
                    <span className="relative z-10 group-hover:text-spice-brown transition-colors duration-500">Explore Collection</span>
                    <div className="absolute inset-0 bg-turmeric transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out" />
                  </Link>
                  <Link 
                    to="/about" 
                    className="group flex items-center gap-3 font-body text-xs uppercase tracking-widest text-spice-brown hover:text-turmeric transition-colors duration-300"
                  >
                    <span>Trace Origins</span>
                    <HiArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
                  </Link>
                </motion.div>
            </div>

            <div className="hidden lg:flex w-full lg:w-1/3 justify-center items-center relative my-4 lg:my-0">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                className="relative w-[280px] h-[380px] xl:w-[320px] xl:h-[440px] bg-cream-dark overflow-hidden rounded-t-full rounded-b-xl flex items-center justify-center group shadow-luxury border border-spice-brown/10"
              >
                <div className="absolute top-10 text-[10px] tracking-[0.3em] font-body text-spice-brown/60 uppercase z-20">Origin Select</div>
                
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeSpice}
                    src={SHOWCASE_SPICES[activeSpice].image}
                    alt={SHOWCASE_SPICES[activeSpice].name}
                    initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full object-contain p-12 mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
                  />
                </AnimatePresence>

                {/* Subtle bottom gradient to ground the image */}
                <div className="absolute inset-0 bg-gradient-to-t from-cream-dark via-cream-dark/20 to-transparent pointer-events-none z-10 opacity-70" />
              </motion.div>
            </div>

            {/* Right: Luxury Info Card */}
            <div className="hidden lg:flex w-full lg:w-1/3 flex-col items-end text-right">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.6 }}
                className="w-full max-w-sm space-y-8"
              >
                <div className="space-y-6 relative pb-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeSpice}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-5"
                    >
                      <div>
                        <p className="font-body text-[9px] tracking-[0.3em] uppercase text-spice-brown/50 mb-1">Origin</p>
                        <p className="font-display text-2xl text-spice-brown">{SHOWCASE_SPICES[activeSpice].origin}</p>
                      </div>
                      <div>
                        <p className="font-body text-[9px] tracking-[0.3em] uppercase text-spice-brown/50 mb-1">Spice</p>
                        <p className="font-display text-xl text-turmeric">{SHOWCASE_SPICES[activeSpice].name}</p>
                      </div>
                      <div>
                        <p className="font-body text-[9px] tracking-[0.3em] uppercase text-spice-brown/50 mb-1">Farmer</p>
                        <p className="font-accent italic text-lg text-spice-brown/90">{SHOWCASE_SPICES[activeSpice].farmer}</p>
                      </div>
                      <div>
                        <p className="font-body text-[9px] tracking-[0.3em] uppercase text-spice-brown/50 mb-1">Harvest</p>
                        <p className="font-body text-sm text-charcoal-soft">{SHOWCASE_SPICES[activeSpice].harvest}</p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Progress Line */}
                <div className="w-full pt-6 border-t border-spice-brown/10 relative">
                  <div className="flex justify-between items-center text-[8px] sm:text-[9px] font-body tracking-widest uppercase text-spice-brown/50 mb-2">
                    <span>Farm</span>
                    <span>Harvest</span>
                    <span>Process</span>
                    <span>Package</span>
                    <span>You</span>
                  </div>
                  <div className="w-full h-px bg-spice-brown/20 relative">
                    <motion.div 
                      className="absolute left-0 top-0 h-full bg-turmeric"
                      animate={{ width: ["0%", "100%", "0%"] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom Statistics & Scroll Indicator */}
          <div className="relative z-10 w-full border-t border-spice-brown/5 bg-cream/60 backdrop-blur-md">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
              
              {/* Counters */}
              <div ref={counterRef} className="flex flex-wrap justify-center md:justify-start gap-8 sm:gap-16">
                {[
                  { label: "Farmers", target: 150, suffix: "+" },
                  { label: "Spice Varieties", target: 20, suffix: "+" },
                  { label: "Traceable", target: 100, suffix: "%" },
                  { label: "Happy Customers", target: 5000, suffix: "+" }
                ].map((stat, idx) => (
                  <div key={idx} className="flex flex-col items-center md:items-start">
                    <span className="font-body text-4xl sm:text-5xl font-light tracking-tight text-spice-brown">
                      {isCounterInView ? (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 1, delay: 0.2 * idx }}
                        >
                          {stat.target}
                        </motion.span>
                      ) : "0"}
                      {stat.suffix}
                    </span>
                    <span className="font-body text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-charcoal-muted mt-1">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Scroll Indicator */}
              <div className="flex items-center gap-4 text-spice-brown/60">
                <span className="font-body text-[9px] tracking-[0.2em] uppercase hidden sm:block">Discover the Story</span>
                <span className="font-body text-[9px] tracking-[0.2em] uppercase block sm:hidden">Scroll</span>
                <div className="h-10 w-px bg-spice-brown/20 relative overflow-hidden">
                  <motion.div 
                    className="absolute top-0 left-0 w-full h-1/2 bg-turmeric"
                    animate={{ y: [0, 40] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              </div>
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
              <Link key={product.id} to={`/products/${product.slug}`} className="group block cursor-pointer">
                <div className="aspect-[4/5] overflow-hidden mb-6 bg-cream-dark relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-spice-brown/0 group-hover:bg-spice-brown/10 transition-colors duration-500" />
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      toggleWishlist(product)
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-cream/80 backdrop-blur-sm shadow-sm hover:bg-cream transition-colors text-earth z-10 opacity-0 group-hover:opacity-100 duration-300"
                    title={isWishlisted(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    {isWishlisted(product.id) ? (
                      <HiHeart className="w-5 h-5 text-turmeric" />
                    ) : (
                      <HiOutlineHeart className="w-5 h-5" />
                    )}
                  </button>
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
