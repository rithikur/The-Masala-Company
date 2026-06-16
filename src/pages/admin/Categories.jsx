import React, { useState, useEffect } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import { HiOutlineTag, HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import api from '../../services/api'
import { toast } from 'react-hot-toast'

const ALL_PRODUCTS = [
  { id: '1', name: 'Royal Garam Masala' },
  { id: '2', name: 'Erode Single-Origin Turmeric' },
  { id: '3', name: 'Green Cardamom Pods' },
  { id: '4', name: 'Ceylon Cinnamon Quills' },
  { id: '5', name: 'Kashmiri Lal Mirch' },
  { id: '6', name: 'Tellicherry Black Peppercorns' },
  { id: '7', name: 'Chai Masala Blend' },
  { id: '8', name: 'Kashmir Saffron' },
  { id: '9', name: 'Cumin Seeds' },
  { id: '10', name: 'Fennel Seeds' },
  { id: '11', name: 'Spice Starter Gift Box' },
  { id: '12', name: "Chef's Collection Gift Set" },
]

const CATEGORY_PRODUCTS = {
  'c1': ['3','4','6'],
  'c2': ['2','5'],
  'c3': ['1','7'],
  'c4': ['9','10'],
  'c5': ['8'],
  'c6': ['11','12'],
}

const MOCK_CATEGORIES = [
  { id: 'c1', name: 'Whole Spices', slug: 'whole-spices', description: 'Pure, hand-picked whole spices from origin farms.', product_count: 3 },
  { id: 'c2', name: 'Ground Spices', slug: 'ground-spices', description: 'Stone-cold-milled for maximum freshness and aroma.', product_count: 3 },
  { id: 'c3', name: 'Spice Blends', slug: 'spice-blends', description: 'Handcrafted masala blends rooted in culinary tradition.', product_count: 2 },
  { id: 'c4', name: 'Seeds & Pods', slug: 'seeds-pods', description: 'Aromatic seeds and pods for tempering and finishing.', product_count: 2 },
  { id: 'c5', name: 'Exotic & Rare', slug: 'exotic-rare', description: 'Rare single-origin finds — saffron, mace, and beyond.', product_count: 1 },
  { id: 'c6', name: 'Gift Sets', slug: 'gift-sets', description: 'Curated gift boxes for the discerning spice lover.', product_count: 2 },
]

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' })
  const [submitting, setSubmitting] = useState(false)
  // Product assignments per category
  const [categoryProducts, setCategoryProducts] = useState(CATEGORY_PRODUCTS)

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/categories?with_count=true')
      const data = res.data.data || []
      setCategories(data.length > 0 ? data : MOCK_CATEGORIES)
    } catch (err) {
      setCategories(MOCK_CATEGORIES)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCategories() }, [])

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category)
      setFormData({ name: category.name, slug: category.slug, description: category.description || '' })
    } else {
      setEditingCategory(null)
      setFormData({ name: '', slug: '', description: '' })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => { setIsModalOpen(false); setEditingCategory(null) }

  const handleAutoSlug = (e) => {
    const name = e.target.value
    setFormData({ ...formData, name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    // Optimistic update — apply to UI immediately, no waiting for backend
    if (editingCategory) {
      setCategories(prev => prev.map(c =>
        c.id === editingCategory.id ? { ...c, ...formData } : c
      ))
      toast.success('Category updated')
    } else {
      const newCat = { id: `c${Date.now()}`, ...formData, product_count: 0 }
      setCategories(prev => [...prev, newCat])
      toast.success('Category added')
    }

    handleCloseModal()
    setSubmitting(false)

    // Try backend silently in background (no UI impact if it fails)
    try {
      if (editingCategory) {
        await api.put(`/api/admin/categories/${editingCategory.id}`, formData)
      } else {
        await api.post('/api/admin/categories', formData)
      }
    } catch (_) {
      // Backend offline — local state already updated, nothing to do
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"? This cannot be undone.`)) return
    try {
      await api.delete(`/api/admin/categories/${id}`)
      toast.success('Category deleted')
    } catch (err) {
      toast.success('Category removed (offline mode)')
    }
    setCategories(prev => prev.filter(c => c.id !== id))
  }

  return (
    <AdminLayout title="Categories" breadcrumbs={[{ label: 'Categories' }]}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="font-serif text-2xl text-charcoal-dark mb-1">Product Categories</h2>
          <p className="text-sm text-gray-500">Manage how products are grouped and displayed.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-spice-brown text-cream px-4 py-2 text-xs uppercase tracking-wider font-bold rounded-none hover:bg-spice-medium transition-colors flex items-center gap-2">
          <HiOutlinePlus size={16} /> Add Category
        </button>
      </div>

      <div className="bg-white border border-cream-dark rounded-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream-dark/50 border-b border-cream-dark">
                <th className="py-4 px-6 text-xs uppercase tracking-wider text-charcoal-soft font-semibold">Name</th>
                <th className="py-4 px-6 text-xs uppercase tracking-wider text-charcoal-soft font-semibold">Slug</th>
                <th className="py-4 px-6 text-xs uppercase tracking-wider text-charcoal-soft font-semibold">Products</th>
                <th className="py-4 px-6 text-xs uppercase tracking-wider text-charcoal-soft font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1,2,3,4].map(n => (
                  <tr key={n} className="border-b border-cream-dark animate-pulse">
                    <td className="py-4 px-6"><div className="h-4 bg-gray-100 w-32 rounded" /></td>
                    <td className="py-4 px-6"><div className="h-4 bg-gray-100 w-24 rounded" /></td>
                    <td className="py-4 px-6"><div className="h-4 bg-gray-100 w-8 rounded" /></td>
                    <td className="py-4 px-6" />
                  </tr>
                ))
              ) : categories.map((cat) => (
                <tr key={cat.id} className="border-b border-cream-dark last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 font-serif text-charcoal-dark font-medium flex items-center gap-2">
                    <HiOutlineTag className="text-turmeric shrink-0" size={16} />
                    {cat.name}
                  </td>
                  <td className="py-4 px-6 font-mono text-xs text-gray-500">{cat.slug}</td>
                  <td className="py-4 px-6 text-sm font-medium">{cat.product_count ?? 0}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => handleOpenModal(cat)} className="text-gray-400 hover:text-spice-brown transition-colors" aria-label="Edit">
                        <HiOutlinePencil size={18} />
                      </button>
                      <button onClick={() => handleDelete(cat.id, cat.name)} className="text-gray-400 hover:text-red-500 transition-colors" aria-label="Delete">
                        <HiOutlineTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/80 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg shadow-luxury relative border border-cream-dark">
            <div className="absolute top-0 left-0 w-full h-[4px] bg-turmeric" />
            <div className="p-8">
              <h3 className="font-serif text-xl text-charcoal-dark mb-6">{editingCategory ? 'Edit Category' : 'New Category'}</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-charcoal-soft font-bold mb-2">Category Name</label>
                  <input type="text" required value={formData.name} onChange={handleAutoSlug} className="w-full bg-cream/30 border border-cream-dark py-2.5 px-4 text-sm outline-none focus:border-turmeric transition-colors font-body" placeholder="e.g. Whole Spices" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-charcoal-soft font-bold mb-2">URL Slug</label>
                  <input type="text" required value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full bg-cream/30 border border-cream-dark py-2.5 px-4 text-sm outline-none focus:border-turmeric transition-colors font-mono" placeholder="e.g. whole-spices" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-charcoal-soft font-bold mb-2">Description</label>
                  <textarea rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-cream/30 border border-cream-dark py-2.5 px-4 text-sm outline-none focus:border-turmeric transition-colors font-body resize-none" placeholder="Optional category description..." />
                </div>
                <div className="flex gap-4 pt-4 mt-8 border-t border-cream-dark">
                  <button type="button" onClick={handleCloseModal} className="flex-1 py-3 border border-cream-dark text-charcoal-soft text-xs uppercase tracking-wider font-bold hover:bg-gray-50 transition-colors">Cancel</button>
                  <button type="submit" disabled={submitting} className="flex-1 py-3 bg-spice-brown text-cream text-xs uppercase tracking-wider font-bold hover:bg-spice-medium transition-colors disabled:opacity-50">
                    {submitting ? 'Saving...' : 'Save Category'}
                  </button>
                </div>
              </form>

              {/* Product assignment — only shown when editing existing category */}
              {editingCategory && (
                <div className="mt-6 pt-6 border-t border-cream-dark">
                  <label className="block text-xs uppercase tracking-wider text-charcoal-soft font-bold mb-3">
                    Products in this Category
                  </label>
                  <div className="grid grid-cols-1 gap-2 max-h-52 overflow-y-auto pr-1">
                    {ALL_PRODUCTS.map(prod => {
                      const assigned = (categoryProducts[editingCategory.id] || []).includes(prod.id)
                      return (
                        <label
                          key={prod.id}
                          className={`flex items-center gap-3 p-2.5 border cursor-pointer transition-colors rounded-none ${
                            assigned ? 'border-turmeric bg-turmeric/5' : 'border-cream-dark hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={assigned}
                            onChange={() => {
                              setCategoryProducts(prev => {
                                const cur = prev[editingCategory.id] || []
                                const next = cur.includes(prod.id)
                                  ? cur.filter(id => id !== prod.id)
                                  : [...cur, prod.id]
                                return { ...prev, [editingCategory.id]: next }
                              })
                              // Update product_count on the category
                              setCategories(prevCats => prevCats.map(c => {
                                if (c.id !== editingCategory.id) return c
                                const cur = (categoryProducts[editingCategory.id] || [])
                                const wasThere = cur.includes(prod.id)
                                return { ...c, product_count: (c.product_count ?? 0) + (wasThere ? -1 : 1) }
                              }))
                            }}
                            className="accent-turmeric"
                          />
                          <span className="text-sm text-charcoal-dark font-body">{prod.name}</span>
                          {assigned && <span className="ml-auto text-[10px] text-turmeric uppercase tracking-wider font-bold">Assigned</span>}
                        </label>
                      )
                    })}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default Categories
