import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  
  // Add debug headers
  res.headers.set('x-middleware-debug', 'true')
  res.headers.set('x-middleware-path', request.nextUrl.pathname)
  
  const supabase = createMiddlewareClient({ req: request, res })

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
  if (!session && !request.nextUrl.pathname.startsWith('/auth')) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth/signin'
    redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is signed in
  if (session) {
    // Check if user has a profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', session.user.id)
      .single()

    // If no profile and not already on onboarding, redirect to onboarding
    if (!profile && !request.nextUrl.pathname.startsWith('/onboarding')) {
      return NextResponse.redirect(new URL('/onbording', request.url))
    }

    // If has profile and on onboarding, redirect to home
    if (profile && request.nextUrl.pathname.startsWith('/onboarding')) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
} 
