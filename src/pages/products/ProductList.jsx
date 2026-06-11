import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PageWrapper from '../../components/layout/PageWrapper'
import SEOHead from '../../components/seo/SEOHead'
import { getProducts } from '../../services/products'
import { getCategories } from '../../services/categories'
import { toast } from 'react-hot-toast'
import { HiHeart, HiOutlineHeart, HiOutlineChevronDown, HiOutlineX } from 'react-icons/hi'
import useWishlist from '../../hooks/useWishlist'

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSortOpen, setIsSortOpen] = useState(false)
  const { toggleWishlist, isWishlisted } = useWishlist()

  // URL query params
  const currentCategory = searchParams.get('category') || ''
  const currentSort = searchParams.get('sort') || 'newest'
  const currentSearch = searchParams.get('search') || ''

  useEffect(() => {
    const fetchFiltersAndProducts = async () => {
      setLoading(true)
      try {
        // Fetch Categories
        let cats = []
        try {
          cats = await getCategories(true)
          if (!cats || cats.length === 0) {
            cats = [] // fallback handled below
          } else {
            cats = [{ id: 'all', name: 'All Collections', slug: '', description: 'Explore the absolute pinnacle of Indian spices. Hand-sourced, stone-ground, and ethically curated single-origins and artisanal blends.' }, ...cats]
          }
        } catch (err) {
          cats = [{ id: 'all', name: 'All Collections', slug: '', description: 'Explore the absolute pinnacle of Indian spices. Hand-sourced, stone-ground, and ethically curated single-origins and artisanal blends.' }]
        }
        setCategories(cats)

        // Fetch Products
        try {
          const res = await getProducts({
            category: currentCategory,
            sort: currentSort,
            search: currentSearch,
            per_page: 50 // Fetch more for masonry
          })
          setProducts(res.data || [])
        } catch (err) {
          toast.error('Failed to load catalog. Please try again.')
          setProducts([])
        }
      } catch (error) {
        toast.error('Failed to load catalog.')
      } finally {
        setLoading(false)
      }
    }

    fetchFiltersAndProducts()
  }, [currentCategory, currentSort, currentSearch])

  const handleCategorySelect = (slug) => {
    const params = new URLSearchParams(searchParams)
    if (slug) {
      params.set('category', slug)
    } else {
      params.delete('category')
    }
    setSearchParams(params)
  }

  const handleSortSelect = (sortVal) => {
    const params = new URLSearchParams(searchParams)
    params.set('sort', sortVal)
    setSearchParams(params)
    setIsSortOpen(false)
  }

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams)
    params.delete('search')
    setSearchParams(params)
  }

  // Determine Hero Content
  const activeCatObj = categories.find(c => c.slug === currentCategory) || categories[0]
  const heroImage = activeCatObj?.image_url || '/images/hero_spices_bg.png'
  const heroTitle = activeCatObj ? activeCatObj.name : 'The Complete Collection'
  const heroDesc = activeCatObj?.description || 'Discover our curated selection of premium spices and blends.'

  // Sort Options
  const sortOptions = [
    { name: 'Latest Arrivals', value: 'newest' },
    { name: 'Price: Low to High', value: 'price_asc' },
    { name: 'Price: High to Low', value: 'price_desc' }
  ]
  const activeSortName = sortOptions.find(o => o.value === currentSort)?.name || 'Sort By'

  return (
    <PageWrapper transparentNav={true} darkNavText={false}>
      <SEOHead 
        title={`${heroTitle} | The Masala Company`}
        description={heroDesc}
      />
      
      <div className="bg-cream min-h-screen">
        
        {/* === DYNAMIC CINEMATIC HERO === */}
        <section className="relative w-full h-[50vh] md:h-[60vh] bg-charcoal overflow-hidden flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.img
              key={heroImage}
              src={heroImage}
              alt={heroTitle}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.6, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute inset-0 w-full h-full object-cover mix-blend-multiply"
            />
          </AnimatePresence>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-dark via-charcoal/40 to-transparent pointer-events-none" />

          {/* Hero Content */}
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-16">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-body text-xs sm:text-sm tracking-[0.3em] uppercase text-turmeric mb-4"
            >
              Curated Selection
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-display text-5xl md:text-6xl text-cream mb-6 leading-tight"
            >
              {heroTitle}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="font-accent italic text-lg md:text-xl text-cream/80 max-w-2xl mx-auto"
            >
              {heroDesc}
            </motion.p>
          </div>

          {/* Animated Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-cream/60 pointer-events-none"
          >
            <span className="font-body text-[9px] tracking-[0.2em] uppercase">Scroll</span>
            <motion.div 
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <HiOutlineChevronDown size={18} />
            </motion.div>
          </motion.div>
        </section>

        {/* === STICKY HORIZONTAL FILTERS === */}
        <div className="sticky top-0 z-40 bg-cream/90 backdrop-blur-md border-b border-spice-brown/10 shadow-sm transition-all duration-300">
          <div className="max-w-[1600px] mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Category Pills (Scrollable horizontally on mobile) */}
            <div className="w-full sm:w-auto flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
              {categories.map((cat) => {
                const isActive = currentCategory === cat.slug
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.slug)}
                    className={`whitespace-nowrap px-5 py-2 rounded-full font-body text-[11px] tracking-[0.15em] uppercase transition-all duration-300 ${
                      isActive 
                        ? 'bg-spice-brown text-cream shadow-md' 
                        : 'bg-transparent text-spice-brown/70 hover:bg-spice-brown/5 hover:text-spice-brown border border-spice-brown/20'
                    }`}
                  >
                    {cat.name}
                  </button>
                )
              })}
            </div>

            {/* Sort Dropdown */}
            <div className="relative w-full sm:w-auto flex justify-end">
              <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 px-5 py-2 rounded-full font-body text-[11px] tracking-[0.15em] uppercase text-spice-brown border border-spice-brown/20 hover:bg-spice-brown/5 transition-colors"
              >
                {activeSortName} <HiOutlineChevronDown className={`transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isSortOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-cream border border-spice-brown/10 shadow-luxury rounded-xl overflow-hidden z-50 flex flex-col"
                  >
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleSortSelect(opt.value)}
                        className={`text-left px-5 py-3 font-body text-xs tracking-wider transition-colors ${
                          currentSort === opt.value ? 'bg-spice-brown/5 text-turmeric font-medium' : 'text-spice-brown/70 hover:bg-spice-brown/5 hover:text-spice-brown'
                        }`}
                      >
                        {opt.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* === MAIN GALLERY AREA === */}
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-16 min-h-[50vh]">
          
          {currentSearch && (
            <div className="mb-12 flex items-center gap-4">
              <p className="font-accent italic text-xl text-spice-brown/60">
                Showing search results for <span className="text-spice-brown font-semibold">"{currentSearch}"</span>
              </p>
              <button 
                onClick={clearSearch}
                className="p-2 rounded-full hover:bg-spice-brown/10 text-spice-brown transition-colors"
                title="Clear Search"
              >
                <HiOutlineX size={18} />
              </button>
            </div>
          )}

          {loading ? (
            // Loading Skeletons for Masonry
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="break-inside-avoid flex flex-col gap-4 animate-pulse mb-8">
                  <div className={`w-full bg-spice-brown/5 rounded-2xl ${n % 2 === 0 ? 'aspect-[3/4]' : 'aspect-square'}`}></div>
                  <div className="h-4 bg-spice-brown/10 w-2/3 rounded"></div>
                  <div className="h-3 bg-spice-brown/5 w-1/3 rounded"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32 flex flex-col items-center justify-center"
            >
              <div className="w-24 h-24 rounded-full border border-spice-brown/10 flex items-center justify-center mb-6">
                <HiOutlineHeart className="w-8 h-8 text-spice-brown/30" />
              </div>
              <h3 className="font-display text-2xl text-spice-brown mb-2">No Spices Found</h3>
              <p className="font-accent italic text-lg text-spice-brown/60 mb-8 max-w-md">
                We couldn't find any products matching your current filters in this collection.
              </p>
              <button 
                onClick={() => setSearchParams({})}
                className="px-8 py-3 bg-spice-brown text-cream font-body text-xs uppercase tracking-widest hover:bg-charcoal transition-colors rounded-full"
              >
                View All Collections
              </button>
            </motion.div>
          ) : (
            // Elegant Grid Layout
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {products.map((product, idx) => {
                const primaryImage = product.images?.find(i => i.is_primary) || product.images?.[0]
                const imageUrl = primaryImage?.url || '/images/product_garam_masala.png'
                
                // Get starting price
                const startingPrice = product.variants?.length > 0 
                  ? Math.min(...product.variants.map(v => parseFloat(v.price))) 
                  : 0

                // Consistent aspect ratio for perfect alignment
                const aspectClass = 'aspect-[4/5]'

                return (
                  <motion.div 
                    key={product.id}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
                    }}
                    className="group flex flex-col h-full"
                  >
                    <Link 
                      to={`/products/${product.slug}`}
                      className="flex flex-col gap-5 block"
                    >
                      {/* Image Area - Frameless, rounded, elegant */}
                      <div className={`w-full overflow-hidden rounded-2xl bg-cream-dark relative shadow-sm transition-shadow duration-500 ${aspectClass}`}>
                        <img 
                          src={imageUrl} 
                          alt={primaryImage?.alt_text || product.name}
                          className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = '/images/product_garam_masala.png'
                          }}
                        />
                        
                        {/* Elegant overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        
                        {/* Wishlist Button - Floating */}
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            toggleWishlist(product)
                          }}
                          className="absolute top-4 right-4 p-3 rounded-full bg-cream/90 backdrop-blur-md shadow-lg text-spice-brown transform scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 hover:bg-cream hover:text-turmeric z-10"
                          title={isWishlisted(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                        >
                          {isWishlisted(product.id) ? (
                            <HiHeart className="w-5 h-5 text-turmeric" />
                          ) : (
                            <HiOutlineHeart className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      {/* Content Area */}
                      <div className="flex flex-col items-center text-center px-4">
                        <span className="font-body text-[9px] tracking-[0.3em] uppercase text-spice-brown/50 mb-2">
                          {product.origin || 'Indian Origin'}
                        </span>
                        <h3 className="font-display text-xl sm:text-2xl text-spice-brown mb-1 group-hover:text-turmeric transition-colors duration-300 leading-tight">
                          {product.name}
                        </h3>
                        <span className="font-accent italic text-sm text-charcoal-muted">
                          {startingPrice > 0 ? `From ₹${startingPrice.toFixed(2)}` : 'Pricing Unavailable'}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}

export default ProductList
