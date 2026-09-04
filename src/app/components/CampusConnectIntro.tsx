'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Activity, BookOpen, BriefcaseBusiness, GraduationCap, Users } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';

interface CampusConnectIntroProps {
  onComplete: () => void;
}

const MAX_INTRO_DURATION = 7500;
const INTRO_STAGES = ['campus', 'network', 'convergence', 'brand', 'transition'] as const;
type IntroStage = (typeof INTRO_STAGES)[number];

const nodes = [
  { id: 'students', label: 'Students', icon: GraduationCap, className: 'intro-node-students' },
  { id: 'faculty', label: 'Faculty', icon: Users, className: 'intro-node-faculty' },
  { id: 'academics', label: 'Academics', icon: BookOpen, className: 'intro-node-academics' },
  { id: 'placement', label: 'Placement', icon: BriefcaseBusiness, className: 'intro-node-placement' },
  { id: 'pulse', label: 'Campus pulse', icon: Activity, className: 'intro-node-pulse' },
];

export default function CampusConnectIntro({ onComplete }: CampusConnectIntroProps) {
  const [stage, setStage] = useState<IntroStage>('campus');
  const completedRef = useRef(false);

  const completeIntro = useCallback(() => {
    if (completedRef.current) return;

    completedRef.current = true;
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      const timer = window.setTimeout(completeIntro, 320);
      return () => window.clearTimeout(timer);
    }

    const stageChanges: Array<{ stage: IntroStage; at: number }> = [
      { stage: 'network', at: 1600 },
      { stage: 'convergence', at: 4200 },
      { stage: 'brand', at: 5050 },
      { stage: 'transition', at: 5720 },
    ];
    let stageIndex = 0;
    let stageTimer: number;
    const advanceStage = () => {
      const nextStage = stageChanges[stageIndex];
      if (!nextStage) return;

      setStage(nextStage.stage);
      stageIndex += 1;
      const followingStage = stageChanges[stageIndex];
      if (followingStage) {
        stageTimer = window.setTimeout(advanceStage, followingStage.at - nextStage.at);
      }
    };
    stageTimer = window.setTimeout(advanceStage, stageChanges[0].at);
    const fallbackTimer = window.setTimeout(completeIntro, MAX_INTRO_DURATION);

    return () => {
      window.clearTimeout(stageTimer);
      window.clearTimeout(fallbackTimer);
    };
  }, [completeIntro]);

  const handleBrandAnimationEnd = (event: React.AnimationEvent<HTMLDivElement>) => {
    if (event.animationName === 'intro-brand-enter') completeIntro();
  };

  return (
    <main className="campus-intro" data-stage={stage} aria-label="CampusConnect is connecting the campus">
      <div className="intro-sky" />
      <div className="intro-haze intro-haze-one" />
      <div className="intro-haze intro-haze-two" />
      <div className="intro-camera">
        <div className="intro-campus intro-layer-campus" aria-hidden="true">
          <div className="intro-horizon" />
          <div className="intro-walkway intro-walkway-one" />
          <div className="intro-walkway intro-walkway-two" />
          <div className="intro-building intro-building-a"><span /><i /><b /></div>
          <div className="intro-building intro-building-b"><span /><i /><b /></div>
          <div className="intro-building intro-building-c"><span /><i /><b /></div>
          <div className="intro-building intro-building-d"><span /><i /><b /></div>
          <div className="intro-tree intro-tree-one" />
          <div className="intro-tree intro-tree-two" />
          <div className="intro-tree intro-tree-three" />
        </div>
        <div className="intro-network intro-layer-network" aria-hidden="true">
          <svg className="intro-network-lines" viewBox="0 0 1000 600" preserveAspectRatio="none">
            <path className="intro-path intro-path-one" d="M500 285 C385 155 260 178 160 245" />
            <path className="intro-path intro-path-two" d="M500 285 C620 175 740 175 850 250" />
            <path className="intro-path intro-path-three" d="M500 285 C400 325 310 395 225 470" />
            <path className="intro-path intro-path-four" d="M500 285 C600 325 680 390 785 455" />
            <path className="intro-path intro-path-five" d="M500 285 C510 370 505 430 500 520" />
            <circle className="intro-data" r="4"><animateMotion dur="2.2s" begin="3.6s" repeatCount="indefinite" path="M500 285 C385 155 260 178 160 245" /></circle>
            <circle className="intro-data" r="4"><animateMotion dur="2.5s" begin="3.9s" repeatCount="indefinite" path="M500 285 C600 325 680 390 785 455" /></circle>
            <circle className="intro-data" r="3"><animateMotion dur="2s" begin="4.2s" repeatCount="indefinite" path="M500 285 C510 370 505 430 500 520" /></circle>
          </svg>
          {nodes.map(({ id, label, icon: Icon, className }) => (
            <div key={id} className={`intro-node ${className}`}>
              <span className="intro-node-halo" />
              <span className="intro-node-core"><Icon size={15} strokeWidth={1.8} /></span>
              <span className="intro-node-label">{label}</span>
            </div>
          ))}
        </div>
        <div className="intro-center-light" aria-hidden="true" />
        <div className="intro-brand intro-layer-brand" onAnimationEnd={handleBrandAnimationEnd}>
          <div className="intro-brand-mark"><AppLogo size={66} priority={false} /></div>
          <p className="intro-brand-name">CampusConnect</p>
          <p className="intro-brand-caption">One campus. Every connection.</p>
        </div>
      </div>
      <div className="intro-corner intro-corner-top">CAMPUSCONNECT <span>01 / 01</span></div>
      <div className="intro-corner intro-corner-bottom"><span className="intro-status-dot" /> Campus network awakening</div>
    </main>
  );
}