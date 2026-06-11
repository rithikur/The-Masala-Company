import React, { useState, useEffect } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import { HiOutlineTicket, HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiCheck } from 'react-icons/hi'
import { toast } from 'react-hot-toast'

const Coupons = () => {
  const [coupons, setCoupons] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState(null)
  
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    expiryDate: '',
    usageLimit: '',
    isActive: true
  })

  // Load from LocalStorage for seamless demo functionality without DB schema
  useEffect(() => {
    const saved = localStorage.getItem('admin_coupons')
    if (saved) {
      setCoupons(JSON.parse(saved))
    } else {
      // Seed some beautiful defaults
      const defaults = [
        { id: '1', code: 'WELCOME10', discountType: 'percentage', discountValue: 10, minOrderAmount: 500, expiryDate: '2026-12-31', usageLimit: 100, usedCount: 42, isActive: true },
        { id: '2', code: 'DIWALI20', discountType: 'percentage', discountValue: 20, minOrderAmount: 2000, expiryDate: '2025-11-01', usageLimit: 50, usedCount: 50, isActive: false },
        { id: '3', code: 'FREESHIP', discountType: 'fixed', discountValue: 150, minOrderAmount: 1000, expiryDate: '2026-08-15', usageLimit: '', usedCount: 12, isActive: true },
      ]
      setCoupons(defaults)
      localStorage.setItem('admin_coupons', JSON.stringify(defaults))
    }
  }, [])

  const saveToStorage = (newData) => {
    setCoupons(newData)
    localStorage.setItem('admin_coupons', JSON.stringify(newData))
  }

  const handleOpenModal = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon)
      setFormData(coupon)
    } else {
      setEditingCoupon(null)
      setFormData({
        code: '', discountType: 'percentage', discountValue: '', minOrderAmount: '', expiryDate: '', usageLimit: '', isActive: true
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCoupon(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingCoupon) {
      const updated = coupons.map(c => c.id === editingCoupon.id ? { ...formData, id: c.id, usedCount: c.usedCount } : c)
      saveToStorage(updated)
      toast.success('Coupon updated successfully')
    } else {
      const newCoupon = { 
        ...formData, 
        id: Date.now().toString(), 
        usedCount: 0,
        code: formData.code.toUpperCase() 
      }
      saveToStorage([...coupons, newCoupon])
      toast.success('Coupon created successfully')
    }
    handleCloseModal()
  }

  const handleDelete = (id, code) => {
    if (!window.confirm(`Delete coupon ${code}?`)) return
    saveToStorage(coupons.filter(c => c.id !== id))
    toast.success('Coupon deleted')
  }

  const toggleActive = (id) => {
    const updated = coupons.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c)
    saveToStorage(updated)
    toast.success('Coupon status toggled')
  }

  return (
    <AdminLayout title="Coupons" breadcrumbs={[{ label: 'Coupons' }]}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="font-serif text-2xl text-charcoal-dark mb-1">Promotional Coupons</h2>
          <p className="text-sm text-gray-500">Create and manage discount codes for your customers.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-spice-brown text-cream px-4 py-2 text-xs uppercase tracking-wider font-bold rounded-none hover:bg-spice-medium transition-colors flex items-center gap-2"
        >
          <HiOutlinePlus size={16} /> Create Coupon
        </button>
      </div>

      <div className="bg-white border border-cream-dark rounded-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream-dark/50 border-b border-cream-dark">
                <th className="py-4 px-6 text-xs uppercase tracking-wider text-charcoal-soft font-semibold">Code & Status</th>
                <th className="py-4 px-6 text-xs uppercase tracking-wider text-charcoal-soft font-semibold">Discount</th>
                <th className="py-4 px-6 text-xs uppercase tracking-wider text-charcoal-soft font-semibold">Usage</th>
                <th className="py-4 px-6 text-xs uppercase tracking-wider text-charcoal-soft font-semibold">Expiry</th>
                <th className="py-4 px-6 text-xs uppercase tracking-wider text-charcoal-soft font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-400">No coupons found.</td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className={`border-b border-cream-dark last:border-0 hover:bg-gray-50 transition-colors ${!coupon.isActive ? 'opacity-50' : ''}`}>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-charcoal-dark font-bold text-sm bg-gray-100 px-2 py-1 rounded">
                          {coupon.code}
                        </span>
                        <button onClick={() => toggleActive(coupon.id)} className={`w-8 h-4 rounded-full relative transition-colors ${coupon.isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                          <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${coupon.isActive ? 'left-[18px]' : 'left-0.5'}`}></div>
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-['Outfit'] text-sm">
                      {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                      {coupon.minOrderAmount > 0 && <div className="text-[10px] text-gray-500 font-sans mt-0.5">Min spend: ₹{coupon.minOrderAmount}</div>}
                    </td>
                    <td className="py-4 px-6 font-['Outfit'] text-sm">
                      {coupon.usedCount} / {coupon.usageLimit || '∞'}
                    </td>
                    <td className="py-4 px-6 font-['Outfit'] text-sm text-gray-500">
                      {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-3">
                        <button onClick={() => handleOpenModal(coupon)} className="text-gray-400 hover:text-ochre transition-colors"><HiOutlinePencil size={18} /></button>
                        <button onClick={() => handleDelete(coupon.id, coupon.code)} className="text-gray-400 hover:text-red-500 transition-colors"><HiOutlineTrash size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/80 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg shadow-luxury relative border border-cream-dark">
            <div className="absolute top-0 left-0 w-full h-[4px] bg-turmeric" />
            <div className="p-8">
              <h3 className="font-serif text-xl text-charcoal-dark mb-6">
                {editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-charcoal-soft font-bold mb-1">Coupon Code</label>
                  <input type="text" required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} className="w-full bg-cream/30 border border-cream-dark py-2 px-3 text-sm outline-none focus:border-turmeric font-mono uppercase" placeholder="e.g. SUMMER20" />
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs uppercase tracking-wider text-charcoal-soft font-bold mb-1">Type</label>
                    <select value={formData.discountType} onChange={e => setFormData({...formData, discountType: e.target.value})} className="w-full bg-cream/30 border border-cream-dark py-2 px-3 text-sm outline-none focus:border-turmeric">
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs uppercase tracking-wider text-charcoal-soft font-bold mb-1">Value</label>
                    <input type="number" required min="1" value={formData.discountValue} onChange={e => setFormData({...formData, discountValue: e.target.value})} className="w-full bg-cream/30 border border-cream-dark py-2 px-3 text-sm outline-none focus:border-turmeric font-['Outfit']" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-charcoal-soft font-bold mb-1">Minimum Order Amount (₹) - Optional</label>
                  <input type="number" min="0" value={formData.minOrderAmount} onChange={e => setFormData({...formData, minOrderAmount: e.target.value})} className="w-full bg-cream/30 border border-cream-dark py-2 px-3 text-sm outline-none focus:border-turmeric font-['Outfit']" />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs uppercase tracking-wider text-charcoal-soft font-bold mb-1">Usage Limit</label>
                    <input type="number" min="1" placeholder="Unlimited" value={formData.usageLimit} onChange={e => setFormData({...formData, usageLimit: e.target.value})} className="w-full bg-cream/30 border border-cream-dark py-2 px-3 text-sm outline-none focus:border-turmeric font-['Outfit']" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs uppercase tracking-wider text-charcoal-soft font-bold mb-1">Expiry Date</label>
                    <input type="date" value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} className="w-full bg-cream/30 border border-cream-dark py-2 px-3 text-sm outline-none focus:border-turmeric font-['Outfit']" />
                  </div>
                </div>

                <div className="flex gap-4 pt-4 mt-6 border-t border-cream-dark">
                  <button type="button" onClick={handleCloseModal} className="flex-1 py-3 border border-cream-dark text-charcoal-soft text-xs uppercase tracking-wider font-bold hover:bg-gray-50 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-spice-brown text-cream text-xs uppercase tracking-wider font-bold hover:bg-spice-medium transition-colors">Save Coupon</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default Coupons
