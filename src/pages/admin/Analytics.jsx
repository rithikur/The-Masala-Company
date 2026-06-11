import React, { useState, useEffect } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import api from '../../services/api'
import { toast } from 'react-hot-toast'
import { HiOutlineTrendingUp, HiOutlineShoppingBag } from 'react-icons/hi'

const Analytics = () => {
  const [revenueData, setRevenueData] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const [revRes, topRes] = await Promise.all([
          api.get('/api/admin/analytics/revenue'),
          api.get('/api/admin/analytics/top-products')
        ])
        setRevenueData(revRes.data.data || [])
        setTopProducts(topRes.data.data || [])
      } catch (err) {
        toast.error('Failed to load analytics data')
      } finally {
        setLoading(false)
      }
    }
    
    fetchAnalytics()
  }, [])

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue), 1)
  const maxQty = Math.max(...topProducts.map(d => d.quantity), 1)

  return (
    <AdminLayout title="Analytics" breadcrumbs={[{ label: 'Analytics' }]}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="font-serif text-2xl text-charcoal-dark mb-1">Store Analytics</h2>
          <p className="text-sm text-gray-500">Insights into sales performance and top-selling products.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">Loading analytics...</div>
      ) : (
        <div className="space-y-8">
          
          {/* Revenue Chart (CSS Based) */}
          <div className="bg-white border border-cream-dark p-8 rounded-none">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-spice-brown/10 text-spice-brown"><HiOutlineTrendingUp size={24} /></div>
              <h3 className="font-serif text-xl text-charcoal-dark">Monthly Revenue</h3>
            </div>
            
            <div className="flex items-end gap-2 sm:gap-4 h-64 mt-4">
              {revenueData.map((data, index) => {
                const heightPercent = (data.revenue / maxRevenue) * 100
                return (
                  <div key={index} className="flex-1 flex flex-col items-center justify-end h-full group">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-['Outfit'] font-bold text-spice-brown mb-2 bg-cream-dark px-2 py-1">
                      ₹{data.revenue.toLocaleString()}
                    </div>
                    <div 
                      className="w-full bg-spice-brown hover:bg-spice-medium transition-colors rounded-t-sm"
                      style={{ height: `${Math.max(heightPercent, 2)}%` }}
                    ></div>
                    <div className="mt-4 text-xs font-['Outfit'] uppercase tracking-widest text-gray-500">
                      {data.month}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Top Products (CSS Based Horizontal Bar Chart) */}
          <div className="bg-white border border-cream-dark p-8 rounded-none">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-ochre/10 text-ochre"><HiOutlineShoppingBag size={24} /></div>
              <h3 className="font-serif text-xl text-charcoal-dark">Top Selling Products</h3>
            </div>

            <div className="space-y-6">
              {topProducts.map((prod, index) => {
                const widthPercent = (prod.quantity / maxQty) * 100
                return (
                  <div key={index}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="font-serif text-sm text-charcoal-dark font-medium">{prod.name}</span>
                      <span className="font-['Outfit'] text-sm font-bold text-gray-500">{prod.quantity} sold</span>
                    </div>
                    <div className="w-full bg-gray-100 h-3 rounded-none overflow-hidden">
                      <div 
                        className="bg-ochre h-full transition-all duration-1000 ease-out"
                        style={{ width: `${widthPercent}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      )}
    </AdminLayout>
  )
}

export default Analytics
