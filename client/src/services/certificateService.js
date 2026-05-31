import api from '../lib/api'

export async function verifyCertificate(unique_id) {
  const { data } = await api.get('/api/v1/certificates/verify', { params: { unique_id } })
  return data.data ?? data
}
