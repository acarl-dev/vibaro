# Deployment Checklist

## Canonical URLs
- Web URL (canonical): `NEXT_PUBLIC_APP_URL` (for example `https://app.example.com`)
- API URL (canonical): `NEXT_PUBLIC_API_BASE_URL` in Web and `APP_URL` in API (for example `https://api.example.com`)
- Legacy note: `NEXT_PUBLIC_WEB_URL` is legacy and should not be used for new code.

## ENV Verification
- Web (`apps/web`): set `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_APP_URL`.
- API (`apps/api`): set `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL=https://api.example.com`.
- API DB vars are set for production database (`DB_*`).
- API Redis vars are set (`REDIS_*`), queue uses Redis (`QUEUE_CONNECTION=redis`), cache uses store key (`CACHE_STORE=redis`).
- API mail vars are set (`MAIL_*`).
- Filesystem is configured (`FILESYSTEM_DISK`, plus storage provider config if not local).

## CORS
- Set `CORS_ALLOWED_ORIGINS` to explicit web origins (comma-separated), no wildcard in production.
- Verify API responds with correct CORS headers for both `/api/*` and `/storage/*` requests.

## Storage
- Ensure storage disk is writable by the API process.
- Run `php artisan storage:link` on the API server.
- Verify public media URLs resolve via API domain (`https://api.example.com/storage/...`).

## Migration Precheck (`artist_pages.user_id`)
- Run SQL precheck before migrations:

```sql
SELECT user_id, COUNT(*) AS count
FROM artist_pages
WHERE user_id IS NOT NULL
GROUP BY user_id
HAVING COUNT(*) > 1;
```

- Resolve duplicates before applying destructive/constraint-related migrations.

## Migrations
- Run migration command in production mode:

```bash
php artisan migrate --force
```

## Queue and Scheduler
- Ensure queue worker is running in production (for `QUEUE_CONNECTION=redis`).
- Ensure Laravel scheduler is configured (cron/systemd running `php artisan schedule:run`).

## Smoke Tests
- API health/basic route check (for example `GET /api/v1/...` expected JSON format).
- Verify login/session/token flow from web to API on real domains.
- Verify one public page resolves (`/p/{handle}`) and media loads.
- Verify one tracked share link click reaches API and records expected analytics event path.
