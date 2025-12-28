# Copilot / AI Agent Instructions for "photos-picker-sample"

**Purpose:** Short, actionable guidance to help an AI coding agent be productive in this repo.

## Big picture
- Two implementations in one repo:
  - **Client-side** (GitHub Pages): `docs/` — plain HTML/CSS/JS using Google Identity Services and the Photos Picker API.
  - **Server-side** (Codespaces / Node): `server/` — Node.js (ESM) + Express + Passport, server-side OAuth flows and extra features (e.g., server YouTube uploads).
- The server acts as an authenticated proxy to the Photos Picker and can download media using the user's OAuth token and then upload to YouTube.

## Key workflows & commands ✅
- Local development (server):
  - cd into `server/` and run: `npm run dev` (runs `tailwind` watch + `nodemon` server via `concurrently`).
  - Build/serve only: `npm run serve` (start single process), `npm run css` for Tailwind CSS watch/build.
- Client-side quick test:
  - Use `docs/` and create `docs/config.js` from `docs/config-template.js`.
  - Open `docs/index.html` in browser or rely on GitHub Pages deployment (`main` → `/docs`).
- There are no automated tests (`npm test` prints a placeholder).

## Configuration & secrets 🔐
- **Server:** Edit `server/config.cjs` or (recommended) copy to `server/config-test.cjs` and fill in values:
  - `oAuthClientID`, `oAuthclientSecret`, `oAuthCallbackUrl`, `scopes`, `session_secret`.
  - `config-test.cjs` is listed in `.gitignore` and used as an override (see `server/config.cjs`).
- **Client (docs):** copy `docs/config-template.js` → `docs/config.js` and set `clientId`.
- Important: Don't commit real credentials; use `config-test.cjs` for Codespaces or ephemeral credentials for GH Pages.

## Authentication & runtime data patterns ⚙️
- Passport Google OAuth is configured in `server/auth.js` and used in `server/app.js`.
  - After auth the session user object is `{ profile, token }` (so `req.user.token` contains the access token and `req.user.profile.id` is the user id).
  - The app stores a Photos Picker session per Google profile id in `persist-session/` using `node-persist`.
- When writing server handlers, expect tokens on `req.user.token` and use it as the `Authorization: Bearer <token>` header.

## Common gotchas & project-specific notes ⚠️
- Variable naming: `oAuthClientID` vs `oAuthclientSecret` (note lowercase `c` in `clientSecret` in some files); match what `server/config.cjs` expects.
- Client-side YouTube uploads often fail due to CORS/browser restrictions — the intended solution is to route uploads through the server: see `server/app.js` `/upload-to-youtube`.
- The client handles Photos Picker items with two possible shapes: `item.baseUrl` or `item.mediaFile.baseUrl`. Prefer safe access (optional chaining) and fallbacks when implementing features.
- Session cache TTLs and storage:
  - `persist-session/` is used to cache Photos Picker sessions (default TTL ~29 minutes).
  - `session-file-store` is used for express-session cookie persistence (configured in `app.js`).

## YouTube upload specifics
- To enable `/upload-to-youtube` on the server:
  - Add `https://www.googleapis.com/auth/youtube.upload` to `config.scopes` and re-authorize (force consent by logging out and in again).
  - Enable the YouTube Data API v3 in Google Cloud Console for the OAuth project.
  - The server uses `googleapis` to perform resumable uploads (`server/app.js` around `youtube.videos.insert`).

## Where to look for examples / relevant files 🔎
- Server app: `server/app.js` (routes, auth checks, API proxied calls)
- Auth setup: `server/auth.js` (passport strategy & serialization)
- Config pattern: `server/config.cjs`, `server/config-test.cjs` (override)
- UI templates: `server/views/pages/*.ejs` (server-rendered pages)
- Client-side sample: `docs/app.js`, `docs/config-template.js` (GIS + picker logic)
- Agent workflows: `.agent/workflows/*.md` (e.g., `version-update.md`) — follow these for repo-specific automation behavior.

## How an agent should contribute 🧭
- Prefer small, contained changes with clear rationale and tests/manual verification steps (no unit tests exist; provide manual test steps in PR). Example: "Added better error handling when `mediaFile.baseUrl` is missing; to test: start server `npm run dev`, log in, create a picker session, select an item and confirm the UI shows a placeholder image when baseUrl is absent." 
- For config or credential changes, instruct the user to copy templates and never commit secrets.
- For feature changes touching auth/scopes, always call out re-authorization steps and necessary Cloud Console changes.

---

If you'd like, I can merge this into the repo now (create/update `.github/copilot-instructions.md`) or tweak wording/sections—what would you like me to adjust or add? ✨