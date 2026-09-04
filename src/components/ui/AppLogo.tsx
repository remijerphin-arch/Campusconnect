'use client';

import Image from 'next/image';

interface AppLogoProps {
  size?: number;
  priority?: boolean;
}

export default function AppLogo({ size = 32, priority = true }: AppLogoProps) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <Image
        src="/assets/images/campusconnect-logo.svg"
        alt="CampusConnect"
        fill
        sizes={`${size}px`}
        className="object-contain"
        priority={priority}
      />
    </div>
  );
}
