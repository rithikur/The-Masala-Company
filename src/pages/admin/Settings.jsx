import React from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import PageStub from '../../components/admin/PageStub'
import { HiOutlineCog } from 'react-icons/hi'

const Settings = () => {
  return (
    <AdminLayout title="Settings" breadcrumbs={[{ label: 'Settings' }]}>
      <PageStub name="Settings" icon={HiOutlineCog} />
    </AdminLayout>
  )
}

export default Settings
