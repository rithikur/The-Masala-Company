import React, { useState } from 'react'
import { HiSelector, HiChevronUp, HiChevronDown } from 'react-icons/hi'
import { RiInboxArchiveLine } from 'react-icons/ri'

const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  onRowClick = null,
  selectable = false,
  selectedRows = [],
  onSelectChange = null,
  onSort = null,
  sortKey = '',
  sortDirection = 'asc',
}) => {
  const handleSortClick = (key) => {
    if (!onSort) return
    let newDirection = 'asc'
    if (sortKey === key && sortDirection === 'asc') {
      newDirection = 'desc'
    }
    onSort(key, newDirection)
  }

  const handleSelectAll = (e) => {
    if (!onSelectChange) return
    if (e.target.checked) {
      onSelectChange(data.map((row) => row.id))
    } else {
      onSelectChange([])
    }
  }

  const handleSelectRow = (e, rowId) => {
    e.stopPropagation()
    if (!onSelectChange) return
    if (e.target.checked) {
      onSelectChange([...selectedRows, rowId])
    } else {
      onSelectChange(selectedRows.filter((id) => id !== rowId))
    }
  }

  const isAllSelected = data.length > 0 && selectedRows.length === data.length

  return (
    <div className="w-full overflow-x-auto bg-white rounded-xl border border-cream-dark shadow-card">
      <table className="w-full text-left border-collapse">
        <thead className="sticky top-0 bg-cream border-b border-cream-dark z-20">
          <tr>
            {selectable && (
              <th className="py-4 px-6 w-12">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  disabled={loading || data.length === 0}
                  className="rounded border-gray-300 text-turmeric focus:ring-turmeric focus:ring-offset-0 w-4 h-4 cursor-pointer"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className={[
                  'py-4 px-6 text-xs font-semibold font-body text-charcoal-soft uppercase tracking-wider',
                  col.sortable && !loading ? 'cursor-pointer select-none hover:text-spice-brown' : '',
                ].join(' ')}
                onClick={() => col.sortable && handleSortClick(col.key)}
              >
                <div className="flex items-center gap-1.5">
                  {col.label}
                  {col.sortable && !loading && (
                    <span className="text-charcoal-muted">
                      {sortKey === col.key ? (
                        sortDirection === 'asc' ? (
                          <HiChevronUp size={14} className="text-turmeric" />
                        ) : (
                          <HiChevronDown size={14} className="text-turmeric" />
                        )
                      ) : (
                        <HiSelector size={14} />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-cream-dark/60 font-body text-sm text-charcoal">
          {loading ? (
            // Render 5 Skeleton Rows
            Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr key={rowIndex} className="animate-pulse">
                {selectable && (
                  <td className="py-4 px-6">
                    <div className="h-4 w-4 bg-cream-dark rounded"></div>
                  </td>
                )}
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="py-4 px-6">
                    <div className="h-4 bg-cream-dark rounded w-3/4"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            // Empty State
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="py-12 px-6 text-center text-charcoal-muted"
              >
                <div className="flex flex-col items-center justify-center">
                  <RiInboxArchiveLine size={40} className="text-charcoal-muted/50 mb-3" />
                  <p className="font-semibold text-charcoal-soft mb-1">No data found</p>
                  <p className="text-xs">Try adjusting your filters or search criteria.</p>
                </div>
              </td>
            </tr>
          ) : (
            // Data Rows
            data.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick && onRowClick(row)}
                className={[
                  'transition-all duration-150',
                  onRowClick ? 'cursor-pointer hover:bg-cream/40' : 'hover:bg-cream/20',
                ].join(' ')}
              >
                {selectable && (
                  <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={(e) => handleSelectRow(e, row.id)}
                      className="rounded border-gray-300 text-turmeric focus:ring-turmeric focus:ring-offset-0 w-4 h-4 cursor-pointer"
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key} className="py-4 px-6">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
