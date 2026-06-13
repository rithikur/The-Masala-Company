import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../layouts/AdminLayout'
import api from '../../services/api'
import { toast } from 'react-hot-toast'
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineSearch } from 'react-icons/hi'

// All 12 mock products — matches the full storefront catalog
const MOCK_ADMIN_PRODUCTS = [
  { id: '1', name: 'Royal Garam Masala', slug: 'royal-garam-masala', origin: 'Malabar Coast, Kerala', status: 'published', variants: [{ id: 'v1a', weight: '100g', price: 350.00, inventory_count: 25, sku: 'TMC-RGM-100' }, { id: 'v1b', weight: '250g', price: 790.00, inventory_count: 12, sku: 'TMC-RGM-250' }] },
  { id: '2', name: 'Erode Single-Origin Turmeric', slug: 'erode-turmeric', origin: 'Erode, Tamil Nadu', status: 'published', variants: [{ id: 'v2a', weight: '100g', price: 280.00, inventory_count: 40, sku: 'TMC-ERT-100' }, { id: 'v2b', weight: '250g', price: 620.00, inventory_count: 18, sku: 'TMC-ERT-250' }] },
  { id: '3', name: 'Green Cardamom Pods', slug: 'green-cardamom', origin: 'Kerala Highlands', status: 'published', variants: [{ id: 'v3a', weight: '50g', price: 420.00, inventory_count: 30, sku: 'TMC-GCP-50' }, { id: 'v3b', weight: '100g', price: 790.00, inventory_count: 14, sku: 'TMC-GCP-100' }] },
  { id: '4', name: 'Ceylon Cinnamon Quills', slug: 'ceylon-cinnamon', origin: 'Sri Lanka', status: 'published', variants: [{ id: 'v4a', weight: '50g', price: 380.00, inventory_count: 22, sku: 'TMC-CCQ-50' }, { id: 'v4b', weight: '100g', price: 720.00, inventory_count: 10, sku: 'TMC-CCQ-100' }] },
  { id: '5', name: 'Kashmiri Lal Mirch', slug: 'kashmiri-lal-mirch', origin: 'Pampore, Kashmir', status: 'published', variants: [{ id: 'v5a', weight: '100g', price: 320.00, inventory_count: 30, sku: 'TMC-KLM-100' }, { id: 'v5b', weight: '250g', price: 720.00, inventory_count: 15, sku: 'TMC-KLM-250' }] },
  { id: '6', name: 'Tellicherry Black Peppercorns', slug: 'tellicherry-pepper', origin: 'Wayanad, Kerala', status: 'published', variants: [{ id: 'v6a', weight: '100g', price: 420.00, inventory_count: 20, sku: 'TMC-TBP-100' }, { id: 'v6b', weight: '250g', price: 920.00, inventory_count: 8, sku: 'TMC-TBP-250' }] },
  { id: '7', name: 'Chai Masala Blend', slug: 'chai-masala', origin: 'Assam Highlands', status: 'published', variants: [{ id: 'v7a', weight: '100g', price: 290.00, inventory_count: 35, sku: 'TMC-CML-100' }, { id: 'v7b', weight: '250g', price: 650.00, inventory_count: 20, sku: 'TMC-CML-250' }] },
  { id: '8', name: 'Kashmir Saffron', slug: 'kashmir-saffron', origin: 'Pampore, Kashmir', status: 'published', variants: [{ id: 'v8a', weight: '1g', price: 850.00, inventory_count: 15, sku: 'TMC-KSF-1G' }, { id: 'v8b', weight: '2g', price: 1600.00, inventory_count: 6, sku: 'TMC-KSF-2G' }] },
  { id: '9', name: 'Cumin Seeds', slug: 'cumin-seeds', origin: 'Rajasthan, India', status: 'published', variants: [{ id: 'v9a', weight: '100g', price: 180.00, inventory_count: 60, sku: 'TMC-CUS-100' }, { id: 'v9b', weight: '250g', price: 400.00, inventory_count: 30, sku: 'TMC-CUS-250' }] },
  { id: '10', name: 'Fennel Seeds', slug: 'fennel-seeds', origin: 'Gujarat, India', status: 'published', variants: [{ id: 'v10a', weight: '100g', price: 160.00, inventory_count: 50, sku: 'TMC-FNS-100' }, { id: 'v10b', weight: '250g', price: 360.00, inventory_count: 25, sku: 'TMC-FNS-250' }] },
  { id: '11', name: 'Spice Starter Gift Box', slug: 'spice-starter-gift', origin: 'Pan India', status: 'published', variants: [{ id: 'v11a', weight: '6 × 50g', price: 1200.00, inventory_count: 20, sku: 'TMC-GFT-STR' }] },
  { id: '12', name: "Chef's Collection Gift Set", slug: 'chefs-collection-gift', origin: 'Pan India', status: 'published', variants: [{ id: 'v12a', weight: '12 × 50g', price: 2200.00, inventory_count: 10, sku: 'TMC-GFT-CHF' }] },
]

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'published' | 'draft'

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/admin/products')
      setProducts(res.data.data || [])
    } catch (err) {
      setProducts(MOCK_ADMIN_PRODUCTS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return
    }

    try {
      await api.delete(`/api/admin/products/${id}`)
      toast.success(`Deleted ${name}`)
      fetchProducts()
    } catch (err) {
      // Offline fallback: delete from local state
      setProducts(prev => prev.filter(p => p.id !== id))
      toast.success(`Simulated deleting ${name}`)
    }
  }

  // Filter products locally based on filters
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.slug.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <AdminLayout title="Products" breadcrumbs={[{ label: 'Catalog' }, { label: 'Products' }]}>
      <div className="bg-white border border-cream-dark p-6 rounded-none">
        
        {/* Table header operations */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 flex-1">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <HiOutlineSearch className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 text-sm outline-none focus:border-spice-brown rounded-none"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-200 px-4 py-2.5 text-sm bg-white outline-none focus:border-spice-brown rounded-none"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-2 bg-charcoal text-cream px-6 py-2.5 text-sm uppercase tracking-wider font-body hover:bg-spice-brown transition-colors rounded-none"
          >
            <HiOutlinePlus /> Add Product
          </Link>
        </div>

        {/* Products Data Table */}
        {loading ? (
          <div className="py-20 text-center text-sm text-gray-500 animate-pulse">Loading catalog...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-sm text-gray-400 italic">No products found matching filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 font-semibold bg-gray-50">
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-6">Slug</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Pricing</th>
                  <th className="py-4 px-6">Stock</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const minPrice = p.variants?.length > 0 ? Math.min(...p.variants.map(v => parseFloat(v.price))) : 0
                  const totalStock = p.variants?.length > 0 ? p.variants.reduce((sum, v) => sum + parseInt(v.inventory_count || 0), 0) : 0
                  
                  return (
                    <tr key={p.id} className="border-b border-gray-100 text-sm text-charcoal-soft hover:bg-gray-50/50">
                      <td className="py-4 px-6 font-semibold text-charcoal-dark">{p.name}</td>
                      <td className="py-4 px-6 font-mono text-xs text-gray-500">{p.slug}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-block px-2.5 py-1 text-xs uppercase tracking-wider font-bold rounded-none ${
                          p.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-['Outfit']">
                        {minPrice > 0 ? `From ₹${minPrice.toFixed(2)}` : 'N/A'}
                      </td>
                      <td className="py-4 px-6 font-sans">
                        {totalStock > 0 ? `${totalStock} units` : <span className="text-red-500 font-medium">Out of stock</span>}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/admin/products/${p.id}/edit`}
                            className="p-2 text-gray-500 hover:text-spice-brown transition-colors hover:bg-gray-100 rounded-none"
                            title="Edit"
                          >
                            <HiOutlinePencil size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-2 text-gray-500 hover:text-red-600 transition-colors hover:bg-red-50 rounded-none cursor-pointer"
                            title="Delete"
                          >
                            <HiOutlineTrash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </AdminLayout>
  )
}

export default Products
