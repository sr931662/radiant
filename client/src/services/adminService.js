import api from '../lib/api'

// ── Dashboard ──
export async function getDashboardStats() {
  const { data } = await api.get('/api/v1/admin/dashboard/stats')
  return data.data ?? data
}

export async function getRecentActivity() {
  const { data } = await api.get('/api/v1/admin/dashboard/activity')
  return data.data ?? data
}

// ── Users ──
export async function getUsers(page = 1, size = 20, role = '') {
  const { data } = await api.get('/api/v1/admin/users', { params: { page, size, role: role || undefined } })
  return data.data ?? data
}

export async function getUser(userId) {
  const { data } = await api.get(`/api/v1/admin/users/${userId}`)
  return data.data ?? data
}

export async function updateUser(userId, payload) {
  const { data } = await api.patch(`/api/v1/admin/users/${userId}`, payload)
  return data.data ?? data
}

export async function banUser(userId, ban) {
  const { data } = await api.patch(`/api/v1/admin/users/${userId}/ban`, { ban })
  return data
}

export async function changeUserRoles(userId, role_names) {
  const { data } = await api.patch(`/api/v1/admin/users/${userId}/roles`, { user_id: userId, role_names })
  return data
}

// ── Admissions ──
export async function getAdmissions(page = 1, size = 20, status = '') {
  const { data } = await api.get('/api/v1/admin/admissions', { params: { page, size, status: status || undefined } })
  return data.data ?? data
}

export async function getAdmission(id) {
  const { data } = await api.get(`/api/v1/admin/admissions/${id}`)
  return data.data ?? data
}

export async function updateAdmissionStatus(id, status, remarks = '') {
  const { data } = await api.patch(`/api/v1/admin/admissions/${id}/status`, { status, remarks })
  return data.data ?? data
}

// ── Donations ──
export async function getAdminDonations(page = 1, size = 20, status = '') {
  const { data } = await api.get('/api/v1/admin/donations', { params: { page, size, status: status || undefined } })
  return data.data ?? data
}

export async function getDonationStats() {
  const { data } = await api.get('/api/v1/admin/donations/stats')
  return data.data ?? data
}

export async function exportDonations() {
  const { data } = await api.get('/api/v1/admin/donations/export')
  return data.data ?? data
}

// ── Blog ──
export async function getAdminPosts(page = 1, size = 20) {
  const { data } = await api.get('/api/v1/admin/blog/posts', { params: { page, size } })
  return data.data ?? data
}

export async function createPost(payload) {
  const { data } = await api.post('/api/v1/admin/blog/posts', payload)
  return data.data ?? data
}

export async function updatePost(postId, payload) {
  const { data } = await api.put(`/api/v1/admin/blog/posts/${postId}`, payload)
  return data.data ?? data
}

export async function deletePost(postId) {
  const { data } = await api.delete(`/api/v1/admin/blog/posts/${postId}`)
  return data
}

export async function getAdminComments(page = 1, size = 20) {
  const { data } = await api.get('/api/v1/admin/blog/comments', { params: { page, size } })
  return data.data ?? data
}

export async function moderateComment(commentId, status) {
  const { data } = await api.patch(`/api/v1/admin/blog/comments/${commentId}`, null, { params: { status } })
  return data
}

// ── Courses ──
export async function getAdminCourses(page = 1, size = 20) {
  const { data } = await api.get('/api/v1/admin/courses', { params: { page, size } })
  return data.data ?? data
}

export async function createCourse(payload) {
  const { data } = await api.post('/api/v1/admin/courses', payload)
  return data.data ?? data
}

export async function updateCourse(courseId, payload) {
  const { data } = await api.put(`/api/v1/admin/courses/${courseId}`, payload)
  return data.data ?? data
}

export async function deleteCourse(courseId) {
  const { data } = await api.delete(`/api/v1/admin/courses/${courseId}`)
  return data
}

export async function createModule(courseId, payload) {
  const { data } = await api.post(`/api/v1/admin/courses/${courseId}/modules`, payload)
  return data.data ?? data
}

export async function createLesson(moduleId, payload) {
  const { data } = await api.post(`/api/v1/admin/courses/modules/${moduleId}/lessons`, payload)
  return data.data ?? data
}

export async function getAllEnrollments(page = 1, size = 20) {
  const { data } = await api.get('/api/v1/admin/courses/enrollments', { params: { page, size } })
  return data.data ?? data
}

