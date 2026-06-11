import React, { useState, useEffect } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import { toast } from 'react-hot-toast'
import { HiOutlineCog, HiOutlineSave } from 'react-icons/hi'

const Settings = () => {
  const [settings, setSettings] = useState({
    storeName: 'The Masala Company',
    contactEmail: 'hello@themasalacompany.com',
    supportPhone: '+91 98765 43210',
    freeShippingThreshold: '1500',
    flatShippingRate: '99',
    taxPercentage: '5',
    enableReviews: true,
    maintenanceMode: false
  })
  
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('admin_store_settings')
    if (saved) {
      setSettings(JSON.parse(saved))
    }
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      localStorage.setItem('admin_store_settings', JSON.stringify(settings))
      toast.success('Store settings saved successfully')
      setSaving(false)
    }, 600)
  }

  return (
    <AdminLayout title="Settings" breadcrumbs={[{ label: 'Settings' }]}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="font-serif text-2xl text-charcoal-dark mb-1">Store Settings</h2>
          <p className="text-sm text-gray-500">Configure global parameters and business rules.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-spice-brown text-cream px-6 py-2.5 text-xs uppercase tracking-wider font-bold rounded-none hover:bg-spice-medium transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <HiOutlineSave size={18} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Information */}
        <div className="bg-white border border-cream-dark rounded-none">
          <div className="p-6 border-b border-cream-dark bg-cream-dark/20">
            <h3 className="font-serif text-lg text-charcoal-dark">General Information</h3>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal-soft font-bold mb-2">Store Name</label>
              <input type="text" name="storeName" value={settings.storeName} onChange={handleChange} className="w-full bg-cream/30 border border-cream-dark py-2.5 px-4 text-sm outline-none focus:border-turmeric transition-colors font-body" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal-soft font-bold mb-2">Contact Email</label>
              <input type="email" name="contactEmail" value={settings.contactEmail} onChange={handleChange} className="w-full bg-cream/30 border border-cream-dark py-2.5 px-4 text-sm outline-none focus:border-turmeric transition-colors font-body" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal-soft font-bold mb-2">Support Phone Number</label>
              <input type="text" name="supportPhone" value={settings.supportPhone} onChange={handleChange} className="w-full bg-cream/30 border border-cream-dark py-2.5 px-4 text-sm outline-none focus:border-turmeric transition-colors font-body" />
            </div>
          </div>
        </div>

        {/* E-Commerce Rules */}
        <div className="bg-white border border-cream-dark rounded-none">
          <div className="p-6 border-b border-cream-dark bg-cream-dark/20">
            <h3 className="font-serif text-lg text-charcoal-dark">E-Commerce Configuration</h3>
          </div>
          <div className="p-6 space-y-5">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs uppercase tracking-wider text-charcoal-soft font-bold mb-2">Free Shipping Threshold (₹)</label>
                <input type="number" name="freeShippingThreshold" value={settings.freeShippingThreshold} onChange={handleChange} className="w-full bg-cream/30 border border-cream-dark py-2.5 px-4 text-sm outline-none focus:border-turmeric transition-colors font-['Outfit']" />
              </div>
              <div className="flex-1">
                <label className="block text-xs uppercase tracking-wider text-charcoal-soft font-bold mb-2">Flat Shipping Rate (₹)</label>
                <input type="number" name="flatShippingRate" value={settings.flatShippingRate} onChange={handleChange} className="w-full bg-cream/30 border border-cream-dark py-2.5 px-4 text-sm outline-none focus:border-turmeric transition-colors font-['Outfit']" />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal-soft font-bold mb-2">Default Tax Percentage (%)</label>
              <input type="number" name="taxPercentage" value={settings.taxPercentage} onChange={handleChange} className="w-full bg-cream/30 border border-cream-dark py-2.5 px-4 text-sm outline-none focus:border-turmeric transition-colors font-['Outfit']" />
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="bg-white border border-cream-dark rounded-none lg:col-span-2">
          <div className="p-6 border-b border-cream-dark bg-cream-dark/20">
            <h3 className="font-serif text-lg text-charcoal-dark">Feature Toggles</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <label className="flex items-center gap-4 cursor-pointer">
                <div className={`w-10 h-5 rounded-full relative transition-colors ${settings.enableReviews ? 'bg-spice-brown' : 'bg-gray-300'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${settings.enableReviews ? 'left-[22px]' : 'left-0.5'}`}></div>
                </div>
                <input type="checkbox" name="enableReviews" checked={settings.enableReviews} onChange={handleChange} className="hidden" />
                <div>
                  <div className="text-sm font-bold text-charcoal-dark">Enable Product Reviews</div>
                  <div className="text-xs text-gray-500">Allow customers to leave ratings and reviews on product pages.</div>
                </div>
              </label>

              <label className="flex items-center gap-4 cursor-pointer pt-4 border-t border-cream-dark">
                <div className={`w-10 h-5 rounded-full relative transition-colors ${settings.maintenanceMode ? 'bg-red-500' : 'bg-gray-300'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${settings.maintenanceMode ? 'left-[22px]' : 'left-0.5'}`}></div>
                </div>
                <input type="checkbox" name="maintenanceMode" checked={settings.maintenanceMode} onChange={handleChange} className="hidden" />
                <div>
                  <div className="text-sm font-bold text-charcoal-dark">Maintenance Mode</div>
                  <div className="text-xs text-gray-500">Disable frontend access. Customers will see a "Coming Soon" screen.</div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Settings
