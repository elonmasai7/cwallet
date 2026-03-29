# Architecture

## Monorepo

- `apps/api`: source of truth for auth, lessons, progress, reporting, gamification, notifications, and SMS webhooks.
- `apps/web`: citizen and admin web experience built with Next.js App Router and Tailwind CSS.
- `apps/mobile`: Expo app for lesson consumption, reporting, and leaderboard viewing.

## Backend Design

- Express REST API with MVC-style separation.
- Prisma models for PostgreSQL.
- JWT access + refresh tokens.
- Zod validation, rate limiting, secure headers, and role guards.
- File uploads via Cloudinary with a local fallback for development.

## Future-Ready Hooks

- Finance data is exposed through a service boundary so a static dataset can later be swapped for real government APIs.
- Notifications and SMS providers are isolated behind service modules.
- Gamification is event-driven enough to support more actions and reward rules later.

