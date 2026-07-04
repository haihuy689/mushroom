# Mushroom.Pi

Mushroom.Pi is a `Next.js` storefront-and-blog foundation built around the Pi ecosystem.

The current shape is:

- storefront-first UI for mushroom products
- blog/editorial layer for mushroom content
- Pi sign-in scaffold
- Pi Testnet payment scaffold with server-side verification, approval, and completion routes
- optional Postgres-backed storefront persistence for carts, saved addresses, and order history

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment setup

Copy the example values and add your real Pi credentials locally:

```powershell
Copy-Item .env.example .env.local
```

Environment variables:

- `PI_API_KEY`
  The Pi Server API Key from the Pi Developer Portal. Required for payment approval and completion routes.
- `NEXT_PUBLIC_PI_SANDBOX`
  Set to `true` only when testing via Pi Sandbox locally.
- `NEXT_PUBLIC_PI_NETWORK_LABEL`
  UI label only, useful for showing `Pi Testnet` while the app is still in test mode.
- `NEXT_PUBLIC_PI_AUTO_AUTH`
  Set to `true` if you want the Pi auth prompt to fire automatically once the Pi SDK is ready.
- `STOREFRONT_SESSION_SECRET`
  Recommended. Used to sign the secure storefront session cookie after Pi authentication. In development, the app falls back to a local dev secret. In production, set this explicitly unless you want to reuse `PI_API_KEY` as the signing secret.
- `DATABASE_URL`
  Recommended connection string for a Postgres database. For Supabase on Vercel, use the `Transaction pooler` / `Supavisor` connection string (serverless-safe, usually port `6543`). If this is missing, the storefront falls back to browser `localStorage`.
- `POSTGRES_URL`
  Optional alias used by Vercel Postgres. The app will use this automatically if `DATABASE_URL` is not set.

## Pi integration notes

This repo now includes:

- `src/app/api/pi/auth/route.ts`
  Verifies a Pi access token with `GET /me`.
- `src/app/api/pi/payments/approve/route.ts`
  Handles server-side approval for U2A payments.
- `src/app/api/pi/payments/complete/route.ts`
  Handles server-side completion after the blockchain txid is returned.
- `src/app/api/pi/payments/incomplete/route.ts`
  Attempts to reconcile incomplete Pi payments.
- `src/components/pi-commerce-panel.tsx`
  Client-side Pi auth and payment test surface.
- `src/app/api/storefront/state/route.ts`
  Secure storefront sync route for cart, address, and order persistence tied to the authenticated Pi session.

According to the official Pi docs, the app should be:

1. registered in the Pi Developer Portal
2. configured as a Pi Testnet app first
3. opened in Pi Browser or Pi Sandbox for native sign-in/payment testing

## Storefront persistence

When a shopper signs in with Pi, the auth route now sets a signed `httpOnly` cookie. The storefront sync API uses that cookie so cart, saved addresses, and order history can be stored safely per Pi account.

Behavior by environment:

- if `DATABASE_URL` or `POSTGRES_URL` exists, state is persisted to Postgres
- if no database connection string exists, the storefront still works and falls back to browser `localStorage`

For Vercel + Supabase, the easiest setup is:

1. create a Supabase project
2. in Supabase, open `Connect` and copy the `Transaction pooler` connection string
3. add that value to `DATABASE_URL` in Vercel
4. set `STOREFRONT_SESSION_SECRET`
5. redeploy

Why this mode:

- Supabase documents that transaction mode is the right fit for serverless or edge workloads
- transaction mode does not support prepared statements, and this app already disables prepared statements in the Postgres client for that reason

If you install Supabase through the Vercel Marketplace instead, Vercel can inject the credentials into your project automatically.

If you prefer manual setup locally:

1. copy `.env.example` to `.env.local`
2. paste the same Supabase transaction-pooler string into `DATABASE_URL`
3. set `STOREFRONT_SESSION_SECRET`
4. run `npm run dev`

## Quality checks

```bash
npm run lint
npm run build
```

## Deployment

The repository is already connected to GitHub and Vercel.

Typical flow:

```bash
git add .
git commit -m "Update Mushroom.Pi"
git push origin main
```

After push, Vercel should deploy the new version automatically.
