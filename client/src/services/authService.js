import api from '../lib/api'

export async function login(email, password) {
  const { data } = await api.post('/api/v1/auth/login', { email, password })
  return data.data ?? data
}

export async function register(payload) {
  const { data } = await api.post('/api/v1/auth/register', payload)
  return data.data ?? data
}

export async function logout(refresh_token) {
  const { data } = await api.post('/api/v1/auth/logout', { refresh_token })
  return data
}

export async function refreshToken(refresh_token) {
  const { data } = await api.post('/api/v1/auth/refresh', { refresh_token })
  return data.data ?? data
}

export async function verifyEmail(email, otp) {
  const { data } = await api.post('/api/v1/auth/verify-email', { email, otp })
  return data
}

export async function forgotPassword(email) {
  const { data } = await api.post('/api/v1/auth/forgot-password', { email })
  return data
}

export async function resetPassword(email, otp, new_password) {
  const { data } = await api.post('/api/v1/auth/reset-password', { email, otp, new_password })
  return data
}

export async function changePassword(current_password, new_password) {
  const { data } = await api.post('/api/v1/auth/change-password', { current_password, new_password })
  return data
}

export async function resendOtp(email, purpose = 'VERIFY_EMAIL') {
  const { data } = await api.post('/api/v1/auth/resend-otp', { email, purpose })
  return data
}
