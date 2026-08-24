'use client';

import { useEffect, useMemo, useState } from 'react';
import { BrainCircuit, CheckCircle2, CircleAlert, Sparkles, Users } from 'lucide-react';
import { toast } from 'sonner';
import { ADMIN_DRIVES, CANDIDATE_POOL, type CandidateApplication } from '@/lib/placementAdminData';
import { FACULTY_STUDENTS } from '@/lib/facultyMockData';

interface RankedCandidate extends CandidateApplication {
  score: number;
  reasons: string[];
  qualified: boolean;
}

const SHORTLIST_KEY = 'campusconnect-ai-shortlists';

function rankCandidates(driveId: string): RankedCandidate[] {
  const drive = ADMIN_DRIVES.find((item) => item.id === driveId);
  if (!drive) return [];

  return CANDIDATE_POOL
    .filter((candidate) => candidate.driveId === driveId)
    .map((candidate) => {
      const profile = FACULTY_STUDENTS.find((student) => student.rollNumber === candidate.rollNumber);
      const attendance = profile?.overallAttendance ?? 0;
      const reasons: string[] = [];
      let score = 0;
      const cgpaRatio = Math.min(candidate.cgpa / 10, 1);
      score += cgpaRatio * 45;
      score += Math.min(attendance / 100, 1) * 25;

      if (candidate.cgpa >= drive.minCgpa) {
        score += 15;
        reasons.push(`CGPA ${candidate.cgpa} meets ${drive.minCgpa}+ requirement`);
      } else {
        reasons.push(`CGPA ${candidate.cgpa} is below ${drive.minCgpa} requirement`);
      }
      if (candidate.backlogCount <= drive.allowedBacklogs) {
        score += 10;
        reasons.push(`${candidate.backlogCount} backlog meets the allowed limit`);
      } else {
        reasons.push(`${candidate.backlogCount} backlog exceeds the allowed limit`);
      }
      if (attendance >= 75) {
        score += 5;
        reasons.push(`${attendance}% attendance is above the 75% campus baseline`);
      } else {
        reasons.push(`${attendance}% attendance needs review`);
      }

      return {
        ...candidate,
        score: Math.round(score),
        reasons,
        qualified: candidate.cgpa >= drive.minCgpa && candidate.backlogCount <= drive.allowedBacklogs,
      };
    })
    .sort((left, right) => right.score - left.score);
}

export default function SmartShortlist() {
  const [driveId, setDriveId] = useState(ADMIN_DRIVES[0]?.id ?? '');
  const [shortlistSize, setShortlistSize] = useState(5);
  const [ranked, setRanked] = useState<RankedCandidate[]>(() => rankCandidates(ADMIN_DRIVES[0]?.id ?? ''));
  const [shortlisted, setShortlisted] = useState<string[]>([]);

  useEffect(() => {
    const saved = window.localStorage.getItem(SHORTLIST_KEY);
    if (saved) setShortlisted(JSON.parse(saved));
  }, []);

  const drive = ADMIN_DRIVES.find((item) => item.id === driveId);
  const eligible = useMemo(() => ranked.filter((candidate) => candidate.qualified), [ranked]);

  const runScreening = () => {
    setRanked(rankCandidates(driveId));
    toast.success('Candidate screening completed');
  };

  const applyShortlist = () => {
    const selected = eligible.slice(0, shortlistSize).map((candidate) => candidate.id);
    const next = [...new Set([...shortlisted, ...selected])];
    setShortlisted(next);
    window.localStorage.setItem(SHORTLIST_KEY, JSON.stringify(next));
    toast.success(`${selected.length} candidates shortlisted for ${drive?.company}`);
  };

  const toggleCandidate = (candidateId: string) => {
    const next = shortlisted.includes(candidateId)
      ? shortlisted.filter((id) => id !== candidateId)
      : [...shortlisted, candidateId];
    setShortlisted(next);
    window.localStorage.setItem(SHORTLIST_KEY, JSON.stringify(next));
  };

  return (
    <section className="rounded-[2rem] border bg-card p-6 shadow-card">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-2 text-primary"><BrainCircuit size={20} /><p className="text-sm font-semibold uppercase tracking-[0.2em]">AI-assisted screening</p></div>
          <h2 className="mt-2 text-2xl font-bold">Smart candidate shortlist</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">An explainable ranking assistant checks drive rules, CGPA, backlogs, and attendance. Final selection remains with the placement team.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-2 text-sm font-semibold text-primary"><Sparkles size={16} /> Explainable scoring</div>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-[1fr_160px_auto] md:items-end">
        <label className="text-sm font-medium">Placement drive<select value={driveId} onChange={(event) => { setDriveId(event.target.value); setRanked(rankCandidates(event.target.value)); }} className="mt-1 w-full rounded-xl border bg-background px-3 py-2"><option value="drive-1">Infosphere Labs · Software Engineer</option><option value="drive-2">Northpeak Analytics · Data Analyst Intern</option></select></label>
        <label className="text-sm font-medium">Shortlist top<input type="number" min="1" max="50" value={shortlistSize} onChange={(event) => setShortlistSize(Number(event.target.value))} className="mt-1 w-full rounded-xl border bg-background px-3 py-2" /></label>
        <button type="button" onClick={runScreening} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground"><BrainCircuit size={16} /> Run screening</button>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl border bg-muted/50 p-4"><Users size={17} className="text-primary" /><p className="mt-2 text-2xl font-bold">{ranked.length}</p><p className="text-sm text-muted-foreground">Applicants scored</p></div><div className="rounded-2xl border bg-muted/50 p-4"><CheckCircle2 size={17} className="text-success" /><p className="mt-2 text-2xl font-bold">{eligible.length}</p><p className="text-sm text-muted-foreground">Meet hard criteria</p></div><div className="rounded-2xl border bg-muted/50 p-4"><Sparkles size={17} className="text-primary" /><p className="mt-2 text-2xl font-bold">{shortlisted.length}</p><p className="text-sm text-muted-foreground">Shortlisted total</p></div></div>
      <div className="mt-6 space-y-3">{ranked.map((candidate, index) => <div key={candidate.id} className={`rounded-2xl border p-4 ${shortlisted.includes(candidate.id) ? 'border-success/50 bg-success/5' : ''}`}><div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div className="flex items-start gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">#{index + 1}</div><div><p className="font-semibold">{candidate.studentName}</p><p className="text-sm text-muted-foreground">{candidate.rollNumber} · {candidate.driveName}</p></div></div><div className="flex items-center gap-3"><span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">{candidate.score}/100</span><button type="button" onClick={() => toggleCandidate(candidate.id)} className={`rounded-xl px-3 py-2 text-sm font-semibold ${shortlisted.includes(candidate.id) ? 'bg-success text-success-foreground' : 'border'}`}>{shortlisted.includes(candidate.id) ? 'Shortlisted' : 'Select'}</button></div></div><div className="mt-4 flex flex-wrap gap-2">{candidate.reasons.map((reason) => <span key={reason} className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs ${reason.includes('meets') || reason.includes('above') ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>{reason.includes('meets') || reason.includes('above') ? <CheckCircle2 size={13} /> : <CircleAlert size={13} />}{reason}</span>)}</div></div>)}</div>
      <button type="button" onClick={applyShortlist} className="mt-5 rounded-xl bg-success px-4 py-2 font-semibold text-success-foreground">Apply top {Math.min(shortlistSize, eligible.length)} eligible candidates</button>
    </section>
  );
}
