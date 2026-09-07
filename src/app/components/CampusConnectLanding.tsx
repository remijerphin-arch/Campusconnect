'use client';

import Link from 'next/link';
import { ArrowRight, BellRing, BookOpen, BriefcaseBusiness, GraduationCap, ShieldCheck, Users } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';
import ThemeToggle from '@/components/ThemeToggle';

const features = [
  {
    icon: BookOpen,
    label: 'Academic clarity',
    title: 'Know where you stand.',
    description: 'Keep classes, marks, attendance, and semester progress in one focused student workspace.',
    tone: 'landing-feature-rose',
  },
  {
    icon: BriefcaseBusiness,
    label: 'Career momentum',
    title: 'Find the next opportunity.',
    description: 'Explore placement drives, check eligibility, and follow every application from discovery to outcome.',
    tone: 'landing-feature-blue',
  },
  {
    icon: BellRing,
    label: 'Campus pulse',
    title: 'Stay in the loop.',
    description: 'Receive campus updates, service information, and important actions without searching across channels.',
    tone: 'landing-feature-amber',
  },
];

const audiences = [
  ['Students', 'A personal view of academics, attendance, services, and opportunities.', GraduationCap],
  ['Faculty', 'Simple tools for attendance, marks, and student operations.', Users],
  ['Campus teams', 'Shared visibility for placements, services, announcements, and administration.', ShieldCheck],
] as const;

const steps = [
  ['01', 'Choose your role', 'Start with a workspace designed for the way you contribute to campus life.'],
  ['02', 'Open your workspace', 'See the academic, operational, and career information that matters to you.'],
  ['03', 'Keep campus moving', 'Take action, stay informed, and make better decisions from one connected place.'],
] as const;

export default function CampusConnectLanding() {
  return (
    <main className="landing-page min-h-screen overflow-hidden">
      <nav className="landing-nav mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/" className="flex items-center gap-3" aria-label="CampusConnect home">
          <AppLogo size={42} />
          <span>
            <span className="block text-xs font-bold uppercase tracking-[0.24em] text-primary">Digital campus</span>
            <span className="block text-xl font-bold tracking-tight">CampusConnect</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login" className="landing-nav-link hidden items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold sm:inline-flex">
            Sign in <ArrowRight size={15} />
          </Link>
        </div>
      </nav>

      <section className="landing-hero mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-10 lg:grid-cols-1 lg:px-10 lg:pb-28 lg:pt-16">
        <div className="landing-hero-copy">
          <div className="landing-kicker inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
            <span className="landing-live-dot" /> One connected campus workspace
          </div>
          <h1 className="mt-7 max-w-3xl text-5xl font-bold leading-[0.96] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
            Make campus life easier to <span className="text-primary">navigate.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">
            CampusConnect brings academics, attendance, placements, campus services, and everyday updates into one calm, useful place.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/login" className="landing-primary-cta inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/20">
              Get started <ArrowRight size={18} />
            </Link>
            <a href="#how-it-works" className="inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition hover:border-primary hover:text-primary">
              See how it works
            </a>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Demo environment available for students, faculty, placement, and campus admin teams.</p>
        </div>

      </section>

      <section className="landing-section border-y">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Simple from the first click</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Campus work, without the runaround.</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {steps.map(([number, title, description]) => (
                <div key={number} className="landing-step rounded-2xl border p-5">
                  <span className="text-xs font-bold tracking-[0.18em] text-primary">{number}</span>
                  <h3 className="mt-8 font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="landing-section border-y">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Built around your day</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Less hunting. More doing.</h2>
            <p className="mt-4 leading-7 text-muted-foreground">CampusConnect keeps the most important parts of university life close at hand, with the right view for every role.</p>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {features.map(({ icon: Icon, label, title, description, tone }) => (
              <article key={title} className={`landing-feature ${tone} rounded-2xl border p-6`}>
                <div className="flex items-center justify-between"><span className="landing-feature-icon"><Icon size={20} /></span><span className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">{label}</span></div>
                <h3 className="mt-10 text-2xl font-bold tracking-tight">{title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">One platform, every perspective</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Everyone sees what matters.</h2>
          </div>
          <div className="grid gap-3">
            {audiences.map(([title, description, Icon]) => (
              <Link key={title} href="/login" className="landing-audience flex items-start gap-4 rounded-2xl border p-5">
                <span className="landing-audience-icon"><Icon size={19} /></span>
                <div><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p></div>
                <ArrowRight size={17} className="ml-auto mt-1 shrink-0 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-cta mx-6 mb-8 rounded-[2rem] border px-6 py-12 text-center sm:px-10 lg:mx-auto lg:max-w-7xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Your campus, connected</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">Start with the view built for you.</h2>
        <p className="mx-auto mt-4 max-w-xl leading-7 text-muted-foreground">Choose your role and step into a workspace that makes campus life clearer.</p>
        <Link href="/login" className="landing-primary-cta mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/20">Get started <ArrowRight size={18} /></Link>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-6 pb-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <span>CampusConnect · Your digital campus workspace</span>
        <span>Academics · Campus life · Career momentum</span>
      </footer>
    </main>
  );
}
