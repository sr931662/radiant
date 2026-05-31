const BACKEND_URL = 'https://radianttrust-611643978472.asia-south2.run.app'

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    if (url.pathname.startsWith('/api/')) {
      const target = `${BACKEND_URL}${url.pathname}${url.search}`
      const proxied = new Request(target, {
        method: request.method,
        headers: request.headers,
        body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
        redirect: 'follow',
      })
      return fetch(proxied)
    }

    return env.ASSETS.fetch(request)
  },
}
