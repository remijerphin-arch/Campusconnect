'use client';

import { useCallback, useState } from 'react';
import LoginPageClient from '@/app/components/LoginPageClient';
import CampusConnectIntro from '@/app/components/CampusConnectIntro';

export default function LoginPage() {
  const [showIntro, setShowIntro] = useState(true);
  const completeIntro = useCallback(() => setShowIntro(false), []);

  return showIntro ? <CampusConnectIntro onComplete={completeIntro} /> : <LoginPageClient />;
}
