const BACKEND_URL = 'https://radianttrust-611643978472.asia-south2.run.app'

const STATIC_EXTENSIONS = [
  '.js', '.css', '.map', '.woff', '.woff2', '.ttf', '.eot',
  '.svg', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.webp',
]

function corsHeaders(origin) {
  const allowed = [
    'https://www.radiandeducation.org',
    'https://radiandeducation.org',
    'https://radiant-54m.pages.dev',
    'https://radiant.sr931662.workers.dev',
    'https://radianttrust.sr931662.workers.dev',
  ]
  const allowedOrigin = (allowed.includes(origin) || /https?:\/\/[\w-]+\.(pages\.dev|workers\.dev)/.test(origin))
    ? origin
    : allowed[0]
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const origin = request.headers.get('Origin') || ''

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) })
    }

    // Proxy all /api/* to Cloud Run
    if (url.pathname.startsWith('/api/')) {
      const target = `${BACKEND_URL}${url.pathname}${url.search}`

      // Strip browser-sent Origin/Host — this is now server-to-server
      const forwardHeaders = new Headers(request.headers)
      forwardHeaders.delete('origin')
      forwardHeaders.delete('host')

      const proxied = new Request(target, {
        method: request.method,
        headers: forwardHeaders,
        body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
        redirect: 'follow',
      })

      let response
      try {
        response = await fetch(proxied)
      } catch {
        return new Response(JSON.stringify({ success: false, message: 'Backend unreachable' }), {
          status: 502,
          headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
        })
      }

      // Rebuild response — inject CORS headers regardless of what Cloud Run returned
      const newHeaders = new Headers(response.headers)
      Object.entries(corsHeaders(origin)).forEach(([k, v]) => newHeaders.set(k, v))

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      })
    }

    // Static asset
    if (STATIC_EXTENSIONS.some((ext) => url.pathname.endsWith(ext))) {
      return env.ASSETS.fetch(request)
    }

    // SPA fallback — serve index.html for all non-API, non-static routes
    try {
      const response = await env.ASSETS.fetch(request)
      if (response.status === 404) {
        return env.ASSETS.fetch(new Request(new URL('/index.html', url).toString()))
      }
      return response
    } catch {
      return env.ASSETS.fetch(new Request(new URL('/index.html', url).toString()))
    }
  },
}
