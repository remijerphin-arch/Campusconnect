'use client';

import React from 'react';
import { ShieldAlert, PhoneCall, CheckCircle2, AlertTriangle, Radio, ShieldCheck } from 'lucide-react';

export default function StudentSafetyCard() {
  return (
    <div className="bg-slate-900 border border-purple-500/30 rounded-3xl p-6 text-slate-100 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-600/20 text-purple-400 rounded-2xl border border-purple-500/30">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Christ University Campus Safety & Incident Verification
            </h3>
            <p className="text-xs text-slate-400">24/7 Security Control Desk • Emergency Response System</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-950/60 border border-emerald-500/40 rounded-full text-emerald-400 text-xs font-semibold">
          <Radio size={14} className="animate-pulse" /> Live Guard Dispatch Active
        </div>
      </div>

      {/* Emergency Hotline Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-purple-950/40 border border-purple-500/30 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 bg-purple-600 text-white rounded-xl">
            <PhoneCall size={20} />
          </div>
          <div>
            <div className="text-[11px] text-purple-300 font-semibold uppercase tracking-wider">Security Control Desk</div>
            <div className="text-sm font-bold text-white">+91 8639527123</div>
          </div>
        </div>

        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Campus Patrol Gate 1</div>
            <div className="text-sm font-bold text-white">Ext: 4012 (Kengeri Campus)</div>
          </div>
        </div>

        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 bg-amber-600/20 text-amber-400 rounded-xl border border-amber-500/30">
            <AlertTriangle size={20} />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Medical Emergency Hub</div>
            <div className="text-sm font-bold text-white">Ext: 108 / Block IV First Aid</div>
          </div>
        </div>
      </div>

      {/* Triage & Verification Workflow Explanation */}
      <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3">
        <h4 className="text-xs font-extrabold text-purple-300 uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 size={16} className="text-purple-400" /> Security Verification & Incident Workflow
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          All student emergency reports undergo 2-phase security triage (Accept as Genuine, Decline, or Prank Audit). Once verified by the Security Control Desk, incident resolution follows a transparent 4-step progress tracker.
        </p>
      </div>
    </div>
  );
}
