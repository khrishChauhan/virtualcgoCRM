# VirtualCGO — CRM & Agency Operations Platform

> **Phase 1** — Project scaffold & architecture setup

---

## Project Structure

```
virtualcgoCRM/
├── frontend/          → Next.js 15 (App Router + TypeScript + Tailwind CSS)
├── backend/           → Express.js (TypeScript + Prisma ORM)
└── database/          → Prisma schema & migrations (source of truth)
```

---

## Quick Start

### Prerequisites

- Node.js >= 18.x
- PostgreSQL running locally (or connection string ready)
- npm >= 9.x

### 1. Clone & setup environment

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env — set your DATABASE_URL
```

### 2. Start the backend

```bash
cd backend
npm install
npm run dev       # ts-node-dev with hot reload
```

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev       # Next.js dev server on :3000
```

### 4. Verify everything works

```
GET http://localhost:5000/api/v1/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "VirtualCGO API",
  "version": "1.0.0",
  "environment": "development",
  "timestamp": "...",
  "uptime": "..."
}
```

---

## Architecture

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js 15 + TypeScript + Tailwind | UI / Client-side rendering |
| Backend | Express.js + TypeScript | REST API |
| Database | PostgreSQL | Relational data store |
| ORM | Prisma | Type-safe DB access & migrations |

### Frontend → Backend Communication

- Frontend calls `http://localhost:5000/api/v1/...` during development
- In production, set `NEXT_PUBLIC_API_URL` env var to the deployed backend URL
- CORS is pre-configured in the backend to accept requests from the frontend origin

---

## Phases

| Phase | Scope | Status |
|---|---|---|
| **Phase 1** | Project scaffold, architecture, health check | ✅ Done |
| Phase 2 | Auth system (JWT + RBAC) | 🔜 Next |
| Phase 3 | CRM core (clients, contacts, organizations) | 🔜 |
| Phase 4 | Operations (projects, tasks, pipelines) | 🔜 |
| Phase 5 | Finance (invoices, payments) | 🔜 |
| Phase 6 | Dashboard & analytics UI | 🔜 |
