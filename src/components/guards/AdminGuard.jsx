import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const AdminGuard = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role !== 'admin') {
      toast.error('Admin access required')
    }
  }, [isLoading, isAuthenticated, user])

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default AdminGuard
