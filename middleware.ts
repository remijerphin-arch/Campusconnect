import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { canAccessPath } from '@/lib/auth/permissions';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) return response;

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

  const { data: authData } = await supabase.auth.getUser();
  const protectedPath = request.nextUrl.pathname;
  if (authData.user && protectedPath !== '/' && protectedPath !== '/forbidden' && !protectedPath.startsWith('/api')) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', authData.user.id).single();
    const role = profile?.role ?? authData.user.user_metadata?.role ?? 'student';
    if (!canAccessPath(role, protectedPath)) {
      return NextResponse.redirect(new URL('/forbidden', request.url));
    }
  }
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
