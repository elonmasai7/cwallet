# Deployment Guide

## Backend

- Deploy `apps/api` to Render or Railway.
- Provision PostgreSQL on Neon, Supabase, or Railway.
- Set environment variables from `apps/api/.env.example`.
- Run:

```bash
npm install
npm --workspace apps/api run prisma:migrate:deploy
npm --workspace apps/api run build
npm --workspace apps/api run start
```

## Web

- Deploy `apps/web` to Vercel.
- Set `NEXT_PUBLIC_API_URL` to the deployed API.
- Build command:

```bash
npm --workspace apps/web run build
```

## Mobile

- Build with Expo EAS or run locally with Expo Go.
- Set `EXPO_PUBLIC_API_URL` in `apps/mobile/.env`.

## Storage

- Configure Cloudinary for image uploads in production.
- The API includes a local development fallback when Cloudinary keys are absent.

