# Back-office Architecture README

This document explains the high-level architecture of the Angular back-office and provides the full project tree for navigation.

## Architectural Overview

The application follows a feature-oriented Angular structure:

- `core/` contains cross-cutting infrastructure such as API access.
- `features/` contains domain behavior, services, and reusable shared UI primitives.
- `layouts/` contains page-level route containers that compose features into screens.
- `models/` contains strongly typed interfaces and app contracts.
- `environments/` contains runtime configuration per environment.
- `styles/` contains shared global styling layers.

## Runtime Flow

1. Angular bootstraps from `src/main.ts`.
2. Root providers are declared in `app.config.ts`.
3. Navigation is controlled by `app.routes.ts`.
4. Layout components orchestrate feature components and services.
5. Feature services use `core/api.service.ts` to communicate with backend APIs.

## Detailed Project Tree

The tree below mirrors the canonical structure captured in `ARCHITECTURE.md`.

```text
backoffice
├── public/                              # Static assets (favicon, etc.)
├── src                                  # Application source code
│   ├── app
│   │   ├── core                         # Core applications files used accross features
│   │   │   └── api.service.ts
│   │   ├── features                     # Domain features + reusable shared feature UI
│   │   │   ├── announces
│   │   │   │   ├── components/          # Announce components
│   │   │   │   └── announce.service.ts  # Announce service
│   │   │   ├── auth
│   │   │   │   ├── components/          # Auth components
│   │   │   │   ├── auth.guard.ts        # Guard applied before routing
│   │   │   │   └── auth.service.ts      # Auth service
│   │   │   ├── categories
│   │   │   │   └── category.service.ts  # Category service
│   │   │   ├── discussions
│   │   │   │   ├── components/          # Discussion components
│   │   │   │   └── discussion.service.ts# Discussion service
│   │   │   ├── messages
│   │   │   │   └── components/          # Message components
│   │   │   ├── shared
│   │   │   │   ├── components/          # Shared generic components
│   │   │   │   ├── services
│   │   │   │   │   └── notification.service.ts # Service to display flash messages
│   │   │   │   └── utils
│   │   │   │       └── pipe.ts          # String formating utils for displays
│   │   │   └── users
│   │   │       ├── components/          # User components
│   │   │       ├── user.service.ts      # User service
│   │   │       └── utils.ts             # User utility functions
│   │   ├── layouts                      # Page-level route containers
│   │   │   ├── announces/               # Announce screens
│   │   │   ├── auth/                    # Auth screens
│   │   │   ├── discussions/             # Discussion screens
│   │   │   └── users                    # User screens
│   │   ├── models                       # TypeScript interfaces/types
│   │   │   └── *.model.ts
│   │   ├── app.component.html           # Root component template
│   │   ├── app.component.scss           # Root component styles
│   │   ├── app.component.spec.ts        # Root component unit tests
│   │   ├── app.component.ts             # Root component component
│   │   ├── app.config.ts                # App-wide providers/config
│   │   └── app.routes.ts                # Router map
│   ├── environments                     # Environment-specific runtime config
│   │   ├── environment.development.ts
│   │   └── environment.ts
│   ├── styles                           # Global and shared SCSS partials
│   │   ├── shared/                      # Shared styles
│   │   └── _variables.scss              # SCSS constants
│   ├── index.html                       # SPA HTML entry point
│   ├── main.ts                          # Angular bootstrap entry point
│   └── styles.scss                      # Global stylesheet entry
├── .gitignore                           # Git ignore rules
├── angular.json                         # Angular CLI workspace/build config
├── package.json                         # Scripts + dependencies
├── package-lock.json                    # Dependency lockfile
├── README.md                            # Project documentation
├── tsconfig.app.json                    # TS config for app build
├── tsconfig.json                        # Base TS config
└── tsconfig.spec.json                   # TS config for tests
```

## Design Intent

- Keep domain logic in feature services and avoid leaking API concerns into UI components.
- Keep route-level composition in layouts to reduce coupling between screens.
- Keep reusable primitives in `features/shared` to avoid duplication.
- Keep strong type contracts in `models` for safer API and UI evolution.
