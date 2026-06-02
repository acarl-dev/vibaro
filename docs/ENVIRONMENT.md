# Vibaro Environment

This file describes the setup for **local development**, **staging** (Hetzner CPX21), and **production** (hybrid: Vercel + Hetzner).
It is the binding reference for `.env` keys, ports, services, and common issues.

---

## 1) Monorepo Overview

Root:
- `apps/web` -> Next.js (landing, dashboard, public pages)
- `apps/api` -> Laravel (JSON API)
- `infra/docker` -> local services (Postgres, Redis, Mailhog)
- `docs` -> documentation (source of truth)

---

## 2) Local Development

### 2.1 Ports (Default)
- Web (Next.js): `http://localhost:3000`
- API (Laravel): `http://127.0.0.1:8000`
- Postgres: `localhost:5432`
- Redis: `localhost:6379`
- Mailhog UI: `http://localhost:8025`
- Mailhog SMTP: `localhost:1025`

> Important: In local development, web and API usually run directly (not in containers), while DB/Redis/Mailhog run via Docker.

---

### 2.2 Local Services via Docker Compose
Recommended: Docker Compose at `infra/docker/docker-compose.yml` with:
- `postgres:16`
- `redis:7`
- `mailhog`

Start:
```bash
docker compose -f infra/docker/docker-compose.yml up -d
```

Stop:
```bash
docker compose -f infra/docker/docker-compose.yml down
```

---

### 2.3 Local ENV Files

#### 2.3.1 Web: `apps/web/.env.local`

Minimal:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

> **Canonical name:** `NEXT_PUBLIC_API_BASE_URL` is the only correct variable name for the backend URL in the web project. All route handlers and server utilities in `apps/web` read only this variable (via `getBackendBaseUrl()` in `src/lib/api/backend.ts`).

#### 2.3.2 API: `apps/api/.env`

Minimal (Postgres + Redis + Mailhog):

```env
APP_ENV=local
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=vibaro
DB_USERNAME=vibaro
DB_PASSWORD=vibaro

CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
MAIL_FROM_ADDRESS=no-reply@vibaro.local
MAIL_FROM_NAME="Vibaro"
```

---

### 2.4 Running Locally

#### Web

From repo root:

```bash
npm run dev:web
```

Or directly:

```bash
cd apps/web && npm run dev
```

#### API

```bash
cd apps/api
php artisan serve
```

#### Migrations

```bash
cd apps/api
php artisan migrate
```

---

## 3) Staging (Hetzner CPX21)

### 3.1 Goals

Staging is used for:

* deploy rehearsals
* Stripe test mode
* upload/storage tests
* CORS/auth checks
* webhooks (test)

### 3.2 Domains (Example)

* `staging-api.<domain>` -> Hetzner CPX21
* Optional: `staging.<domain>` -> Vercel preview or separate Vercel env

### 3.3 ENV (API Staging)

Important differences from local:

```env
APP_ENV=staging
APP_DEBUG=false
APP_URL=https://staging-api.<domain>

DB_HOST=localhost
REDIS_HOST=localhost

# Logging/Monitoring optional
# SENTRY_DSN=...
```

### 3.4 HTTPS

Staging must use real HTTPS (LetsEncrypt), because of:

* cookies/auth
* Stripe webhooks
* public links

---

## 4) Production (Hybrid)

### 4.1 Topology

* Web: **Vercel**
* API: **Hetzner**
* DB/Redis: Hetzner (on the API server is fine at the beginning)
* Assets: later S3-compatible storage (Hetzner Object Storage / R2 / DO Spaces)

### 4.2 Domains (Recommendation)

* `vibaro.<domain>` or `<domain>` -> Vercel (landing)
* `app.<domain>` -> Vercel (dashboard)
* `api.<domain>` -> Hetzner (Laravel API)

Public pages:

* `/<domain>/p/<handle>` (served by Next.js)

---

### 4.3 Vercel ENV

In Vercel project settings:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.<domain>
```

---

### 4.4 API ENV (Prod)

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.<domain>

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=vibaro
DB_USERNAME=<secure_user>
DB_PASSWORD=<secure_password>

CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=<provider>
MAIL_PORT=587
MAIL_USERNAME=<provider_user>
MAIL_PASSWORD=<provider_pass>
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=no-reply@<domain>
MAIL_FROM_NAME="Vibaro"
```

---

## 5) Auth/CORS Notes

### 5.1 Token Auth (MVP recommended)

* Works well across Vercel <-> Hetzner.
* Avoids most cookie domain/samesite complexity.

### 5.2 Cookie Auth (if used later)

Then you must configure:

* `SANCTUM_STATEFUL_DOMAINS`
* `SESSION_DOMAIN`
* CORS allowed origins + credentials

In production, avoid wildcard origins.

---

## 6) Healthchecks

API should provide a simple health endpoint (example):

* `GET /health` (returns `{ "ok": true }`)

Use it for uptime monitoring and CI smoke tests.

---

## 7) Backups (Staging/Prod)

Minimum viable backup:

* nightly `pg_dump`
* store on Storage Box or secure offsite

Recommended:

* keep 7 daily + 4 weekly backups
* regularly test restore

---

## 8) Common Troubleshooting

### Web cannot reach API

* Check `NEXT_PUBLIC_API_BASE_URL`
* Check API is running (`curl http://127.0.0.1:8000`)
* Check CORS if the browser blocks requests

### API cannot connect to Postgres

* Is Docker Compose running?
* Is `DB_HOST=127.0.0.1` correct (not `db`) when DB runs on host?
* Check that port 5432 is not in use

### Mail not arriving locally

* Open Mailhog UI: `http://localhost:8025`
* Ensure `MAIL_HOST=127.0.0.1` and `MAIL_PORT=1025`

---

## 9) Required Files (Never Commit Secrets)

* Commit: `.env.example`, `.env.local.example`
* Never commit: `.env`, `.env.local`
