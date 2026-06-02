import api from '../lib/api'

export async function createOrder(amount, anonymous = false) {
  const { data } = await api.post('/api/v1/donations/create-order', { amount, anonymous })
  const payload = data.data ?? data
  return {
    ...payload,
    id: payload.id ?? payload.order_id,
  }
}

export async function verifyPayment(payload) {
  const { data } = await api.post('/api/v1/donations/verify', payload)
  return data.data ?? data
}

export async function getDonationHistory(page = 1, size = 20) {
  const { data } = await api.get('/api/v1/donations/history', { params: { page, size } })
  return data.data ?? data
}

export async function simulateDonation(amount, anonymous = false) {
  const { data } = await api.post('/api/v1/donations/simulate', { amount, anonymous })
  return data.data ?? data
}

export async function getReceipt(donationId) {
  const { data } = await api.get(`/api/v1/donations/${donationId}/receipt`)
  return data.data ?? data
}
