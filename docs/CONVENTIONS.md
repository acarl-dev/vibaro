# Vibaro Conventions

This file defines binding conventions for the entire Vibaro project.
All implementations (web, API, and later add-ons) must follow them.

---

## 1. Naming & URLs

### Artist Handle
- lowercase
- URL-safe (`a-z`, `0-9`, `-`)
- unique
- Example: `emily-j`, `darkwave-berlin`

### Public Pages
- Public route: `/p/[handle]`
- No uppercase letters
- No internal IDs in URLs

---

## 2. Frontend - apps/web (Next.js)

### Principles
- Next.js App Router
- TypeScript everywhere
- Prefer Server Components **where appropriate**
- Use Client Components only for:
  - forms
  - editors
  - interactive UI

### Folder Structure
- `src/app/` -> routes and layouts
- `src/components/` -> UI components
- `src/lib/api/` -> API clients and fetch wrappers
- `src/lib/theme/` -> theme and variant logic
- `src/styles/` -> global styles and themes (`themes.css`)

### Styling
- **No hardcoded colors**
- Use colors **only via CSS variables**
- Theme assignment via:
  - `data-theme`
  - `data-variant`

Forbidden:
```tsx
style={{ color: "#ff00ff" }}
```

Allowed:
```css
color: var(--text);
```

---

## 3. Backend - apps/api (Laravel)

### API Structure
- REST JSON API
- Versioned: `/api/v1/...`
- No HTML responses

### Controller Rules
- Controllers are **thin**
- No business logic in controllers
- Validation:
  - use Request classes where appropriate
- Authorization:
  - use Laravel Policies

### Services
- Use services only when logic is:
  - reusable
  - or becoming complex
- No overengineering in MVP

---

## 4. API Response Format (binding)

### Success

```json
{
  "data": {}
}
```

### Error

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

### Validation Error

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "fields": {
      "fieldName": ["Error message"]
    }
  }
}
```

No mixed response formats.
No bare strings or arrays as responses.

---

## 5. Auth & Security (MVP)

- Auth is handled exclusively via API
- Web **never** accesses the DB directly
- No sensitive fields in public responses:
  - no email
  - no internal IDs
  - no tokens

---

## 6. Git & Workflow

### Branches

- `main` -> stable / production-close
- `develop` -> active development
- `feature/<name>`
- `fix/<name>`

### Commits

- Imperative mood
- Short and clear

Examples:
- `Add artist page editor`
- `Fix public page caching`
- `Refactor theme handling`

Do not use:
- `stuff`
- `wip`
- `changes`

---

## 7. MVP Focus (important)

- Focus on **Free + Artist**
- No AI features
- No app
- No feature flood

> If something is unclear:
> **simple, stable, understandable > clever**

---

## 8. Hard Prohibitions

- Do not commit `node_modules` or `vendor`
- No cross-imports between `apps/web` and `apps/api`
- No color picker in MVP
- No "magic" without documentation

---

## 9. Guiding Principle

> Vibaro is a product for musicians.
> Clarity, calm, and taste matter more than technical gimmicks.

