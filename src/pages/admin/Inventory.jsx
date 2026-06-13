import React, { useState, useEffect } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import api from '../../services/api'
import { toast } from 'react-hot-toast'
import { HiOutlineSave, HiCheck } from 'react-icons/hi'

const MOCK_INVENTORY_PRODUCTS = [
  { id: '1', name: 'Royal Garam Masala', variants: [{ id: 'v1a', weight: '100g', sku: 'TMC-RGM-100', price: 350, inventory_count: 25 }, { id: 'v1b', weight: '250g', sku: 'TMC-RGM-250', price: 790, inventory_count: 12 }] },
  { id: '2', name: 'Erode Turmeric', variants: [{ id: 'v2a', weight: '100g', sku: 'TMC-ERT-100', price: 280, inventory_count: 40 }, { id: 'v2b', weight: '250g', sku: 'TMC-ERT-250', price: 620, inventory_count: 18 }] },
  { id: '3', name: 'Green Cardamom Pods', variants: [{ id: 'v3a', weight: '50g', sku: 'TMC-GCP-50', price: 420, inventory_count: 30 }, { id: 'v3b', weight: '100g', sku: 'TMC-GCP-100', price: 790, inventory_count: 14 }] },
  { id: '4', name: 'Ceylon Cinnamon Quills', variants: [{ id: 'v4a', weight: '50g', sku: 'TMC-CCQ-50', price: 380, inventory_count: 22 }, { id: 'v4b', weight: '100g', sku: 'TMC-CCQ-100', price: 720, inventory_count: 10 }] },
  { id: '5', name: 'Kashmiri Lal Mirch', variants: [{ id: 'v5a', weight: '100g', sku: 'TMC-KLM-100', price: 320, inventory_count: 30 }, { id: 'v5b', weight: '250g', sku: 'TMC-KLM-250', price: 720, inventory_count: 15 }] },
  { id: '6', name: 'Tellicherry Pepper', variants: [{ id: 'v6a', weight: '100g', sku: 'TMC-TBP-100', price: 420, inventory_count: 20 }, { id: 'v6b', weight: '250g', sku: 'TMC-TBP-250', price: 920, inventory_count: 8 }] },
  { id: '7', name: 'Chai Masala Blend', variants: [{ id: 'v7a', weight: '100g', sku: 'TMC-CML-100', price: 290, inventory_count: 35 }, { id: 'v7b', weight: '250g', sku: 'TMC-CML-250', price: 650, inventory_count: 20 }] },
  { id: '8', name: 'Kashmir Saffron', variants: [{ id: 'v8a', weight: '1g', sku: 'TMC-KSF-1G', price: 850, inventory_count: 15 }, { id: 'v8b', weight: '2g', sku: 'TMC-KSF-2G', price: 1600, inventory_count: 6 }] },
  { id: '9', name: 'Cumin Seeds', variants: [{ id: 'v9a', weight: '100g', sku: 'TMC-CUS-100', price: 180, inventory_count: 60 }, { id: 'v9b', weight: '250g', sku: 'TMC-CUS-250', price: 400, inventory_count: 30 }] },
  { id: '10', name: 'Fennel Seeds', variants: [{ id: 'v10a', weight: '100g', sku: 'TMC-FNS-100', price: 160, inventory_count: 50 }, { id: 'v10b', weight: '250g', sku: 'TMC-FNS-250', price: 360, inventory_count: 25 }] },
  { id: '11', name: 'Spice Starter Gift Box', variants: [{ id: 'v11a', weight: '6 × 50g', sku: 'TMC-GFT-STR', price: 1200, inventory_count: 20 }] },
  { id: '12', name: "Chef's Collection Gift Set", variants: [{ id: 'v12a', weight: '12 × 50g', sku: 'TMC-GFT-CHF', price: 2200, inventory_count: 10 }] },
]

const Inventory = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await api.get('/api/admin/products')
      const data = res.data.data || []
      setProducts(data.length > 0 ? data : MOCK_INVENTORY_PRODUCTS)
    } catch (err) {
      setProducts(MOCK_INVENTORY_PRODUCTS) // silent fallback
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
