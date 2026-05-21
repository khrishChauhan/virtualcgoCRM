# Deploying VirtualCGO to Vercel

## Prerequisites
- Vercel account (vercel.com)
- GitHub/GitLab/Bitbucket repo with this code pushed

---

## Step 1 — Import Project on Vercel

1. Go to **vercel.com/new**
2. Click **"Import Git Repository"**
3. Select your `virtualcgoCRM` repository

---

## Step 2 — Configure Project Settings

On the configuration screen:

| Setting | Value |
|---|---|
| **Framework Preset** | Next.js |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` (auto-detected) |
| **Output Directory** | `.next` (auto-detected) |
| **Install Command** | `npm install` (auto-detected) |

> [!IMPORTANT]
> Make sure **Root Directory is set to `frontend`**. If you have the `vercel.json` at the repo root, Vercel will pick this up automatically.

---

## Step 3 — Set Environment Variables

Go to **Project Settings → Environment Variables** and add these:

| Variable | Value | Environments |
|---|---|---|
| `DATABASE_URL` | `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres?pgbouncer=true` | Production, Preview, Development |
| `DIRECT_URL` | `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres` | Production, Preview, Development |
| `JWT_SECRET` | Your strong random secret (min 32 chars) | Production, Preview, Development |
| `JWT_EXPIRES_IN` | `7d` | Production, Preview, Development |

> [!CAUTION]
> **Never commit real `.env` or `.env.local` files.** All secrets go in Vercel's dashboard only.

Generate a strong JWT_SECRET:
```bash
openssl rand -base64 32
```

---

## Step 4 — Deploy

Click **Deploy**. Vercel will:
1. Run `npm install` → triggers `postinstall` which runs `prisma generate`
2. Run `npm run build` → runs `prisma generate && next build`
3. Deploy to Vercel's Edge Network

---

## What Happens at Runtime on Vercel

| Layer | Runtime | Description |
|---|---|---|
| `middleware.ts` | **Edge** | Auth guard runs globally at CDN level |
| `/api/*` routes | **Node.js** | Prisma + bcryptjs run in Node.js lambda |
| `/dashboard/*` | **Node.js** | Server components with Prisma queries |
| `/login`, `/` | **Static** | Pure HTML — served instantly from CDN |

---

## Troubleshooting

### "Failed to collect page data for /api/..."
**Cause**: Missing `export const dynamic = 'force-dynamic'` on API routes that use auth.
**Fix**: All routes in this project already have this set.

### "@prisma/client was not generated"
**Cause**: `postinstall` script not running.
**Fix**: Already added to `package.json`. Run `npm install` manually if needed.

### "JWT_SECRET is not set"
**Cause**: Environment variable missing from Vercel dashboard.
**Fix**: Add `JWT_SECRET` in Vercel → Settings → Environment Variables.

### "Cannot connect to database"
**Cause**: Supabase requires `?pgbouncer=true` on `DATABASE_URL` for connection pooling.
**Fix**: Use the connection string from Supabase → Settings → Database → Connection Pooling.
