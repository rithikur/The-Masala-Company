import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import registerBg from '../../assets/images/register_bg.png'

const Register = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const calculateStrength = (pwd) => {
    if (!pwd) return { label: '', color: 'bg-transparent', text: '' }
    if (pwd.length < 6) return { label: 'WEAK', color: 'bg-red-700', text: 'text-red-700', width: 'w-1/3' }
    
    const hasNumOrSpec = /[0-9!@#$%^&*]/.test(pwd)
    if (pwd.length >= 8 && hasNumOrSpec) {
      return { label: 'STRONG', color: 'bg-spice-brown', text: 'text-spice-brown', width: 'w-full' }
    }
    
    return { label: 'MEDIUM', color: 'bg-turmeric', text: 'text-turmeric', width: 'w-2/3' }
  }

  const strength = calculateStrength(password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match')
    }
    if (!agreed) {
      return toast.error('Please agree to the Terms of Service')
    }
    
    setLoading(true)
    try {
      await register(email, password, firstName, lastName)
      toast.success('Welcome to The Masala Company!')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to register')
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-cream">
      {/* Left side - Stark, high-end editorial splash */}
      <div className="hidden md:flex flex-1 relative items-center justify-center p-12 bg-charcoal">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40" 
          style={{ backgroundImage: `url(${registerBg})` }}
        ></div>
        <div className="relative z-10 text-cream max-w-lg text-center md:text-left">
          <span className="text-xs uppercase tracking-widest text-turmeric font-semibold mb-3 block">Est. 2026</span>
          <h1 className="font-display text-5xl font-light mb-6 tracking-wide leading-tight text-cream">Pure, Aromatic, Authentic.</h1>
          <p className="font-body text-sm leading-relaxed opacity-80 font-light max-w-md">
            Create an account to preserve your favorite spice selections, trace the origin of each harvest, and receive curated seasonal recipes.
          </p>
        </div>
      </div>

      {/* Right side - Stark, cardless form with generous whitespace */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-16 bg-cream">
        <div className="w-full max-w-md bg-transparent">
          <div className="mb-10 text-left">
            <span className="text-xs uppercase tracking-widest text-turmeric font-medium block mb-1">Registration</span>
            <h2 className="text-3xl font-display font-light text-spice-brown tracking-wide">Create Account</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-charcoal font-body text-xs uppercase tracking-wider mb-2 font-medium">First Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-transparent border-b border-spice-brown/30 rounded-none py-2 font-body text-sm text-charcoal-dark focus:outline-none focus:border-spice-brown transition-all"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-charcoal font-body text-xs uppercase tracking-wider mb-2 font-medium">Last Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-transparent border-b border-spice-brown/30 rounded-none py-2 font-body text-sm text-charcoal-dark focus:outline-none focus:border-spice-brown transition-all"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-charcoal font-body text-xs uppercase tracking-wider mb-2 font-medium">Email Address</label>
              <input
                type="email"
                required
                className="w-full bg-transparent border-b border-spice-brown/30 rounded-none py-2 font-body text-sm text-charcoal-dark focus:outline-none focus:border-spice-brown transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-charcoal font-body text-xs uppercase tracking-wider mb-2 font-medium">Password</label>
              <input
                type="password"
                required
                className="w-full bg-transparent border-b border-spice-brown/30 rounded-none py-2 font-body text-sm text-charcoal-dark focus:outline-none focus:border-spice-brown transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {password && (
                <div className="mt-2 flex items-center justify-between">
                  <div className="h-[2px] w-full bg-spice-brown/10 overflow-hidden flex-1 mr-3">
                    <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`}></div>
                  </div>
                  <span className={`text-[10px] tracking-widest font-semibold ${strength.text}`}>{strength.label}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-charcoal font-body text-xs uppercase tracking-wider mb-2 font-medium">Confirm Password</label>
              <input
                type="password"
                required
                className="w-full bg-transparent border-b border-spice-brown/30 rounded-none py-2 font-body text-sm text-charcoal-dark focus:outline-none focus:border-spice-brown transition-all"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex items-start mt-4">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 accent-spice-brown cursor-pointer"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <label htmlFor="terms" className="ml-3 text-xs text-charcoal-soft font-body font-light select-none">
                I agree to the <Link to="/terms-of-service" className="underline hover:text-spice-brown" target="_blank" rel="noopener noreferrer">Terms of Service</Link> and <Link to="/privacy-policy" className="underline hover:text-spice-brown" target="_blank" rel="noopener noreferrer">Privacy Policy</Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-spice-brown text-cream font-body text-xs uppercase tracking-widest py-3.5 rounded-none hover:bg-opacity-95 hover:tracking-[0.15em] transition-all duration-300 mt-6"
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>



          <p className="mt-8 text-center text-xs font-body font-light text-charcoal-soft">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-spice-brown hover:underline tracking-wide">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register

