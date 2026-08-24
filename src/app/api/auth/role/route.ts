import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { UserRole } from '@/types';

export async function GET() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ role: null });

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return NextResponse.json({ role: null }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', authData.user.id)
    .single();
  const role = (profile?.role ?? authData.user.user_metadata?.role ?? 'student') as UserRole;
  return NextResponse.json({ role });
}
