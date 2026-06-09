import React from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import PageStub from '../../components/admin/PageStub'
import { HiOutlineChartBar } from 'react-icons/hi'

const Analytics = () => {
  return (
    <AdminLayout title="Analytics" breadcrumbs={[{ label: 'Analytics' }]}>
      <PageStub name="Analytics" icon={HiOutlineChartBar} />
    </AdminLayout>
  )
}

export default Analytics
