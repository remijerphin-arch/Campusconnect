'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md rounded-[2rem] border bg-card p-10 text-center shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
          CampusConnect
        </p>
        <h1 className="mt-4 text-4xl font-bold">Page not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you requested is not available in this workspace.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Go back
          </button>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            <Home size={16} />
            Home
          </button>
        </div>
      </div>
    </main>
  );
}
