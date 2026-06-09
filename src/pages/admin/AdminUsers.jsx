import React from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import PageStub from '../../components/admin/PageStub'
import { HiOutlineShieldCheck } from 'react-icons/hi'

const AdminUsers = () => {
  return (
    <AdminLayout title="Admin Users" breadcrumbs={[{ label: 'Admin Users' }]}>
      <PageStub name="Admin Users" icon={HiOutlineShieldCheck} />
    </AdminLayout>
  )
}

export default AdminUsers
