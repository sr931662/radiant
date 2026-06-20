import api, { getApiBaseUrl } from '../lib/api'

export async function getDownloads() {
  const { data } = await api.get('/api/v1/downloads')
  return data.data ?? data
}

export function getDownloadUrl(itemId) {
  return `${getApiBaseUrl()}/api/v1/downloads/${itemId}`
}

export async function downloadItem(itemId, filename = 'download') {
  const response = await api.get(`/api/v1/downloads/${itemId}`, {
    responseType: 'blob',
  })

  const blobUrl = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = blobUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(blobUrl)
}
