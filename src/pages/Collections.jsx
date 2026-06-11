import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import { motion } from 'framer-motion'
import { HiArrowRight, HiHeart, HiOutlineHeart, HiOutlineShoppingBag } from 'react-icons/hi'
import { getCategories } from '../services/categories'
import { getProducts } from '../services/products'
import useWishlist from '../hooks/useWishlist'

const Collections = () => {
  const [categories, setCategories] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const { toggleWishlist, isWishlisted } = useWishlist()

  useEffect(() => {
    const loadData = async () => {
      try {
        const cats = await getCategories()
        // Map spans dynamically for the bento grid
        const mappedCats = cats.map((c, i) => {
          let span = 'col-span-1 md:col-span-1 row-span-1'
          if (i === 0) span = 'col-span-1 md:col-span-2 row-span-2'
          else if (i === 5) span = 'col-span-1 md:col-span-2 row-span-1'
          return { ...c, span }
        })
        setCategories(mappedCats)

        const result = await getProducts({ page: 1, per_page: 8, sort: 'newest' })
        setFeaturedProducts(result.data || [])
      } catch (err) {
        console.error('Failed to load collections page data', err)
      }
    }
    loadData()
  }, [])

  return (
    <PageWrapper>
      <div className="min-h-screen bg-cream pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.2em] text-turmeric font-semibold block mb-3">Our Offerings</span>
            <h1 className="text-5xl md:text-6xl font-display font-light text-spice-brown mb-6">Curated Collections</h1>
            <p className="max-w-2xl mx-auto text-charcoal-soft font-body leading-relaxed text-sm">
              Discover our carefully sourced selections. From foundational whole spices to intricate signature blends, everything is designed to elevate your cooking.
            </p>
          </div>

          {/* BENTO GRID UI */}
          <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[250px] gap-4 mb-32">
            {categories.map((collection, idx) => (
              <motion.div 
                key={collection.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`group relative overflow-hidden bg-cream-dark flex flex-col ${collection.span}`}
              >
                <div className="absolute inset-0 z-0">
                  <img 
                    src={collection.image_url || '/images/hero_spices_bg.png'} 
                    alt={collection.name}
                    className="w-full h-full object-cover mix-blend-multiply opacity-80 transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
                </div>
                
                <div className="relative z-10 flex-1 flex flex-col justify-end p-6 md:p-8 text-cream">
                  <h2 className="text-2xl md:text-3xl font-display font-light mb-2">{collection.name}</h2>
                  <p className="font-body text-xs md:text-sm text-cream/80 mb-4 max-w-sm">
                    {collection.description}
                  </p>
                  <Link 
                    to={`/products?category=${collection.slug}`}
                    className="inline-flex items-center text-xs uppercase tracking-widest font-semibold text-turmeric hover:text-white transition-colors w-fit"
                  >
                    Explore <HiArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ADDED PRODUCTS SECTION */}
          <div className="mt-32 pt-16 border-t border-spice-brown/10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-turmeric font-semibold block mb-2">Direct from Farms</span>
                <h2 className="text-3xl md:text-4xl font-display text-spice-brown">Featured Spices</h2>
              </div>
              <Link to="/products" className="font-body text-sm uppercase tracking-widest text-spice-brown border-b border-spice-brown hover:text-turmeric hover:border-turmeric pb-1 transition-colors">
                Shop the Pantry
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, idx) => {
                const primaryImage = product.images?.find(i => i.is_primary) || product.images?.[0]
                const imageUrl = primaryImage?.url || '/images/product_garam_masala.png'
                const startingPrice = product.variants?.length > 0 ? Math.min(...product.variants.map(v => parseFloat(v.price))) : 0

                return (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group flex flex-col cursor-pointer"
                >
                  <Link to={`/products/${product.slug}`} className="aspect-[4/5] bg-cream-dark relative overflow-hidden mb-4 block">
                    <img 
                      src={imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-spice-brown/0 group-hover:bg-spice-brown/5 transition-colors duration-500" />
                    
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
                  </Link>

                  <div>
                    <h3 className="font-display text-lg text-spice-brown group-hover:text-turmeric transition-colors">{product.name}</h3>
                    <p className="font-accent italic text-charcoal-soft mb-1">{product.origin || 'India'}</p>
                    <p className="font-body text-spice-brown">{startingPrice > 0 ? `₹${startingPrice.toFixed(2)}` : 'N/A'}</p>
                  </div>
                </motion.div>
              )})}
            </div>
          </div>

        </div>
      </div>
    </PageWrapper>
  )
}

export default Collections