// ── Gallery ──
export async function getAdminAlbums() {
  const { data } = await api.get('/api/v1/admin/gallery/albums')
  return data.data ?? data
}

export async function createAlbum(payload) {
  const { data } = await api.post('/api/v1/admin/gallery/albums', payload)
  return data.data ?? data
}

export async function updateAlbum(albumId, payload) {
  const { data } = await api.put(`/api/v1/admin/gallery/albums/${albumId}`, payload)
  return data.data ?? data
}

export async function deleteAlbum(albumId) {
  const { data } = await api.delete(`/api/v1/admin/gallery/albums/${albumId}`)
  return data
}

export async function uploadMedia(formData) {
  const { data } = await api.post('/api/v1/admin/gallery/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data ?? data
}

export async function deleteMedia(mediaId) {
  const { data } = await api.delete(`/api/v1/admin/gallery/media/${mediaId}`)
  return data
}

// ── Volunteers ──
export async function getAdminVolunteers(page = 1, size = 20) {
  const { data } = await api.get('/api/v1/admin/volunteers', { params: { page, size } })
  return data.data ?? data
}

export async function updateApplicationStatus(applicationId, type, status, remarks = '') {
  const { data } = await api.patch(`/api/v1/admin/volunteers/${applicationId}/${type}`, { status, remarks })
  return data
}

// ── Memberships ──
export async function getAdminMemberships(page = 1, size = 20, status = '') {
  const { data } = await api.get('/api/v1/admin/memberships', { params: { page, size, status: status || undefined } })
  return data.data ?? data
}

export async function approveMembership(membershipId, status, remarks = '') {
  const { data } = await api.patch(`/api/v1/admin/memberships/${membershipId}/approve`, { status, remarks })
  return data.data ?? data
}

export async function exportMemberships() {
  const { data } = await api.get('/api/v1/admin/memberships/export')
  return data.data ?? data
}

// ── FDP ──
export async function getAdminFdps(page = 1, size = 20) {
  const { data } = await api.get('/api/v1/admin/fdp', { params: { page, size } })
  return data.data ?? data
}

export async function createFdp(payload) {
  const { data } = await api.post('/api/v1/admin/fdp', payload)
  return data.data ?? data
}

export async function updateFdp(fdpId, payload) {
  const { data } = await api.put(`/api/v1/admin/fdp/${fdpId}`, payload)
  return data.data ?? data
}

export async function deleteFdp(fdpId) {
  const { data } = await api.delete(`/api/v1/admin/fdp/${fdpId}`)
  return data
}

export async function getFdpRegistrations(fdpId) {
  const { data } = await api.get(`/api/v1/admin/fdp/${fdpId}/registrations`)
  return data.data ?? data
}

export async function updateFdpRegistrationStatus(fdpId, registrationId, status) {
  const { data } = await api.patch(
    `/api/v1/admin/fdp/${fdpId}/registrations/${registrationId}`,
    null,
    { params: { status } }
  )
  return data.data ?? data
}

export async function markAttendance(fdpId, records) {
  const { data } = await api.post(`/api/v1/admin/fdp/${fdpId}/attendance`, records)
  return data
}

export async function generateFdpCertificates(fdpId) {
  const { data } = await api.post(`/api/v1/admin/fdp/${fdpId}/generate-certificates`)
  return data
}

// ── Contacts ──
export async function getAdminContacts(page = 1, size = 20) {
  const { data } = await api.get('/api/v1/admin/contacts', { params: { page, size } })
  return data.data ?? data
}

export async function replyToInquiry(inquiryId, reply) {
  const { data } = await api.patch(`/api/v1/admin/contacts/${inquiryId}/reply`, { reply })
  return data
}

// ── Downloads ──
export async function getAdminDownloads() {
  const { data } = await api.get('/api/v1/admin/downloads')
  return data.data ?? data
}

export async function createDownload(payload) {
  const { data } = await api.post('/api/v1/admin/downloads', payload)
  return data.data ?? data
}

export async function deleteDownload(itemId) {
  const { data } = await api.delete(`/api/v1/admin/downloads/${itemId}`)
  return data
}

// ── Certificates ──
export async function generateCertificate(payload) {
  const { data } = await api.post('/api/v1/admin/certificates/generate', payload)
  return data.data ?? data
}
