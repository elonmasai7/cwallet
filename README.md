# CivicWallet

CivicWallet is a civic-fintech MVP that combines financial literacy, public finance transparency, citizen issue reporting, gamification, and SMS engagement.

## Apps

- `apps/api`: Express + Prisma + PostgreSQL REST API
- `apps/web`: Next.js App Router frontend
- `apps/mobile`: Expo React Native mobile app

## Folder Structure

```text
civic wallet/
├── apps/
│   ├── api/
│   │   ├── prisma/
│   │   ├── src/controllers
│   │   ├── src/routes
│   │   ├── src/services
│   │   └── tests
│   ├── web/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── store/
│   └── mobile/
│       ├── app/
│       └── lib/
└── docs/
```

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Copy environment templates:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
cp apps/mobile/.env.example apps/mobile/.env
```

3. Start PostgreSQL and update `DATABASE_URL`.
4. Run Prisma migrations and seed data:

```bash
npm --workspace apps/api run prisma:migrate
npm --workspace apps/api run prisma:seed
```

5. Start the services:

```bash
npm run dev:api
npm run dev:web
npm run dev:mobile
```

## Demo Credentials

- Admin: `admin@civicwallet.app` / `Admin123!`
- User: `user@civicwallet.app` / `User12345!`

## Documentation

- [API docs](/home/elon/Desktop/civic%20wallet/docs/API.md)
- [Deployment guide](/home/elon/Desktop/civic%20wallet/docs/DEPLOYMENT.md)
- [Architecture notes](/home/elon/Desktop/civic%20wallet/docs/ARCHITECTURE.md)

## CI

GitHub Actions workflow is available at [.github/workflows/ci.yml](/home/elon/Desktop/civic%20wallet/.github/workflows/ci.yml). It installs dependencies, runs TypeScript checks, executes backend tests, and builds the backend and web applications.
