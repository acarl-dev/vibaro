# Vibaro Environment

Diese Datei beschreibt das Setup für **Local Development**, **Staging** (Hetzner CPX21) und **Production** (Hybrid: Vercel + Hetzner).
Sie ist die verbindliche Referenz für `.env` Keys, Ports, Services und typische Probleme.

---

## 1) Monorepo Overview

Root:
- `apps/web` → Next.js (Landing, Dashboard, Public Pages)
- `apps/api` → Laravel (JSON API)
- `infra/docker` → lokale Services (Postgres, Redis, Mailhog)
- `docs` → Dokumentation (Source of Truth)

---

## 2) Local Development

### 2.1 Ports (Default)
- Web (Next.js): `http://localhost:3000`
- API (Laravel): `http://127.0.0.1:8000`
- Postgres: `localhost:5432`
- Redis: `localhost:6379`
- Mailhog UI: `http://localhost:8025`
- Mailhog SMTP: `localhost:1025`

> Wichtig: Local läuft Web und API typischerweise direkt (nicht in Containern), DB/Redis/Mailhog via Docker.

---

### 2.2 Local Services via Docker Compose
Empfohlen: Docker Compose unter `infra/docker/docker-compose.yml` mit:
- `postgres:16`
- `redis:7`
- `mailhog`

Start:
```bash
docker compose -f infra/docker/docker-compose.yml up -d
````

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

> **Kanonischer Name:** `NEXT_PUBLIC_API_BASE_URL` ist der einzige korrekte Variablenname für die Backend-URL im Web-Projekt. Alle Route Handlers und Server-Utilities in `apps/web` lesen ausschließlich diese Variable (via `getBackendBaseUrl()` in `src/lib/api/backend.ts`).

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

oder direkt:

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

### 3.1 Ziele

Staging ist für:

* Deploy-Proben
* Stripe Test Mode
* Upload/Storage Tests
* CORS/Auth Checks
* Webhooks (Test)

### 3.2 Domains (Beispiel)

* `staging-api.<domain>` → Hetzner CPX21
* Optional: `staging.<domain>` → Vercel Preview oder separate Vercel env

### 3.3 ENV (API Staging)

Wichtige Unterschiede zu local:

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

Staging muss echtes HTTPS nutzen (LetsEncrypt), weil:

* Cookies/Auth
* Stripe Webhooks
* Public Links

---

## 4) Production (Hybrid)

### 4.1 Topology

* Web: **Vercel**
* API: **Hetzner**
* DB/Redis: Hetzner (auf dem API-Server am Anfang ok)
* Assets: später S3-compatible Storage (Hetzner Object Storage / R2 / DO Spaces)

### 4.2 Domains (Empfehlung)

* `vibaro.<domain>` oder `<domain>` → Vercel (Landing)
* `app.<domain>` → Vercel (Dashboard)
* `api.<domain>` → Hetzner (Laravel API)

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

* Works well across Vercel ↔ Hetzner.
* Avoids most cookie domain/samesite complexity.

### 5.2 Cookie Auth (If used later)

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
* Check CORS if browser blocks requests

### API cannot connect to Postgres

* Is docker compose running?
* Is `DB_HOST=127.0.0.1` correct (not `db`) when DB is on host?
* Check port 5432 not in use

### Mail not arriving locally

* Open Mailhog UI: `http://localhost:8025`
* Ensure `MAIL_HOST=127.0.0.1` and `MAIL_PORT=1025`

---

## 9) Required Files (Never commit secrets)

* Commit: `.env.example`, `.env.local.example`
* Never commit: `.env`, `.env.local`

