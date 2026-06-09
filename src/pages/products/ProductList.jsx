import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PageWrapper from '../../components/layout/PageWrapper'
import SEOHead from '../../components/seo/SEOHead'
import { getProducts } from '../../services/products'
import { getCategories } from '../../services/categories'
import { toast } from 'react-hot-toast'

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
    images: [{ url: '/images/product_garam_masala.png', alt_text: 'Royal Garam Masala Box', is_primary: true }],
    category_slug: 'signature-blends'
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
    images: [{ url: '/images/product_turmeric.png', alt_text: 'Erode Turmeric Jar', is_primary: true }],
    category_slug: 'single-origin'
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
    images: [{ url: '/images/product_garam_masala.png', alt_text: 'Kashmiri Lal Mirch Packaging', is_primary: true }],
    category_slug: 'single-origin'
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
    images: [{ url: '/images/product_turmeric.png', alt_text: 'Tellicherry Black Peppercorns Jar', is_primary: true }],
    category_slug: 'single-origin'
  }
]

const MOCK_CATEGORIES = [
  { id: 'c1', name: 'All Blends', slug: '' },
  { id: 'c2', name: 'Signature Blends', slug: 'signature-blends' },
  { id: 'c3', name: 'Single-Origin Spices', slug: 'single-origin' }
]

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

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
            cats = MOCK_CATEGORIES
          } else {
            cats = [{ id: 'all', name: 'All Blends', slug: '' }, ...cats]
          }
        } catch (err) {
          cats = MOCK_CATEGORIES
        }
        setCategories(cats)

        // Fetch Products
        let prodList = []
        try {
          const res = await getProducts({
            category: currentCategory,
            sort: currentSort,
            search: currentSearch,
            per_page: 24
          })
          prodList = res.data || []
          if (!prodList || prodList.length === 0) {
            // Filter mock data locally
            prodList = MOCK_PRODUCTS.filter(p => {
              if (currentCategory && p.category_slug !== currentCategory) return false
              if (currentSearch && !p.name.toLowerCase().includes(currentSearch.toLowerCase())) return false
              return true
            })
            // Sort mock data locally
            if (currentSort === 'price_asc') {
              prodList.sort((a, b) => (a.variants?.[0]?.price || 0) - (b.variants?.[0]?.price || 0))
            } else if (currentSort === 'price_desc') {
              prodList.sort((a, b) => (b.variants?.[0]?.price || 0) - (a.variants?.[0]?.price || 0))
            }
          }
        } catch (err) {
          // Filter mock data locally on API failure
          prodList = MOCK_PRODUCTS.filter(p => {
            if (currentCategory && p.category_slug !== currentCategory) return false
            if (currentSearch && !p.name.toLowerCase().includes(currentSearch.toLowerCase())) return false
            return true
          })
          if (currentSort === 'price_asc') {
            prodList.sort((a, b) => (a.variants?.[0]?.price || 0) - (b.variants?.[0]?.price || 0))
          } else if (currentSort === 'price_desc') {
            prodList.sort((a, b) => (b.variants?.[0]?.price || 0) - (a.variants?.[0]?.price || 0))
          }
        }
        setProducts(prodList)
      } catch (error) {
        toast.error('Failed to load catalog. Showing curated selection.')
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
  }

  return (
    <PageWrapper transparentNav={false} darkNavText={true}>
      <SEOHead 
        title="Spices Catalog" 
        description="Explore the absolute pinnacle of Indian spices. Hand-sourced, stone-ground, and ethically curated single-origins and artisanal blends."
      />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 flex flex-col md:flex-row gap-12 mt-10">
        {/* Left Sidebar Filter/Sort */}
        <aside className="w-full md:w-64 flex-shrink-0 flex flex-col gap-10">
          <div>
            <h2 className="font-serif text-xs uppercase tracking-[0.2em] text-ochre mb-6">Collections</h2>
            <ul className="flex flex-col gap-4">
              {categories.map((cat) => {
                const isActive = currentCategory === cat.slug
                return (
                  <li key={cat.id}>
                    <button
                      onClick={() => handleCategorySelect(cat.slug)}
                      className={`font-serif text-sm transition-all duration-300 text-left border-b ${
                        isActive 
                          ? 'text-earth border-earth/40 font-medium translate-x-1' 
                          : 'text-earth/60 border-transparent hover:text-earth'
                      }`}
                    >
                      {cat.name}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-xs uppercase tracking-[0.2em] text-ochre mb-6">Sort By</h2>
            <ul className="flex flex-col gap-4">
              {[
                { name: 'Latest Arrivals', value: 'newest' },
                { name: 'Price: Low to High', value: 'price_asc' },
                { name: 'Price: High to Low', value: 'price_desc' }
              ].map((opt) => {
                const isActive = currentSort === opt.value
                return (
                  <li key={opt.value}>
                    <button
                      onClick={() => handleSortSelect(opt.value)}
                      className={`font-serif text-sm transition-all duration-300 text-left border-b ${
                        isActive 
                          ? 'text-earth border-earth/40 font-medium translate-x-1' 
                          : 'text-earth/60 border-transparent hover:text-earth'
                      }`}
                    >
                      {opt.name}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="flex-1">
          {currentSearch && (
            <div className="mb-8 font-serif text-sm text-earth/60 italic">
              Showing search results for &ldquo;{currentSearch}&rdquo;
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="flex flex-col gap-4 animate-pulse">
                  <div className="aspect-[4/5] w-full bg-earth/5 border border-earth/10"></div>
                  <div className="h-4 bg-earth/10 w-2/3"></div>
                  <div className="h-4 bg-earth/10 w-1/3"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-earth/20 rounded">
              <p className="font-serif text-lg text-earth/60 italic">No blends found in this collection.</p>
              <button 
                onClick={() => setSearchParams({})}
                className="mt-4 font-serif text-xs uppercase tracking-[0.2em] text-ochre hover:text-earth transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {products.map((product) => {
                const primaryImage = product.images?.find(i => i.is_primary) || product.images?.[0]
                const imageUrl = primaryImage?.url || '/images/product_garam_masala.png'
                
                // Get starting price from variants
                const startingPrice = product.variants?.length > 0 
                  ? Math.min(...product.variants.map(v => parseFloat(v.price))) 
                  : 0

                return (
                  <Link 
                    key={product.id} 
                    to={`/products/${product.slug}`}
                    className="group flex flex-col"
                  >
                    {/* Image Area - scale on hover, elegant frame */}
                    <div className="aspect-[4/5] w-full overflow-hidden bg-cream-dark border border-earth/5 mb-6 relative">
                      <img 
                        src={imageUrl} 
                        alt={primaryImage?.alt_text || product.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = '/images/product_garam_masala.png'
                        }}
                      />
                      <div className="absolute inset-0 bg-earth/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-col gap-1 text-center">
                      <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-ochre">
                        {product.origin || 'Indian Origin'}
                      </span>
                      <h3 className="font-serif text-lg text-earth group-hover:text-ochre transition-colors duration-300">
                        {product.name}
                      </h3>
                      <span className="font-serif text-sm text-earth/70">
                        {startingPrice > 0 ? `From ₹${startingPrice.toFixed(2)}` : 'Pricing Unavailable'}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}

export default ProductList
