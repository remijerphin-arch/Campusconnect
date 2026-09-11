# Changelog

All notable changes to CampusConnect are documented here.

## [Unreleased]

### Added
- Table of contents and Tech Stack section in the README
- `CONTRIBUTING.md` with local setup and commit message guidelines
- Unit tests for the shared form validators (`src/lib/validation.test.ts`)
- Inline documentation across `middleware.ts`, `src/lib/auth/permissions.ts`, `src/lib/validation.ts`, and `src/lib/data/dataProvider.ts`

### Fixed
- `CampusUpdate` seed data in `src/lib/demoStore.ts` used `content` / `targetRole` fields that didn't match the `CampusUpdate` interface (`body` / `roles`); corrected to match the type

## [0.1.0]

- Initial CampusConnect release: role-aware Student, Faculty, Placement Admin, and Campus Admin workspaces with Supabase Auth, demo mode, and the full module set described in the README.
