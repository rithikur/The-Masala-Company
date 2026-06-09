import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const AuthCallback = () => {
  const navigate = useNavigate()
  const { refreshToken } = useAuth()

  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        toast.error('Authentication failed')
        navigate('/login')
        return
      }

      if (data?.session) {
        try {
          // Exchange Supabase token for Flask JWT
          const response = await api.post('/auth/google', {
            access_token: data.session.access_token
          })
          
          localStorage.setItem('masala_access_token', response.data.data.access_token)
          if (response.data.data.refresh_token) {
            localStorage.setItem('masala_refresh_token', response.data.data.refresh_token)
          }
          // Force auth context to refresh
          window.location.href = '/'
        } catch (err) {
          toast.error('Failed to complete sign in')
          navigate('/login')
        }
      } else {
        navigate('/login')
      }
    }

    handleAuth()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-turmeric border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-body text-charcoal-soft">Completing sign in...</p>
      </div>
    </div>
  )
}

export default AuthCallback
