import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-hot-toast'

const AdminLogin = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error("Please enter both email and password")
      return
    }
    
    setSubmitting(true)
    const toastId = toast.loading("Authenticating admin credentials...")
    try {
      const user = await login(email, password)
      if (user?.role === 'admin') {
        toast.success("Welcome to Admin Dashboard", { id: toastId })
        navigate('/admin')
      } else {
        toast.error("Access denied. Admin role required.", { id: toastId })
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials", { id: toastId })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 font-body">
      <div className="w-full max-w-md bg-white border border-cream-dark p-10 rounded-none shadow-xs">
        
        {/* Editorial Brand Header */}
        <div className="text-center mb-8">
          <span className="text-[10px] uppercase tracking-widest text-ochre font-bold">Internal Access</span>
          <h2 className="font-serif text-2xl text-charcoal-dark font-bold mt-2">The Masala Company</h2>
          <p className="text-xs text-gray-400 mt-1">Administrative Control Center</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500 uppercase tracking-wider">Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-200 p-3 text-sm outline-none focus:border-spice-brown rounded-none transition-colors"
              placeholder="admin@themasalacompany.com"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500 uppercase tracking-wider">Secure Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-200 p-3 text-sm outline-none focus:border-spice-brown rounded-none transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-charcoal-dark text-cream p-3 text-xs uppercase tracking-widest font-bold hover:bg-spice-brown transition-colors cursor-pointer rounded-none disabled:opacity-55"
          >
            {submitting ? "Signing in..." : "Enter Dashboard"}
          </button>
        </form>

        <div className="mt-8 border-t border-gray-100 pt-4 text-center">
          <p className="text-[10px] text-gray-400 font-mono mb-4">
            Default credentials: <br/>
            <span className="text-charcoal-soft font-semibold">admin@themasalacompany.com</span> / <span className="text-charcoal-soft font-semibold">themasalacompany</span>
          </p>
          <Link to="/login" className="text-xs text-spice-brown hover:underline tracking-wide font-semibold">
            ← Back to Customer Login
          </Link>
        </div>

      </div>
    </div>
  )
}

export default AdminLogin
