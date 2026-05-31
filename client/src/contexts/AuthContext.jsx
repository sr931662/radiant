import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { clearTokens, setTokens, getRefreshToken } from '../lib/api'
import * as authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user
  const isAdmin =
    user?.roles?.includes('ADMIN') || user?.roles?.includes('SUPER_ADMIN') || false

  const restoreSession = useCallback(async () => {
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      setIsLoading(false)
      return
    }
    try {
      const data = await authService.refreshToken(refreshToken)
      setTokens(data.access_token, data.refresh_token)
      setUser(parseJwtPayload(data.access_token))
    } catch {
      clearTokens()
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    restoreSession()
  }, [restoreSession])

  async function login(email, password) {
    const data = await authService.login(email, password)
    setTokens(data.access_token, data.refresh_token)
    setUser(parseJwtPayload(data.access_token))
    return data
  }

  async function register(payload) {
    const data = await authService.register(payload)
    setTokens(data.access_token, data.refresh_token)
    setUser(parseJwtPayload(data.access_token))
    return data
  }

  function logout() {
    const refreshToken = getRefreshToken()
    if (refreshToken) authService.logout(refreshToken).catch(() => {})
    clearTokens()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

function parseJwtPayload(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return {
      id: payload.sub,
      roles: payload.roles || [],
      permissions: payload.permissions || [],
    }
  } catch {
    return null
  }
}
