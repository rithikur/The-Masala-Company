import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { HiOutlineEye, HiOutlineEyeOff, HiArrowLeft } from 'react-icons/hi'
import loginBg from '../../assets/images/login_bg.jpg'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const loggedInUser = await login(email, password)
      toast.success('Welcome back!')
      if (loggedInUser && loggedInUser.role === 'admin') {
        navigate('/admin')
      } else {
        const params = new URLSearchParams(location.search)
        const redirect = params.get('redirect') || '/'
        navigate(redirect)
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-cream">
      {/* Left side - Full-bleed visual */}
      <div className="hidden md:flex flex-1 relative items-center justify-center p-12 bg-charcoal overflow-hidden">
        <img
          src={loginBg}
          alt="Spices background"
          fetchpriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 text-cream max-w-lg text-center md:text-left">
          <span className="text-xs uppercase tracking-widest text-turmeric font-semibold mb-3 block">Welcome</span>
          <h1 className="font-display text-5xl font-light mb-6 tracking-wide leading-tight text-cream">Elevate Every Dish.</h1>
          <p className="font-body text-sm leading-relaxed opacity-85 font-light max-w-md">
            Log in to manage your orders, trace the source of your premium spice blends, and access exclusive culinary insights.
          </p>
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-16 bg-cream relative">
        {/* Back to home button */}
        <Link
          to="/"
          className="absolute top-6 left-6 flex items-center gap-2 text-xs font-body uppercase tracking-widest text-spice-brown/60 hover:text-spice-brown transition-colors"
        >
          <HiArrowLeft size={16} />
          <span className="hidden sm:inline">Back to Home</span>
        </Link>

        <div className="w-full max-w-md bg-transparent">
          <div className="mb-10 text-left">
            <span className="text-xs uppercase tracking-widest text-turmeric font-medium block mb-1">Sign In</span>
            <h2 className="text-3xl font-display font-light text-spice-brown tracking-wide">Enter Your Details</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-charcoal font-body text-xs uppercase tracking-wider mb-2 font-medium" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full bg-transparent border-b border-spice-brown/30 rounded-none py-2 font-body text-sm text-charcoal-dark focus:outline-none focus:border-spice-brown transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-charcoal font-body text-xs uppercase tracking-wider font-medium" htmlFor="password">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-body text-turmeric hover:text-spice-brown transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full bg-transparent border-b border-spice-brown/30 rounded-none py-2 pr-10 font-body text-sm text-charcoal-dark focus:outline-none focus:border-spice-brown transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-charcoal-soft hover:text-spice-brown"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <HiOutlineEyeOff size={18} /> : <HiOutlineEye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-spice-brown text-cream font-body text-xs uppercase tracking-widest py-3.5 rounded-none hover:bg-opacity-95 hover:tracking-[0.15em] transition-all duration-300 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>



          <p className="mt-8 text-center text-xs font-body font-light text-charcoal-soft space-y-2 flex flex-col">
            <span>
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-spice-brown hover:underline tracking-wide">
                Create One
              </Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

