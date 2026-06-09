import React from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import PageStub from '../../components/admin/PageStub'
import { HiOutlineSearch } from 'react-icons/hi'

const SearchHistory = () => {
  return (
    <AdminLayout title="Search History" breadcrumbs={[{ label: 'Search History' }]}>
      <PageStub name="Search History" icon={HiOutlineSearch} />
    </AdminLayout>
  )
}

export default SearchHistory
