import api, { getApiBaseUrl } from '../lib/api'

export async function getDownloads() {
  const { data } = await api.get('/api/v1/downloads')
  return data.data ?? data
}

export function getDownloadUrl(itemId) {
  return `${getApiBaseUrl()}/api/v1/downloads/${itemId}`
}
