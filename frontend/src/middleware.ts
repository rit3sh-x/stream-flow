import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000']

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-electron-app-key',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400',
}

const isProtectedRoutes = createRouteMatcher(['/dashboard(.*)', '/pricing(.*)'])

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false
  return allowedOrigins.includes(origin)
}

function isInternalElectronApp(appKey: string | null): boolean {
  return appKey === process.env.INTERNAL_ELECTRON_APP_KEY && !!process.env.INTERNAL_ELECTRON_APP_KEY
}

function createCorsHeaders(origin: string | null, isAllowed: boolean): HeadersInit {
  const headers: HeadersInit = { ...corsOptions }

  if (isAllowed && origin) {
    headers['Access-Control-Allow-Origin'] = origin
  }

  return headers
}

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const origin = req.headers.get('origin')
  const appKey = req.headers.get('x-electron-app-key')

  const isAllowedOrigin = isOriginAllowed(origin)
  const isInternalApp = isInternalElectronApp(appKey)
  const shouldAllowCors = isAllowedOrigin || isInternalApp

  if (req.nextUrl.pathname.startsWith('/api/webhooks/')) {
    return NextResponse.next()
  }

  if (req.method === 'OPTIONS') {
    const headers = createCorsHeaders(origin, shouldAllowCors)
    return NextResponse.json({}, { headers })
  }

  if (isProtectedRoutes(req)) {
    try {
      auth.protect()
    } catch (error) {
      console.error('Authentication error:', error)
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
  }

  const response = NextResponse.next()

  if (shouldAllowCors) {
    const headers = createCorsHeaders(origin, true)
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
  }

  return response
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}