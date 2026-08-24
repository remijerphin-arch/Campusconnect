'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  BookOpen,
  Briefcase,
  ChevronRight,
  GraduationCap,
  Shield,
  Users,
} from 'lucide-react';
import { DEMO_CREDENTIALS } from '@/lib/mockData';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { UserRole } from '@/types';
import AppLogo from '@/components/ui/AppLogo';

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
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    const matched = DEMO_CREDENTIALS.find(
      (credential) => credential.email === data.email && credential.password === data.password
    );

    if (matched) {
      toast.success(`Welcome, ${matched.name}`);
      const route =
        matched.roleKey === 'student'
          ? '/student-dashboard'
          : matched.roleKey === 'faculty'
            ? '/faculty-dashboard'
            : matched.roleKey === 'placement_admin'
              ? '/placement-admin'
              : '/campus-admin';
      window.location.href = route;
      return;
    }

    const supabase = createSupabaseBrowserClient();

    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (!error) {
        toast.success('Welcome back to CampusConnect');
        window.location.href =
          selectedRole === 'student'
            ? '/student-dashboard'
            : selectedRole === 'faculty'
              ? '/faculty-dashboard'
              : selectedRole === 'placement_admin'
                ? '/placement-admin'
                : '/campus-admin';
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
    <div className="min-h-screen lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative overflow-hidden bg-slate-950 px-6 py-10 text-white sm:px-10 lg:px-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.35),transparent_28%),radial-gradient(circle_at_75%_25%,rgba(14,165,233,0.22),transparent_24%)]" />
        <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-center gap-3">
            <AppLogo size={42} />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-200">
                Cloud Platform
              </p>
              <h1 className="text-2xl font-bold">CampusConnect</h1>
            </div>
          </div>

          <div className="my-auto max-w-xl py-16">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
              <Users size={14} />
              Unified student ecosystem
            </span>
            <h2 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl">
              One place for academics, placement growth, lost-and-found, and peer exchange.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/72">
              CampusConnect centralizes student services with cloud access, notifications,
              role-based dashboards, and RFID attendance updates that sync directly into the
              platform.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ['RFID Sync', 'Attendance flows automatically into the cloud'],
                ['Placements', 'Discover and track opportunities in one view'],
                ['Community', 'Recover items and exchange resources faster'],
              ].map(([title, text]) => (
                <div key={title} className="rounded-[1.5rem] border border-white/15 bg-white/10 p-4">
                  <p className="font-semibold">{title}</p>
                  <p className="mt-2 text-sm text-white/70">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="flex items-center px-6 py-10 sm:px-10">
        <div className="mx-auto w-full max-w-xl rounded-[2rem] border bg-card p-8 shadow-card">
          <h3 className="text-2xl font-bold">Sign in</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Select your role and use a demo account to preview the platform.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {(Object.keys(roleDescriptions) as UserRole[]).map((role) => {
              const Icon = roleIcons[role];
              const active = selectedRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`rounded-[1.25rem] border p-4 text-left transition ${
                    active ? 'border-primary bg-primary/10' : 'hover:bg-muted'
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
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 font-semibold text-primary-foreground"
            >
              {isLoading ? 'Signing in...' : 'Enter CampusConnect'}
              <ChevronRight size={18} />
            </button>
          </form>

          <div className="mt-8 rounded-[1.5rem] bg-muted p-4">
            <p className="text-sm font-semibold">Demo credentials</p>
            <div className="mt-3 space-y-3">
              {DEMO_CREDENTIALS.map((credential) => (
                <button
                  key={credential.email}
                  type="button"
                  onClick={() => {
                    setSelectedRole(credential.roleKey);
                    setValue('email', credential.email);
                    setValue('password', credential.password);
                  }}
                  className="flex w-full items-center justify-between rounded-2xl border bg-card px-4 py-3 text-left"
                >
                  <div>
                    <p className="font-medium">{credential.label}</p>
                    <p className="text-sm text-muted-foreground">{credential.email}</p>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    Autofill
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
