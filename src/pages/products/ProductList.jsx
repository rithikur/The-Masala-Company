import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PageWrapper from '../../components/layout/PageWrapper'
import SEOHead from '../../components/seo/SEOHead'
import { getProducts } from '../../services/products'
import { getCategories } from '../../services/categories'
import { HiHeart, HiOutlineHeart, HiOutlineChevronDown, HiOutlineX } from 'react-icons/hi'
import useWishlist from '../../hooks/useWishlist'

// ── Rich mock data — always shown if the backend is unreachable ─────────────
const MOCK_CATEGORIES = [
  { id: 'all', name: 'All Collections', slug: '', description: 'Explore the absolute pinnacle of Indian spices. Hand-sourced, stone-ground, and ethically curated.' },
  { id: 'c1', name: 'Whole Spices', slug: 'whole-spices', description: 'Pure, hand-picked whole spices from origin farms.', image_url: '/images/floating_cardamom.jpg' },
  { id: 'c2', name: 'Ground Spices', slug: 'ground-spices', description: 'Stone-cold-milled for maximum freshness and aroma.', image_url: '/images/product_turmeric.jpg' },
  { id: 'c3', name: 'Spice Blends', slug: 'spice-blends', description: 'Handcrafted masala blends rooted in culinary tradition.', image_url: '/images/product_garam_masala.jpg' },
  { id: 'c4', name: 'Seeds & Pods', slug: 'seeds-pods', description: 'Aromatic seeds and pods for tempering and finishing.', image_url: '/images/floating_cinnamon.jpg' },
  { id: 'c5', name: 'Exotic & Rare', slug: 'exotic-rare', description: 'Rare single-origin finds — saffron, mace, and beyond.', image_url: '/images/hero_spices_bg.jpg' },
  { id: 'c6', name: 'Gift Sets', slug: 'gift-sets', description: 'Curated gift boxes for the discerning spice lover.', image_url: '/images/product_garam_masala.jpg' },
]

