import React, { useState } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import { HiOutlineShieldCheck, HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineX } from 'react-icons/hi'
import { toast } from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

const ROLES = ['admin', 'editor', 'viewer']

const ROLE_BADGE = {
  admin:  { bg: 'bg-spice-brown/10 text-spice-brown', label: 'Admin' },
  editor: { bg: 'bg-turmeric/10 text-turmeric-dark',  label: 'Editor' },
  viewer: { bg: 'bg-gray-100 text-gray-500',           label: 'Viewer' },
}

const initAdmins = [
  { id: 'a1', full_name: 'Admin User',      email: 'admin@themasalacompany.com', role: 'admin',  created_at: '2026-01-01T00:00:00Z', is_self: true },
  { id: 'a2', full_name: 'Rithik Kumar',    email: 'rithik@themasalacompany.com', role: 'editor', created_at: '2026-04-10T08:30:00Z', is_self: false },
  { id: 'a3', full_name: 'Meena Rajgopal',  email: 'meena@themasalacompany.com',  role: 'viewer', created_at: '2026-05-20T11:00:00Z', is_self: false },
]

const emptyForm = { full_name: '', email: '', role: 'editor', password: '' }

const AdminUsers = () => {
  const { user } = useAuth()
  const [admins, setAdmins] = useState(initAdmins)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing]   = useState(null) // null = new
  const [form, setForm]         = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (admin) => {
    setEditing(admin)
    setForm({ full_name: admin.full_name, email: admin.email, role: admin.role, password: '' })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditing(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)

    setTimeout(() => {
      if (editing) {
        setAdmins(prev => prev.map(a => a.id === editing.id
          ? { ...a, full_name: form.full_name, email: form.email, role: form.role }
          : a
        ))
        toast.success(`${form.full_name} updated`)
      } else {
        const newAdmin = {
          id: `a${Date.now()}`,
          full_name: form.full_name,
          email: form.email,
          role: form.role,
          created_at: new Date().toISOString(),
          is_self: false,
        }
        setAdmins(prev => [...prev, newAdmin])
        toast.success(`${form.full_name} added as ${form.role}`)
      }
      setSubmitting(false)
      closeModal()
    }, 600)
  }

  const handleDelete = (admin) => {
    if (admin.is_self) return toast.error("You cannot remove your own account.")
    if (!window.confirm(`Remove ${admin.full_name} from admin access?`)) return
    setAdmins(prev => prev.filter(a => a.id !== admin.id))
    toast.success(`${admin.full_name} removed`)
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <AdminLayout title="Admin Users" breadcrumbs={[{ label: 'Settings' }, { label: 'Admin Users' }]}>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="font-serif text-2xl text-charcoal-dark mb-1">Admin User Management</h2>
          <p className="text-sm text-gray-500">Control who has access to the admin console and their permission level.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-spice-brown text-cream px-4 py-2.5 text-xs uppercase tracking-wider font-bold hover:bg-spice-medium transition-colors rounded-none"
        >
          <HiOutlinePlus size={16} /> Add Admin
        </button>
      </div>

      {/* Role Legend */}
      <div className="flex flex-wrap gap-4 mb-6">
        {ROLES.map(r => (
          <div key={r} className="flex items-center gap-2 text-xs text-gray-500 font-body">
            <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold ${ROLE_BADGE[r].bg}`}>{ROLE_BADGE[r].label}</span>
            <span>{r === 'admin' ? 'Full access' : r === 'editor' ? 'Edit catalog & orders' : 'Read-only'}</span>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-white border border-cream-dark overflow-hidden rounded-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream-dark/50 border-b border-cream-dark">
                <th className="py-4 px-6 text-xs uppercase tracking-wider text-charcoal-soft font-semibold">User</th>
                <th className="py-4 px-6 text-xs uppercase tracking-wider text-charcoal-soft font-semibold">Email</th>
                <th className="py-4 px-6 text-xs uppercase tracking-wider text-charcoal-soft font-semibold">Role</th>
                <th className="py-4 px-6 text-xs uppercase tracking-wider text-charcoal-soft font-semibold">Added</th>
                <th className="py-4 px-6 text-xs uppercase tracking-wider text-charcoal-soft font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} className="border-b border-cream-dark last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-spice-brown/10 flex items-center justify-center text-spice-brown font-bold text-xs uppercase">
                        {admin.full_name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-charcoal-dark text-sm">{admin.full_name}</div>
                        {admin.is_self && <div className="text-[10px] text-turmeric uppercase tracking-wider font-bold">You</div>}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono text-xs text-gray-500">{admin.email}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-block px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-none ${ROLE_BADGE[admin.role]?.bg}`}>
                      {ROLE_BADGE[admin.role]?.label || admin.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-xs text-gray-400 font-body">{formatDate(admin.created_at)}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => openEdit(admin)}
                        className="text-gray-400 hover:text-spice-brown transition-colors"
                        title="Edit"
                      >
                        <HiOutlinePencil size={17} />
                      </button>
                      <button
                        onClick={() => handleDelete(admin)}
                        disabled={admin.is_self}
                        className={`transition-colors ${admin.is_self ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-red-500'}`}
                        title={admin.is_self ? 'Cannot remove yourself' : 'Remove'}
                      >
                        <HiOutlineTrash size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/70 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md shadow-luxury border border-cream-dark relative">
            <div className="absolute top-0 left-0 w-full h-[4px] bg-turmeric" />
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-xl text-charcoal-dark">
                  {editing ? 'Edit Admin User' : 'Add Admin User'}
                </h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-charcoal transition-colors">
                  <HiOutlineX size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-charcoal-soft font-bold mb-2">Full Name</label>
                  <input
                    type="text" required
                    value={form.full_name}
                    onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                    className="w-full bg-cream/30 border border-cream-dark py-2.5 px-4 text-sm outline-none focus:border-turmeric transition-colors font-body"
                    placeholder="e.g. Priya Nair"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-charcoal-soft font-bold mb-2">Email Address</label>
                  <input
                    type="email" required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full bg-cream/30 border border-cream-dark py-2.5 px-4 text-sm outline-none focus:border-turmeric transition-colors font-body"
                    placeholder="e.g. priya@themasalacompany.com"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-charcoal-soft font-bold mb-2">Role</label>
                  <select
                    value={form.role}
                    onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                    className="w-full bg-cream/30 border border-cream-dark py-2.5 px-4 text-sm outline-none focus:border-turmeric transition-colors font-body"
                  >
                    {ROLES.map(r => (
                      <option key={r} value={r}>{ROLE_BADGE[r].label} — {r === 'admin' ? 'Full access' : r === 'editor' ? 'Edit catalog & orders' : 'Read-only'}</option>
                    ))}
                  </select>
                </div>
                {!editing && (
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-charcoal-soft font-bold mb-2">Temporary Password</label>
                    <input
                      type="password" required
                      value={form.password}
                      onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                      className="w-full bg-cream/30 border border-cream-dark py-2.5 px-4 text-sm outline-none focus:border-turmeric transition-colors font-body"
                      placeholder="Min. 8 characters"
                      minLength={8}
                    />
                    <p className="text-[10px] text-gray-400 mt-1.5">User will be prompted to change this on first login.</p>
                  </div>
                )}

                <div className="flex gap-4 pt-4 mt-6 border-t border-cream-dark">
                  <button
                    type="button" onClick={closeModal}
                    className="flex-1 py-3 border border-cream-dark text-charcoal-soft text-xs uppercase tracking-wider font-bold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit" disabled={submitting}
                    className="flex-1 py-3 bg-spice-brown text-cream text-xs uppercase tracking-wider font-bold hover:bg-spice-medium transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : editing ? 'Update User' : 'Add User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminUsers
