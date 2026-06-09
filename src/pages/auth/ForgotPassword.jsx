import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { HiCheckCircle } from 'react-icons/hi'
import toast from 'react-hot-toast'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { forgotPassword } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await forgotPassword(email)
      setSuccess(true)
    } catch (error) {
      toast.error('Failed to send reset link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-4">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-card">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6 font-display font-bold text-xl tracking-widest uppercase text-spice-brown">
            The Masala Company
          </Link>
          <h2 className="text-2xl font-display font-bold text-charcoal-dark mb-2">Reset Your Password</h2>
        </div>

        {success ? (
          <div className="text-center py-6">
            <HiCheckCircle className="mx-auto text-green-500 w-16 h-16 mb-4" />
            <p className="text-charcoal-soft font-body">Check your email for a reset link.</p>
            <Link to="/login" className="inline-block mt-6 text-spice-brown hover:underline font-medium font-body">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <p className="text-sm text-charcoal-soft font-body mb-4">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <div>
              <label className="block text-charcoal-soft font-body text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                required
                className="w-full bg-cream border border-spice-brown/20 rounded-md px-4 py-2.5 font-body focus:outline-none focus:ring-2 focus:ring-turmeric"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-spice-brown text-cream font-body font-medium py-3 rounded-md hover:bg-opacity-90 transition-all mt-4"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <div className="text-center mt-6">
              <Link to="/login" className="text-sm font-medium text-spice-brown hover:underline font-body">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword
