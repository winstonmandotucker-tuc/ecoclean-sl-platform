# ECOCLEAN SL Production Deployment Guide

## Topology

- React/Vite frontend: Vercel.
- Express API and background workers: Railway.
- MariaDB and persistent uploads/backups: Railway-compatible persistent infrastructure controlled by ECOCLEAN SL.
- DNS and HTTPS: production domains owned by ECOCLEAN SL.

## Railway

Configure `NODE_ENV=production`, `API_PORT`, `FRONTEND_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `COOKIE_SECURE=true`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`, notification-provider credentials, and persistent storage paths. Never use development seed passwords in production.

Railway runs `pnpm db:migrate && pnpm db:seed && pnpm start:api`. Confirm `/api/health`, migration completion, persistent uploads, database writes, notification workers, backup storage, and restart behavior.

## Vercel

Use the Vite preset, `pnpm install --frozen-lockfile`, `pnpm build`, and `dist`. Set `VITE_API_URL` to the Railway API ending in `/api`. If Google Maps is authorized, set `VITE_GOOGLE_MAPS_API_KEY` to the restricted browser key and restrict it by the production domains and required APIs.

## Release validation

Run `pnpm lint`, `pnpm test`, `pnpm test:security`, and `pnpm build`. Validate registration, login/logout, password recovery, profile media, report creation/media, supervisor assignment, staff evidence, supervisor verification, notifications, conversations, exports, GIS, administrator access, and logout using production HTTPS URLs.

Rollback by redeploying the previous Git tag and restoring a verified database/upload backup only through the approved restore procedure.
