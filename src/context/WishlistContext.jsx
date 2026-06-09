import React, { createContext, useState, useEffect } from 'react'
import api from '../services/api'
import useAuth from '../hooks/useAuth'

export const WishlistContext = createContext({
  items: [],
  itemCount: 0,
  toggleWishlist: () => {},
  isWishlisted: () => false,
})

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState([])
  const { user } = useAuth()

  // Load wishlist from local storage on mount, or fetch from API if logged in
  useEffect(() => {
    const loadWishlist = async () => {
      if (user) {
        try {
          const res = await api.get('/api/wishlist')
          setItems(res.data.data || [])
        } catch (e) {
          console.error("Failed to load wishlist from API", e)
        }
      } else {
        const local = localStorage.getItem('tmc_wishlist')
        if (local) {
          try {
            setItems(JSON.parse(local))
          } catch (e) {
            console.error("Failed to parse local wishlist", e)
          }
        }
      }
    }
    loadWishlist()
  }, [user])

  const toggleWishlist = async (product) => {
    if (user) {
      try {
        const res = await api.post('/api/wishlist', { product_id: product.id })
        const { wishlisted } = res.data.data
        if (wishlisted) {
          setItems(prev => [...prev, { product_id: product.id, products: product }])
        } else {
          setItems(prev => prev.filter(item => item.product_id !== product.id))
        }
      } catch (e) {
        console.error("Wishlist API failed", e)
      }
    } else {
      // Local fallback
      setItems((prev) => {
        const exists = prev.some((item) => item.product_id === product.id)
        let updated = []
        if (exists) {
          updated = prev.filter((item) => item.product_id !== product.id)
        } else {
          updated = [...prev, { product_id: product.id, products: product }]
        }
        localStorage.setItem('tmc_wishlist', JSON.stringify(updated))
        return updated
      })
    }
  }

  const isWishlisted = (productId) => {
    return items.some((item) => item.product_id === productId)
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        itemCount: items.length,
        toggleWishlist,
        isWishlisted,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export default WishlistContext
