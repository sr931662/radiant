import api from '../lib/api'

export async function getPosts(page = 1, size = 10) {
  const { data } = await api.get('/api/v1/blog/posts', { params: { page, size } })
  return data.data ?? data
}

export async function getPostBySlug(slug) {
  const { data } = await api.get(`/api/v1/blog/posts/${slug}`)
  return data.data ?? data
}

export async function addComment(postId, content) {
  const { data } = await api.post(`/api/v1/blog/posts/${postId}/comments`, { content })
  return data.data ?? data
}
