import { createSupabaseServerClient } from '@/lib/supabase/server';
import { MOCK_ATTENDANCE, MOCK_CGPA_TREND, MOCK_DASHBOARD_STATS, MOCK_STUDENT_DETAILS } from '@/lib/mockData';
import { FACULTY_SUBJECTS } from '@/lib/facultyMockData';
import { ADMIN_COMPANIES, ADMIN_DRIVES, CANDIDATE_POOL } from '@/lib/placementAdminData';

export async function getStudentDashboardData() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { source: 'demo' as const, profile: MOCK_STUDENT_DETAILS, stats: MOCK_DASHBOARD_STATS, attendance: MOCK_ATTENDANCE, trend: MOCK_CGPA_TREND };
  }

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return null;
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', authData.user.id).single();
  const { data: attendance } = await supabase.from('attendance').select('*').eq('student_id', authData.user.id).order('attendance_date', { ascending: false });
  const { data: marks } = await supabase.from('marks').select('*').eq('student_id', authData.user.id);
  return { source: 'supabase' as const, profile, stats: { ...MOCK_DASHBOARD_STATS, attendancePct: attendance?.length ? Math.round(attendance.filter((item) => item.status === 'present').length / attendance.length * 100) : 0 }, attendance: attendance ?? [], marks: marks ?? [], trend: MOCK_CGPA_TREND };
}

export async function getFacultyWorkspaceData() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { source: 'demo' as const, subjects: FACULTY_SUBJECTS };
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return null;
  const { data: subjects } = await supabase.from('subjects').select('*');
  return { source: 'supabase' as const, subjects: subjects ?? [] };
}

export async function getPlacementWorkspaceData() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { source: 'demo' as const, companies: ADMIN_COMPANIES, drives: ADMIN_DRIVES, candidates: CANDIDATE_POOL };
  const { data: companies } = await supabase.from('companies').select('*').order('created_at', { ascending: false });
  const { data: drives } = await supabase.from('placement_drives').select('*, companies(*)');
  return { source: 'supabase' as const, companies: companies ?? [], drives: drives ?? [], candidates: [] };
}
