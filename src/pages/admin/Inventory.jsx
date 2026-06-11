import React, { useState, useEffect } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import api from '../../services/api'
import { toast } from 'react-hot-toast'
import { HiOutlineSave, HiCheck } from 'react-icons/hi'

const Inventory = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null) // holds variant_id currently being updated

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await api.get('/api/admin/products')
      setProducts(res.data.data || [])
    } catch (err) {
      toast.error('Failed to load inventory data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleUpdateStock = async (variantId, newCount) => {
    if (newCount === '' || isNaN(newCount)) return
    
    setUpdating(variantId)
    try {
      await api.put(`/api/admin/products/variants/${variantId}/inventory`, {
        inventory_count: parseInt(newCount, 10)
      })
      
      toast.success('Inventory count updated')
      // Update local state to avoid full refetch
      setProducts(prev => prev.map(p => ({
        ...p,
        variants: p.variants.map(v => 
          v.id === variantId ? { ...v, inventory_count: parseInt(newCount, 10) } : v
        )
      })))
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update inventory')
      fetchProducts() // Revert to server state on error
    } finally {
      setUpdating(null)
    }
  }

  return (
    <AdminLayout title="Inventory" breadcrumbs={[{ label: 'Inventory' }]}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="font-serif text-2xl text-charcoal-dark mb-1">Inventory Management</h2>
          <p className="text-sm text-gray-500">Track and adjust stock levels for all product variants.</p>
        </div>
      </div>

      <div className="bg-white border border-cream-dark rounded-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream-dark/50 border-b border-cream-dark">
                <th className="py-4 px-6 text-xs uppercase tracking-wider text-charcoal-soft font-semibold">Product & Variant</th>
                <th className="py-4 px-6 text-xs uppercase tracking-wider text-charcoal-soft font-semibold">SKU</th>
                <th className="py-4 px-6 text-xs uppercase tracking-wider text-charcoal-soft font-semibold">Price</th>
                <th className="py-4 px-6 text-xs uppercase tracking-wider text-charcoal-soft font-semibold">Stock Level</th>
                <th className="py-4 px-6 text-xs uppercase tracking-wider text-charcoal-soft font-semibold text-right">Adjust</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-400">Loading inventory data...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-400">No products found.</td>
                </tr>
              ) : (
                products.map((product) => (
                  <React.Fragment key={product.id}>
                    {/* Parent Product Row */}
                    <tr className="bg-gray-50 border-y border-cream-dark">
                      <td colSpan="5" className="py-3 px-6 font-serif text-charcoal-dark font-semibold">
                        {product.name} 
                        <span className={`ml-3 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full ${
                          product.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                    </tr>
                    
                    {/* Variant Rows */}
                    {product.variants?.length > 0 ? (
                      product.variants.map((variant) => (
                        <tr key={variant.id} className="border-b border-cream-dark last:border-0 hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 px-6 pl-12 text-sm text-charcoal-soft">
                            <span className="font-['Outfit'] font-medium">{variant.weight}</span>
                          </td>
                          <td className="py-4 px-6 font-mono text-xs text-gray-500">{variant.sku}</td>
                          <td className="py-4 px-6 font-['Outfit'] text-sm">₹{parseFloat(variant.price).toFixed(2)}</td>
                          <td className="py-4 px-6">
                            <span className={`font-['Outfit'] font-bold ${
                              variant.inventory_count <= 5 ? 'text-red-500' : 'text-green-600'
                            }`}>
                              {variant.inventory_count}
                            </span>
                            {variant.inventory_count <= 5 && (
                              <span className="ml-2 text-[10px] text-red-500 uppercase font-bold">Low</span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex justify-end gap-2 items-center">
                              <input 
                                type="number" 
                                min="0"
                                defaultValue={variant.inventory_count}
                                className="w-20 border border-gray-300 rounded-none px-2 py-1.5 text-sm font-['Outfit'] outline-none focus:border-turmeric text-right"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleUpdateStock(variant.id, e.target.value)
                                  }
                                }}
                                onBlur={(e) => {
                                  if (e.target.value !== variant.inventory_count.toString()) {
                                    handleUpdateStock(variant.id, e.target.value)
                                  }
                                }}
                                disabled={updating === variant.id}
                              />
                              {updating === variant.id ? (
                                <span className="text-gray-400 p-1 animate-pulse"><HiOutlineSave size={18} /></span>
                              ) : (
                                <button className="text-green-600 p-1 opacity-0 hover:opacity-100 transition-opacity" title="Auto-saves on blur/enter">
                                  <HiCheck size={18} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-4 px-6 pl-12 text-sm text-gray-400 italic">No variants configured.</td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Inventory
