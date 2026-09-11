# Contributing to CampusConnect

Thanks for helping build CampusConnect. This is a small academic project, so the workflow below is intentionally lightweight.

## Getting set up

```bash
npm install
npm run dev
```

The app runs at [http://localhost:4028](http://localhost:4028). See the README for demo account credentials and Supabase setup.

## Before committing

Run the project's checks locally so a broken build doesn't land on `main`:

```bash
npm run type-check
npm run lint
npm run test
```

## Commit messages

Keep messages short and specific about *what* changed, e.g.:

- `Add bulk attendance CSV export`
- `Fix CampusUpdate seed data field mismatch`
- `Document role permission structure`

Avoid vague messages like `update` or `fix stuff`.

## Code style

- Formatting follows the repo's `.prettierrc` / `.eslintrc.json` — run `npm run lint` before pushing.
- Keep new modules typed; avoid `any` where a real type is available.
- New logic in `src/lib/` should have a matching `*.test.ts` file using Node's built-in test runner (see `src/lib/auth/permissions.test.ts` for the pattern).

## Reporting issues

Open a GitHub Issue describing the problem, the steps to reproduce it, and which role/workspace it affects (Student, Faculty, Placement Admin, or Campus Admin).
