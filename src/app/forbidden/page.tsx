import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <section className="max-w-md rounded-[2rem] border bg-card p-8 text-center shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-danger">403</p>
        <h1 className="mt-3 text-3xl font-bold">Access restricted</h1>
        <p className="mt-3 text-sm text-muted-foreground">Your account does not have permission to open this workspace.</p>
        <Link href="/" className="mt-6 inline-flex rounded-full bg-primary px-4 py-2 font-semibold text-primary-foreground">Return to sign in</Link>
      </section>
    </main>
  );
}