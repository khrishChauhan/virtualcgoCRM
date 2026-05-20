# VirtualCGO Database

This directory contains the **single source of truth** for the database schema.

## Structure

```
database/
├── schema.prisma        ← Prisma schema (models, relations, datasource)
└── migrations/          ← Auto-generated migration files (created by Prisma)
```

## How Prisma Works with This Structure

The `schema.prisma` lives here in `database/` to keep it visible at the project root level.
The Prisma `generator` outputs `@prisma/client` directly into the backend `node_modules`.

### Key Commands (run from `backend/`)

| Command | What it does |
|---|---|
| `npm run prisma:generate` | Regenerates the TypeScript client from schema |
| `npm run prisma:migrate` | Creates a new SQL migration and applies it |
| `npm run prisma:studio` | Opens Prisma Studio (visual DB browser) |

> **Important**: Always point `--schema` to `../database/schema.prisma` when running Prisma CLI manually.

## DATABASE_URL Format

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
```
