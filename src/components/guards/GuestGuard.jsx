import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const GuestGuard = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()
  
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  if (isAuthenticated) {
    const params = new URLSearchParams(location.search)
    const redirect = params.get('redirect') || '/'
    return <Navigate to={redirect} replace />
  }

  return children
}

export default GuestGuard
