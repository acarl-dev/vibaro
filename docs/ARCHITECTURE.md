# Vibaro Architecture

Status: current
Last verified: 2026-04-22
Scope: aktuelle Laufzeit- und Integrationsarchitektur des Monorepos

Diese Datei beschreibt den derzeitigen Systemzuschnitt.
Produktvisionen oder historische V1/V2-Einordnungen gehören in die Produktdokumente, nicht hierher.

## Goal

Vibaro ist aktuell ein Monorepo mit Next.js-Webanwendung und Laravel-JSON-API für Public Pages, Studio-Funktionen, Auth sowie die aktuellen Spotlight-/Tracking-/Analytics-Flows.

## Monorepo Structure

- `apps/web`: Next.js App Router, Landing, Auth, Studio, Public Artist Pages, BFF Route Handlers
- `apps/api`: Laravel JSON API für Auth, Artist Pages, Studio CRUD, Tracking, Analytics und Spotlights
- `packages/shared`: framework-agnostische gemeinsame Artefakte, ohne Cross-App-Laufzeitkopplung
- `infra/`: lokale Infrastruktur und Skripte
- `docs/`: Dokumentation; nur korrekt, wenn mit Code synchron gehalten

## Hard Boundaries

- `apps/web` importiert keinen Code aus `apps/api`.
- Kommunikation zwischen Web und API erfolgt über HTTP/JSON.
- Gemeinsamer Code gehört nur nach `packages/shared` und muss framework-agnostisch bleiben.

## Current Runtime Topology

- Browser spricht primär mit Next.js.
- Laravel ist das Backend-System für Daten, Auth, Policies und Business-Logik.
- Authentifizierte Browser-Aktionen laufen über Next.js Route Handlers oder server-only Utilities.
- Öffentliche Server-Fetches dürfen direkt von Next.js zur Laravel-API gehen, wenn kein Browser-Token beteiligt ist.

## Current Auth/Data Flow

### Authentication

- Laravel erzeugt Sanctum Personal Access Tokens.
- Next.js Login-/Register-Route-Handler lesen den Token aus der Laravel-Response und setzen `vibaro_token` als `httpOnly` Cookie.
- Authentifizierte Requests aus Browser-Clients laufen über Next.js-BFF-Endpunkte.
- Authentifizierte serverseitige Requests laufen über `backendFetch()`.
- Der Browser hält keinen lesbaren Bearer-Token.

### Public Artist Pages

- Öffentliche Seiten liegen unter `/p/[handle]`.
- Der veröffentlichte öffentliche Pfad nutzt den Public-Endpoint der API.
- Die Owner-Preview für unveröffentlichte Seiten nutzt einen separaten authentifizierten Preview-Endpoint.
- Öffentliche und Preview-Pfade bleiben bewusst getrennt, damit Caching-Regeln nicht vermischt werden.

## Route Handler Classification

| Category | Current rule | Example |
|---|---|---|
| Auth-sensitive | Muss über BFF oder server-only Helper laufen | Studio-Endpunkte |
| Upload proxy | Muss über Web-Schicht laufen | Avatar-, Hero-, Cover-, Flyer-Uploads |
| Public, directly fetchable | Darf server-seitig direkt gegen Laravel gehen | veröffentlichte Public Page |
| Public but transformed | Route Handler nur bei zusätzlicher Aggregation/Transformation | spezielle zusammengesetzte Web-Responses |

Die bindende Grenze ist einfach:
Sobald ein Request den `vibaro_token` braucht, darf die Browser-Schicht den Token nicht selbst halten oder an Laravel senden.

## Non-Goals (Current)

- kein direkter DB-Zugriff aus `apps/web`
- keine zweite Auth-Schiene neben dem BFF-/server-only-Muster
- keine Cross-App-Imports zwischen Web und API
