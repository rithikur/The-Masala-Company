import React from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import PageStub from '../../components/admin/PageStub'
import { HiOutlineTag } from 'react-icons/hi'

const Categories = () => {
  return (
    <AdminLayout title="Categories" breadcrumbs={[{ label: 'Categories' }]}>
      <PageStub name="Categories" icon={HiOutlineTag} />
    </AdminLayout>
  )
}

export default Categories
