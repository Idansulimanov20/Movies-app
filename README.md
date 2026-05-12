# Watch & Chill

Watch & Chill is a React movie discovery app with a small Node backend for movie API proxying, authentication, protected favorites, and profile security features.

## Features

- Modern streaming-style UI with a responsive navbar, polished landing page, and mobile-friendly layouts.
- Movie discovery through a backend TMDB proxy, keeping the TMDB API key off the frontend.
- Search, title filtering, and release-year filtering.
- Sign up, sign in, sign out, and persisted user sessions.
- Protected favorites with a guest-friendly access screen instead of an automatic redirect.
- Per-user favorite movies stored by the backend.
- Profile modal for display name and avatar updates.
- Password change flow with a 6-digit email verification step.
- Production-style toast notifications with generic user-facing error messages and detailed console logging.
- AI movie assistant demo with chat-style prompts, saved recommendation sets, and favorite-saving support for signed-in users.
- Branded loader with an embedded optimized logo so it appears immediately, even on slower connections.
- Responsive media queries for mobile, tablet, and desktop views.
- Docker support for running the full-stack app.

## Tech Stack

- React 19
- Vite
- React Router
- React Icons
- React Toastify
- Node.js HTTP server
- Local JSON file persistence for development
- Built-in mock AI recommendation engine for interactive demo mode

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and fill in the values:

```bash
TMDB_API_KEY=your_tmdb_api_key_here
AUTH_TOKEN_SECRET=replace_with_a_long_random_secret
CLIENT_ORIGIN=http://localhost:5173
PORT=4000
VITE_API_BASE_URL=http://localhost:4000/api
```

3. Start the backend:

```bash
npm run server
```

4. Start the frontend in another terminal:

```bash
npm run dev
```

Open the Vite URL shown in the terminal. With the configured basename, routes are served under:

```text
http://localhost:5173/Movies-app/
```

The new AI assistant is available at `/Movies-app/ai-assistance` and uses a built-in mock recommendation engine for local demo mode.

You can also run frontend and backend together:

```bash
npm run dev:all
```

## Password Verification Notes

The password change flow is shaped like a production two-step verification flow:

1. The signed-in user requests a verification code from the profile modal.
2. The backend generates a 6-digit code that expires after 10 minutes.
3. The user enters the code and a new password.

This project does not include a real email provider yet. In local development, the verification code is logged in the backend console. The forgot-password flow follows the same development pattern.

## Docker

Create a `.env` file first, then run:

```bash
docker compose up --build
```

Open:

```text
http://localhost:4000/Movies-app/
```

The Docker setup stores local users and favorites in a named volume.

## Useful Scripts

```bash
npm run dev
npm run dev:all
npm run server
npm run build
npm run lint
npm run preview
```

## Production Notes

- Replace local JSON persistence with a database before deploying for real users.
- Connect an email provider for verification codes and password recovery.
- Set a strong `AUTH_TOKEN_SECRET` in production.
- Keep `TMDB_API_KEY` server-side only.
- Run `npm run build` and `npm run lint` before publishing changes.
