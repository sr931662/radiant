import api from '../lib/api'

export async function getPlans() {
  const { data } = await api.get('/api/v1/memberships/plans')
  return data.data ?? data
}

export async function applyMembership(plan_id) {
  const { data } = await api.post('/api/v1/memberships/apply', { plan_id })
  return data.data ?? data
}

export async function getMyMemberships() {
  const { data } = await api.get('/api/v1/memberships/my-memberships')
  return data.data ?? data
}

export async function getMembershipCard(membershipId) {
  const { data } = await api.get(`/api/v1/memberships/${membershipId}/card`)
  return data.data ?? data
}

export async function renewMembership(membershipId) {
  const { data } = await api.post(`/api/v1/memberships/${membershipId}/renew`)
  return data.data ?? data
}

export async function createMembershipPaymentOrder(plan_id) {
  const { data } = await api.post('/api/v1/memberships/payment-order', { plan_id })
  return data.data ?? data
}

export async function verifyMembershipPayment(payload) {
  const { data } = await api.post('/api/v1/memberships/verify-payment', payload)
  return data.data ?? data
}
