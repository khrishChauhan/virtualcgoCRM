# VirtualCGO — CRM & Agency Operations Platform

> **Unified Full-Stack Next.js Application**
> One codebase · One command · One Vercel deployment

---

## Project Structure

```
virtualcgoCRM/
└── frontend/                  ← The entire application lives here
    ├── app/
    │   ├── (auth)/login/      → Login page UI
    │   ├── api/
    │   │   ├── auth/login/    → POST /api/auth/login
    │   │   ├── auth/logout/   → POST /api/auth/logout
    │   │   ├── auth/me/       → GET  /api/auth/me
    │   │   └── health/        → GET  /api/health
    │   └── dashboard/         → Dashboard UI
    ├── lib/
    │   ├── prisma.ts          → Prisma singleton (DB client)
    │   ├── auth.ts            → JWT sign/verify (jose)
    │   └── api-response.ts    → Standardized response helpers
    ├── middleware.ts           → Edge middleware (auth guard + RBAC)
    ├── prisma/
    │   ├── schema.prisma      → Database schema (source of truth)
    │   └── seed.ts            → Seed script for default users
    ├── types/
    │   └── auth.ts            → Shared TypeScript types
    └── .env.local             → Environment variables
```

---

## Quick Start

### Prerequisites
- Node.js >= 18
- npm >= 9

### 1. Install & setup
```bash
cd frontend
npm install
npx prisma generate
```

### 2. Run (single command)
```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it auto-redirects to `/login`.

### 3. Seed the database (first time only)
```bash
cd frontend
npm run db:seed
```

Default users:
| Email | Password | Role |
|---|---|---|
| superadmin@gmail.com | 123 | SUPER_ADMIN |
| techadmin@gmail.com | 123 | TECH_ADMIN |
| salesadmin@gmail.com | 123 | SALES_ADMIN |

### 4. Verify API health
```
GET http://localhost:3000/api/health
```

---

## Architecture

| Layer | Technology | Details |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | Full-stack React framework |
| **API Layer** | Next.js Route Handlers | `/app/api/**` — no Express needed |
| **Database** | PostgreSQL (Supabase) | Hosted, managed Postgres |
| **ORM** | Prisma 5 | Type-safe DB access + migrations |
| **Auth** | JWT via `jose` + HttpOnly cookies | Edge-compatible, XSS-safe |
| **RBAC** | Next.js Edge Middleware | Runs before page render, zero latency |
| **Styling** | Tailwind CSS v4 | Custom design system via `@theme` |

---

## Deployment to Vercel

1. Push to GitHub
2. Import project at [vercel.com/new](https://vercel.com/new)
3. Set **Root Directory** to `frontend`
4. Add environment variables:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `JWT_SECRET`
5. Click **Deploy** ✅

---

## Available Scripts (run from `frontend/`)

| Command | Description |
|---|---|
| `npm run dev` | Start dev server on localhost:3000 |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npx prisma generate` | Regenerate Prisma client after schema changes |
| `npm run prisma:migrate` | Run pending DB migrations |
| `npm run prisma:studio` | Open Prisma Studio (DB GUI) |
| `npm run db:seed` | Seed default admin users |

---

## Phases

| Phase | Scope | Status |
|---|---|---|
| **Phase 1** | Project scaffold | ✅ Done |
| **Phase 2** | Database schema (Prisma) | ✅ Done |
| **Phase 3** | Auth + RBAC (JWT + Middleware) | ✅ Done |
| **Phase 3.5** | **Frontend ↔ Backend merge** | ✅ Done |
| Phase 4 | Lead management CRUD | 🔜 Next |
| Phase 5 | Task management CRUD | 🔜 |
| Phase 6 | Activity logs & analytics | 🔜 |
