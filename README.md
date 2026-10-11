# Sanjo (BuildTrack) — Frontend

React single-page app for the Sanjo work tracker. The API lives in the
`buildtrack` repo (see its README for architecture and endpoints).

**Live:** https://buildtrack-frontend-ten.vercel.app

## Stack

React 19, Vite, Tailwind CSS 4, React Router, Axios, react-i18next
(Ukrainian, English, Polish, Russian, Czech), a hand-written service worker and
web manifest for the PWA.

## Run locally

```bash
npm install
VITE_API_URL=http://localhost:4000 npm run dev   # http://localhost:5173
npm test        # node:test: hours maths, money formatting, month ranges
npm run build
```

In production the app calls the same-origin `/api`, which `vercel.json`
rewrites to the API on Railway. That keeps the auth cookie first-party, which
Safari requires. To move the API, change the rewrite's `destination` there.

## Layout

- `src/pages` — one file per screen, each loaded as its own chunk.
- `src/components/RecordForm.jsx` — the daily-record form, shared by "New
  record" and editing: per-worker times, hours, rate and notes.
- `src/utils` — pure helpers (`hours.js`, `money.js`, `monthRange.js`) with tests in `test/`.
- `src/i18n/locales` — one JSON file per language; add a key to all five.
- `public/sw.js`, `public/manifest.webmanifest` — PWA.

## Behaviour worth knowing

- Hours can be typed with a dot or a comma (`11,5`).
- Hours computed from start/end subtract a 30-minute lunch break; a new worker
  row defaults to 07:00–19:00 (11.5 h).
- A 401 from the API sends the user to the login page.

GitHub Actions runs the tests, the build and `npm audit` on every push.
