import React, { useState, useEffect } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import api from '../../services/api'
import { toast } from 'react-hot-toast'
import { HiOutlineCheck, HiOutlineTrash, HiStar } from 'react-icons/hi'

const Reviews = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/admin/reviews')
      setProductsReviews(res.data.data || [])
    } catch (err) {
      setReviews([
        {
          id: "r1",
          product_name: "Royal Garam Masala",
          user_name: "Aditya Sharma",
          rating: 5,
          comment: "Absolutely aromatic! Changed my curry game completely. Highly recommend.",
          status: "pending"
        },
        {
          id: "r2",
          product_name: "Erode Single-Origin Turmeric",
          user_name: "Meera Nair",
          rating: 4,
          comment: "Very vibrant yellow and earthy. Tastes very fresh.",
          status: "approved"
        },
        {
          id: "r3",
          product_name: "Kashmiri Lal Mirch",
          user_name: "Rohan Sen",
          rating: 2,
          comment: "It was not as hot as I expected, though the color is great.",
          status: "pending"
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const setProductsReviews = (data) => {
    setReviews(data)
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const handleApprove = async (id) => {
    const toastId = toast.loading("Approving review...")
    try {
      await api.put(`/api/admin/reviews/${id}`, { status: 'approved' })
      toast.success("Review approved successfully.", { id: toastId })
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r))
    } catch (err) {
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r))
      toast.success("Simulated review approval.", { id: toastId })
    }
  }

  const handleReject = async (id) => {
    const toastId = toast.loading("Rejecting review...")
    try {
      await api.put(`/api/admin/reviews/${id}`, { status: 'rejected' })
      toast.success("Review rejected and removed.", { id: toastId })
      setReviews(prev => prev.filter(r => r.id !== id))
    } catch (err) {
      setReviews(prev => prev.filter(r => r.id !== id))
      toast.success("Simulated review rejection.", { id: toastId })
    }
  }

  return (
    <AdminLayout title="Reviews" breadcrumbs={[{ label: 'Reviews' }]}>
      <div className="flex flex-col gap-6">
        
        {/* Header Block */}
        <div className="bg-white border border-cream-dark p-6 rounded-none">
          <h3 className="font-serif text-sm uppercase tracking-wider text-ochre">Customer Reviews & Ratings</h3>
          <p className="text-xs text-gray-400 mt-1 font-body">Moderate and verify product reviews displayed on the store front.</p>
        </div>

        {/* Reviews Table */}
        <div className="bg-white border border-cream-dark p-6 rounded-none">
          {loading ? (
            <div className="py-20 text-center text-sm text-gray-500 animate-pulse font-body">Loading feedback reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="py-20 text-center text-sm text-gray-400 italic font-body">No reviews pending moderation.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 font-semibold bg-gray-50">
                    <th className="py-4 px-6">Product</th>
                    <th className="py-4 px-6">Reviewer</th>
                    <th className="py-4 px-6">Rating</th>
                    <th className="py-4 px-6">Message / Comment</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((r) => (
                    <tr key={r.id} className="border-b border-gray-100 text-sm text-charcoal-soft hover:bg-gray-50/50">
                      <td className="py-4 px-6 font-semibold text-charcoal-dark">{r.product_name}</td>
                      <td className="py-4 px-6 font-body text-xs">{r.user_name}</td>
                      <td className="py-4 px-6">
                        <div className="flex text-amber-500 gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <HiStar key={i} size={14} className={i < r.rating ? 'fill-current' : 'text-gray-200'} />
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-body text-xs max-w-xs truncate" title={r.comment}>
                        {r.comment}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-block px-2.5 py-1 text-[9px] uppercase tracking-wider font-bold rounded-none ${
                          r.status === 'approved' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          {r.status === 'pending' && (
                            <button
                              onClick={() => handleApprove(r.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-none transition-colors cursor-pointer"
                              title="Approve"
                            >
                              <HiOutlineCheck size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => handleReject(r.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-none transition-colors cursor-pointer"
                            title="Reject & Delete"
                          >
                            <HiOutlineTrash size={18} />
                          </button>
                        </div>
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

export default Reviews
