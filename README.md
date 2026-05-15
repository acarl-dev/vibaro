# Vibaro

![Status](https://img.shields.io/badge/status-active%20development-yellow)
![Frontend](https://img.shields.io/badge/frontend-Next.js-black)
![Backend](https://img.shields.io/badge/backend-Laravel-red)
![Database](https://img.shields.io/badge/database-PostgreSQL-blue)
![Cache](https://img.shields.io/badge/cache-Redis-red)
![API](https://img.shields.io/badge/API-JSON%20HTTP-lightgrey)

Vibaro is a full-stack SaaS project for musicians and bands. It allows artists to create a public band page, manage their current focus phase, distribute links and QR codes, and view simple performance analytics.

The project is built as a personal portfolio and learning project to practice modern web application development, API-driven architecture, authentication flows, public/private data boundaries, tracking logic, and deployment preparation.

> **Status:** Work in progress. Vibaro is an actively developed personal SaaS project. The codebase is not yet launch-ready, but it is designed with a future production release in mind.
---

## What Vibaro Does

Vibaro helps musicians create a simple, focused online presence around what currently matters most: a release, a show, a tour, merch, or another active phase.

Core product idea:

- Create and publish a public artist page under `/p/{handle}`
- Manage artist profile content, links, releases, shows, videos, gallery images and contact options
- Define a current focus phase for the artist page
- Generate and manage tracking links for different platforms and placements
- Use a permanent QR code that points to the public artist page
- View basic performance analytics for public pages and distributed links

The goal is not to be another generic website builder, but a calm, focused tool for artists who want one clear page and a simple way to understand how their shared links perform.

---

## Tech Stack

### Frontend

- **Next.js** with App Router
- **React**
- **TypeScript**
- **Tailwind CSS**
- Server Components, Route Handlers and BFF-style API routes

### Backend

- **Laravel** JSON API
- **Laravel Sanctum** for token-based authentication
- **PostgreSQL** as primary database
- **Redis** for cache/queue use cases
- PHPUnit-based backend tests

### Infrastructure / Tooling

- Monorepo structure
- Docker Compose for local infrastructure services
- Mailhog for local mail testing
- Documentation-first project structure under `/docs`

---

## Repository Structure

```txt
.
├── apps
│   ├── api        # Laravel backend / JSON API
│   └── web        # Next.js frontend / public pages / studio UI
├── docs           # Architecture, product rules, API contracts, security notes
├── infra
│   └── docker     # Local Docker Compose services
├── package.json   # Root workspace scripts
└── README.md
```

Important documentation files:

```txt
docs/ARCHITECTURE.md       # Runtime architecture and system boundaries
docs/API_CONTRACTS.md      # API contract notes
docs/DATA_MODEL.md         # Data model overview
docs/PRODUCT_RULES.md      # Current product rules
docs/SECURITY.md           # Security model and auth boundaries
docs/ENVIRONMENT.md        # Environment setup and deployment notes
docs/DEPLOYMENT_CHECKLIST.md
```

---

## Architecture Overview

Vibaro is split into two applications:

```txt
Browser
   │
   ▼
Next.js Web App
   │
   │  HTTP/JSON
   ▼
Laravel API
   │
   ▼
PostgreSQL / Redis / Storage
```

Key architectural rules:

- The frontend does not access the database directly.
- Communication between frontend and backend happens through HTTP/JSON.
- Authenticated browser requests go through Next.js route handlers or server-only utilities.
- Laravel owns business logic, persistence, policies, tracking and analytics.
- Public artist pages are separated from authenticated owner previews.
- Public API responses must not expose private artist or user fields.

This separation is intentional: the project is used to practice realistic full-stack boundaries instead of placing all logic in the frontend.

---

## Main Features

### Public Artist Pages

Artists can publish a public page under a stable handle-based URL:

```txt
/p/{handle}
```

The public page can contain profile information, links, music, releases, shows, videos, gallery images and selected contact options.

### Studio / Dashboard

The authenticated studio is used to manage the artist page and related content. It includes areas for page content, sharing, phases and results.

### Phase-Based Sharing

A central concept is the artist's current phase. A phase represents what the artist currently wants to promote, such as a release, show, tour or merch campaign.

Tracking links can be created around that phase and distributed across platforms or placements.

### Tracking Links and Analytics

Vibaro supports basic tracking and analytics flows:

- page view tracking for public artist pages
- tracking link redirects
- click events
- normalized referrer handling
- bot detection utilities
- simple performance views in the studio

### Uploads and Media

The project includes upload flows for artist images and content media such as avatars, hero images, logos, release covers, show flyers and gallery images.

---

## Security and Privacy Notes

Vibaro includes several security-oriented design decisions:

- Auth tokens are stored in an `httpOnly` cookie by the Next.js layer.
- Browser JavaScript should never receive or store bearer tokens.
- Authenticated requests are routed through a BFF-style boundary.
- Laravel policies protect owner-specific resources.
- Public artist pages only return published and public-safe data.
- Uploads are validated server-side.
- External URLs are validated through a dedicated safe URL rule.
- Server-side remote fetches use a guarded HTTP service to reduce SSRF risk.
- Production CORS is expected to use explicit allowed origins, not wildcards.

More details are documented in:

```txt
docs/SECURITY.md
```

---

## Local Development

### Requirements

- Node.js and npm
- PHP 8.2+
- Composer
- Docker / Docker Compose
- PostgreSQL-compatible local database service
- Redis-compatible local cache/queue service

### 1. Start local infrastructure

From the repository root:

```bash
docker compose -f infra/docker/docker-compose.yml up -d
```

This starts local services such as PostgreSQL, Redis and Mailhog.

### 2. Configure the backend

```bash
cd apps/api
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

Default local API URL:

```txt
http://127.0.0.1:8000
```

### 3. Configure the frontend

```bash
cd apps/web
cp .env.example .env.local
npm install
npm run dev
```

Default local web URL:

```txt
http://localhost:3000
```

The web app expects the backend URL to be configured through:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

---

## Root Scripts

From the repository root:

```bash
npm run dev:web      # Start the Next.js app
npm run dev:api      # Start the Laravel API using artisan serve
npm run lint:web     # Run frontend linting
npm run format:web   # Run frontend formatting
```

Backend tests can be run from `apps/api`:

```bash
cd apps/api
php artisan test
```

---

## Project Status

Vibaro is currently in active development. The repository already contains the core structure for the web app, API, public pages, studio flows, tracking, analytics and documentation.

Known areas that are still being refined before a production deployment include:

- final production infrastructure setup
- monitoring and logging strategy
- backup strategy
- production-ready storage setup
- privacy and legal documents
- further UI polish
- additional test coverage
- final cleanup of legacy naming around earlier product iterations

---

## Why This Project Exists

This project is used to deepen practical full-stack development skills beyond small demo applications.

It focuses on topics that are relevant in real-world web applications:

- API-driven application design
- frontend/backend separation
- authentication and authorization boundaries
- public vs. private data modeling
- product-oriented user flows
- analytics and tracking logic
- deployment readiness
- documentation and maintainability

---

## License

No license has been selected yet.

This repository is currently intended as a personal portfolio and learning project. Reuse, distribution or commercial use is not granted unless a license is added later.
