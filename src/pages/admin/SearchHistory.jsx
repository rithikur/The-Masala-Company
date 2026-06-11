import React, { useState } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import { HiOutlineSearch, HiOutlineTrendingUp, HiOutlineCalendar } from 'react-icons/hi'

const MOCK_SEARCHES = [
  { id: 1, term: 'Turmeric Powder', frequency: 1245, results_avg: 4, last_searched: '2026-06-11T10:23:00Z', trend: 'up' },
  { id: 2, term: 'Garam Masala', frequency: 982, results_avg: 6, last_searched: '2026-06-11T09:45:00Z', trend: 'up' },
  { id: 3, term: 'Cardamom', frequency: 876, results_avg: 3, last_searched: '2026-06-11T08:12:00Z', trend: 'down' },
  { id: 4, term: 'Saffron', frequency: 654, results_avg: 1, last_searched: '2026-06-10T14:30:00Z', trend: 'up' },
  { id: 5, term: 'Chai Masala', frequency: 543, results_avg: 2, last_searched: '2026-06-10T11:20:00Z', trend: 'down' },
  { id: 6, term: 'Gift set', frequency: 432, results_avg: 8, last_searched: '2026-06-09T16:15:00Z', trend: 'up' },
  { id: 7, term: 'Black Pepper', frequency: 321, results_avg: 5, last_searched: '2026-06-09T09:10:00Z', trend: 'down' },
  { id: 8, term: 'Cumin seeds', frequency: 210, results_avg: 4, last_searched: '2026-06-08T18:45:00Z', trend: 'up' },
  { id: 9, term: 'Cinnamon sticks', frequency: 198, results_avg: 2, last_searched: '2026-06-08T12:30:00Z', trend: 'down' },
  { id: 10, term: 'Cloves', frequency: 156, results_avg: 3, last_searched: '2026-06-07T10:15:00Z', trend: 'up' },
]

const SearchHistory = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredSearches = MOCK_SEARCHES.filter(s => 
    s.term.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return new Intl.DateTimeFormat('en-IN', { 
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' 
    }).format(d)
  }

  return (
    <AdminLayout title="Search History" breadcrumbs={[{ label: 'Insights' }, { label: 'Search History' }]}>
      <div className="bg-white border border-cream-dark p-6 rounded-none">
        
        {/* Header Options */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <HiOutlineSearch className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 text-sm outline-none focus:border-spice-brown rounded-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-sm text-charcoal-muted hover:text-spice-brown transition-colors">
            <HiOutlineCalendar size={18} /> Last 30 Days
          </button>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 font-semibold bg-gray-50">
                <th className="py-4 px-6">Search Query</th>
                <th className="py-4 px-6 text-right">Frequency</th>
                <th className="py-4 px-6 text-center">Avg Results</th>
                <th className="py-4 px-6">Last Searched</th>
                <th className="py-4 px-6 text-center">Trend</th>
              </tr>
            </thead>
            <tbody>
              {filteredSearches.length > 0 ? (
                filteredSearches.map((s) => (
                  <tr key={s.id} className="border-b border-gray-100 text-sm text-charcoal-soft hover:bg-gray-50/50">
                    <td className="py-4 px-6 font-medium text-charcoal-dark">"{s.term}"</td>
                    <td className="py-4 px-6 text-right font-['Outfit']">{s.frequency.toLocaleString()}</td>
                    <td className="py-4 px-6 text-center font-sans">
                      <span className={`px-2 py-1 rounded-full text-xs ${s.results_avg === 0 ? 'bg-red-50 text-red-600' : 'bg-gray-100'}`}>
                        {s.results_avg}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-500">{formatDate(s.last_searched)}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center">
                        <HiOutlineTrendingUp className={`w-4 h-4 ${s.trend === 'up' ? 'text-green-500' : 'text-red-500 transform rotate-180'}`} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-sm text-gray-400 italic">No search queries match your filter.</td>
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
