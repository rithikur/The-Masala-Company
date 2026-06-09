import React, { createContext, useState, useEffect } from 'react'

const initialState = {
  items: [], // [{ product, variant, quantity }]
  itemCount: 0,
  subtotal: 0,
}

export const CartContext = createContext({
  ...initialState,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
})

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([])
  const [itemCount, setItemCount] = useState(0)
  const [subtotal, setSubtotal] = useState(0)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('tmc_cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (e) {
        console.error("Failed to parse cart items", e)
      }
    }
  }, [])

  // Recalculate count and subtotal when items change
  useEffect(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0)
    const sub = items.reduce((sum, item) => sum + (parseFloat(item.variant.price) * item.quantity), 0)
    
    setItemCount(count)
    setSubtotal(sub)
    localStorage.setItem('tmc_cart', JSON.stringify(items))
  }, [items])

  const addToCart = (product, variant, quantity = 1) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.variant.id === variant.id
      )

      if (existingIndex > -1) {
        const updated = [...prevItems]
        updated[existingIndex].quantity += quantity
        return updated
      }

      return [...prevItems, { product, variant, quantity }]
    })
  }

  const removeFromCart = (variantId) => {
    setItems((prevItems) => prevItems.filter((item) => item.variant.id !== variantId))
  }

  const updateQuantity = (variantId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(variantId)
      return
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.variant.id === variantId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export default CartContext
