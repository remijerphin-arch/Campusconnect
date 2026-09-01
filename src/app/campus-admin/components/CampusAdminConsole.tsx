'use client';

import { useEffect, useState, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  Activity,
  Check,
  ChevronDown,
  ChevronUp,
  Database,
  ImagePlus,
  LockKeyhole,
  Pencil,
  Radio,
  RotateCcw,
  Save,
  Settings2,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Upload,
  Users,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { DEMO_CREDENTIALS } from '@/lib/mockData';
import { publishCampusUpdate, readAdminSettings, readImportedUsers, readProfileImages, saveAdminSettings, saveImportedUsers, saveProfileImages, type AdminSettings, type ImportedUser } from '@/lib/demoStore';
import type { UserRole } from '@/types';

const defaultSettings: AdminSettings = {
  services: {
    studentPortal: true,
    facultyWorkspace: true,
    placementServices: true,
    communityBoard: true,
  },
  rfidEnabled: true,
  maintenanceMode: false,
  studentWidgets: ['profile', 'classes', 'exams', 'announcements', 'deadlines'],
};

const roleLabels: Record<UserRole, string> = {
  student: 'Student',
  faculty: 'Faculty',
  placement_admin: 'Placement Admin',
  campus_admin: 'Campus Admin',
};

const serviceLabels = [
  ['studentPortal', 'Student portal', 'Academic dashboards, attendance, and student updates.'],
  ['facultyWorkspace', 'Faculty workspace', 'Subject rosters, attendance, and marks entry.'],
  ['placementServices', 'Placement services', 'Company, drive, eligibility, and candidate workflows.'],
  ['communityBoard', 'Community board', 'Lost-and-found and resource exchange posts.'],
] as const;

const serviceColumns = [
  {
    key: 'studentPortal',
    title: 'Student services',
    description: 'Control academic access, attendance visibility, student updates, and the student portal experience.',
    badge: 'Student',
    path: '/student-dashboard',
  },
  {
    key: 'facultyWorkspace',
    title: 'Faculty services',
    description: 'Manage faculty dashboards, rosters, attendance tracking, and marks-related access.',
    badge: 'Faculty',
    path: '/faculty-dashboard',
  },
  {
    key: 'placementServices',
    title: 'Placement services',
    description: 'Control placement access, candidate visibility, drive workflows, and hiring dashboards.',
    badge: 'Placement',
    path: '/placement-admin',
  },
  {
    key: 'communityBoard',
    title: 'Community services',
    description: 'Operate lost-and-found, community notices, and peer resource exchange features.',
    badge: 'Community',
    path: '/lost-found',
  },
] as const;

const widgetLabels = [
  ['profile', 'Profile summary'],
  ['classes', 'Upcoming classes'],
  ['exams', 'Upcoming exams'],
  ['announcements', 'Announcements'],
  ['deadlines', 'Important deadlines'],
] as const;

const profileFieldLabels: Record<string, string> = {
  profileImage: 'Profile photo',
  name: 'Name',
  phone: 'Phone',
  program: 'Course / Program',
  section: 'Section',
  academicYear: 'Academic year',
  dateOfBirth: 'Date of birth',
  address: 'Address',
  emergencyContact: 'Emergency contact',
  skills: 'Skills',
};

type ServiceKey = 'studentPortal' | 'facultyWorkspace' | 'placementServices' | 'communityBoard';

const serviceOverviewDetails: Record<ServiceKey, { title: string; eyebrow: string; description: string; metrics: Array<{ label: string; value: string }> }> = {
  studentPortal: {
    title: 'Student services overview',
    eyebrow: 'Student',
    description: 'Review the student journey across academics, profile management, student services, placements, and campus support touchpoints.',
    metrics: [
      { label: 'Portal access', value: 'Enabled' },
      { label: 'Student modules', value: '5 core views' },
      { label: 'Attendance sync', value: 'Live' },
    ],
  },
  facultyWorkspace: {
    title: 'Faculty services overview',
    eyebrow: 'Faculty',
    description: 'Track how faculty members manage subject rosters, student attendance, internal marks, and day-to-day instruction operations.',
    metrics: [
      { label: 'Faculty access', value: 'Enabled' },
      { label: 'Roster tools', value: 'Connected' },
      { label: 'Marks entry', value: 'Live' },
    ],
  },
  placementServices: {
    title: 'Placement services overview',
    eyebrow: 'Placement',
    description: 'Monitor placement workflows, company drives, and candidate visibility before opening or changing placement operations.',
    metrics: [
      { label: 'Drive visibility', value: 'Active' },
      { label: 'Candidate flow', value: 'Managed' },
      { label: 'Eligibility rules', value: 'Editable' },
    ],
  },
  communityBoard: {
    title: 'Community services overview',
    eyebrow: 'Community',
    description: 'Moderate lost-and-found support, community notices, and peer-to-peer resource exchange across campus communities.',
    metrics: [
      { label: 'Board access', value: 'Enabled' },
      { label: 'Community posts', value: 'Reviewable' },
      { label: 'Moderation', value: 'Live' },
    ],
  },
};

export default function CampusAdminConsole() {
  const router = useRouter();
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings);
  const [selectedService, setSelectedService] = useState<ServiceKey>('studentPortal');
  const [users, setUsers] = useState(() =>
    [...DEMO_CREDENTIALS.map((user) => ({ ...user, active: true })), ...readImportedUsers().map((user) => ({ ...user, active: user.active ?? true }))]
  );
  const [activity, setActivity] = useState<string[]>(['Admin console initialized']);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [roleDraft, setRoleDraft] = useState<UserRole>('student');
  const [uploadRole, setUploadRole] = useState<UserRole>('student');
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [profileImages, setProfileImages] = useState<Record<string, string>>({});
  const [changeRequests, setChangeRequests] = useState<Array<Record<string, string>>>([]);

  useEffect(() => {
    const stored = readAdminSettings();
    setSettings({ ...defaultSettings, ...stored, studentWidgets: stored?.studentWidgets ?? defaultSettings.studentWidgets });
    setUsers([...DEMO_CREDENTIALS.map((user) => ({ ...user, active: true })), ...readImportedUsers().map((user) => ({ ...user, active: user.active ?? true }))]);
    setProfileImages(readProfileImages());
    setChangeRequests(JSON.parse(window.localStorage.getItem('campusconnect-profile-change-requests') ?? '[]'));
  }, []);

  const handleProfileImage = (email: string, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      record('Profile image upload rejected: choose an image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const image = String(reader.result);
      const next = { ...profileImages, [email.toLowerCase()]: image };
      setProfileImages(next);
      saveProfileImages(next);
      record(`Profile image updated for ${email}`);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const approveChangeRequest = (index: number) => {
    const request = changeRequests[index];
    const next = changeRequests.filter((_, requestIndex) => requestIndex !== index);
    setChangeRequests(next);
    window.localStorage.setItem('campusconnect-profile-change-requests', JSON.stringify(next));
    const permissions = JSON.parse(window.localStorage.getItem('campusconnect-profile-edit-permissions') ?? '{}') as Record<string, string[]>;
    const fields = Array.isArray(request?.fields) ? request.fields as unknown as string[] : ['profileImage'];
    const email = request?.email?.toLowerCase() ?? '';
    if (email) permissions[email] = fields;
    window.localStorage.setItem('campusconnect-profile-edit-permissions', JSON.stringify(permissions));
    publishCampusUpdate({ title: 'Profile edit approved', body: `Your approved profile fields are ready to edit once: ${fields.map((field) => profileFieldLabels[field] ?? field).join(', ')}.`, roles: ['student'], targetEmail: email || undefined });
    record(`Profile change approved for ${changeRequests[index]?.student ?? 'student'}`);
  };

  const record = (message: string) => {
    setActivity((current) => [message, ...current].slice(0, 5));
    if (message !== 'Admin console initialized') {
      publishCampusUpdate({ title: 'Campus admin update', body: message, roles: ['student', 'faculty'] });
    }
  };

  const updateSetting = (key: keyof AdminSettings['services']) => {
    const next = {
      ...settings,
      services: { ...settings.services, [key]: !settings.services[key] },
    };
    setSettings(next);
    saveAdminSettings(next);
    record(`${serviceLabels.find(([service]) => service === key)?.[1]} ${next.services[key] ? 'enabled' : 'disabled'}`);
  };

  const toggleGlobal = (key: 'rfidEnabled' | 'maintenanceMode') => {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    saveAdminSettings(next);
    record(`${key === 'rfidEnabled' ? 'RFID sync' : 'Maintenance mode'} ${next[key] ? 'enabled' : 'disabled'}`);
  };

  const toggleUser = (email: string) => {
    const nextUsers = users.map((user) => (
      user.email === email ? { ...user, active: !user.active } : user
    ));
    setUsers(nextUsers);
    const user = nextUsers.find((item) => item.email === email);
    record(`${user?.label ?? user?.name} access ${user?.active ? 'disabled' : 'enabled'}`);
  };

  const normalizeImportedUser = (row: Record<string, unknown>, role: UserRole): ImportedUser | null => {
    const name = String(row.name ?? row.fullName ?? row.studentName ?? row.facultyName ?? row.employeeName ?? '').trim();
    const email = String(row.email ?? row.mail ?? row.studentEmail ?? row.facultyEmail ?? '').trim();
    if (!name || !email) return null;

    const password = `${role}123`;
    const department = String(row.department ?? row.dept ?? row.program ?? '').trim();
    const rollNumber = String(row.rollNumber ?? row.roll_no ?? row.studentId ?? '').trim();
    const employeeId = String(row.employeeId ?? row.staffId ?? row.id ?? '').trim();

    return {
      label: role === 'student' ? 'Student' : role === 'faculty' ? 'Faculty' : 'Placement Admin',
      roleKey: role,
      name,
      email,
      password,
      department: department || undefined,
      rollNumber: rollNumber || undefined,
      employeeId: employeeId || undefined,
      active: true,
    };
  };

  const processRosterRows = (rows: Array<Record<string, unknown>>, role: UserRole) => {
    const imported = rows
      .map((row) => normalizeImportedUser(row, role))
      .filter((row): row is ImportedUser => Boolean(row));

    if (!imported.length) {
      throw new Error('No valid records were found in the uploaded file. Use rows that include name and email.');
    }

    const current = readImportedUsers();
    const existing = new Map(current.map((user) => [user.email.toLowerCase(), user]));
    imported.forEach((user) => existing.set(user.email.toLowerCase(), user));
    const next = [...existing.values()];
    saveImportedUsers(next);
    setUsers([...DEMO_CREDENTIALS.map((user) => ({ ...user, active: true })), ...next.map((user) => ({ ...user, active: user.active ?? true }))]);
    record(`${imported.length} ${role === 'student' ? 'student' : 'faculty'} records imported from roster`);
  };

  const handleRosterUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadMessage('');

    try {
      const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
      if (['xlsx', 'xls', 'csv'].includes(extension)) {
        const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });
        processRosterRows(rows, uploadRole);
      } else if (extension === 'pdf') {
        const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
        const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
        let text = '';
        for (let index = 1; index <= pdf.numPages; index += 1) {
          const page = await pdf.getPage(index);
          const content = await page.getTextContent();
          text += content.items.map((item) => ('str' in item ? item.str : '')).join(' ') + '\n';
        }
        const rows = text
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => {
            const [namePart, emailPart, ...rest] = line.split(/\s+/);
            return {
              name: namePart,
              email: emailPart?.includes('@') ? emailPart : rest.find((entry) => entry.includes('@')) ?? '',
              department: rest.join(' '),
            };
          })
          .filter((entry) => entry.name && entry.email)
          .map((entry) => ({ name: entry.name, email: entry.email, department: entry.department }));

        if (!rows.length) {
          throw new Error('The PDF did not contain readable text. Use a text-based PDF or Excel file.');
        }

        processRosterRows(rows, uploadRole);
      } else {
        throw new Error('Unsupported file type. Upload a PDF, Excel, or CSV sheet.');
      }

      setUploadMessage(`${uploadRole === 'student' ? 'Students' : 'Faculty'} roster uploaded successfully.`);
      event.target.value = '';
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to parse the uploaded file.';
      setUploadMessage(message);
      record(`Roster import failed: ${message}`);
    } finally {
      setUploading(false);
    }
  };

  const beginRoleEdit = (email: string, role: UserRole) => {
    setEditingUser(email);
    setRoleDraft(role);
  };

  const saveRole = (email: string) => {
    setUsers((current) => current.map((user) => (
      user.email === email ? { ...user, roleKey: roleDraft } : user
    )));
    setEditingUser(null);
    record(`Role updated to ${roleLabels[roleDraft]}`);
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    saveAdminSettings(defaultSettings);
    record('System settings reset to defaults');
  };

  const toggleWidget = (widget: string) => {
    const studentWidgets = settings.studentWidgets.includes(widget)
      ? settings.studentWidgets.filter((item) => item !== widget)
      : [...settings.studentWidgets, widget];
    const next = { ...settings, studentWidgets };
    setSettings(next);
    saveAdminSettings(next);
    record(`${widgetLabels.find(([key]) => key === widget)?.[1]} ${studentWidgets.includes(widget) ? 'enabled' : 'disabled'}`);
  };

  const moveWidget = (widget: string, direction: -1 | 1) => {
    const index = settings.studentWidgets.indexOf(widget);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= settings.studentWidgets.length) return;
    const studentWidgets = [...settings.studentWidgets];
    [studentWidgets[index], studentWidgets[nextIndex]] = [studentWidgets[nextIndex], studentWidgets[index]];
    const next = { ...settings, studentWidgets };
    setSettings(next);
    saveAdminSettings(next);
    record(`${widgetLabels.find(([key]) => key === widget)?.[1]} order updated`);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border bg-card p-6 shadow-card">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Campus administration</p>
            <h1 className="mt-2 text-3xl font-bold">CampusConnect control center</h1>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">Manage access, platform services, attendance integrations, and operational safeguards from one place.</p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-success/10 px-3 py-2 text-sm font-semibold text-success"><Activity size={16} /> System online</div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border bg-muted/50 p-4"><Users size={18} className="text-primary" /><p className="mt-3 text-2xl font-bold">{users.length}</p><p className="text-sm text-muted-foreground">Managed accounts</p></div>
          <div className="rounded-2xl border bg-muted/50 p-4"><Database size={18} className="text-primary" /><p className="mt-3 text-2xl font-bold">Supabase</p><p className="text-sm text-muted-foreground">Cloud provider</p></div>
          <div className="rounded-2xl border bg-muted/50 p-4"><Radio size={18} className="text-primary" /><p className="mt-3 text-2xl font-bold">{settings.rfidEnabled ? 'Active' : 'Paused'}</p><p className="text-sm text-muted-foreground">RFID attendance</p></div>
        </div>
      </section>

      <section className="rounded-[2rem] border bg-card p-6 shadow-card">
        <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Profile approvals</p><h2 className="mt-2 text-2xl font-bold">Student change requests</h2><p className="mt-2 text-sm text-muted-foreground">Review requests before profile details or photos are changed.</p></div><LockKeyhole className="text-primary" size={22} /></div>
        <div className="mt-6 space-y-3">
          {changeRequests.length ? changeRequests.map((request, index) => (
            <div key={`${request.email}-${request.createdAt}-${index}`} className="flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="font-semibold">{request.student}</p><p className="text-sm text-muted-foreground">{request.email}</p><p className="mt-2 text-sm">{request.reason}</p><div className="mt-2 flex flex-wrap gap-2">{(Array.isArray(request.fields) ? request.fields as unknown as string[] : ['profileImage']).map((field) => <span key={field} className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold">{profileFieldLabels[field] ?? field}</span>)}</div></div>
              {request.status === 'Pending' ? <button type="button" onClick={() => approveChangeRequest(index)} className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">Approve request</button> : <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">Approved</span>}
            </div>
          )) : <p className="rounded-2xl border border-dashed p-5 text-sm text-muted-foreground">No profile change requests.</p>}
        </div>
      </section>

      <section className="rounded-[2rem] border bg-card p-6 shadow-card">
        <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Bulk roster upload</p><h2 className="mt-2 text-2xl font-bold">Add students or faculty from spreadsheet or PDF</h2><p className="mt-2 text-sm text-muted-foreground">Upload a roster and the records will be added to the campus directory for login, faculty management, and placement visibility.</p></div><Upload className="text-primary" size={22} /></div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <select value={uploadRole} onChange={(event) => setUploadRole(event.target.value as UserRole)} className="rounded-xl border bg-background px-3 py-2 text-sm">
            <option value="student">Student roster</option>
            <option value="faculty">Faculty roster</option>
          </select>
          <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            <input type="file" accept=".xlsx,.xls,.csv,.pdf" className="hidden" onChange={handleRosterUpload} disabled={uploading} />
            {uploading ? 'Uploading...' : 'Upload file'}
          </label>
        </div>
        {uploadMessage && <p className="mt-3 text-sm text-success">{uploadMessage}</p>}
      </section>

      <section className="rounded-[2rem] border bg-card p-6 shadow-card">
        <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Access management</p><h2 className="mt-2 text-2xl font-bold">Users and roles</h2><p className="mt-2 text-sm text-muted-foreground">Enable or disable access and correct a user&apos;s workspace role.</p></div><LockKeyhole className="text-primary" size={22} /></div>
        <div className="mt-6 space-y-3">
          {users.map((user) => (
              <div key={user.email} className="flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                {profileImages[user.email.toLowerCase()] ? <div className="h-10 w-10 shrink-0 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${profileImages[user.email.toLowerCase()]})` }} /> : <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div>}
                <div className="min-w-0"><p className="truncate font-semibold">{user.name}</p><p className="truncate text-sm text-muted-foreground">{user.email}</p></div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label className="inline-flex cursor-pointer items-center gap-1 rounded-xl border px-3 py-2 text-xs font-semibold" title="Set profile picture"><ImagePlus size={16} /> Profile picture<input type="file" accept="image/*" className="hidden" onChange={(event) => handleProfileImage(user.email, event)} /></label>
                {editingUser === user.email ? <><select value={roleDraft} onChange={(event) => setRoleDraft(event.target.value as UserRole)} className="rounded-xl border bg-background px-3 py-2 text-sm"><option value="student">Student</option><option value="faculty">Faculty</option><option value="placement_admin">Placement Admin</option><option value="campus_admin">Campus Admin</option></select><button type="button" onClick={() => saveRole(user.email)} className="rounded-xl bg-primary p-2 text-primary-foreground" title="Save role"><Check size={16} /></button></> : <><span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">{roleLabels[user.roleKey]}</span><button type="button" onClick={() => beginRoleEdit(user.email, user.roleKey)} className="rounded-xl p-2 text-muted-foreground hover:bg-muted" title="Edit role"><Pencil size={16} /></button></>}
                <button type="button" onClick={() => toggleUser(user.email)} className={`inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold ${user.active ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`} title="Toggle user access">{user.active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}{user.active ? 'Active' : 'Disabled'}</button>
                <button type="button" onClick={() => record(`Account review opened for ${user.label}`)} className="rounded-xl p-2 text-muted-foreground hover:bg-muted" title="Review account"><Settings2 size={16} /></button>
                <button type="button" onClick={() => record(`Account removal requested for ${user.label}`)} className="rounded-xl p-2 text-muted-foreground hover:bg-danger/10 hover:text-danger" title="Remove account"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[2rem] border bg-card p-6 shadow-card">
          <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Campus administration</p><h2 className="mt-2 text-2xl font-bold">System status and service controls</h2></div><ShieldCheck className="text-primary" size={22} /></div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-success/20 bg-success/10 p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-success">System status</p>
              <h3 className="mt-2 text-2xl font-bold">Online</h3>
              <p className="mt-2 text-sm text-muted-foreground">CampusConnect services are currently operational and ready for campus management.</p>
            </div>
            <div className="rounded-2xl border bg-muted/50 p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Operations</p>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-between"><span>RFID attendance</span><span className="font-semibold text-foreground">{settings.rfidEnabled ? 'Enabled' : 'Paused'}</span></div>
                <div className="flex items-center justify-between"><span>Maintenance mode</span><span className="font-semibold text-foreground">{settings.maintenanceMode ? 'On' : 'Off'}</span></div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {serviceColumns.map((column) => {
              const currentKey = column.key as ServiceKey;
              const enabled = settings.services[currentKey];
              const active = selectedService === currentKey;
              return (
                <div key={column.key} className={`flex h-full flex-col justify-between rounded-2xl border p-4 transition ${active ? 'border-primary bg-primary/5' : 'hover:border-primary hover:bg-muted/30'}`}>
                  <button type="button" onClick={() => setSelectedService(currentKey)} className="flex flex-1 flex-col items-start text-left">
                    <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{column.badge}</span>
                    <h3 className="mt-3 text-lg font-bold">{column.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{column.description}</p>
                  </button>
                  <div className="mt-5 flex w-full items-center justify-between border-t pt-3">
                    <span className="text-sm font-medium text-foreground">{enabled ? 'Enabled' : 'Disabled'}</span>
                    <button
                      type="button"
                      aria-label={`Toggle ${column.title}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        updateSetting(currentKey);
                      }}
                      className="rounded-full p-1"
                    >
                      {enabled ? <ToggleRight className="shrink-0 text-success" size={24} /> : <ToggleLeft className="shrink-0 text-muted-foreground" size={24} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-[1.75rem] border bg-muted/30 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{serviceOverviewDetails[selectedService].eyebrow}</p>
                <h3 className="mt-2 text-2xl font-bold">{serviceOverviewDetails[selectedService].title}</h3>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{serviceOverviewDetails[selectedService].description}</p>
              </div>
              <button type="button" onClick={() => router.push(serviceColumns.find((column) => column.key === selectedService)?.path ?? '/campus-admin')} className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                Open module
              </button>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {serviceOverviewDetails[selectedService].metrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl border bg-background p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{metric.label}</p>
                  <p className="mt-2 text-xl font-bold">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={() => toggleGlobal('rfidEnabled')} className="flex items-center justify-between rounded-2xl border p-4 text-left"><span><span className="block font-semibold">RFID sync</span><span className="text-sm text-muted-foreground">Attendance event ingestion</span></span>{settings.rfidEnabled ? <ToggleRight className="text-success" size={26} /> : <ToggleLeft className="text-muted-foreground" size={26} />}</button>
            <button type="button" onClick={() => toggleGlobal('maintenanceMode')} className="flex items-center justify-between rounded-2xl border p-4 text-left"><span><span className="block font-semibold">Maintenance mode</span><span className="text-sm text-muted-foreground">Pause student-facing services</span></span>{settings.maintenanceMode ? <ToggleRight className="text-warning" size={26} /> : <ToggleLeft className="text-muted-foreground" size={26} />}</button>
          </div>
          <button type="button" onClick={resetSettings} className="mt-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold"><RotateCcw size={16} /> Reset settings</button>
          <div className="mt-8 border-t pt-6"><p className="font-semibold">Student dashboard widgets</p><p className="mt-1 text-sm text-muted-foreground">Enable cards and change their order on the student home dashboard.</p><div className="mt-3 space-y-2">{widgetLabels.map(([key, label]) => <div key={key} className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm"><span>{label}</span><span className="flex items-center gap-1">{settings.studentWidgets.includes(key) && <><button type="button" onClick={() => moveWidget(key, -1)} className="rounded-lg p-1 hover:bg-muted" title={`Move ${label} up`}><ChevronUp size={16} /></button><button type="button" onClick={() => moveWidget(key, 1)} className="rounded-lg p-1 hover:bg-muted" title={`Move ${label} down`}><ChevronDown size={16} /></button></>}<button type="button" onClick={() => toggleWidget(key)} className="rounded-lg p-1">{settings.studentWidgets.includes(key) ? <ToggleRight className="text-success" size={24} /> : <ToggleLeft className="text-muted-foreground" size={24} />}</button></span></div>)}</div></div>
        </section>
        <section className="rounded-[2rem] border bg-card p-6 shadow-card"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Audit activity</p><h2 className="mt-2 text-2xl font-bold">Recent admin actions</h2></div><Save className="text-primary" size={22} /></div><div className="mt-6 space-y-3">{activity.map((item, index) => <div key={`${item}-${index}`} className="flex gap-3 rounded-xl bg-muted/50 p-3 text-sm"><Check size={16} className="mt-0.5 shrink-0 text-success" /><span>{item}</span></div>)}</div></section>
      </div>
    </div>
  );
}
