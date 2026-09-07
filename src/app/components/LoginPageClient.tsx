'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  BookOpen,
  Briefcase,
  Check,
  ChevronRight,
  Eye,
  EyeOff,
  GraduationCap,
  HelpCircle,
  LockKeyhole,
  Shield,
  Users,
  UserRound,
} from 'lucide-react';
import { DEMO_CREDENTIALS } from '@/lib/mockData';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { UserRole } from '@/types';
import AppLogo from '@/components/ui/AppLogo';
import ThemeToggle from '@/components/ThemeToggle';
import { readAdminSettings, readImportedUsers, readProfileImages } from '@/lib/demoStore';
import { isRoleAccessEnabled } from '@/lib/adminAccess';
import { AUTHORITATIVE_STUDENT_ROSTER, searchAuthoritativeStudents } from '@/lib/authoritative-student-roster';
import { getDemoStudentCredentialList } from '@/lib/studentDemoData';

interface LoginFormData {
  email: string;
  password: string;
}

const roleDescriptions: Record<UserRole, string> = {
  student: 'Track academics, attendance, placements, lost-and-found, and shared resources.',
  faculty: 'Manage subjects, attendance sync, and internal marks.',
  placement_admin: 'Coordinate drives, eligibility, and candidate movement.',
  campus_admin: 'Oversee cloud operations and campus-wide services.',
};

const roleIcons = {
  student: GraduationCap,
  faculty: BookOpen,
  placement_admin: Briefcase,
  campus_admin: Shield,
};

const staffAutofillRoles: Array<{
  role: Extract<UserRole, 'faculty' | 'placement_admin' | 'campus_admin'>;
  label: string;
  panelClass: string;
  iconClass: string;
}> = [
  { role: 'faculty', label: 'Faculty', panelClass: 'border-blue-500/30 hover:border-blue-500/60', iconClass: 'bg-blue-500/15 text-blue-600' },
  { role: 'placement_admin', label: 'Placement', panelClass: 'border-purple-500/30 hover:border-purple-500/60', iconClass: 'bg-purple-500/15 text-purple-600' },
  { role: 'campus_admin', label: 'Admin', panelClass: 'border-red-500/30 hover:border-red-500/60', iconClass: 'bg-red-500/15 text-red-600' },
];

export default function LoginPageClient() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [authAnimation, setAuthAnimation] = useState<'idle' | 'success'>('idle');
  const [authenticatedUser, setAuthenticatedUser] = useState<{ name: string; profileImage?: string } | null>(null);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [recentlyAutofilledRole, setRecentlyAutofilledRole] = useState<UserRole | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberRole, setRememberRole] = useState(false);
  const [recentStudentEmails, setRecentStudentEmails] = useState<string[]>([]);
  const studentSearchRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>();

  useEffect(() => {
    const storedRole = window.localStorage.getItem('campusconnect-demo-role') as UserRole | null;
    if (storedRole === 'campus_admin') {
      router.push('/campus-admin');
      return;
    }
    if (storedRole === 'student') {
      router.push('/student-dashboard');
      return;
    }
    if (storedRole === 'faculty') {
      router.push('/faculty-dashboard');
      return;
    }
    if (storedRole === 'placement_admin') {
      router.push('/placement-admin');
      return;
    }
    const rememberedRole = window.localStorage.getItem('campusconnect-last-role') as UserRole | null;
    let rememberedStudents: string[] = [];
    try {
      const storedStudents = JSON.parse(window.localStorage.getItem('campusconnect-recent-students') ?? '[]');
      rememberedStudents = Array.isArray(storedStudents) ? storedStudents.filter((email): email is string => typeof email === 'string') : [];
    } catch {
      rememberedStudents = [];
    }
    if (rememberedRole && Object.keys(roleDescriptions).includes(rememberedRole)) setSelectedRole(rememberedRole);
    setRememberRole(Boolean(rememberedRole));
    setRecentStudentEmails(rememberedStudents.filter((email) => AUTHORITATIVE_STUDENT_ROSTER.some((student) => student.email === email)).slice(0, 4));
    setMaintenanceMode(readAdminSettings()?.maintenanceMode ?? false);
  }, [router]);

  useEffect(() => {
    const handleLoginShortcut = (event: KeyboardEvent) => {
      if (event.key === '/' && event.target instanceof HTMLElement && !['INPUT', 'TEXTAREA'].includes(event.target.tagName)) {
        event.preventDefault();
        studentSearchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleLoginShortcut);
    return () => window.removeEventListener('keydown', handleLoginShortcut);
  }, []);

  const completeLogin = (role: UserRole, message: string, name: string, email: string, profileImage?: string) => {
    window.localStorage.setItem('campusconnect-demo-role', role);
    window.localStorage.setItem('campusconnect-demo-email', email.toLowerCase());
    toast.success(message);
    setAuthenticatedUser({ name, profileImage });
    window.setTimeout(() => setAuthAnimation('success'), 350);

    window.setTimeout(() => {
      router.push(
        role === 'student'
          ? '/student-dashboard'
          : role === 'faculty'
            ? '/faculty-dashboard'
            : role === 'placement_admin'
              ? '/placement-admin'
                : '/campus-admin'
      );
    }, 2050);
  };

  const applyDemoCredential = (role: UserRole, email: string, password: string) => {
    setSelectedRole(role);
    if (rememberRole) window.localStorage.setItem('campusconnect-last-role', role);
    setValue('email', email);
    setValue('password', password);
    setRecentlyAutofilledRole(role);
    window.setTimeout(() => {
      setRecentlyAutofilledRole((currentRole) => (currentRole === role ? null : currentRole));
    }, 1200);
  };

  const selectRole = (role: UserRole) => {
    setSelectedRole(role);
    if (rememberRole) window.localStorage.setItem('campusconnect-last-role', role);
  };

  const applyStudentCredential = (email: string, password: string, name?: string) => {
    applyDemoCredential('student', email, password);
    const nextRecentStudents = [email, ...recentStudentEmails.filter((recentEmail) => recentEmail !== email)].slice(0, 4);
    setRecentStudentEmails(nextRecentStudents);
    window.localStorage.setItem('campusconnect-recent-students', JSON.stringify(nextRecentStudents));
    if (name) setStudentSearch(name);
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    const adminSettings = readAdminSettings();
    const allCredentials = [...DEMO_CREDENTIALS, ...getDemoStudentCredentialList(), ...readImportedUsers()];
    const matched = allCredentials.find(
      (credential) => credential.email.toLowerCase() === data.email.trim().toLowerCase() && credential.password === data.password
    );

    if (matched) {
      if (adminSettings?.maintenanceMode && matched.roleKey !== 'campus_admin') {
        setError('email', { message: 'CampusConnect is currently under maintenance. Please try again later.' });
        setIsLoading(false);
        return;
      }
      if (!isRoleAccessEnabled(matched.roleKey, adminSettings)) {
        setError('email', {
          message: `${matched.roleKey === 'student' ? 'Student' : matched.roleKey === 'faculty' ? 'Faculty' : matched.roleKey === 'placement_admin' ? 'Placement' : 'Campus'} access is disabled by the admin.`,
        });
        setIsLoading(false);
        return;
      }

      completeLogin(matched.roleKey, `Welcome, ${matched.name}`, matched.name, matched.email, readProfileImages()[matched.email.toLowerCase()]);
      return;
    }

    const supabase = createSupabaseBrowserClient();

    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (!error) {
        const roleResponse = await fetch('/api/auth/role');
        const roleData = (await roleResponse.json()) as { role?: UserRole };
        const role = roleData.role ?? 'student';
        const adminSettings = readAdminSettings();

        if (adminSettings?.maintenanceMode && role !== 'campus_admin') {
          setError('email', { message: 'CampusConnect is currently under maintenance. Please try again later.' });
          setIsLoading(false);
          return;
        }

        if (!isRoleAccessEnabled(role, adminSettings)) {
          setError('email', {
            message: 'This role is currently disabled by the campus admin.',
          });
          setIsLoading(false);
          return;
        }

        completeLogin(role, 'Welcome back to CampusConnect', data.email.split('@')[0], data.email);
        return;
      }

      setError('email', { message: error.message });
      setIsLoading(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    setError('email', { message: 'Use a valid Supabase account or a demo credential below.' });
    setIsLoading(false);
  };

  return (
    <div className="campus-login relative flex min-h-screen items-center justify-center overflow-hidden">
      <section className="campus-login-showcase hidden">
        <div className="login-glow absolute -left-24 -top-24 h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />
        <div className="login-glow login-glow-delay absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.35),transparent_28%),radial-gradient(circle_at_75%_25%,rgba(14,165,233,0.22),transparent_24%)]" />
        <div className="relative z-10 flex h-full flex-col">
          <div className="login-enter flex items-center gap-3">
            <AppLogo size={42} />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-200">
                Your digital campus
              </p>
              <h1 className="text-2xl font-bold">CampusConnect</h1>
            </div>
          </div>

          <div className="my-auto max-w-xl py-16">
            <span className="login-enter login-delay-1 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
              <Users size={14} />
              Your campus life, in sync
            </span>
            <h2 className="login-enter login-delay-2 mt-6 max-w-lg text-5xl font-bold leading-[0.98] tracking-[-0.06em] sm:text-6xl">
              Academics, campus life.<br /><span className="text-rose-300">One connected place.</span>
            </h2>
            <p className="login-enter login-delay-3 mt-6 max-w-md text-base leading-7 text-white/70">
              Keep up with classes, attendance, opportunities, and campus services from one space designed for your day.
            </p>
            <div className="campus-login-phone-stage relative mt-10 hidden min-h-64 sm:block" aria-label="Campus platform preview">
              <div className="campus-login-phone-campus">
                <span className="campus-login-phone-time">9:41 AM</span>
                <p>Welcome back</p><strong>Campus life,<br />in sync.</strong>
                <small>See what&apos;s happening today.</small>
                <div className="campus-login-phone-banner"><b>75%</b><span>Attendance<br />on track</span></div>
                <div className="campus-login-phone-icons"><i /><i /><i /><i /></div>
              </div>
              <div className="login-preview-card login-preview-one">
                <span>Academic pulse</span>
                <strong>84%</strong>
                <small>Attendance this term</small>
              </div>
              <div className="login-preview-card login-preview-two">
                <span>Opportunity board</span>
                <strong>12 roles</strong>
                <small>3 tailored matches</small>
              </div>
              <div className="login-preview-card login-preview-three">
                <span>Campus feed</span>
                <strong>Live</strong>
                <small>New updates waiting</small>
              </div>
            </div>
            <div className="mt-10 grid gap-4 max-sm:hidden sm:grid-cols-3">
              {[
                ['Smart academics', 'Attendance and coursework, clearly organized'],
                ['Career-ready', 'Discover and track your best-fit opportunities'],
                ['Campus community', 'Updates, resources and student services'],
              ].map(([title, text]) => (
                <div key={title} className="login-enter login-delay-4 rounded-[1.5rem] border border-white/15 bg-white/10 p-4 transition duration-300 hover:-translate-y-1 hover:bg-white/15">
                  <p className="font-semibold">{title}</p>
                  <p className="mt-2 text-sm text-white/70">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="campus-login-panel relative flex min-h-screen w-full items-center justify-center px-6 py-10 sm:px-10">
        <Link href="/" className="absolute left-6 top-6 z-20 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-primary sm:left-10">
          <ChevronRight size={16} className="rotate-180" /> Back to CampusConnect
        </Link>
        <div className="absolute right-6 top-6 z-20">
          <ThemeToggle />
        </div>
        <div className="login-form-enter mx-auto w-full max-w-xl rounded-[2rem] border bg-card p-8 shadow-card">
          <div className="mb-7 flex items-center justify-between lg:hidden"><AppLogo size={36} /><span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">CampusConnect</span></div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">CampusConnect access</p>
          <h3 className="login-form-title mt-2 text-3xl font-bold tracking-[-0.04em]">Welcome back to campus.</h3>
          <p className="login-form-copy mt-2 text-sm text-muted-foreground">
            Sign in to manage your academics, campus services, and career journey.
          </p>
          {maintenanceMode && <div className="mt-4 rounded-2xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm font-semibold text-warning">CampusConnect is under maintenance. Campus Admin access remains available.</div>}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {(Object.keys(roleDescriptions) as UserRole[]).map((role) => {
              const Icon = roleIcons[role];
              const active = selectedRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => selectRole(role)}
                  aria-pressed={active}
                  style={{ animationDelay: `${180 + (Object.keys(roleDescriptions) as UserRole[]).indexOf(role) * 70}ms` }}
                  className={`login-role-card rounded-[1.25rem] border p-4 text-left ${
                    active ? 'login-role-card-active border-primary bg-primary/10 shadow-lg shadow-primary/10' : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    <Icon size={16} />
                    {role.replace('_', ' ')}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{roleDescriptions[role]}</p>
                </button>
              );
            })}
          </div>

          <div className="login-quick-autofill mt-5 rounded-[1.5rem] border bg-muted/40 p-4">
            <div className="flex items-center gap-2">
              <LockKeyhole size={16} className="text-primary" />
              <div>
                <p className="text-sm font-bold">Quick demo autofill</p>
                <p className="text-xs text-muted-foreground">Choose an account to fill in its login details.</p>
              </div>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {staffAutofillRoles.map(({ role, label, panelClass, iconClass }) => {
                const credential = DEMO_CREDENTIALS.find((item) => item.roleKey === role);
                const Icon = roleIcons[role];

                if (!credential) return null;

                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => applyDemoCredential(role, credential.email, credential.password)}
                    aria-label={`Autofill ${label} demo login`}
                    className={`login-quick-autofill-card flex items-center gap-3 rounded-xl border bg-card px-3 py-3 text-left ${recentlyAutofilledRole === role ? 'login-quick-autofill-card-selected' : ''} ${panelClass}`}
                  >
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>
                      <Icon size={16} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{label}</span>
                      <span className="block truncate text-xs text-muted-foreground">Autofill login</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <label className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={rememberRole}
                onChange={(event) => {
                  const next = event.target.checked;
                  setRememberRole(next);
                  if (next) window.localStorage.setItem('campusconnect-last-role', selectedRole);
                  else window.localStorage.removeItem('campusconnect-last-role');
                }}
                className="h-4 w-4 accent-primary"
              />
              Remember my role on this device
            </label>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Email</label>
              <input
                {...register('email', { required: 'Email is required' })}
                className={`login-input w-full rounded-2xl border bg-background px-4 py-3 outline-none ring-0 ${recentlyAutofilledRole ? 'login-input-autofilled' : ''}`}
                placeholder="student@campusconnect.edu"
              />
              <p className="mt-1 text-xs text-danger">{errors.email?.message}</p>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium" htmlFor="login-password">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={passwordVisible ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required' })}
                  className={`login-input w-full rounded-2xl border bg-background px-4 py-3 pr-12 outline-none ring-0 ${recentlyAutofilledRole ? 'login-input-autofilled' : ''}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible((visible) => !visible)}
                  title={passwordVisible ? 'Hide password' : 'Show password'}
                  aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted-foreground transition hover:text-foreground"
                >
                  {passwordVisible ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              <p className="mt-1 text-xs text-danger">{errors.password?.message}</p>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="login-submit inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 font-semibold text-primary-foreground"
            >
              {isLoading ? <span className="login-spinner h-4 w-4 rounded-full border-2 border-current border-r-transparent" /> : null}
              {isLoading ? 'Signing in...' : 'Enter CampusConnect'}
              <ChevronRight size={18} />
            </button>
            <p className={`login-autofill-feedback ${recentlyAutofilledRole ? 'login-autofill-feedback-visible' : ''}`} aria-live="polite">
              {recentlyAutofilledRole ? `${recentlyAutofilledRole === 'student' ? 'Student' : recentlyAutofilledRole === 'campus_admin' ? 'Admin' : recentlyAutofilledRole === 'placement_admin' ? 'Placement' : 'Faculty'} demo login is ready.` : '\u00a0'}
            </p>
            <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
              <span>Demo environment · No real credentials required</span>
              <a href="mailto:support@campusconnect.edu" className="inline-flex shrink-0 items-center gap-1 font-semibold text-primary hover:underline">
                <HelpCircle size={14} /> Need help?
              </a>
            </div>
          </form>

          {/* STUDENT AUTOFILL SECTION */}
          {selectedRole === 'student' && (
           <div className="animate-in fade-in slide-in-from-bottom-2 mt-8 rounded-[1.5rem] bg-gradient-to-br from-primary/10 via-muted to-muted p-4 transition-all duration-300">
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                   <GraduationCap size={16} className="text-primary" />
                 </div>
                 <p className="text-sm font-bold">Student Demo Accounts</p>
               </div>
               <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">57 Students</span>
             </div>
             <div className="mt-3 space-y-2">
               <input
                 ref={studentSearchRef}
                 value={studentSearch}
                 onChange={(event) => setStudentSearch(event.target.value)}
                 onKeyDown={(event) => {
                   if (event.key !== 'Enter') return;
                   event.preventDefault();
                   const firstStudent = searchAuthoritativeStudents(studentSearch)[0];
                   if (firstStudent) applyStudentCredential(firstStudent.email, firstStudent.password, firstStudent.fullName);
                 }}
                 placeholder="Search by name, register #, or email (press / to focus)"
                 className="w-full rounded-xl border border-primary/20 bg-background/80 px-3 py-2 text-sm outline-none transition-all duration-200 placeholder:text-muted-foreground focus:border-primary/50 focus:bg-background focus:ring-2 focus:ring-primary/20"
               />
               {recentStudentEmails.length > 0 && !studentSearch && (
                 <div className="flex flex-wrap gap-2">
                   {recentStudentEmails.map((email) => {
                     const recentStudent = AUTHORITATIVE_STUDENT_ROSTER.find((student) => student.email === email);
                     if (!recentStudent) return null;
                     return (
                       <button
                         key={email}
                         type="button"
                         onClick={() => applyStudentCredential(recentStudent.email, recentStudent.password, recentStudent.fullName)}
                         className="rounded-full border border-primary/20 bg-background px-3 py-1 text-xs font-semibold text-primary transition hover:border-primary/50 hover:bg-primary/10"
                       >
                         Recent: {recentStudent.registerNumber}
                       </button>
                     );
                   })}
                 </div>
               )}
               <div className="max-h-80 space-y-2 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                 {searchAuthoritativeStudents(studentSearch).length > 0 ? (
                   searchAuthoritativeStudents(studentSearch).map((student, idx) => (
                     <button
                       key={student.email}
                       type="button"
                       onClick={() => {
                         applyStudentCredential(student.email, student.password, student.fullName);
                       }}
                       className="animate-in fade-in slide-in-from-left-2 group flex w-full items-center justify-between gap-3 rounded-xl border border-border/50 bg-card/60 px-3 py-2 text-left transition-all duration-200 hover:border-primary/50 hover:bg-card hover:shadow-md hover:shadow-primary/10"
                       style={{
                         animationDelay: `${idx * 20}ms`,
                         animationFillMode: 'both',
                       }}
                     >
                       <div className="flex-1">
                         <p className="font-medium text-sm leading-tight">{student.fullName}</p>
                         <p className="text-xs text-muted-foreground">{student.registerNumber} · {student.email}</p>
                       </div>
                       <div className="flex items-center gap-2">
                         <ChevronRight size={14} className="text-primary/50 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                       </div>
                     </button>
                   ))
                 ) : (
                   <div className="animate-in fade-in rounded-xl border border-dashed border-primary/20 bg-card/30 px-4 py-6 text-center">
                     <p className="text-sm text-muted-foreground">No students found matching &quot;{studentSearch}&quot;</p>
                   </div>
                 )}
               </div>
             </div>
           </div>
          )}

          {/* FACULTY AUTOFILL SECTION */}
          {selectedRole === 'faculty' && (
           <div className="animate-in fade-in slide-in-from-bottom-2 mt-8 rounded-[1.5rem] bg-gradient-to-br from-blue-500/10 via-muted to-muted p-4 transition-all duration-300">
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
                   <BookOpen size={16} className="text-blue-600" />
                 </div>
                 <p className="text-sm font-bold">Faculty Demo Accounts</p>
               </div>
             </div>
             <div className="mt-3 space-y-2">
               {DEMO_CREDENTIALS.filter(c => c.roleKey === 'faculty').map((credential, idx) => (
                 <button
                   key={credential.email}
                   type="button"
                   onClick={() => applyDemoCredential('faculty', credential.email, credential.password)}
                   className="animate-in fade-in slide-in-from-left-2 group flex w-full items-center justify-between gap-3 rounded-xl border border-border/50 bg-card/60 px-4 py-3 text-left transition-all duration-200 hover:border-blue-500/50 hover:bg-card hover:shadow-md hover:shadow-blue-500/10 hover:-translate-y-1"
                   style={{
                     animationDelay: `${idx * 50}ms`,
                     animationFillMode: 'both',
                   }}
                 >
                   <div className="flex-1">
                     <p className="font-medium text-sm">{credential.name}</p>
                     <p className="text-xs text-muted-foreground">{credential.email}</p>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">Autofill</span>
                     <ChevronRight size={14} className="text-blue-600/50 transition-transform group-hover:translate-x-1 group-hover:text-blue-600" />
                   </div>
                 </button>
               ))}
             </div>
           </div>
          )}

          {/* PLACEMENT ADMIN AUTOFILL SECTION */}
          {selectedRole === 'placement_admin' && (
           <div className="animate-in fade-in slide-in-from-bottom-2 mt-8 rounded-[1.5rem] bg-gradient-to-br from-purple-500/10 via-muted to-muted p-4 transition-all duration-300">
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20">
                   <Briefcase size={16} className="text-purple-600" />
                 </div>
                 <p className="text-sm font-bold">Placement Cell Demo Accounts</p>
               </div>
             </div>
             <div className="mt-3 space-y-2">
               {DEMO_CREDENTIALS.filter(c => c.roleKey === 'placement_admin').map((credential, idx) => (
                 <button
                   key={credential.email}
                   type="button"
                   onClick={() => applyDemoCredential('placement_admin', credential.email, credential.password)}
                   className="animate-in fade-in slide-in-from-left-2 group flex w-full items-center justify-between gap-3 rounded-xl border border-border/50 bg-card/60 px-4 py-3 text-left transition-all duration-200 hover:border-purple-500/50 hover:bg-card hover:shadow-md hover:shadow-purple-500/10 hover:-translate-y-1"
                   style={{
                     animationDelay: `${idx * 50}ms`,
                     animationFillMode: 'both',
                   }}
                 >
                   <div className="flex-1">
                     <p className="font-medium text-sm">{credential.name}</p>
                     <p className="text-xs text-muted-foreground">{credential.email}</p>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="text-xs font-semibold uppercase tracking-wide text-purple-600">Autofill</span>
                     <ChevronRight size={14} className="text-purple-600/50 transition-transform group-hover:translate-x-1 group-hover:text-purple-600" />
                   </div>
                 </button>
               ))}
             </div>
           </div>
          )}

          {/* CAMPUS ADMIN AUTOFILL SECTION */}
          {selectedRole === 'campus_admin' && (
           <div className="animate-in fade-in slide-in-from-bottom-2 mt-8 rounded-[1.5rem] bg-gradient-to-br from-red-500/10 via-muted to-muted p-4 transition-all duration-300">
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/20">
                   <Shield size={16} className="text-red-600" />
                 </div>
                 <p className="text-sm font-bold">Campus Admin Demo Accounts</p>
               </div>
             </div>
             <div className="mt-3 space-y-2">
               {DEMO_CREDENTIALS.filter(c => c.roleKey === 'campus_admin').map((credential, idx) => (
                 <button
                   key={credential.email}
                   type="button"
                   onClick={() => applyDemoCredential('campus_admin', credential.email, credential.password)}
                   className="animate-in fade-in slide-in-from-left-2 group flex w-full items-center justify-between gap-3 rounded-xl border border-border/50 bg-card/60 px-4 py-3 text-left transition-all duration-200 hover:border-red-500/50 hover:bg-card hover:shadow-md hover:shadow-red-500/10 hover:-translate-y-1"
                   style={{
                     animationDelay: `${idx * 50}ms`,
                     animationFillMode: 'both',
                   }}
                 >
                   <div className="flex-1">
                     <p className="font-medium text-sm">{credential.name}</p>
                     <p className="text-xs text-muted-foreground">{credential.email}</p>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="text-xs font-semibold uppercase tracking-wide text-red-600">Autofill</span>
                     <ChevronRight size={14} className="text-red-600/50 transition-transform group-hover:translate-x-1 group-hover:text-red-600" />
                   </div>
                 </button>
               ))}
             </div>
           </div>
          )}
        </div>
      </section>

      {authAnimation === 'success' ? (
        <div className="login-auth-overlay" role="status" aria-live="polite">
          <div className="login-auth-rings" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="login-auth-icon">
            <div className="login-auth-profile">
              {authenticatedUser?.profileImage ? (
                <div
                  className="login-auth-avatar"
                  style={{ backgroundImage: `url(${authenticatedUser.profileImage})` }}
                  aria-label={`${authenticatedUser.name} profile picture`}
                />
              ) : (
                <UserRound size={38} strokeWidth={1.7} />
              )}
              <LockKeyhole className="login-auth-lock" size={19} strokeWidth={2.2} />
            </div>
            <div className="login-auth-check">
              <Check size={42} strokeWidth={3} />
            </div>
          </div>
          <p className="login-auth-message">Welcome, {authenticatedUser?.name}</p>
        </div>
      ) : null}
    </div>
  );
}
