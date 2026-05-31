import api from '../lib/api'

export async function submitContact(payload) {
  const { data } = await api.post('/api/v1/contact', payload)
  return data
}
