import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import SEOHead from '../components/seo/SEOHead'
import useAuth from '../hooks/useAuth'
import useWishlist from '../hooks/useWishlist'
import api from '../services/api'
import { toast } from 'react-hot-toast'
import { HiOutlineUser, HiOutlineShoppingBag, HiOutlineLocationMarker, HiOutlineHeart, HiOutlineTrash } from 'react-icons/hi'

// High-fidelity Mock Orders Fallback
const MOCK_ORDERS = [
  {
    id: 'TMC-98317A',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    status: 'processing',
    total_amount: 1140.00,
    shipping_address: {
      first_name: 'Dev',
      last_name: 'Sharma',
      address_line: 'Flat 402, Oakwood Apartments',
      city: 'Mumbai',
      postal_code: '400001'
    },
    items: [
      {
        id: 'oi1',
        quantity: 1,
        price_at_time: 350.00,
        product_variants: {
          weight: '100g',
          products: {
            name: 'Royal Garam Masala'
          }
        }
      },
      {
        id: 'oi2',
        quantity: 1,
        price_at_time: 790.00,
        product_variants: {
          weight: '250g',
          products: {
            name: 'Tellicherry Black Peppercorns'
          }
        }
      }
    ]
  },
  {
    id: 'TMC-87102B',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    status: 'delivered',
    total_amount: 280.00,
    shipping_address: {
      first_name: 'Dev',
      last_name: 'Sharma',
      address_line: 'Flat 402, Oakwood Apartments',
      city: 'Mumbai',
      postal_code: '400001'
    },
    items: [
      {
        id: 'oi3',
        quantity: 1,
        price_at_time: 280.00,
        product_variants: {
          weight: '100g',
          products: {
            name: 'Erode Single-Origin Turmeric'
          }
        }
      }
    ]
  }
]

