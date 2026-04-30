import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' }
})

// Check if token is close to expiry (within 1 day)
function isTokenExpiringSoon(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const expiresAt = payload.exp * 1000
    const oneDayMs = 24 * 60 * 60 * 1000
    return expiresAt - Date.now() < oneDayMs
  } catch {
    return false
  }
}

let refreshing = null

// Attach token and auto-refresh if expiring soon
api.interceptors.request.use(async config => {
  let token = localStorage.getItem('token')
  if (token) {
    if (isTokenExpiringSoon(token) && !config.url.includes('/auth/refresh')) {
      if (!refreshing) {
        refreshing = axios.post(
          (import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api/auth/refresh',
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        ).then(res => {
          localStorage.setItem('token', res.data.token)
          if (res.data.user) localStorage.setItem('user', JSON.stringify(res.data.user))
          return res.data.token
        }).catch(() => null).finally(() => { refreshing = null })
      }
      const newToken = await refreshing
      if (newToken) token = newToken
    }
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors globally
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
