import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Routes that don't require authentication
const publicRoutes = [
  '/auth',
  '/auth/signin',
  '/auth/signup',
  '/auth/verification-success',
  '/'
]

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Simple checking for verification redirect
  const { pathname, searchParams } = request.nextUrl
  const token = searchParams.get('token')
  const type = searchParams.get('type')

  // Handle email verification flow (signup)
  if (token && type === 'signup') {
    // Redirect to verification success page
    const redirectUrl = new URL('/auth/verification-success', request.url)
    
    // Preserve all query parameters
    for (const [key, value] of searchParams.entries()) {
      redirectUrl.searchParams.set(key, value)
    }
    
    return NextResponse.redirect(redirectUrl)
  }

  // Protect non-public routes
  if (!session && !publicRoutes.includes(pathname)) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth'
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
} 
