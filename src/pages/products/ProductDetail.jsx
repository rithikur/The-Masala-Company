import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import PageWrapper from '../../components/layout/PageWrapper'
import SEOHead from '../../components/seo/SEOHead'
import { getProductBySlug } from '../../services/products'
import { toast } from 'react-hot-toast'
import useCart from '../../hooks/useCart'
import useWishlist from '../../hooks/useWishlist'
import { HiOutlineArrowLeft, HiOutlineChevronDown, HiHeart, HiOutlineHeart } from 'react-icons/hi'

// Premium mock data fallback if backend is unavailable
const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Royal Garam Masala',
    slug: 'royal-garam-masala',
    description: 'An aromatic heirloom spice blend crafted from 15 hand-roasted, single-origin ingredients. Deeply complex and intensely warm.',
    origin: 'Malabar Coast, Kerala',
    variants: [
      { id: 'v1-1', weight: '100g', price: 350.00, inventory_count: 25, sku: 'TMC-RGM-100' },
      { id: 'v1-2', weight: '250g', price: 790.00, inventory_count: 12, sku: 'TMC-RGM-250' }
    ],
    images: [
      { url: '/images/product_garam_masala.jpg', alt_text: 'Royal Garam Masala Packaging', is_primary: true },
      { url: '/images/product_turmeric.jpg', alt_text: 'Royal Garam Masala Whole Spices', is_primary: false }
    ],
    category_slug: 'signature-blends',
    tasting_notes: 'Cinnamon warmth, black pepper sharpness, cardamom sweetness, and a complex floral depth of whole mace and nutmeg.',
    ingredients: 'Cardamom, Cinnamon, Cloves, Mace, Nutmeg, Black Pepper, Coriander Seeds, Cumin, Star Anise, Fennel, Stone Flower.',
    sourcing: 'Harvested by farmer cooperatives across the Western Ghats under fair-trade partnerships, ensuring direct farm-gate premium pricing.'
  },
  {
    id: '2',
    name: 'Erode Single-Origin Turmeric',
    slug: 'erode-turmeric',
    description: 'Vibrant, high-curcumin turmeric powder, ground from carefully cured rhizomes. Earthy, warm, and highly therapeutic.',
    origin: 'Erode, Tamil Nadu',
    variants: [
      { id: 'v2-1', weight: '100g', price: 280.00, inventory_count: 40, sku: 'TMC-ERT-100' },
      { id: 'v2-2', weight: '250g', price: 620.00, inventory_count: 18, sku: 'TMC-ERT-250' }
    ],
    images: [
      { url: '/images/product_turmeric.jpg', alt_text: 'Erode Turmeric Jar', is_primary: true },
      { url: '/images/product_garam_masala.jpg', alt_text: 'Erode Turmeric Powder Close Up', is_primary: false }
    ],
    category_slug: 'single-origin',
    tasting_notes: 'Rich woody aroma, intense gingery earthiness, with a subtle bitter-sweet undertone and warm finish.',
    ingredients: '100% Pure Single-Origin Erode Turmeric Powder.',
    sourcing: 'Sourced directly from a family-run heritage farm in Erode, dried naturally under the shade, and cold-milled to retain essential turmeric oils.'
  },
  {
    id: '3',
    name: 'Kashmiri Lal Mirch',
    slug: 'kashmiri-lal-mirch',
    description: 'Sun-dried Kashmiri chillies yielding a rich, brilliant crimson color and a delicate, mild heat with sweet undertones.',
    origin: 'Pampore, Kashmir',
    variants: [
      { id: 'v3-1', weight: '100g', price: 320.00, inventory_count: 30, sku: 'TMC-KLM-100' },
      { id: 'v3-2', weight: '250g', price: 720.00, inventory_count: 15, sku: 'TMC-KLM-250' }
    ],
    images: [
      { url: '/images/product_garam_masala.jpg', alt_text: 'Kashmiri Lal Mirch Packaging', is_primary: true },
      { url: '/images/product_turmeric.jpg', alt_text: 'Kashmiri Lal Mirch Whole Chillies', is_primary: false }
    ],
    category_slug: 'single-origin',
    tasting_notes: 'Mildly pungent, fruity, sweet, smoky, offering a gorgeous natural red color with minimal heat.',
    ingredients: '100% Sun-Dried Kashmiri Red Chilli Powder.',
    sourcing: 'Cultivated in the rich saffron-rich soils of Pampore, Kashmir, harvested at peak ripeness, and stone-ground by hand.'
  },
  {
    id: '4',
    name: 'Tellicherry Black Peppercorns',
    slug: 'tellicherry-pepper',
    description: 'Vine-ripened, hand-picked large black peppercorns. Bold, complex aroma with citrus and pine notes and a clean, sharp bite.',
    origin: 'Wayanad, Kerala',
    variants: [
      { id: 'v4-1', weight: '100g', price: 420.00, inventory_count: 20, sku: 'TMC-TBP-100' },
      { id: 'v4-2', weight: '250g', price: 920.00, inventory_count: 8, sku: 'TMC-TBP-250' }
    ],
    images: [
      { url: '/images/product_turmeric.jpg', alt_text: 'Tellicherry Black Peppercorns Jar', is_primary: true },
      { url: '/images/product_garam_masala.jpg', alt_text: 'Tellicherry Pepper Close Up', is_primary: false }
    ],
    category_slug: 'single-origin',
    tasting_notes: 'Pungent heat, deep pine, woody undertones, citrus top notes, long and lingering finish.',
    ingredients: '100% Whole Tellicherry Black Peppercorns.',
    sourcing: 'Harvested from high-altitude estates in Wayanad, Kerala, select-graded for size (extra-large TGSEB grade).'
  }
]

const ProductDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [selectedImage, setSelectedImage] = useState('')
  const [loading, setLoading] = useState(true)
  const [openAccordions, setOpenAccordions] = useState({ tasting: true, sourcing: false })
  const [isAdding, setIsAdding] = useState(false)
  const [btnText, setBtnText] = useState('Add to Blend')
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })

  const { addToCart } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()

  const addToCartBtnRef = useRef(null)
  const carouselRef = useRef(null)

  useEffect(() => {
    // Ensure we start at the top of the new product page
    window.scrollTo(0, 0)
    
    const fetchProduct = async () => {
      setLoading(true)
      try {
        let prod = null
        try {
          prod = await getProductBySlug(slug)
        } catch (err) {
          // Fallback to mock product
          prod = MOCK_PRODUCTS.find(p => p.slug === slug)
        }

        if (!prod) {
          prod = MOCK_PRODUCTS.find(p => p.slug === slug)
        }

        if (prod) {
          setProduct(prod)
          if (prod.variants?.length > 0) {
            setSelectedVariant(prod.variants[0])
          }
          const primaryImg = prod.images?.find(i => i.is_primary) || prod.images?.[0]
          setSelectedImage(primaryImg?.url || '/images/product_garam_masala.jpg')
        }
      } catch (error) {
        toast.error('Failed to load product details.')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  // Related blends list (filter out current product)
  const relatedProducts = MOCK_PRODUCTS.filter(p => p.slug !== slug)

  const toggleAccordion = (section) => {
    setOpenAccordions(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const handleAddToCart = () => {
    if (!selectedVariant) return

    setIsAdding(true)
    setBtnText('Adding...')

    // Tactical micro-interaction on button click
    gsap.timeline()
      .to(addToCartBtnRef.current, { scale: 0.95, duration: 0.1, ease: 'power2.out' })
      .to(addToCartBtnRef.current, { scale: 1, duration: 0.15, ease: 'power2.out' })

    // Actually add the item to the cart
    addToCart(product, selectedVariant, 1)

    setTimeout(() => {
      setBtnText('Added to Bag ✓')
      toast.success(`${product.name} (${selectedVariant.weight}) added to your bag!`, {
        icon: '🛍️',
        duration: 3000,
      })

      setTimeout(() => {
        setIsAdding(false)
        setBtnText('Add to Blend')
      }, 2000)
    }, 600)
  }

  // Handle Image Zoom
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setZoomPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setZoomPosition({ x: 50, y: 50 })
  }

  // Scroll Related Blends Carousel
  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 300
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  if (loading) {
    return (
      <PageWrapper transparentNav={false} darkNavText={true}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 flex flex-col md:flex-row gap-12 mt-10 animate-pulse">
          <div className="flex-1 aspect-[4/5] bg-earth/5"></div>
          <div className="flex-1 flex flex-col gap-6">
            <div className="h-4 bg-earth/10 w-24"></div>
            <div className="h-10 bg-earth/10 w-3/4"></div>
            <div className="h-6 bg-earth/10 w-1/4"></div>
            <div className="h-24 bg-earth/10 w-full"></div>
          </div>
        </div>
      </PageWrapper>
    )
  }

  if (!product) {
    return (
      <PageWrapper transparentNav={false} darkNavText={true}>
        <div className="max-w-7xl mx-auto px-6 py-32 text-center">
          <h2 className="font-serif text-3xl text-earth mb-6">Blend Not Found</h2>
          <Link to="/products" className="inline-flex items-center gap-2 font-serif text-xs uppercase tracking-[0.2em] text-ochre hover:text-earth transition-colors">
            <HiOutlineArrowLeft /> Back to Catalog
          </Link>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper transparentNav={false} darkNavText={true}>
      <SEOHead 
        title={product.name} 
        description={product.description}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 mt-10">
        {/* Back navigation */}
        <Link 
          to="/products" 
          className="inline-flex items-center gap-2 font-serif text-xs uppercase tracking-[0.2em] text-ochre hover:text-earth transition-colors mb-12"
        >
          <HiOutlineArrowLeft /> Catalog
        </Link>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left: Sticky Image Gallery */}
          <div className="lg:sticky lg:top-32 flex flex-col gap-6">
            <div 
              className="aspect-[4/5] w-full overflow-hidden bg-cream-dark border border-earth/5 relative group cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img 
                src={selectedImage} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-[400ms] ease-out group-hover:scale-[2]"
                style={{ transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }}
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = '/images/product_garam_masala.jpg'
                }}
              />
            </div>
            {/* Thumbnail selector */}
            {product.images?.length > 1 && (
              <div className="flex gap-4">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedImage(img.url)}
                    className={`w-20 h-24 border overflow-hidden bg-cream-dark transition-all duration-300 ${
                      selectedImage === img.url ? 'border-ochre scale-95' : 'border-earth/10 hover:border-earth/30'
                    }`}
                  >
                    <img 
                      src={img.url} 
                      alt={`Thumbnail ${idx}`} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = '/images/product_garam_masala.jpg'
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Scrolling Info */}
          <div className="flex flex-col gap-8">
            <div className="border-b border-earth/10 pb-6">
              <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-ochre block mb-2">
                {product.origin || 'Heirloom Spice'}
              </span>
              <h1 className="font-serif text-4xl text-earth tracking-wide mb-4">
                {product.name}
              </h1>
              <p className="font-serif text-lg text-earth/80 italic leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Variant selector */}
            <div>
              <h3 className="font-['Outfit'] text-[10px] uppercase tracking-[0.2em] text-ochre mb-4">Select Weight</h3>
              <div className="flex flex-wrap gap-4">
                {product.variants?.map((v) => {
                  const isSelected = selectedVariant?.id === v.id
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`font-['Outfit'] text-sm px-6 py-3 transition-all duration-300 border ${
                        isSelected 
                          ? 'border-earth bg-earth text-cream' 
                          : 'border-earth/20 hover:border-earth/50 text-earth'
                      }`}
                    >
                      {v.weight} — ₹{parseFloat(v.price).toFixed(2)}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Price display and CTA button */}
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex items-baseline gap-4">
                <span className="font-['Outfit'] font-medium text-3xl tracking-wide text-earth">
                  ₹{selectedVariant ? parseFloat(selectedVariant.price).toFixed(2) : '0.00'}
                </span>
                {selectedVariant?.inventory_count <= 0 && (
                  <span className="font-['Outfit'] text-xs text-orange-600 uppercase tracking-widest">Out of Stock</span>
                )}
              </div>

              <div className="flex items-center gap-4">
                <button
                  ref={addToCartBtnRef}
                  onClick={handleAddToCart}
                  disabled={isAdding || (selectedVariant && selectedVariant.inventory_count <= 0)}
                  className={`flex-1 py-4 font-serif text-xs uppercase tracking-[0.2em] transition-all duration-300 border ${
                    isAdding 
                      ? 'bg-ochre border-ochre text-cream' 
                      : 'bg-earth border-earth text-cream hover:bg-transparent hover:text-earth'
                  }`}
                >
                  {btnText}
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-4 border transition-all duration-300 flex-shrink-0 ${
                    isWishlisted(product.id) ? 'border-turmeric bg-turmeric/5 text-turmeric' : 'border-earth/20 hover:border-earth text-earth'
                  }`}
                  title={isWishlisted(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  {isWishlisted(product.id) ? (
                    <HiHeart className="w-5 h-5" />
                  ) : (
                    <HiOutlineHeart className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Details Accordions */}
            <div className="border-t border-earth/10 mt-8 flex flex-col">
              {/* Accordion 1 */}
              <div className="border-b border-earth/10 py-5">
                <button
                  onClick={() => toggleAccordion('tasting')}
                  className="w-full flex items-center justify-between text-left font-serif text-sm text-earth uppercase tracking-[0.15em]"
                >
                  Tasting Notes & Ingredients
                  <HiOutlineChevronDown className={`transition-transform duration-300 ${openAccordions.tasting ? 'rotate-180' : ''}`} />
                </button>
                {openAccordions.tasting && (
                  <div className="mt-4 font-serif text-sm text-earth/70 leading-relaxed flex flex-col gap-3">
                    <p><strong>Flavor Profile:</strong> {product.tasting_notes || 'Warm, aromatic, robust and full-bodied.'}</p>
                    <p><strong>Ingredients:</strong> {product.ingredients || '100% whole spices.'}</p>
                  </div>
                )}
              </div>

              {/* Accordion 2 */}
              <div className="border-b border-earth/10 py-5">
                <button
                  onClick={() => toggleAccordion('sourcing')}
                  className="w-full flex items-center justify-between text-left font-serif text-sm text-earth uppercase tracking-[0.15em]"
                >
                  Sourcing & Farm Traceability
                  <HiOutlineChevronDown className={`transition-transform duration-300 ${openAccordions.sourcing ? 'rotate-180' : ''}`} />
                </button>
                {openAccordions.sourcing && (
                  <div className="mt-4 font-serif text-sm text-earth/70 leading-relaxed">
                    <p>{product.sourcing || 'Sourced directly from heritage spice farms using traditional harvesting techniques to protect flavor purity.'}</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* RELATED BLENDS CAROUSEL */}
        <div className="mt-32">
          <div className="flex items-center justify-between mb-8 border-b border-earth/10 pb-4">
            <h2 className="font-serif text-2xl text-earth">Related Blends</h2>
            <div className="flex gap-4">
              <button 
                onClick={() => scrollCarousel('left')}
                className="p-2 border border-earth/10 hover:border-earth/40 text-earth transition-colors"
                aria-label="Scroll left"
              >
                &larr;
              </button>
              <button 
                onClick={() => scrollCarousel('right')}
                className="p-2 border border-earth/10 hover:border-earth/40 text-earth transition-colors"
                aria-label="Scroll right"
              >
                &rarr;
              </button>
            </div>
          </div>

          <div 
            ref={carouselRef}
            className="flex gap-8 overflow-x-auto pb-6 scrollbar-hide snap-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {relatedProducts.map((p) => {
              const primaryImage = p.images?.find(i => i.is_primary) || p.images?.[0]
              const imageUrl = primaryImage?.url || '/images/product_garam_masala.jpg'
              const startingPrice = p.variants?.length > 0 
                ? Math.min(...p.variants.map(v => parseFloat(v.price))) 
                : 0

              return (
                <Link 
                  key={p.id}
                  to={`/products/${p.slug}`}
                  className="w-72 shrink-0 snap-start group"
                >
                  <div className="aspect-[4/5] w-full overflow-hidden bg-cream-dark border border-earth/5 mb-4">
                    <img 
                      src={imageUrl} 
                      alt={p.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = '/images/product_garam_masala.jpg'
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-center">
                    <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-ochre">
                      {p.origin}
                    </span>
                    <h3 className="font-serif text-base text-earth group-hover:text-ochre transition-colors duration-300">
                      {p.name}
                    </h3>
                    <div className="font-['Outfit'] text-sm text-earth/70">
                      From ₹{startingPrice.toFixed(2)}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

      </div>
    </PageWrapper>
  )
}

export default ProductDetail
