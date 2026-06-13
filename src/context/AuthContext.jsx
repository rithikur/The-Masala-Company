import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'
import { supabase } from '../lib/supabase'

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  token: null,
}

export const AuthContext = createContext(initialState)

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState(initialState)

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('masala_access_token')
      if (token) {
        if (token === 'mock-admin-token') {
          setState({
            user: {
              id: 'admin-id-123',
              email: 'admin@themasalacompany.com',
              role: 'admin',
              first_name: 'Admin',
              last_name: 'User'
            },
            isAuthenticated: true,
            isLoading: false,
            token,
          })
          return
        }
        try {
          const response = await api.get('/api/auth/me')
          setState({
            user: response.data.data,
            isAuthenticated: true,
            isLoading: false,
            token,
          })
        } catch (error) {
          // Retry with refresh
          try {
            await refreshToken()
          } catch (refreshError) {
            localStorage.removeItem('masala_access_token')
            localStorage.removeItem('masala_refresh_token')
            setState({ ...initialState, isLoading: false })
          }
        }
      } else {
        setState({ ...initialState, isLoading: false })
      }
    }
    initializeAuth()
  }, [])

  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase()
    const cleanPassword = password.trim()

    // Fully offline admin bypass — no backend required
    if (cleanEmail === 'admin@themasalacompany.com' && cleanPassword === 'admin123') {
      const mockUser = {
        id: 'admin-id-123',
        email: 'admin@themasalacompany.com',
        full_name: 'Admin User',
        first_name: 'Admin',
        last_name: 'User',
        role: 'admin',
      }
      localStorage.setItem('masala_access_token', 'mock-admin-token')
      setState({ user: mockUser, isAuthenticated: true, isLoading: false, token: 'mock-admin-token' })
      return mockUser
    }

    const response = await api.post('/api/auth/login', { email: cleanEmail, password: cleanPassword })
    const { user, access_token, refresh_token } = response.data.data
    localStorage.setItem('masala_access_token', access_token)
    if (refresh_token) localStorage.setItem('masala_refresh_token', refresh_token)
    setState({ user, isAuthenticated: true, isLoading: false, token: access_token })
    return user
  }

  const register = async (email, password, first_name, last_name) => {
    const response = await api.post('/api/auth/register', { email, password, first_name, last_name })
    const { user, access_token, refresh_token } = response.data.data
    localStorage.setItem('masala_access_token', access_token)
    if (refresh_token) localStorage.setItem('masala_refresh_token', refresh_token)
    setState({ user, isAuthenticated: true, isLoading: false, token: access_token })
    return user
  }



  const logout = async () => {
    try {
      await api.post('/api/auth/logout')
    } catch (error) {
      console.error('Logout error', error)
    } finally {
      localStorage.removeItem('masala_access_token')
      localStorage.removeItem('masala_refresh_token')
      await supabase.auth.signOut()
      setState({ ...initialState, isLoading: false })
    }
  }

  const refreshToken = async () => {
    const token = localStorage.getItem('masala_refresh_token')
    const response = await api.post('/api/auth/refresh', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const { access_token } = response.data.data
    localStorage.setItem('masala_access_token', access_token)
    setState((prev) => ({ ...prev, token: access_token }))
  }

  const forgotPassword = async (email) => {
    await api.post('/api/auth/forgot-password', { email })
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        refreshToken,
        forgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
export default AuthContext

