import axios from 'axios'

const ACCESS_KEY = 'radiant_access_token'
const REFRESH_KEY = 'radiant_refresh_token'

// Determine API base URL
function resolveApiBaseUrl() {
  // In development: /api requests are proxied to http://localhost:8000 via vite
  // In production on Cloudflare: /api requests are proxied to backend via _worker.js
  // In Cloudflare preview mode: same as production
  
  if (typeof window === 'undefined') {
    return 'http://localhost:8000'
  }

  // For browser environments, use relative URLs so proxying works
  return ''
}

const API_BASE_URL = resolveApiBaseUrl()

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let isRefreshing = false
let failedQueue = []

function processQueue(error, token = null) {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)))
  failedQueue = []
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      const refreshToken = localStorage.getItem(REFRESH_KEY)
      if (!refreshToken) {
        clearTokens()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              original.headers.Authorization = `Bearer ${token}`
              resolve(api(original))
            },
            reject,
          })
        })
      }

      original._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/api/v1/auth/refresh`,
          { refresh_token: refreshToken }
        )
        const newAccess = data.data?.access_token || data.access_token
        const newRefresh = data.data?.refresh_token || data.refresh_token
        localStorage.setItem(ACCESS_KEY, newAccess)
        if (newRefresh) localStorage.setItem(REFRESH_KEY, newRefresh)
        processQueue(null, newAccess)
        original.headers.Authorization = `Bearer ${newAccess}`
        return api(original)
      } catch (err) {
        processQueue(err, null)
        clearTokens()
        window.location.href = '/login'
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

export function setTokens(access, refresh) {
  localStorage.setItem(ACCESS_KEY, access)
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh)
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY)
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY)
}

export function getApiBaseUrl() {
  return API_BASE_URL
}

export default api

function resolveApiBaseUrl() {
  if (import.meta.env.DEV) return ''

  const configured = (import.meta.env.VITE_API_URL || '').trim()
  if (!configured) return ''

  // Prefer same-origin API calls in production so the Worker can proxy `/api/*`
  // without requiring direct browser-to-Cloud Run CORS.
  if (configured.startsWith('/')) return configured.replace(/\/+$/, '')

  try {
    const configuredUrl = new URL(configured)
    if (typeof window !== 'undefined' && configuredUrl.origin === window.location.origin) {
      return configuredUrl.origin
    }
  } catch {
    return configured.replace(/\/+$/, '')
  }

  return ''
}
