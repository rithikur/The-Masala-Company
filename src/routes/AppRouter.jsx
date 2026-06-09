import React from 'react'
import { Routes, Route } from 'react-router-dom'

// Public Pages
import Home from '../pages/Home'
import NotFound from '../pages/NotFound'
import ProductList from '../pages/products/ProductList'
import ProductDetail from '../pages/products/ProductDetail'
import Checkout from '../pages/Checkout'
import Profile from '../pages/Profile'

// Auth Pages
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import ForgotPassword from '../pages/auth/ForgotPassword'
import AuthCallback from '../pages/auth/AuthCallback'

// Admin Pages
import Dashboard from '../pages/admin/Dashboard'
import Products from '../pages/admin/Products'
import ProductForm from '../pages/admin/ProductForm'
import Categories from '../pages/admin/Categories'
import Orders from '../pages/admin/Orders'
import Coupons from '../pages/admin/Coupons'
import Customers from '../pages/admin/Customers'
import Reviews from '../pages/admin/Reviews'
import Analytics from '../pages/admin/Analytics'
import Inventory from '../pages/admin/Inventory'
import SearchHistory from '../pages/admin/SearchHistory'
import Settings from '../pages/admin/Settings'
import AdminUsers from '../pages/admin/AdminUsers'

import AdminLogin from '../pages/admin/AdminLogin'

// Guards
import GuestGuard from '../components/guards/GuestGuard'
import AdminGuard from '../components/guards/AdminGuard'

const AppRouter = () => {
  return (
    <Routes>
      {/* ─── Public ─── */}
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/products/:slug" element={<ProductDetail />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/profile" element={<Profile />} />

      {/* ─── Auth ─── */}
      <Route path="/login"           element={<GuestGuard><Login /></GuestGuard>} />
      <Route path="/register"        element={<GuestGuard><Register /></GuestGuard>} />
      <Route path="/forgot-password" element={<GuestGuard><ForgotPassword /></GuestGuard>} />
      <Route path="/auth/callback"   element={<AuthCallback />} />
      <Route path="/admin/login"     element={<AdminLogin />} />

      {/* ─── Admin ─── */}
      <Route path="/admin"                element={<AdminGuard><Dashboard /></AdminGuard>} />
      <Route path="/admin/products"       element={<AdminGuard><Products /></AdminGuard>} />
      <Route path="/admin/products/new"   element={<AdminGuard><ProductForm /></AdminGuard>} />
      <Route path="/admin/products/:id/edit" element={<AdminGuard><ProductForm /></AdminGuard>} />
      <Route path="/admin/categories"     element={<AdminGuard><Categories /></AdminGuard>} />
      <Route path="/admin/orders"         element={<AdminGuard><Orders /></AdminGuard>} />
      <Route path="/admin/coupons"        element={<AdminGuard><Coupons /></AdminGuard>} />
      <Route path="/admin/customers"      element={<AdminGuard><Customers /></AdminGuard>} />
      <Route path="/admin/reviews"        element={<AdminGuard><Reviews /></AdminGuard>} />
      <Route path="/admin/analytics"      element={<AdminGuard><Analytics /></AdminGuard>} />
      <Route path="/admin/inventory"      element={<AdminGuard><Inventory /></AdminGuard>} />
      <Route path="/admin/search-history" element={<AdminGuard><SearchHistory /></AdminGuard>} />
      <Route path="/admin/settings"       element={<AdminGuard><Settings /></AdminGuard>} />
      <Route path="/admin/admin-users"    element={<AdminGuard><AdminUsers /></AdminGuard>} />

      {/* ─── 404 ─── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRouter
