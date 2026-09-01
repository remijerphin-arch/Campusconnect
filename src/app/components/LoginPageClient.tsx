'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  BookOpen,
  Briefcase,
  Check,
  ChevronRight,
  GraduationCap,
  LockKeyhole,
  Shield,
  Users,
  UserRound,
} from 'lucide-react';
import { DEMO_CREDENTIALS } from '@/lib/mockData';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { UserRole } from '@/types';
import AppLogo from '@/components/ui/AppLogo';
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

export default function LoginPageClient() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [authAnimation, setAuthAnimation] = useState<'idle' | 'success'>('idle');
  const [authenticatedUser, setAuthenticatedUser] = useState<{ name: string; profileImage?: string } | null>(null);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
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
    setMaintenanceMode(readAdminSettings()?.maintenanceMode ?? false);
  }, [router]);

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
    <div className="relative min-h-screen overflow-hidden lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative overflow-hidden bg-slate-950 px-6 py-10 text-white sm:px-10 lg:px-14">
        <div className="login-glow absolute -left-24 -top-24 h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />
        <div className="login-glow login-glow-delay absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.35),transparent_28%),radial-gradient(circle_at_75%_25%,rgba(14,165,233,0.22),transparent_24%)]" />
        <div className="relative z-10 flex h-full flex-col">
          <div className="login-enter flex items-center gap-3">
            <AppLogo size={42} />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-200">
                Cloud Platform
              </p>
              <h1 className="text-2xl font-bold">CampusConnect</h1>
            </div>
          </div>

          <div className="my-auto max-w-xl py-16">
            <span className="login-enter login-delay-1 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
              <Users size={14} />
              Unified student ecosystem
            </span>
            <h2 className="login-enter login-delay-2 mt-6 text-4xl font-bold leading-tight sm:text-5xl">
              One place for academics, placement growth, lost-and-found, and peer exchange.
            </h2>
            <p className="login-enter login-delay-3 mt-5 max-w-lg text-base leading-7 text-white/72">
              CampusConnect centralizes student services with cloud access, notifications,
              role-based dashboards, and RFID attendance updates that sync directly into the
              platform.
            </p>
            <div className="relative mt-10 hidden min-h-24 sm:block" aria-label="Campus platform preview">
              <div className="login-preview-card login-preview-one">
                <span>Attendance</span>
                <strong>84%</strong>
                <small>Up 3.2% this month</small>
              </div>
              <div className="login-preview-card login-preview-two">
                <span>Placements</span>
                <strong>12 new roles</strong>
                <small>3 match your profile</small>
              </div>
              <div className="login-preview-card login-preview-three">
                <span>RFID Sync</span>
                <strong>Synced</strong>
                <small>2 minutes ago</small>
              </div>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ['RFID Sync', 'Attendance flows automatically into the cloud'],
                ['Placements', 'Discover and track opportunities in one view'],
                ['Community', 'Recover items and exchange resources faster'],
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

      <section className="flex items-center px-6 py-10 sm:px-10">
        <div className="login-form-enter mx-auto w-full max-w-xl rounded-[2rem] border bg-card p-8 shadow-card">
          <h3 className="text-2xl font-bold">Sign in</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Select your role and use a demo account to preview the platform.
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
                  onClick={() => setSelectedRole(role)}
                    className={`login-role-card rounded-[1.25rem] border p-4 text-left transition ${
                    active ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10' : 'hover:-translate-y-1 hover:bg-muted'
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

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Email</label>
              <input
                {...register('email', { required: 'Email is required' })}
                className="w-full rounded-2xl border bg-background px-4 py-3 outline-none ring-0"
                placeholder="student@campusconnect.edu"
              />
              <p className="mt-1 text-xs text-danger">{errors.email?.message}</p>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Password</label>
              <input
                type="password"
                {...register('password', { required: 'Password is required' })}
                className="w-full rounded-2xl border bg-background px-4 py-3 outline-none ring-0"
                placeholder="••••••••"
              />
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
                 value={studentSearch}
                 onChange={(event) => setStudentSearch(event.target.value)}
                 placeholder="🔍 Search by name, register #, or email"
                 className="w-full rounded-xl border border-primary/20 bg-background/80 px-3 py-2 text-sm outline-none transition-all duration-200 placeholder:text-muted-foreground focus:border-primary/50 focus:bg-background focus:ring-2 focus:ring-primary/20"
               />
               <div className="max-h-80 space-y-2 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                 {searchAuthoritativeStudents(studentSearch).length > 0 ? (
                   searchAuthoritativeStudents(studentSearch).map((student, idx) => (
                     <button
                       key={student.email}
                       type="button"
                       onClick={() => {
                         setSelectedRole('student');
                         setValue('email', student.email);
                         setValue('password', student.password);
                         setStudentSearch(student.fullName);
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
                     <p className="text-sm text-muted-foreground">No students found matching "{studentSearch}"</p>
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
                   onClick={() => {
                     setSelectedRole('faculty');
                     setValue('email', credential.email);
                     setValue('password', credential.password);
                   }}
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
                   onClick={() => {
                     setSelectedRole('placement_admin');
                     setValue('email', credential.email);
                     setValue('password', credential.password);
                   }}
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
                   onClick={() => {
                     setSelectedRole('campus_admin');
                     setValue('email', credential.email);
                     setValue('password', credential.password);
                   }}
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
