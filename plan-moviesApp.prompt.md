# Movies App Production Upgrade Plan

## Overview

This plan converts the current Movies-app prototype into a production-ready full-stack application with:
- a real database and ORM
- modular backend architecture
- secure auth and session handling
- live AI recommendation infrastructure
- backend persistence for AI answers and feedback
- production deployment and CI readiness

---

## 1. Current state review

### Existing implementation
- Frontend: React 19 + Vite
- Backend: custom Node raw `http` server in `server/index.js`
- Data store: local JSON file at `server/data/users.json`
- AI: local mock recommender in `src/pages/ai-assistance/mockRecommendation.js`
- Deployment: `Dockerfile`, `docker-compose.yml`, `.env.example`
- Linting: ESLint only

### Production gaps
- Backend is monolithic and not modular
- No database or ORM
- No separation of controllers/services/models
- Auth is custom and lacks refresh/invalidation
- Password reset logs codes to console, no email provider
- No input validation schema or centralized error handling
- AI feature is frontend-only mock logic
- No tests, no CI, no deployment pipeline
- Saved AI answers are stored in localStorage, not account-owned storage

---

## 2. Target architecture

### Backend
- Use Express or Fastify for API routing
- Use Prisma + PostgreSQL as primary DB and SQLite for local dev
- Add models for:
  - `User`
  - `FavoriteMovie`
  - `AiRecommendation`
  - `AiFeedback`
  - `PasswordResetToken`
- Implement folders:
  - `server/app.js`
  - `server/server.js`
  - `server/routes/*.js`
  - `server/controllers/*.js`
  - `server/services/*.js`
  - `server/repositories/*.js`
  - `server/middleware/*.js`
  - `server/config/*.js`
  - `prisma/schema.prisma`

### Auth & security
- Use `bcrypt` or `argon2`
- Secure cookies: `HttpOnly`, `SameSite`, `Secure` in prod
- Add refresh tokens or DB-backed session invalidation
- Validate input with `zod` or `joi`
- Add centralized error handling middleware
- Add email provider support with abstraction layer

### AI infrastructure
- Expose backend endpoint `POST /api/ai/recommendations`
- Implement `server/services/aiService.js`
- Support real provider integration (OpenAI / Azure OpenAI)
- Add fallback mock mode for local dev/unavailable provider
- Store AI answers and feedback in DB
- Add endpoints for AI history and feedback

### Frontend
- Refactor services into stable API boundary
- Use hooks for auth, movies, favorites, AI assistant
- Move AI UI into `src/features/ai/`
- Use backend persistence instead of localStorage for saved answers
- Improve error/loading state handling and UX

### Deployment readiness
- Harden Dockerfile for production
- Add DB service or external DB support in compose
- Add GitHub Actions CI with install, lint, test, build
- Add env validation and deployment docs

---

## 3. Detailed implementation plan

### Phase 1: Backend restructuring
1. Extract raw server logic into `server/server.js` and `server/app.js`
2. Replace raw `http` server with Express
3. Add middleware: JSON parser, cookie parser, CORS, logger, error handler
4. Add config loader in `server/config/env.js`
5. Add Prisma, DB dependencies, and migrations
6. Convert storage logic into repositories

### Phase 2: Database + ORM
1. Create Prisma models for user, favorite, AI, feedback, password reset
2. Add service layer:
   - `authService.js`
   - `movieService.js`
   - `favoritesService.js`
   - `aiService.js`
3. Add repository layer for DB operations
4. Add response serializers for consistent API output

### Phase 3: Auth and account flows
1. Use secure password storage (`bcrypt`)
2. Add auth middleware and `requireAuth`
3. Refactor signup/signin/logout routes with DB storage
4. Add password reset email flow with provider abstraction
5. Add refresh token or session record model

### Phase 4: AI backend
1. Add `/api/ai/recommendations`
2. Add AI service adapter pattern for provider config
3. Persist generated recommendations and feedback
4. Add `/api/ai/history`, `/api/ai/feedback`, `/api/ai/history/:id`
5. Add input validation and response schema

### Phase 5: Frontend refactor
1. Restructure `src/services/` by domain
2. Add `src/hooks/` for feature logic
3. Move AI pages and components to `src/features/ai/`
4. Replace localStorage saved answers with backend data
5. Add strong error and loading handling

### Phase 6: Production setup
1. Harden Dockerfile for production install and runtime
2. Update `docker-compose.yml` with DB service
3. Add `docker-compose.prod.yml` or deployment manifest
4. Add CI workflow and docs

### Phase 7: Quality and polish
1. Add backend and frontend tests
2. Add formatting rules or Prettier
3. Optionally migrate to TypeScript in phases
4. Add `lint-staged` / `husky` if desired

---

## 4. Specific codebase recommendations

### Backend
- Remove `server/data/users.json`
- Extract routing, auth, validation, and DB access into separate modules
- Add ORM and DB models instead of file persistence
- Add email provider support for password recovery
- Add centralized error handling
- Split TMDB proxy from feature routes
- Avoid mixing static serving and API handling in one file

### Frontend
- Refactor `MovieAssistantPage.jsx` business logic into hooks/services
- Replace localStorage AI saved answers with backend storage
- Use `src/services` boundary consistently
- Improve auth/favorites state handling
- Add tests and ideally type safety

### UX / architecture
- Make AI feature a real backend-driven experience
- Add secure session management
- Improve API contract and versioning
- Document production deployment clearly

---

## 5. Priority roadmap
1. Express + Prisma backend refactor
2. Auth + secure DB user storage
3. AI backend endpoint and persistence
4. Frontend API/AI refactor
5. Deployment config and CI
6. Tests, docs, lint

---

## 6. Most important additions
- `prisma/schema.prisma`
- `server/routes/`, `server/controllers/`, `server/services/`
- `server/middleware/errorHandler.js`
- `server/services/emailService.js`
- `server/services/aiService.js`
- `src/features/ai/` backend-backed assistant
- backend DB persistence for AI answers
- production Docker + compose DB service
- API docs in `README.md`

---

## 7. Optional polish
- Add TypeScript gradually
- Add `react-query` for server state
- Add OpenAPI/Swagger docs
- Add logging with `pino` or `winston`
- Add GitHub Actions for CI
- Add migration and seed scripts