const MOCK_PRODUCTS = [
  { id: '1', name: 'Royal Garam Masala', slug: 'royal-garam-masala', origin: 'Malabar Coast, Kerala', category_slug: 'spice-blends', images: [{ url: '/images/product_garam_masala.jpg', is_primary: true }], variants: [{ price: '350.00' }, { price: '790.00' }] },
  { id: '2', name: 'Erode Single-Origin Turmeric', slug: 'erode-turmeric', origin: 'Erode, Tamil Nadu', category_slug: 'ground-spices', images: [{ url: '/images/product_turmeric.jpg', is_primary: true }], variants: [{ price: '280.00' }, { price: '620.00' }] },
  { id: '3', name: 'Green Cardamom Pods', slug: 'green-cardamom', origin: 'Kerala Highlands', category_slug: 'whole-spices', images: [{ url: '/images/floating_cardamom.jpg', is_primary: true }], variants: [{ price: '420.00' }, { price: '950.00' }] },
  { id: '4', name: 'Ceylon Cinnamon Quills', slug: 'ceylon-cinnamon', origin: 'Sri Lanka', category_slug: 'whole-spices', images: [{ url: '/images/floating_cinnamon.jpg', is_primary: true }], variants: [{ price: '380.00' }, { price: '850.00' }] },
  { id: '5', name: 'Kashmiri Lal Mirch', slug: 'kashmiri-lal-mirch', origin: 'Pampore, Kashmir', category_slug: 'ground-spices', images: [{ url: '/images/product_turmeric.jpg', is_primary: true }], variants: [{ price: '320.00' }, { price: '720.00' }] },
  { id: '6', name: 'Tellicherry Black Pepper', slug: 'tellicherry-pepper', origin: 'Wayanad, Kerala', category_slug: 'whole-spices', images: [{ url: '/images/product_garam_masala.jpg', is_primary: true }], variants: [{ price: '420.00' }, { price: '920.00' }] },
  { id: '7', name: 'Chai Masala Blend', slug: 'chai-masala', origin: 'Assam Highlands', category_slug: 'spice-blends', images: [{ url: '/images/product_garam_masala.jpg', is_primary: true }], variants: [{ price: '290.00' }, { price: '650.00' }] },
  { id: '8', name: 'Kashmir Saffron', slug: 'kashmir-saffron', origin: 'Pampore, Kashmir', category_slug: 'exotic-rare', images: [{ url: '/images/hero_spices_bg.jpg', is_primary: true }], variants: [{ price: '850.00' }] },
  { id: '9', name: 'Cumin Seeds', slug: 'cumin-seeds', origin: 'Rajasthan, India', category_slug: 'seeds-pods', images: [{ url: '/images/floating_cardamom.jpg', is_primary: true }], variants: [{ price: '180.00' }, { price: '400.00' }] },
  { id: '10', name: 'Fennel Seeds', slug: 'fennel-seeds', origin: 'Gujarat, India', category_slug: 'seeds-pods', images: [{ url: '/images/floating_cinnamon.jpg', is_primary: true }], variants: [{ price: '160.00' }, { price: '360.00' }] },
  { id: '11', name: 'Spice Starter Gift Box', slug: 'spice-starter-gift', origin: 'Pan India', category_slug: 'gift-sets', images: [{ url: '/images/product_garam_masala.jpg', is_primary: true }], variants: [{ price: '1200.00' }] },
  { id: '12', name: 'Chef\'s Collection Gift Set', slug: 'chefs-collection-gift', origin: 'Pan India', category_slug: 'gift-sets', images: [{ url: '/images/hero_spices_bg.jpg', is_primary: true }], variants: [{ price: '2200.00' }] },
]

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState(MOCK_CATEGORIES)
  const [loading, setLoading] = useState(true)
  const [isSortOpen, setIsSortOpen] = useState(false)
  const { toggleWishlist, isWishlisted } = useWishlist()

  const currentCategory = searchParams.get('category') || ''
  const currentSort = searchParams.get('sort') || 'newest'
  const currentSearch = searchParams.get('search') || ''

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      // Load categories silently — fall back to mock if API fails
      try {
        const cats = await getCategories(true)
        if (cats && cats.length > 0) {
          setCategories([MOCK_CATEGORIES[0], ...cats])
        }
      } catch (_) {
        // keep MOCK_CATEGORIES — already set as default state
      }

      // Load products silently — fall back to mock if API fails
      try {
        const res = await getProducts({
          category: currentCategory,
          sort: currentSort,
          search: currentSearch,
          per_page: 50,
        })
        if (res.data && res.data.length > 0) {
          setProducts(res.data)
        } else {
          setProducts(getFilteredMock(currentCategory, currentSearch, currentSort))
        }
      } catch (_) {
        setProducts(getFilteredMock(currentCategory, currentSearch, currentSort))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentCategory, currentSort, currentSearch])

  // Filter mock products client-side when API is unavailable
  const getFilteredMock = (category, search, sort) => {
    let list = [...MOCK_PRODUCTS]
    if (category) list = list.filter(p => p.category_slug === category)
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    if (sort === 'price_asc') list.sort((a, b) => parseFloat(a.variants[0].price) - parseFloat(b.variants[0].price))
    if (sort === 'price_desc') list.sort((a, b) => parseFloat(b.variants[0].price) - parseFloat(a.variants[0].price))
    return list
  }

  const handleCategorySelect = (slug) => {
    const params = new URLSearchParams(searchParams)
    slug ? params.set('category', slug) : params.delete('category')
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

  const activeCatObj = categories.find(c => c.slug === currentCategory) || categories[0]
  const heroImage = activeCatObj?.image_url || '/images/hero_spices_bg.jpg'
  const heroTitle = activeCatObj?.name || 'The Complete Collection'
  const heroDesc = activeCatObj?.description || 'Discover our curated selection of premium spices and blends.'

  const sortOptions = [
    { name: 'Latest Arrivals', value: 'newest' },
    { name: 'Price: Low to High', value: 'price_asc' },
    { name: 'Price: High to Low', value: 'price_desc' },
  ]
  const activeSortName = sortOptions.find(o => o.value === currentSort)?.name || 'Sort By'

  return (
    <PageWrapper transparentNav={true} darkNavText={false}>
      <SEOHead
        title={`${heroTitle} | The Masala Company`}
        description={heroDesc}
      />

      <div className="bg-cream min-h-screen">

        {/* === CINEMATIC HERO === */}
        <section className="relative w-full h-[50vh] md:h-[60vh] bg-charcoal overflow-hidden flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.img
              key={heroImage}
              src={heroImage}
              alt={heroTitle}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.6, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute inset-0 w-full h-full object-cover mix-blend-multiply"
              loading="eager"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-dark via-charcoal/40 to-transparent pointer-events-none" />

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
              className="font-display text-3xl sm:text-4xl md:text-6xl text-cream mb-6 leading-tight"
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
        </section>

        {/* === STICKY FILTERS === */}
        <div className="sticky top-0 z-40 bg-cream/90 backdrop-blur-md border-b border-spice-brown/10 shadow-sm">
          <div className="max-w-[1600px] mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Category Pills */}
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

        {/* === MAIN GALLERY === */}
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-16 min-h-[50vh]">

          {currentSearch && (
            <div className="mb-12 flex items-center gap-4">
              <p className="font-accent italic text-xl text-spice-brown/60">
                Results for <span className="text-spice-brown font-semibold">"{currentSearch}"</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="flex flex-col gap-4 animate-pulse">
                  <div className="w-full aspect-[4/5] bg-spice-brown/5 rounded-2xl" />
                  <div className="h-4 bg-spice-brown/10 w-2/3 rounded mx-auto" />
                  <div className="h-3 bg-spice-brown/5 w-1/3 rounded mx-auto" />
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
                No products match your current filters.
              </p>
              <button
                onClick={() => setSearchParams({})}
                className="px-8 py-3 bg-spice-brown text-cream font-body text-xs uppercase tracking-widest hover:bg-charcoal transition-colors rounded-full"
              >
                View All Collections
              </button>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            >
              {products.map((product) => {
                const primaryImage = product.images?.find(i => i.is_primary) || product.images?.[0]
                const imageUrl = primaryImage?.url || '/images/product_garam_masala.jpg'
                const startingPrice = product.variants?.length > 0
                  ? Math.min(...product.variants.map(v => parseFloat(v.price)))
                  : 0

                return (
                  <motion.div
                    key={product.id}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
                    }}
                    className="group flex flex-col"
                  >
                    <Link to={`/products/${product.slug}`} className="flex flex-col gap-5">
                      <div className="w-full aspect-[4/5] overflow-hidden rounded-2xl bg-cream-dark relative shadow-sm">
                        <img
                          src={imageUrl}
                          alt={primaryImage?.alt_text || product.name}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => { e.target.onerror = null; e.target.src = '/images/product_garam_masala.jpg' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <button
                          onClick={(e) => { e.preventDefault(); toggleWishlist(product) }}
                          className="absolute top-4 right-4 p-3 rounded-full bg-cream/90 backdrop-blur-md shadow-lg text-spice-brown sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:text-turmeric z-10"
                          title={isWishlisted(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        >
                          {isWishlisted(product.id)
                            ? <HiHeart className="w-5 h-5 text-turmeric" />
                            : <HiOutlineHeart className="w-5 h-5" />}
                        </button>
                      </div>

                      <div className="flex flex-col items-center text-center px-4">
                        <span className="font-body text-[9px] tracking-[0.3em] uppercase text-spice-brown/50 mb-2">
                          {product.origin || 'Indian Origin'}
                        </span>
                        <h3 className="font-display text-xl sm:text-2xl text-spice-brown mb-1 group-hover:text-turmeric transition-colors duration-300 leading-tight">
                          {product.name}
                        </h3>
                        <span className="font-accent italic text-sm text-charcoal-muted">
                          {startingPrice > 0 ? `From ₹${startingPrice.toFixed(2)}` : 'Price on request'}
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
