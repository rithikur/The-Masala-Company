import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'

import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'

import AppRouter from './routes/AppRouter'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <AppRouter />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3500,
                  style: {
                    background: '#2C1810',
                    color: '#FAF6EE',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '14px',
                    borderRadius: '2px',
                    border: '1px solid rgba(200, 146, 42, 0.2)',
                    boxShadow: '0 4px 40px rgba(44, 24, 16, 0.3)',
                  },
                  success: {
                    iconTheme: {
                      primary: '#C8922A',
                      secondary: '#FAF6EE',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#E8751A',
                      secondary: '#FAF6EE',
                    },
                  },
                }}
              />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
)
