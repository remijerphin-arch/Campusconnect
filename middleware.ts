import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { canAccessPath } from '@/lib/auth/permissions';

/**
 * Next.js middleware that runs on every matched request.
 * It refreshes the Supabase auth session server-side and blocks
 * authenticated users from visiting routes their role isn't allowed to see.
 */
export async function middleware(request: NextRequest) {
  // Start with a pass-through response; Supabase may attach refreshed
  // session cookies to this object before we return it.
  const response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // If Supabase isn't configured (e.g. local/demo mode without env vars),
  // skip auth checks entirely and let the request through unchanged.
  if (!url || !publishableKey) return response;

  // Server-side Supabase client that reads/writes auth cookies directly on
  // the incoming request and outgoing response — this is what keeps the
  // session alive across page loads.
  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // Resolve the currently signed-in user, if any, from the refreshed session.
  const { data: authData } = await supabase.auth.getUser();
  const protectedPath = request.nextUrl.pathname;

  // Only run the role check for signed-in users hitting an actual app page
  // (skip the sign-in page, the forbidden page, and API routes).
  if (authData.user && protectedPath !== '/' && protectedPath !== '/forbidden' && !protectedPath.startsWith('/api')) {
    // Look up the user's role from their profile row, falling back to
    // auth metadata, and finally to 'student' if neither is set.
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', authData.user.id).single();
    const role = profile?.role ?? authData.user.user_metadata?.role ?? 'student';

    // Redirect to /forbidden if this role isn't permitted on the requested path.
    if (!canAccessPath(role, protectedPath)) {
      return NextResponse.redirect(new URL('/forbidden', request.url));
    }
  }
  return response;
}

// Run this middleware on every route except static assets and the favicon.
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
