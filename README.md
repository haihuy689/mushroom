# Mushroom.Pi

Mushroom.Pi is a `Next.js` storefront-and-blog foundation built around the Pi ecosystem.

The current shape is:

- storefront-first UI for mushroom products
- blog/editorial layer for mushroom content
- Pi sign-in scaffold
- Pi Testnet payment scaffold with server-side verification, approval, and completion routes

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

According to the official Pi docs, the app should be:

1. registered in the Pi Developer Portal
2. configured as a Pi Testnet app first
3. opened in Pi Browser or Pi Sandbox for native sign-in/payment testing

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
