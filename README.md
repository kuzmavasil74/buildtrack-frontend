# Sanjo (BuildTrack) — Frontend

The web app for Sanjo, a work tracker for construction crews: daily records
per worker, crews and sites, monthly payroll, receipt photos and a small team
with owner and foreman roles. It installs on a phone as a PWA.

| | |
|---|---|
| **Live** | https://buildtrack-frontend-ten.vercel.app |
| **API repo** | [`buildtrack`](https://github.com/kuzmavasil74/buildtrack): architecture, endpoints, roles, deploy and backups |
| **Languages** | Ukrainian, English, Polish, Russian, Czech |
| **Access** | Invitation only: accounts are created from an invitation link |

## Stack

React 19, Vite 8, Tailwind CSS 4, React Router, Axios and react-i18next. The
service worker and web manifest are written by hand. Tests use `node:test`,
with no extra dependencies.

## Run locally

```bash
npm install
VITE_API_URL=http://localhost:4000 npm run dev   # http://localhost:5173
npm test
npm run lint
npm run build
```

Start the API first (see its README). Sign-up needs an invitation, so start it
with `OPEN_REGISTRATION=true` to create the first account on an empty database.

In production the app calls the same-origin `/api`, which `vercel.json`
rewrites to the API on Railway. That keeps the auth cookie first-party, which
Safari requires. To move the API, change the rewrite's `destination` there.
Every push to `main` deploys on Vercel.

## Screens

| Path | Who | What |
|---|---|---|
| `/`, `/login`, `/forgot-password`, `/reset-password` | everyone | sign-in and password reset |
| `/invite?token=` | everyone | shows an invitation and leads to sign-up, sign-in or joining |
| `/register?invite=` | invited people | sign-up with the email fixed by the invitation and privacy consent |
| `/privacy` | everyone | GDPR privacy policy |
| `/home` | signed in | this month's numbers and quick actions |
| `/dashboard`, `/records` | signed in | new record; list with PDF/CSV export (foremen edit only their own) |
| `/receipts` | signed in | upload, thumbnails, full-size viewer, site filter |
| `/account` | signed in | download my data, delete my account |
| `/crews`, `/sites`, `/payroll`, `/team` | owner | crews and QR codes, sites, monthly pay, members and invitations |
| `/admin` | `ADMIN_EMAILS` | users, activity and record counts |

## Layout

- `src/pages` holds one file per screen. Each one is loaded as its own chunk.
- `src/components/RecordForm.jsx` is the daily-record form, shared by "New
  record" and editing: per-worker times, hours, rate and note.
- `src/components/ProtectedRoute.jsx` loads `/auth/me` and provides it
  through `src/context/me.js` (`useMe`, `isOwner`, `canEditRecord`). Its
  `ownerOnly` and `adminOnly` props send other users to `/home`.
- `src/api/api.js` holds every API call. A 401 outside the public pages sends
  the user to sign-in.
- `src/utils` holds pure helpers with tests in `test/`: hours, money, month
  ranges, relative time, receipt compression and account checks.
- `src/legal/privacyPolicy.js` contains the policy text (Ukrainian, also shown
  for Russian; English for the other languages) and the operator's details.
- `src/i18n/locales` has one JSON file per language. Add every key to all five.
- `public/sw.js` and `public/manifest.webmanifest` make it a PWA;
  `scripts/generate-icons.mjs` builds the icons.

## Behaviour worth knowing

- Hours can be typed with a dot or a comma (`11,5`). Hours computed from
  start/end subtract a 30-minute lunch break, and a new worker row defaults to
  07:00–19:00 (11.5 h).
- Receipt photos are scaled to at most 2000 px and re-encoded as JPEG before
  upload, so a 7 MB phone photo becomes about 0.5 MB. Files the browser cannot
  decode are uploaded as they are.
- Receipt links from the API last an hour, so the receipts page re-fetches the
  list every 50 minutes.
- If a tab opened before a deploy asks for a page chunk that no longer exists,
  the app reloads once to get the new build instead of showing a blank page.

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs the tests, the build and
`npm audit --audit-level=high` on every push and pull request.
