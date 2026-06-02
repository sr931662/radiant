import axios from 'axios'

const ACCESS_KEY = 'radiant_access_token'
const REFRESH_KEY = 'radiant_refresh_token'

// Determine API base URL
function resolveApiBaseUrl() {
  if (import.meta?.env?.DEV) return ''

  const configured = (import.meta.env.VITE_API_URL || '').trim()
  if (!configured) return ''

  // Prefer same-origin API calls in production so the Worker can proxy `/api/*`
  // without requiring direct browser-to-Cloud Run CORS.
  if (configured.startsWith('/')) return configured.replace(/\/+$/, '')

  try {
    const configuredUrl = new URL(configured)
    // Auto-upgrade http → https when the page itself is served over https.
    // Prevents Mixed Content blocks if VITE_API_URL was accidentally set to http://.
    if (
      configuredUrl.protocol === 'http:' &&
      typeof window !== 'undefined' &&
      window.location.protocol === 'https:'
    ) {
      configuredUrl.protocol = 'https:'
    }
    return configuredUrl.origin
  } catch {
    return configured.replace(/\/+$/, '')
  }
}

const API_BASE_URL = resolveApiBaseUrl()

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
})

api.interceptors.request.use((config) => {
  const token = getAccessToken()
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
      const refreshToken = getRefreshToken()
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
        // Preserve whichever storage the token was originally saved to
        const store = localStorage.getItem(REFRESH_KEY) ? localStorage : sessionStorage
        store.setItem(ACCESS_KEY, newAccess)
        if (newRefresh) store.setItem(REFRESH_KEY, newRefresh)
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
  sessionStorage.removeItem(ACCESS_KEY)
  sessionStorage.removeItem(REFRESH_KEY)
}

export function setTokens(access, refresh, remember = true) {
  const store = remember ? localStorage : sessionStorage
  store.setItem(ACCESS_KEY, access)
  if (refresh) store.setItem(REFRESH_KEY, refresh)
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY) ?? sessionStorage.getItem(ACCESS_KEY)
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY) ?? sessionStorage.getItem(REFRESH_KEY)
}

export function getApiBaseUrl() {
  return API_BASE_URL
}

export default api

