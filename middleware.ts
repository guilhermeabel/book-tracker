import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Add debug headers
  res.headers.set('x-middleware-debug', 'true')
  res.headers.set('x-middleware-path', req.nextUrl.pathname)
  
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Add session debug header
  res.headers.set('x-middleware-session', session ? 'true' : 'false')
  if (session) {
    res.headers.set('x-middleware-user-id', session.user.id)
  }

  // If user is not signed in and the current path is not /auth/signin or /auth/signup
  // redirect the user to /auth/signin
  if (!session && !req.nextUrl.pathname.startsWith('/auth')) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/auth/signin'
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is signed in and the current path is /auth/signin or /auth/signup
  // redirect the user to /
  if (session && req.nextUrl.pathname.startsWith('/auth')) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/'
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 
