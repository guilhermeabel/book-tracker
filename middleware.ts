import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const publicRoutes = ['/auth', '/auth/signin', '/auth/signup', '/', '/auth/update-password', '/auth/reset-password']

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()

  const supabase = createMiddlewareClient({ req: request, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  res.headers.set('x-middleware-session', session ? 'true' : 'false')
  if (session) {
    res.headers.set('x-middleware-user-id', session.user.id)
  }

  const hasAuthCode = request.nextUrl.searchParams.has('code');
  const isRecovery = request.nextUrl.searchParams.get('type') === 'recovery';
  const isPasswordReset = request.nextUrl.pathname === '/' && (hasAuthCode || isRecovery);

  if (isPasswordReset) {
    const redirectUrl = new URL('/auth/update-password', request.url);
    
    for (const [key, value] of request.nextUrl.searchParams.entries()) {
      redirectUrl.searchParams.set(key, value);
    }
    
    return NextResponse.redirect(redirectUrl);
  }
  
  const isVerificationCallback = request.nextUrl.pathname === '/' && request.nextUrl.searchParams.has('code');
  if (isVerificationCallback && !isRecovery) {
    return res;
  }

  if (!session && !publicRoutes.includes(request.nextUrl.pathname)) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth'
    return NextResponse.redirect(redirectUrl)
  }

  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', session.user.id)
      .single()

    if (!profile && !request.nextUrl.pathname.startsWith('/onboarding')) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }

    if (profile && request.nextUrl.pathname.startsWith('/onboarding')) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
} 
