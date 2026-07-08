import api from '../lib/api'

export async function submitLandingLead(payload) {
  const { data } = await api.post('/api/v1/landing-leads', payload)
  return data
}

export async function getAdminLandingLeads(page = 1, size = 20) {
  const { data } = await api.get('/api/v1/admin/landing-leads', { params: { page, size } })
  return data.data ?? data
}

export async function updateLandingLeadStatus(id, status) {
  const { data } = await api.patch(`/api/v1/admin/landing-leads/${id}/status`, { status })
  return data
}
