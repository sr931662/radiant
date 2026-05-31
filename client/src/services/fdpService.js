import api from '../lib/api'

export async function getFdps(page = 1, size = 10) {
  const { data } = await api.get('/api/v1/fdp', { params: { page, size } })
  return data.data ?? data
}

export async function getFdp(fdpId) {
  const { data } = await api.get(`/api/v1/fdp/${fdpId}`)
  return data.data ?? data
}

export async function registerFdp(fdpId) {
  const { data } = await api.post(`/api/v1/fdp/${fdpId}/register`)
  return data.data ?? data
}

export async function getMyRegistrations() {
  const { data } = await api.get('/api/v1/fdp/my-registrations')
  return data.data ?? data
}
