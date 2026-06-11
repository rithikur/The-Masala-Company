import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../layouts/AdminLayout'
import api from '../../services/api'
import { toast } from 'react-hot-toast'
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineSearch } from 'react-icons/hi'

// Mock products for fallback
const MOCK_ADMIN_PRODUCTS = [
  {
    id: '1',
    name: 'Royal Garam Masala',
    slug: 'royal-garam-masala',
    origin: 'Malabar Coast, Kerala',
    status: 'published',
    variants: [
      { id: 'v1', weight: '100g', price: 350.00, inventory_count: 25, sku: 'TMC-RGM-100' },
      { id: 'v2', weight: '250g', price: 790.00, inventory_count: 12, sku: 'TMC-RGM-250' }
    ]
  },
  {
    id: '2',
    name: 'Erode Single-Origin Turmeric',
    slug: 'erode-turmeric',
    origin: 'Erode, Tamil Nadu',
    status: 'published',
    variants: [
      { id: 'v3', weight: '100g', price: 280.00, inventory_count: 40, sku: 'TMC-ERT-100' }
    ]
  },
  {
    id: '3',
    name: 'Kashmiri Lal Mirch',
    slug: 'kashmiri-lal-mirch',
    origin: 'Pampore, Kashmir',
    status: 'draft',
    variants: [
      { id: 'v4', weight: '100g', price: 320.00, inventory_count: 0, sku: 'TMC-KLM-100' }
    ]
  }
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
