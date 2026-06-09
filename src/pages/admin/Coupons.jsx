import React from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import PageStub from '../../components/admin/PageStub'
import { HiOutlineTicket } from 'react-icons/hi'

const Coupons = () => {
  return (
    <AdminLayout title="Coupons" breadcrumbs={[{ label: 'Coupons' }]}>
      <PageStub name="Coupons" icon={HiOutlineTicket} />
    </AdminLayout>
  )
}

export default Coupons
