# Development Guide

This guide covers local setup, daily workflow, and practical conventions for the Finder back-office.

## Prerequisites

- Node.js 20+
- npm 10+
- Angular CLI (optional globally, available through npm scripts)

## Install and Run

```bash
npm install
npm start
```

The default app URL is `http://localhost:4200`.

## Main Commands

```bash
npm start         # Start dev server
npm test          # Run unit tests (watch mode)
npm run build     # Production build
```

## Configuration

Environment files are in `src/environments/`:

- `environment.development.ts` for local development.
- `environment.ts` for default/production-oriented values.

Keep secrets and environment-specific backend endpoints out of committed code.

## Architecture Conventions

- Put API calls in feature services (for example `announce.service.ts`, `user.service.ts`).
- Reuse `core/api.service.ts` for transport concerns (headers, base URL, error mapping).
- Keep reusable UI controls under `features/shared/components`.
- Keep page orchestration in layout components under `src/app/layouts`.

## Styling Conventions

- Prefer variables from `src/styles/_variables.scss`.
- Put reusable style patterns in `src/styles/shared/` partials.
- Keep component styles scoped unless the style is globally shared by design.

## Testing Notes

- Place specs next to implementation files when possible.
- Add tests for guard logic, service transforms, and UI states for loading/error paths.
- Verify critical routes after refactors to avoid navigation regressions.

## Troubleshooting

### Port already in use

If 4200 is occupied, run:

```bash
npm start -- --port 4300
```

### Dependency cleanup

If local dependencies get corrupted:

```bash
rm -rf node_modules package-lock.json
npm install
```

On Windows PowerShell, use equivalent commands (`Remove-Item -Recurse -Force`).
