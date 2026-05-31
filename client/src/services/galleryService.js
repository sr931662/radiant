import api from '../lib/api'

export async function getAlbums() {
  const { data } = await api.get('/api/v1/gallery/albums')
  return data.data ?? data
}

export async function getAlbum(albumId) {
  const { data } = await api.get(`/api/v1/gallery/albums/${albumId}`)
  return data.data ?? data
}
