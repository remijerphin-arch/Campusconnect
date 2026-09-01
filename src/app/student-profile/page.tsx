'use client';

import { useEffect, useState, type ChangeEvent } from 'react';
import { Save, Upload } from 'lucide-react';
import { toast } from 'sonner';
import AppLayout from '@/components/AppLayout';
import { DEMO_CREDENTIALS } from '@/lib/mockData';
import { readProfileImages } from '@/lib/demoStore';
import { getDemoStudentByEmail, type DemoStudentProfile } from '@/lib/studentDemoData';

const fields = [
  ['name', 'Name'],
  ['email', 'Email'],
  ['phone', 'Phone'],
  ['department', 'Department'],
  ['program', 'Course / Program'],
  ['semester', 'Semester'],
  ['section', 'Section'],
  ['academicYear', 'Academic year'],
  ['dateOfBirth', 'Date of birth'],
  ['address', 'Address'],
  ['emergencyContact', 'Emergency contact'],
] as const;

const requestableFields = [
  ['profileImage', 'Profile photo'],
  ['name', 'Name'],
  ['phone', 'Phone'],
  ['program', 'Course / Program'],
  ['section', 'Section'],
  ['academicYear', 'Academic year'],
  ['dateOfBirth', 'Date of birth'],
  ['address', 'Address'],
  ['emergencyContact', 'Emergency contact'],
  ['skills', 'Skills'],
] as const;

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<DemoStudentProfile | null>(null);
  const [skills, setSkills] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [requestReason, setRequestReason] = useState('');
  const [requestFields, setRequestFields] = useState<string[]>(['profileImage']);
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [allowedFields, setAllowedFields] = useState<string[]>([]);
  useEffect(() => {
    const email = window.localStorage.getItem('campusconnect-demo-email');
    const activeStudent = email ? getDemoStudentByEmail(email) : null;

    if (!activeStudent) {
      setProfile(null);
      setSkills('');
      setProfileImage('');
      setAllowedFields([]);
      return;
    }

    const saved = window.localStorage.getItem('campusconnect-student-profile');
    if (saved) {
      const next = JSON.parse(saved);
      if (next.email === activeStudent.email || !next.email) {
        setProfile(next);
        setSkills((next.skills ?? []).join(', '));
        setProfileImage(next.avatarUrl ?? '');
      }
    }
    setProfile(activeStudent);
    setSkills((activeStudent.skills ?? []).join(', '));
    const images = readProfileImages();
    setProfileImage(images[activeStudent.email.toLowerCase()] ?? '');
    const permissions = JSON.parse(window.localStorage.getItem('campusconnect-profile-edit-permissions') ?? '{}') as Record<string, string[]>;
    setAllowedFields(permissions[activeStudent.email.toLowerCase()] ?? []);
  }, []);
  const update = (field: string, value: string) =>
    setProfile((current) => (current ? { ...current, [field]: value } : current));
  const requestChange = () => {
    if (!profile || !requestReason.trim() || !requestFields.length) return;
    const requests = JSON.parse(
      window.localStorage.getItem('campusconnect-profile-change-requests') ??
        '[]',
    ) as Array<{ student: string; email: string; reason: string; fields: string[]; status: string; createdAt: string }>;
    requests.unshift({
      student: profile.name,
      email: profile.email,
      reason: requestReason.trim(),
      fields: requestFields,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    });
    window.localStorage.setItem(
      'campusconnect-profile-change-requests',
      JSON.stringify(requests),
    );
    setRequestReason('');
    setRequestOpen(false);
    setRequestSent(true);
    toast.success('Change request sent to the campus admin');
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setProfileImage(String(reader.result));
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const saveApprovedChanges = () => {
    if (!profile || !allowedFields.length) return;
    window.localStorage.setItem('campusconnect-student-profile', JSON.stringify({ ...profile, avatarUrl: profileImage, skills: skills.split(',').map((item) => item.trim()).filter(Boolean) }));
    const permissions = JSON.parse(window.localStorage.getItem('campusconnect-profile-edit-permissions') ?? '{}') as Record<string, string[]>;
    delete permissions[profile.email.toLowerCase()];
    window.localStorage.setItem('campusconnect-profile-edit-permissions', JSON.stringify(permissions));
    setAllowedFields([]);
    toast.success('Approved profile changes saved');
  };

  if (!profile) {
    return (
      <AppLayout currentPath="/student-profile">
        <div className="mx-auto max-w-3xl rounded-[2rem] border bg-card p-8 text-center shadow-card">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Student profile</p>
          <h1 className="mt-3 text-3xl font-bold">Please sign in to a student account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Use the roster-based student login on the home page to access your profile.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout currentPath="/student-profile">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-[2rem] border bg-card p-6 shadow-card">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Student profile
          </p>
          <h1 className="mt-2 text-3xl font-bold">
            Your identity and professional profile
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Edit permitted personal and career details. Academic results remain
            read-only.
          </p>
        </section>
        <section className="rounded-[2rem] border bg-card p-6 shadow-card">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
              {profileImage ? (
                <div
                  className="h-full w-full rounded-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${profileImage})` }}
                />
              ) : (
                profile.name
                  .split(' ')
                  .map((part) => part[0])
                  .join('')
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">{profile.name}</h2>
              <p className="text-sm text-muted-foreground">
                {profile.rollNumber} · {profile.department}
              </p>
            </div>
            <button
              type="button"
              onClick={() => allowedFields.includes('profileImage') ? document.getElementById('student-profile-photo')?.click() : setRequestOpen(true)}
              className="sm:ml-auto inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold"
            >
              <Upload size={16} /> {allowedFields.includes('profileImage') ? 'Upload approved photo' : 'Request photo change'}
              {allowedFields.includes('profileImage') && <input id="student-profile-photo" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />}
            </button>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {fields.map(([field, label]) => (
              <label key={field} className="text-sm font-medium">
                {label}
                <input
                  value={String(profile[field])}
                  onChange={(event) => update(field, event.target.value)}
                  readOnly={!allowedFields.includes(field)}
                  className="mt-1 w-full rounded-xl border bg-background px-3 py-2 read-only:bg-muted"
                />
              </label>
            ))}
            <label className="text-sm font-medium">
              Skills
              <input
                value={skills}
                onChange={(event) => setSkills(event.target.value)}
                readOnly={!allowedFields.includes('skills')}
                className="mt-1 w-full rounded-xl border bg-background px-3 py-2 read-only:bg-muted"
              />
            </label>
          </div>
        </section>
        {requestOpen && (
          <section className="rounded-[2rem] border border-primary/30 bg-primary/5 p-6 shadow-card">
            <h2 className="text-xl font-bold">Request a profile change</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Explain the details or photo you want changed. The campus admin must approve it before anything is updated.
            </p>
            <textarea
              autoFocus
              value={requestReason}
              onChange={(event) => setRequestReason(event.target.value)}
              placeholder="Example: Please update my profile photo or correct my emergency contact."
              className="mt-4 min-h-28 w-full rounded-xl border bg-background px-3 py-2"
            />
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {requestableFields.map(([key, label]) => (
                <label key={key} className="inline-flex items-center gap-2 rounded-xl border bg-background px-3 py-2 text-sm">
                  <input type="checkbox" checked={requestFields.includes(key)} onChange={() => setRequestFields((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key])} />
                  {label}
                </label>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={requestChange} disabled={!requestReason.trim() || !requestFields.length} className="rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50">
                Send request
              </button>
              <button type="button" onClick={() => setRequestOpen(false)} className="rounded-xl border px-4 py-2 font-semibold">
                Cancel
              </button>
            </div>
          </section>
        )}
        {requestSent && (
          <div className="rounded-2xl border border-success/30 bg-success/10 px-4 py-3 text-sm font-semibold text-success" role="status">
            Profile change request sent to the campus admin.
          </div>
        )}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[2rem] border bg-card p-6 shadow-card">
            <h2 className="text-xl font-bold">Professional details</h2>
            <div className="mt-4 space-y-3 text-sm">
              <p>
                <span className="text-muted-foreground">Certifications:</span>{' '}
                {profile.certifications.join(', ')}
              </p>
              <p>
                <span className="text-muted-foreground">Languages:</span>{' '}
                {profile.languages.join(', ')}
              </p>
              <p>
                <span className="text-muted-foreground">Achievements:</span>{' '}
                {profile.achievements.join(', ')}
              </p>
              <p>
                <span className="text-muted-foreground">Projects:</span>{' '}
                {profile.projects.join(', ')}
              </p>
            </div>
          </div>
          <div className="rounded-[2rem] border bg-card p-6 shadow-card">
            <h2 className="text-xl font-bold">Online presence</h2>
            <div className="mt-4 space-y-3 text-sm">
              <p>
                <span className="text-muted-foreground">LinkedIn:</span>{' '}
                {profile.linkedin}
              </p>
              <p>
                <span className="text-muted-foreground">GitHub:</span>{' '}
                {profile.github}
              </p>
              <p>
                <span className="text-muted-foreground">Portfolio:</span>{' '}
                {profile.portfolio}
              </p>
              <p>
                <span className="text-muted-foreground">Resume:</span>{' '}
                {profile.resume}
              </p>
            </div>
          </div>
        </section>
        <button
          type="button"
          onClick={() => setRequestOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground"
        >
          <Save size={17} /> Request profile change
        </button>
        {allowedFields.length > 0 && (
          <button type="button" onClick={saveApprovedChanges} className="ml-2 inline-flex items-center gap-2 rounded-full bg-success px-5 py-3 font-semibold text-success-foreground">
            <Save size={17} /> Save approved changes once
          </button>
        )}
      </div>
    </AppLayout>
  );
}
