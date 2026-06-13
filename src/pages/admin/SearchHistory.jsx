import React, { useState, useEffect } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import { HiOutlineSearch, HiOutlineTrendingUp, HiOutlineCalendar, HiOutlineTrash } from 'react-icons/hi'

const SearchHistory = () => {
  const [searches, setSearches] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  // Load real search history from localStorage
  useEffect(() => {
    const load = () => {
      try {
        const data = JSON.parse(localStorage.getItem('masala_search_history') || '[]')
        // Sort by frequency desc
        setSearches(data.sort((a, b) => b.frequency - a.frequency))
      } catch {
        setSearches([])
      }
    }
    load()
    // Also reload on storage changes (in case search was done in another tab)
    window.addEventListener('storage', load)
    return () => window.removeEventListener('storage', load)
  }, [])

  const handleClear = () => {
    if (!window.confirm('Clear all search history?')) return
    localStorage.removeItem('masala_search_history')
    setSearches([])
  }

  const handleDeleteOne = (id) => {
    const updated = searches.filter(s => s.id !== id)
    localStorage.setItem('masala_search_history', JSON.stringify(updated))
    setSearches(updated)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    const d = new Date(dateStr)
    return new Intl.DateTimeFormat('en-IN', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(d)
  }

  const filtered = searches.filter(s => s.term.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <AdminLayout title="Search History" breadcrumbs={[{ label: 'Insights' }, { label: 'Search History' }]}>
      <div className="bg-white border border-cream-dark p-6 rounded-none">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <HiOutlineSearch className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Filter search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 text-sm outline-none focus:border-spice-brown rounded-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 font-body">{searches.length} real search{searches.length !== 1 ? 'es' : ''} recorded</span>
            {searches.length > 0 && (
              <button onClick={handleClear} className="flex items-center gap-1.5 px-3 py-2 border border-red-200 text-red-500 hover:bg-red-50 text-xs uppercase tracking-wider transition-colors">
                <HiOutlineTrash size={14} /> Clear All
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 font-semibold bg-gray-50">
                <th className="py-4 px-6">Search Query</th>
                <th className="py-4 px-6 text-right">Times Searched</th>
                <th className="py-4 px-6">Last Searched</th>
                <th className="py-4 px-6 text-center">Trend</th>
                <th className="py-4 px-6" />
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((s) => (
                  <tr key={s.id} className="border-b border-gray-100 text-sm text-charcoal-soft hover:bg-gray-50/50">
                    <td className="py-4 px-6 font-medium text-charcoal-dark">"{s.term}"</td>
                    <td className="py-4 px-6 text-right font-mono">{s.frequency}</td>
                    <td className="py-4 px-6 text-xs text-gray-500">{formatDate(s.last_searched)}</td>
                    <td className="py-4 px-6 text-center">
                      <HiOutlineTrendingUp className={`w-4 h-4 mx-auto ${s.frequency > 1 ? 'text-green-500' : 'text-gray-300'}`} />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button onClick={() => handleDeleteOne(s.id)} className="text-gray-300 hover:text-red-400 transition-colors" title="Delete">
                        <HiOutlineTrash size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-16 text-center text-sm text-gray-400 italic">
                    {searches.length === 0
                      ? 'No searches yet. When users search on the storefront, their queries will appear here.'
                      : 'No queries match your filter.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default SearchHistory
