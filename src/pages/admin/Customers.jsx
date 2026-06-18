import React, { useState, useEffect } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import api from '../../services/api'
import { HiOutlineDownload } from 'react-icons/hi'

const MOCK_CUSTOMERS = []

const Customers = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  const getCombinedCustomers = () => {
    const list = [...MOCK_CUSTOMERS]
    
    // 1. Add local registered users
    try {
      const localUsers = JSON.parse(localStorage.getItem('masala_local_users') || '[]')
      localUsers.forEach(u => {
        if (!list.some(existing => existing.email.toLowerCase() === u.email.toLowerCase())) {
          list.push({
            id: u.id || `u-local-${Date.now()}-${Math.random()}`,
            first_name: u.first_name || '',
            last_name: u.last_name || '',
            email: u.email,
            role: u.role || 'customer',
            created_at: u.created_at || new Date().toISOString()
          })
        }
      })
    } catch (_) {}

    // 2. Add email/address profiles from local orders (guests / buyers)
    try {
      const localOrders = JSON.parse(localStorage.getItem('masala_local_orders') || '[]')
      localOrders.forEach(o => {
        const email = o.shipping_address?.email || o.user?.email
        if (email && !list.some(existing => existing.email.toLowerCase() === email.toLowerCase())) {
          list.push({
            id: `u-order-${o.id}`,
            first_name: o.shipping_address?.first_name || 'Guest',
            last_name: o.shipping_address?.last_name || 'Buyer',
            email: email,
            role: 'customer (guest)',
            created_at: o.created_at || new Date().toISOString()
          })
        }
      })
    } catch (_) {}

    return list
  }

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/admin/orders/customers')
      const data = res.data.data || []
      setCustomers(data.length > 0 ? data : getCombinedCustomers())
    } catch (err) {
      setCustomers(getCombinedCustomers()) // silent fallback
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const handleExportCSV = async () => {
    const toastId = toast.loading("Generating customer register CSV...")
    try {
      const res = await api.get('/api/admin/exports/customers', { responseType: 'blob' })
      const blob = new Blob([res.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'customers_export.csv')
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
      toast.success("Customers list exported successfully.", { id: toastId })
    } catch (err) {
      // Client-side fallback download
      let csvContent = "data:text/csv;charset=utf-8," 
        + ["User ID", "Email", "First Name", "Last Name", "Created At"].join(",") + "\n"
        + customers.map(u => [u.id, u.email, u.first_name, u.last_name, u.created_at].join(",")).join("\n")
      
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", "customers_export.csv")
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
      toast.success("Simulated local CSV download.", { id: toastId })
    }
  }

  return (
    <AdminLayout title="Customers" breadcrumbs={[{ label: 'Customers' }]}>
      <div className="flex flex-col gap-6">
        
        {/* Operations Block */}
        <div className="flex justify-between items-center bg-white border border-cream-dark p-6 rounded-none">
          <div>
            <h3 className="font-serif text-sm uppercase tracking-wider text-ochre">Customer Directory</h3>
            <p className="text-xs text-gray-400 mt-1 font-body">Manage verified buyers and export profiles database.</p>
          </div>
          
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 border border-gray-300 px-6 py-2 text-xs uppercase tracking-wider text-charcoal-dark hover:bg-gray-100 transition-all font-body rounded-none cursor-pointer"
          >
            <HiOutlineDownload size={15} /> Export to CSV
          </button>
        </div>

        {/* Directory List Table */}
        <div className="bg-white border border-cream-dark p-6 rounded-none">
          {loading ? (
            <div className="py-20 text-center text-sm text-gray-500 animate-pulse font-body">Loading directories...</div>
          ) : customers.length === 0 ? (
            <div className="py-20 text-center text-sm text-gray-400 italic font-body">No customers registered yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 font-semibold bg-gray-50">
                    <th className="py-4 px-6">Customer Name</th>
                    <th className="py-4 px-6">Email Address</th>
                    <th className="py-4 px-6">System Role</th>
                    <th className="py-4 px-6">Joined Date</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.id} className="border-b border-gray-100 text-sm text-charcoal-soft hover:bg-gray-50/50">
                      <td className="py-4 px-6 font-semibold text-charcoal-dark">
                        {c.first_name} {c.last_name}
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-gray-500">{c.email}</td>
                      <td className="py-4 px-6">
                        <span className="inline-block px-2.5 py-1 bg-cream-dark/30 text-[10px] uppercase tracking-wider font-bold rounded-none text-charcoal-dark">
                          {c.role}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-400 font-body">
                        {new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  )
}

export default Customers
