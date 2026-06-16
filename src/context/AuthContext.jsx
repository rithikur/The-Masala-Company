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
    const token = localStorage.getItem('masala_access_token') || sessionStorage.getItem('masala_access_token')
      if (token) {
        // Admin mock token
        if (token === 'mock-admin-token') {
          if (!sessionStorage.getItem('masala_access_token')) {
            localStorage.removeItem('masala_access_token')
            setState({ ...initialState, isLoading: false })
            return
          }
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

        // Offline customer token
        if (token.startsWith('local-token-')) {
          const localUser = JSON.parse(localStorage.getItem('masala_local_user') || 'null')
          if (localUser) {
            setState({ user: localUser, isAuthenticated: true, isLoading: false, token })
          } else {
            localStorage.removeItem('masala_access_token')
            setState({ ...initialState, isLoading: false })
          }
          return
        }

        // Real backend token
        try {
          const response = await api.get('/api/auth/me')
          setState({
            user: response.data.data,
            isAuthenticated: true,
            isLoading: false,
            token,
          })
        } catch (error) {
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

    // Admin offline bypass
    if (cleanEmail === 'admin@themasalacompany.com' && cleanPassword === 'admin123') {
      const mockUser = {
        id: 'admin-id-123',
        email: 'admin@themasalacompany.com',
        full_name: 'Admin User',
        first_name: 'Admin',
        last_name: 'User',
        role: 'admin',
      }
      sessionStorage.setItem('masala_access_token', 'mock-admin-token')
      localStorage.setItem('masala_access_token', 'mock-admin-token')
      setState({ user: mockUser, isAuthenticated: true, isLoading: false, token: 'mock-admin-token' })
      return mockUser
    }

    // Try backend first
    try {
      const response = await api.post('/api/auth/login', { email: cleanEmail, password: cleanPassword })
      const { user, access_token, refresh_token } = response.data.data
      localStorage.setItem('masala_access_token', access_token)
      if (refresh_token) localStorage.setItem('masala_refresh_token', refresh_token)
      setState({ user, isAuthenticated: true, isLoading: false, token: access_token })
      return user
    } catch (backendErr) {
      // Backend offline — check if user exists in local storage (registered offline before)
      const localUsers = JSON.parse(localStorage.getItem('masala_local_users') || '[]')
      const found = localUsers.find(u => u.email === cleanEmail && u.password === cleanPassword)
      if (found) {
        const { password: _pwd, ...userWithoutPwd } = found
        const mockToken = `local-token-${found.id}`
        localStorage.setItem('masala_access_token', mockToken)
        localStorage.setItem('masala_local_user', JSON.stringify(userWithoutPwd))
        setState({ user: userWithoutPwd, isAuthenticated: true, isLoading: false, token: mockToken })
        return userWithoutPwd
      }
      // No local user found — throw so Login page can show a proper error
      throw new Error('Invalid email or password')
    }
  }

  const register = async (email, password, first_name, last_name) => {
    // Try backend first
    try {
      const response = await api.post('/api/auth/register', { email, password, first_name, last_name })
      const { user, access_token, refresh_token } = response.data.data
      localStorage.setItem('masala_access_token', access_token)
      if (refresh_token) localStorage.setItem('masala_refresh_token', refresh_token)
      setState({ user, isAuthenticated: true, isLoading: false, token: access_token })
      return user
    } catch (backendErr) {
      // Backend offline — save user locally so login works later
      const localUsers = JSON.parse(localStorage.getItem('masala_local_users') || '[]')
      const exists = localUsers.find(u => u.email === email.trim().toLowerCase())
      if (exists) throw new Error('An account with this email already exists')

      const newUser = {
        id: `local-${Date.now()}`,
        email: email.trim().toLowerCase(),
        password, // stored locally for offline login — not sent to any server
        first_name,
        last_name,
        full_name: `${first_name} ${last_name}`,
        role: 'customer',
        created_at: new Date().toISOString(),
      }
      localUsers.push(newUser)
      localStorage.setItem('masala_local_users', JSON.stringify(localUsers))

      const { password: _pwd, ...userWithoutPwd } = newUser
      const mockToken = `local-token-${newUser.id}`
      localStorage.setItem('masala_access_token', mockToken)
      localStorage.setItem('masala_local_user', JSON.stringify(userWithoutPwd))
      setState({ user: userWithoutPwd, isAuthenticated: true, isLoading: false, token: mockToken })
      return userWithoutPwd
    }
  }




  const logout = async () => {
    try {
      await api.post('/api/auth/logout')
    } catch (error) {
      console.error('Logout error', error)
    } finally {
      localStorage.removeItem('masala_access_token')
      localStorage.removeItem('masala_refresh_token')
      sessionStorage.removeItem('masala_access_token')
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

