'use client';

import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  return (
    <button
      type="button"
      onClick={() => window.history.back()}
      title="Go back"
      className="inline-flex items-center gap-2 rounded-xl border bg-card px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      <ArrowLeft size={16} />
      Back
    </button>
  );
}
