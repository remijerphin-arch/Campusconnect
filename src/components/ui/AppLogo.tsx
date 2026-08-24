'use client';

import Image from 'next/image';

interface AppLogoProps {
  size?: number;
}

export default function AppLogo({ size = 32 }: AppLogoProps) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <Image
        src="/assets/images/campusconnect-logo.svg"
        alt="CampusConnect"
        fill
        sizes={`${size}px`}
        className="object-contain"
        priority
      />
    </div>
  );
}
