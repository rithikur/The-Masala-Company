import React from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import PageStub from '../../components/admin/PageStub'
import { HiOutlineArchive } from 'react-icons/hi'

const Inventory = () => {
  return (
    <AdminLayout title="Inventory" breadcrumbs={[{ label: 'Inventory' }]}>
      <PageStub name="Inventory" icon={HiOutlineArchive} />
    </AdminLayout>
  )
}

export default Inventory
