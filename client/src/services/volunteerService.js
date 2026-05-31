import api from '../lib/api'

export async function applyVolunteer(payload) {
  const { data } = await api.post('/api/v1/volunteers/apply/volunteer', payload)
  return data.data ?? data
}

export async function applyInternship(payload) {
  const { data } = await api.post('/api/v1/volunteers/apply/internship', payload)
  return data.data ?? data
}

export async function getMyApplications() {
  const { data } = await api.get('/api/v1/volunteers/my-applications')
  return data.data ?? data
}
