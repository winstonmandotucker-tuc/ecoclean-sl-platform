# Ownership compliance report

## Decision

ECOCLEAN SL can be built and operated on infrastructure controlled by the project without a proprietary third-party business platform. Ownership compliance after Phase 2.5 is 96/100; vendor independence is 97/100.

## Controlled by ECOCLEAN SL

Source code, frontend, API, MariaDB schema and records, authentication, authorization, RBAC, GIS records, audit events, API-key issuance, reporting endpoints, tasks, notification records, deployment configuration, and operational workflows are locally controlled.

API credentials are created with cryptographically secure server randomness. Only SHA-256 hashes, prefixes, and final display characters are stored. Rotation revokes the preceding active key and writes an audit event. The plaintext is returned once.

## Vendor removal evidence

- No Gemini package or source import.
- No Google AI Studio/Cloud Run metadata or configuration.
- No remote Google Fonts or Unsplash assets.
- No hardcoded CARTO tile endpoint.
- No Firebase, Supabase, hosted authentication, hosted primary database, no-code workflow engine, or SaaS-controlled business logic.
- The pnpm lockfile is the single dependency lock; the stale Bun lockfile was removed.

## Remaining limitations

- Operational prototype datasets remain in browser local storage pending Phase 3 API migration.
- A production ECOCLEAN tile server must be provisioned for detailed self-hosted maps; the included local fallback preserves offline rendering but is intentionally non-geographic.
- Notification delivery adapters, file storage, backup infrastructure, monitoring, and full automated testing remain to be completed.
- Legal ownership still requires contributor/contractor IP assignments and trademark records outside the repository.
