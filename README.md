# MeetSpace Monorepo

Full starter repo for a meeting room booking app with:

- **Frontend:** Next.js 14 + TypeScript + App Router
- **Backend:** NestJS 10 + Prisma
- **Database:** Neon Postgres
- **Deploy:** Vercel (web) + Render (api) + Neon (db)

## Features included

### Roles
- EMPLOYEE
- APPROVER
- ADMIN

### Screens
- Dashboard
- Month calendar
- Day calendar (full screen)
- Booking form
- Approval queue
- Room management

### API
- List rooms
- Create booking
- Prevent booking conflicts
- List bookings by day/month
- Approve / reject bookings
- Health check
- Seed demo data

---

## Monorepo structure

```bash
meeting-room-full-repo/
├── apps/
│   ├── api/
│   └── web/
├── packages/
│   └── types/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── package.json
├── tsconfig.base.json
├── .env.example
├── render.yaml
└── README.md
```

---

## 1) Prerequisites

- Node.js 20+
- npm 10+
- Neon database
- Vercel account
- Render account

---

## 2) Install

```bash
npm install
```

---

## 3) Environment variables

Copy `.env.example` to `.env` at repo root and fill the values.

```bash
cp .env.example .env
```

### Required
- `DATABASE_URL`
- `DIRECT_URL`
- `JWT_SECRET`
- `CORS_ORIGIN`
- `NEXT_PUBLIC_API_URL`

---

## 4) Database setup

Run Prisma generate, migrate and seed:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

---

## 5) Local development

Run API:

```bash
npm run dev:api
```

Run Web:

```bash
npm run dev:web
```

- Web: http://localhost:3000
- API: http://localhost:4000

---

## 6) Deploy

### Neon
Create a Neon project and use:
- pooled connection string for `DATABASE_URL`
- direct connection string for `DIRECT_URL`

### Render
Create a **Web Service** for `apps/api`.

Suggested settings:
- Build command: `npm install && npm run prisma:generate && npm run build:api`
- Start command: `npm run start:api`

### Vercel
Import `apps/web` as a Next.js project.

Set:
- `NEXT_PUBLIC_API_URL=https://your-render-api.onrender.com`

---

## 7) Demo users

The seed script creates demo users:

- `employee@meetspace.local`
- `approver@meetspace.local`
- `admin@meetspace.local`

This starter repo does **not** include full auth screens yet. It uses role switching in the UI for fast demo and development.

---

## 8) Production notes

Before production:
- add real authentication (NextAuth / Clerk / custom JWT login)
- add audit logs
- add QR check-in
- add notifications (email / Slack / chat)
- add recurring bookings rules
- add room maintenance windows

---

## 9) Scripts

```bash
npm run dev:web
npm run dev:api
npm run build:web
npm run build:api
npm run start:api
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```
