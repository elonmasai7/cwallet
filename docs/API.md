# API Overview

Base URL: `/api`

## Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`

## Lessons

- `GET /api/lessons`
- `GET /api/lessons/:id`
- `POST /api/lessons` (admin)

## Progress

- `GET /api/progress`
- `POST /api/progress/complete`

## Reports

- `POST /api/reports`
- `GET /api/reports`
- `PATCH /api/reports/:id`

## Gamification

- `GET /api/leaderboard`
- `GET /api/user/points`

## Dashboard

- `GET /api/dashboard/public-finance`
- `GET /api/notifications`

## SMS

- `POST /api/sms/webhook`

Detailed request/response examples are documented inline in route validators and controller comments in `apps/api/src`.

## Example SMS Flow

1. Citizen sends `START`
2. API registers the phone number if needed
3. API sends `Welcome to CivicWallet. Reply 1 for lessons, 2 to report issue.`
4. Citizen replies `1` to receive a lesson summary or `REPORT: title | description | location` to create a report
