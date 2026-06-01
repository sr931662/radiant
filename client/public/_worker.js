const BACKEND_URL = 'https://radianttrust-611643978472.asia-south2.run.app'

// File extensions that should be served as-is
const staticExtensions = ['.js', '.css', '.map', '.woff', '.woff2', '.ttf', '.eot', '.svg', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.json', '.webp']

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    // Proxy API requests to backend
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

    // Check if path is a static asset
    const hasStaticExtension = staticExtensions.some(ext => url.pathname.endsWith(ext))
    
    if (hasStaticExtension) {
      return env.ASSETS.fetch(request)
    }

    // For SPA routing: non-API, non-static requests go to index.html
    // This allows React Router to handle all page routes
    try {
      const response = await env.ASSETS.fetch(request)
      
      // If file not found (404), serve index.html for SPA routing
      if (response.status === 404) {
        const indexRequest = new Request(new URL('/index.html', url).toString(), {
          method: 'GET',
        })
        return env.ASSETS.fetch(indexRequest)
      }
      
      return response
    } catch (error) {
      // Fallback to index.html on error
      const indexRequest = new Request(new URL('/index.html', url).toString(), {
        method: 'GET',
      })
      return env.ASSETS.fetch(indexRequest)
    }
  },
}
