import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// Request interceptor: attach JWT token from localStorage if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('masala_access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: handle 401 — attempt refresh, retry original request once
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Attempt to refresh
        const token = localStorage.getItem('masala_refresh_token')
        // Call refresh endpoint directly using fetch to avoid circular interceptor dependency
        const refreshResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })

        if (!refreshResponse.ok) {
          throw new Error('Refresh failed')
        }

        const data = await refreshResponse.json()
        const newAccessToken = data.data.access_token
        
        localStorage.setItem('masala_access_token', newAccessToken)
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        
        return api(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('masala_access_token')
        localStorage.removeItem('masala_refresh_token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
