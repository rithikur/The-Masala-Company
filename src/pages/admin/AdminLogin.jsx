import React, { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-hot-toast'
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi'

const AdminLogin = () => {
  const { login, isAuthenticated, isLoading, user } = useAuth()
  const navigate = useNavigate()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Already logged in as admin — send straight to dashboard
  if (!isLoading && isAuthenticated && user?.role === 'admin') {
    return <Navigate to="/admin" replace />
  }

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
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 font-body relative overflow-hidden">
      {/* Background Textured Spice Image overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04] mix-blend-multiply pointer-events-none transform scale-105"
        style={{ 
          backgroundImage: "url('/images/hero_spices_bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />

      <div className="w-full max-w-md bg-white/95 backdrop-blur-md border border-cream-dark p-10 relative shadow-luxury">
        {/* Editorial top accent line */}
        <div className="absolute top-0 left-0 w-full h-[4px] bg-turmeric" />
        
        {/* Decorative thin inner frame */}
        <div className="absolute inset-2 border border-cream-dark/30 pointer-events-none" />
        
        {/* Editorial Brand Header */}
        <div className="text-center mb-8 relative z-10">
          <span className="text-[10px] uppercase tracking-[0.35em] text-turmeric font-bold">Internal Access</span>
          <h2 className="font-display text-2xl text-spice-brown uppercase tracking-wider font-semibold mt-2.5">The Masala Co.</h2>
          <p className="font-accent italic text-xs text-spice-medium/70 mt-1.5">Administrative Control Center</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
          <div className="flex flex-col gap-2">
            <label className="text-[9px] text-spice-brown/60 uppercase tracking-[0.25em] font-semibold">Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-cream-dark focus:border-turmeric py-3 text-sm text-spice-brown outline-none transition-all duration-300 placeholder:text-spice-brown/20 font-body rounded-none"
              placeholder="admin@themasalacompany.com"
              autoComplete="username"
              required
            />
          </div>

          <div className="flex flex-col gap-2 relative">
            <label className="text-[9px] text-spice-brown/60 uppercase tracking-[0.25em] font-semibold">Secure Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-cream-dark focus:border-turmeric py-3 pr-10 text-sm text-spice-brown outline-none transition-all duration-300 placeholder:text-spice-brown/20 font-body rounded-none"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="absolute right-0 top-1/2 -translate-y-1/2 text-spice-brown/40 hover:text-spice-brown"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <HiOutlineEyeOff size={18} /> : <HiOutlineEye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-spice-brown hover:bg-spice-medium text-cream py-4 mt-4 text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-300 shadow-sm hover:shadow-luxury cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-none"
          >
            {submitting ? "Authenticating..." : "Enter Dashboard"}
          </button>
        </form>

        <div className="mt-8 border-t border-cream-dark pt-6 text-center relative z-10">
          <Link 
            to="/login" 
            className="text-[10px] text-spice-brown/60 hover:text-spice-brown tracking-[0.2em] uppercase font-bold transition-colors inline-flex items-center gap-1.5"
          >
            ← Back to Customer Login
          </Link>
        </div>

      </div>
    </div>
  )
}

export default AdminLogin