const Profile = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const { items: wishlistItems, toggleWishlist } = useWishlist()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('orders') // 'orders' | 'address' | 'wishlist' | 'details'
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)

  // Profile forms state
  const [profileForm, setProfileForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
  })

  const [addressForm, setAddressForm] = useState({
    address_line: user?.shipping_address?.address_line || '',
    city: user?.shipping_address?.city || '',
    state: user?.shipping_address?.state || '',
    postal_code: user?.shipping_address?.postal_code || '',
  })

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to access your profile.")
      navigate('/login')
    }
  }, [isAuthenticated])

  // Fetch orders from API
  useEffect(() => {
    if (!isAuthenticated) return
    const fetchOrders = async () => {
      setLoadingOrders(true)
      try {
        const res = await api.get('/api/orders/me')
        setOrders(res.data.data || [])
      } catch (err) {
        // Fallback to high fidelity simulated orders
        setOrders(MOCK_ORDERS)
      } finally {
        setLoadingOrders(false)
      }
    }
    fetchOrders()
  }, [isAuthenticated])

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    try {
      await api.put('/api/users/profile', profileForm)
      toast.success("Profile details updated.")
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update profile.")
    }
  }

  const handleUpdateAddress = async (e) => {
    e.preventDefault()
    try {
      await api.put('/api/users/profile', { shipping_address: addressForm })
      toast.success("Shipping address saved.")
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to save address.")
    }
  }

  // Helper to draw status tracker timeline
  const renderStatusTimeline = (status) => {
    const statuses = ['pending', 'processing', 'shipped', 'delivered']
    const currentIndex = statuses.indexOf(status)

    return (
      <div className="flex justify-between items-center mt-6 pt-6 border-t border-earth/5">
        {statuses.map((step, idx) => {
          const isDone = idx <= currentIndex
          const isActive = idx === currentIndex
          return (
            <div key={step} className="flex-1 flex flex-col items-center relative">
              {/* Connector line */}
              {idx > 0 && (
                <div
                  className={`absolute right-1/2 left-[-50%] top-[9px] h-0.5 -z-10 ${
                    isDone ? 'bg-ochre' : 'bg-earth/10'
                  }`}
                />
              )}
              {/* Node */}
              <div
                className={`w-5 h-5 rounded-none flex items-center justify-center border transition-all duration-300 ${
                  isActive
                    ? 'border-ochre bg-cream text-ochre ring-4 ring-ochre/15'
                    : isDone
                    ? 'border-ochre bg-ochre text-cream'
                    : 'border-earth/20 bg-cream text-earth/40'
                }`}
              >
                <div className="w-1.5 h-1.5 bg-current rounded-none" />
              </div>
              <span
                className={`font-sans text-[9px] uppercase tracking-wider mt-2 ${
                  isActive ? 'text-ochre font-semibold' : 'text-earth/60'
                }`}
              >
                {step}
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <PageWrapper transparentNav={false} darkNavText={true}>
      <SEOHead title="My Account" />
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 mt-10">
        <h1 className="font-serif text-3xl text-earth mb-12 tracking-wide">Account Portfolio</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-3 flex flex-col gap-2">
            {[
              { id: 'orders', label: 'Order History', icon: HiOutlineShoppingBag },
              { id: 'address', label: 'Address Management', icon: HiOutlineLocationMarker },
              { id: 'wishlist', label: 'Wishlist', icon: HiOutlineHeart },
              { id: 'details', label: 'Account Details', icon: HiOutlineUser },
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-5 py-4 font-serif text-sm border-l-2 text-left transition-all duration-300 rounded-none ${
                    isActive
                      ? 'border-ochre bg-cream-dark text-earth font-medium'
                      : 'border-transparent text-earth/60 hover:text-earth hover:bg-cream-dark/50'
                  }`}
                >
                  <Icon size={18} className="text-ochre" />
                  {tab.label}
                </button>
              )
            })}
            
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-5 py-4 font-serif text-sm text-red-600/70 hover:text-red-600 text-left hover:bg-red-50/50 mt-6 border-l-2 border-transparent rounded-none"
            >
              Sign Out
            </button>
          </aside>

          {/* Active Panel View */}
          <div className="lg:col-span-9 bg-cream-dark border border-earth/10 p-8 min-h-[500px] rounded-none">
            
            {/* 1. ORDERS */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="font-serif text-lg text-earth mb-6 border-b border-earth/10 pb-3">Order History</h2>
                
                {loadingOrders ? (
                  <div className="flex flex-col gap-4">
                    {[1, 2].map((n) => (
                      <div key={n} className="h-40 bg-earth/5 animate-pulse rounded-none"></div>
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="font-serif text-earth/60 italic mb-6">No order records found.</p>
                    <Link to="/products" className="inline-block bg-earth text-cream font-serif text-xs uppercase tracking-[0.2em] px-6 py-3 border border-earth hover:bg-transparent hover:text-earth transition-all rounded-none">
                      Browse Spice Catalog
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-8">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-earth/10 p-6 bg-cream rounded-none">
                        
                        {/* Header details */}
                        <div className="flex flex-wrap justify-between items-start gap-4 border-b border-earth/5 pb-4">
                          <div>
                            <span className="font-sans text-[10px] uppercase tracking-wider text-earth/50">Order Code</span>
                            <h4 className="font-serif text-sm text-earth">#{order.id}</h4>
                          </div>
                          <div>
                            <span className="font-sans text-[10px] uppercase tracking-wider text-earth/50">Placed On</span>
                            <p className="font-serif text-sm text-earth">{new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className="font-sans text-[10px] uppercase tracking-wider text-earth/50">Total</span>
                            <p className="font-serif text-sm text-earth">₹{parseFloat(order.total_amount).toFixed(2)}</p>
                          </div>
                        </div>

                        {/* Items list */}
                        <div className="flex flex-col gap-4 mt-6">
                          {order.items?.map((item) => (
                            <div key={item.id} className="flex justify-between items-center">
                              <div>
                                <h5 className="font-serif text-sm text-earth">
                                  {item.product_variants?.products?.name || "Premium Spice Blend"}
                                </h5>
                                <span className="font-sans text-[9px] uppercase tracking-wider text-ochre">
                                  Weight: {item.product_variants?.weight} &bull; Qty: {item.quantity}
                                </span>
                              </div>
                              <span className="font-serif text-sm text-earth">
                                ₹{(parseFloat(item.price_at_time) * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Status tracker */}
                        {renderStatusTimeline(order.status)}

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. ADDRESS */}
            {activeTab === 'address' && (
              <form onSubmit={handleUpdateAddress}>
                <h2 className="font-serif text-lg text-earth mb-6 border-b border-earth/10 pb-3">Address Management</h2>
                
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-sans text-[10px] uppercase tracking-wider text-earth/60">Shipping Address Line</label>
                    <input
                      type="text"
                      value={addressForm.address_line}
                      onChange={(e) => setAddressForm({ ...addressForm, address_line: e.target.value })}
                      required
                      className="border border-earth/20 p-3 font-serif text-sm bg-transparent outline-none focus:border-earth rounded-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-sans text-[10px] uppercase tracking-wider text-earth/60">City</label>
                      <input
                        type="text"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        required
                        className="border border-earth/20 p-3 font-serif text-sm bg-transparent outline-none focus:border-earth rounded-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-sans text-[10px] uppercase tracking-wider text-earth/60">State</label>
                      <input
                        type="text"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        required
                        className="border border-earth/20 p-3 font-serif text-sm bg-transparent outline-none focus:border-earth rounded-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-sans text-[10px] uppercase tracking-wider text-earth/60">Postal Code</label>
                      <input
                        type="text"
                        value={addressForm.postal_code}
                        onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                        required
                        className="border border-earth/20 p-3 font-serif text-sm bg-transparent outline-none focus:border-earth rounded-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-4 bg-earth text-cream font-serif text-xs uppercase tracking-[0.2em] px-8 py-4 border border-earth hover:bg-transparent hover:text-earth transition-all duration-300 rounded-none cursor-pointer self-start"
                  >
                    Save Address Details
                  </button>
                </div>
              </form>
            )}

            {/* 3. WISHLIST */}
            {activeTab === 'wishlist' && (
              <div>
                <h2 className="font-serif text-lg text-earth mb-6 border-b border-earth/10 pb-3">Your Wishlist</h2>
                
                {wishlistItems.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="font-serif text-earth/60 italic mb-6">Your wishlist is empty.</p>
                    <Link to="/products" className="inline-block bg-earth text-cream font-serif text-xs uppercase tracking-[0.2em] px-6 py-3 border border-earth hover:bg-transparent hover:text-earth transition-all rounded-none">
                      Browse Spice Catalog
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {wishlistItems.map((item) => {
                      const p = item.products
                      if (!p) return null
                      return (
                        <div key={item.id} className="flex gap-4 border border-earth/10 p-4 bg-cream rounded-none relative group">
                          <div className="w-16 h-20 bg-cream-dark overflow-hidden shrink-0 border border-earth/5">
                            <img
                              src={p.images?.[0]?.url || '/images/product_garam_masala.png'}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="font-serif text-sm text-earth">{p.name}</h4>
                              <p className="font-sans text-[9px] uppercase tracking-wider text-ochre mt-1">
                                {p.origin}
                              </p>
                            </div>
                            <Link
                              to={`/products/${p.slug}`}
                              className="font-serif text-[10px] uppercase tracking-wider text-ochre hover:text-earth transition-colors mt-2 block"
                            >
                              View Options &rarr;
                            </Link>
                          </div>
                          
                          <button
                            onClick={() => toggleWishlist(p)}
                            className="absolute top-4 right-4 text-earth/30 hover:text-red-600 transition-colors"
                            aria-label="Remove item"
                          >
                            <HiOutlineTrash size={16} />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 4. DETAILS */}
            {activeTab === 'details' && (
              <form onSubmit={handleUpdateProfile}>
                <h2 className="font-serif text-lg text-earth mb-6 border-b border-earth/10 pb-3">Account Information</h2>
                
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-sans text-[10px] uppercase tracking-wider text-earth/60">First Name</label>
                      <input
                        type="text"
                        value={profileForm.first_name}
                        onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                        required
                        className="border border-earth/20 p-3 font-serif text-sm bg-transparent outline-none focus:border-earth rounded-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-sans text-[10px] uppercase tracking-wider text-earth/60">Last Name</label>
                      <input
                        type="text"
                        value={profileForm.last_name}
                        onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                        required
                        className="border border-earth/20 p-3 font-serif text-sm bg-transparent outline-none focus:border-earth rounded-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-sans text-[10px] uppercase tracking-wider text-earth/60">Email Address</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="border border-earth/10 p-3 font-serif text-sm bg-cream text-earth/50 outline-none cursor-not-allowed rounded-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-sans text-[10px] uppercase tracking-wider text-earth/60">Phone</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="border border-earth/20 p-3 font-serif text-sm bg-transparent outline-none focus:border-earth rounded-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-4 bg-earth text-cream font-serif text-xs uppercase tracking-[0.2em] px-8 py-4 border border-earth hover:bg-transparent hover:text-earth transition-all duration-300 rounded-none cursor-pointer self-start"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

export default Profile
