import api from '../lib/api'

export async function getActiveBanners() {
  const { data } = await api.get('/api/v1/banners')
  return data.data ?? data
}

export async function getAdminBanners() {
  const { data } = await api.get('/api/v1/admin/banners')
  return data.data ?? data
}

export async function createBanner(payload) {
  const { data } = await api.post('/api/v1/admin/banners', payload)
  return data.data ?? data
}

export async function updateBanner(id, payload) {
  const { data } = await api.put(`/api/v1/admin/banners/${id}`, payload)
  return data.data ?? data
}

export async function deleteBanner(id) {
  const { data } = await api.delete(`/api/v1/admin/banners/${id}`)
  return data
}
