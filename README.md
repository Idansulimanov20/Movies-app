# Movies App - React + Backend API

This movie app uses React for the frontend and a small Node backend for API proxying, authentication, authorization, and per-user favorites.

## Features

- Backend movie API proxy, so the TMDB key stays on the server.
- Sign up, sign in, sign out, and persisted user sessions.
- Protected favorites: guests cannot view or change favorites.
- Per-user favorite movies stored by the backend.
- Docker support for running the full-stack app.

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

Open the Vite URL shown in the terminal.

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
```
