'use client';

import { useEffect, useState } from 'react';
import { Save, Upload } from 'lucide-react';
import { toast } from 'sonner';
import AppLayout from '@/components/AppLayout';
import { MOCK_STUDENT_DETAILS } from '@/lib/mockData';

const fields = [
  ['name', 'Name'], ['email', 'Email'], ['phone', 'Phone'], ['department', 'Department'],
  ['program', 'Course / Program'], ['semester', 'Semester'], ['section', 'Section'],
  ['academicYear', 'Academic year'], ['dateOfBirth', 'Date of birth'], ['address', 'Address'],
  ['emergencyContact', 'Emergency contact'],
] as const;

export default function StudentProfilePage() {
  const [profile, setProfile] = useState(MOCK_STUDENT_DETAILS);
  const [skills, setSkills] = useState(profile.skills.join(', '));
  useEffect(() => {
    const saved = window.localStorage.getItem('campusconnect-student-profile');
    if (saved) {
      const next = JSON.parse(saved);
      setProfile(next);
      setSkills(next.skills.join(', '));
    }
  }, []);
  const update = (field: string, value: string) => setProfile((current) => ({ ...current, [field]: value }));
  const save = () => { window.localStorage.setItem('campusconnect-student-profile', JSON.stringify({ ...profile, skills: skills.split(',').map((item) => item.trim()).filter(Boolean) })); toast.success('Profile saved'); };

  return <AppLayout currentPath="/student-profile"><div className="mx-auto max-w-5xl space-y-6"><section className="rounded-[2rem] border bg-card p-6 shadow-card"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Student profile</p><h1 className="mt-2 text-3xl font-bold">Your identity and professional profile</h1><p className="mt-2 text-sm text-muted-foreground">Edit permitted personal and career details. Academic results remain read-only.</p></section><section className="rounded-[2rem] border bg-card p-6 shadow-card"><div className="flex flex-col gap-5 sm:flex-row sm:items-center"><div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">{profile.name.split(' ').map((part) => part[0]).join('')}</div><div><h2 className="text-xl font-bold">{profile.name}</h2><p className="text-sm text-muted-foreground">{profile.rollNumber} · {profile.department}</p></div><button type="button" className="sm:ml-auto inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold"><Upload size={16} /> Change photo</button></div><div className="mt-8 grid gap-4 sm:grid-cols-2">{fields.map(([field, label]) => <label key={field} className="text-sm font-medium">{label}<input value={String(profile[field])} onChange={(event) => update(field, event.target.value)} readOnly={field === 'email' || field === 'department' || field === 'semester'} className="mt-1 w-full rounded-xl border bg-background px-3 py-2 read-only:bg-muted" /></label>)}<label className="text-sm font-medium">Skills<input value={skills} onChange={(event) => setSkills(event.target.value)} className="mt-1 w-full rounded-xl border bg-background px-3 py-2" /></label></div></section><section className="grid gap-6 md:grid-cols-2"><div className="rounded-[2rem] border bg-card p-6 shadow-card"><h2 className="text-xl font-bold">Professional details</h2><div className="mt-4 space-y-3 text-sm"><p><span className="text-muted-foreground">Certifications:</span> {profile.certifications.join(', ')}</p><p><span className="text-muted-foreground">Languages:</span> {profile.languages.join(', ')}</p><p><span className="text-muted-foreground">Achievements:</span> {profile.achievements.join(', ')}</p><p><span className="text-muted-foreground">Projects:</span> {profile.projects.join(', ')}</p></div></div><div className="rounded-[2rem] border bg-card p-6 shadow-card"><h2 className="text-xl font-bold">Online presence</h2><div className="mt-4 space-y-3 text-sm"><p><span className="text-muted-foreground">LinkedIn:</span> {profile.linkedin}</p><p><span className="text-muted-foreground">GitHub:</span> {profile.github}</p><p><span className="text-muted-foreground">Portfolio:</span> {profile.portfolio}</p><p><span className="text-muted-foreground">Resume:</span> {profile.resume}</p></div></div></section><button type="button" onClick={save} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground"><Save size={17} /> Save profile</button></div></AppLayout>;
}
