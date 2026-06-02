import api from '../lib/api'

export async function getCourses(page = 1, size = 12) {
  const { data } = await api.get('/api/v1/courses', { params: { page, size } })
  return data.data ?? data
}

export async function getCourse(courseId) {
  const { data } = await api.get(`/api/v1/courses/${courseId}`)
  return data.data ?? data
}

export async function enrollCourse(courseId) {
  const { data } = await api.post(`/api/v1/courses/${courseId}/enroll`)
  return data.data ?? data
}

export async function getMyCourses() {
  const { data } = await api.get('/api/v1/courses/my-courses')
  return data.data ?? data
}

export async function getLessons(courseId) {
  const { data } = await api.get(`/api/v1/courses/${courseId}/lessons`)
  return data.data ?? data
}

export async function createCoursePaymentOrder(courseId) {
  const { data } = await api.post(`/api/v1/courses/${courseId}/create-payment-order`)
  return data.data ?? data
}

export async function verifyCoursePayment(courseId, payload) {
  const { data } = await api.post(`/api/v1/courses/${courseId}/verify-payment`, payload)
  return data.data ?? data
}
