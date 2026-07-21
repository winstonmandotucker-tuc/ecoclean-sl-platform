# ECOCLEAN SL

ECOCLEAN SL is a smart waste-management and environmental-intelligence platform for Sierra Leone. It provides role-specific experiences for Citizens, Staff, Supervisors, Administrators, and National Administrators while preserving the original React user experience.

## Current architecture

- Frontend: React 19, TypeScript, Vite 6, Tailwind CSS, Leaflet, Motion
- Routing: the existing state-driven view controller in `src/App.tsx`
- State: React component state; local storage is retained only for non-sensitive UI preferences and legacy prototype datasets
- API: Express/TypeScript REST API under `/api`
- Database: MariaDB/MySQL with InnoDB foreign keys and indexed operational tables
- Authentication: bcrypt password hashing and signed JWT sessions in HttpOnly cookies
- Authorization: server-enforced role checks plus existing frontend route guards

The Phase 2 migration plan and remaining mock-data inventory are in `docs/PHASE_2_MIGRATION.md`.

## Ownership model

ECOCLEAN SL owns and controls the proprietary application source, frontend, API, database schema and records, authentication, authorization, RBAC, GIS records, audit logging, reporting, and operational workflows. The project is marked `UNLICENSED`; see `COPYRIGHT.md`.

The application uses permissively licensed open-source frameworks and libraries, but no proprietary third-party platform controls its primary identity, database, authorization, or business logic. The dependency inventory, SBOM, license attribution, and ownership assessment are maintained in `docs/DEPENDENCY_INVENTORY.md`, `docs/SOFTWARE_BILL_OF_MATERIALS.md`, `docs/LICENSE_ATTRIBUTION.md`, and `docs/OWNERSHIP_COMPLIANCE_REPORT.md`.

## Vendor independence

The default application requires no Gemini, Google AI Studio, Firebase, Supabase, hosted authentication, hosted database, no-code workflow engine, or vendor-owned operational service. Fonts, demonstration images, and the fallback map tile are served locally. Detailed map tiles are selected through environment configuration so ECOCLEAN can operate its own tile server.

## Requirements

- Node.js 20+
- pnpm 10+
- MariaDB 10.4+ or MySQL 8+

## XAMPP setup

1. Install XAMPP with Apache, PHP 8.2+, and MariaDB.
2. Start Apache and MariaDB from the XAMPP manager. This workstation currently uses Apache port `8080` and MariaDB port `3308`; use ports `80` and `3306` when configured to the standards.
3. Confirm MariaDB with `/Applications/XAMPP/xamppfiles/bin/mysqladmin -h127.0.0.1 -P3308 -uroot ping` on macOS, or the equivalent `mysqladmin` command on Windows/Linux.
4. Point Apache at the built `dist` directory when serving the frontend through Apache. During development, Vite serves the frontend on port 3000 and Apache can remain available for deployment validation.
5. Ensure the Node API process can write to `storage/uploads`. Never expose that directory directly through Apache; authenticated downloads use `/api/uploads/:id`.

## Environment setup

Environment templates are provided for development, testing, and production:

- `.env.development` — local development defaults
- `.env.test` — isolated automated-test configuration
- `.env.production.example` — production template; copy it outside version control and supply strong secrets

Important values are `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `FRONTEND_URL`, `VITE_API_URL`, `VITE_MAP_TILE_URL`, and `VITE_MAP_ATTRIBUTION`. Never deploy the development JWT secret or an empty database password.

Phase 5 adds portable `DB_DUMP_BINARY`, `ARCHIVE_BINARY`, and `CLAMDSCAN_BINARY` paths for Linux, macOS, and Windows/XAMPP deployments.

## Database startup

The development configuration expects the local MariaDB server on port `3308` and creates `ecoclean_2000plus` automatically.

```bash
pnpm install
pnpm db:migrate
pnpm db:seed
```

The seed command creates five development accounts. Their password is `Demo@2026!`:

- `citizen@ecoclean.sl`
- `staff@ecoclean.sl`
- `supervisor@ecoclean.sl`
- `admin@ecoclean.sl`
- `nationaladmin@ecoclean.sl`

## Start the application

Run the API and frontend in separate terminals:

```bash
pnpm dev:api
pnpm dev
```

- Frontend: `http://127.0.0.1:3000`
- API health: `http://127.0.0.1:4000/api/health`

The frontend sends credentialed requests to the API. The configured frontend origin must exactly match the browser origin for cookie sessions to work.

## Authentication and roles

Registration creates real MariaDB Citizen accounts. Login accepts either email plus password or phone number plus password and returns a signed session cookie that JavaScript cannot read. `GET /api/auth/me` restores the database-backed full name, role, municipality, district and profile-photo reference after refresh, and logout invalidates the browser cookie. Password recovery issues a hashed, expiring, single-use token. The raw token is returned only in non-production environments until an email/SMS provider is configured.

Server roles are `CITIZEN`, `STAFF`, `SUPERVISOR`, `ADMINISTRATOR`, and `NATIONAL_ADMIN`. The API applies role authorization independently of the UI.

## API overview

- `/api/auth/*` — registration, login, session, logout, password recovery
- `/api/users` — administrator user listing
- `/api/reports` — role-scoped report listing and Citizen creation
- `/api/tasks` — role-scoped task listing
- `/api/notifications` — notification listing and read receipts
- `/api/gis/hierarchy`, `/api/gis/reports` — location hierarchy and map data
- `/api/audit-logs` — administrator audit access
- `/api/dashboard` — role-scoped operational metrics
- `/api/operational-state` — MariaDB compatibility state for remaining legacy view models
- `/api/system/settings`, `/api/rbac` — centrally controlled configuration and permissions
- `/api/support/tickets`, `/api/support/conversations/*` — Service Center tickets and messaging
- `/api/uploads` — authenticated, ownership-checked local evidence storage
- `/api/announcements` — role-targeted announcements and notification creation
- `/api/rewards`, `/api/campaigns`, `/api/community/*` — normalized engagement domains
- `/api/fleet/*`, `/api/assets`, `/api/contractors`, `/api/documents` — normalized enterprise domains
- `/api/notifications/providers`, `/api/notifications/jobs` — replaceable delivery adapters and queue tracking
- `/api/backups`, `/api/security/events`, `/api/auth/sessions`, `/api/operations/health` — deployment operations and security controls
- `/api/gis/layers`, `/api/gis/markers`, `/api/gis/boundaries`, `/api/gis/communities` — expanded vendor-neutral GIS data
- `/api/reports/export` — audited Supervisor/Admin report exports in Excel-compatible CSV, PDF, JSON and GeoJSON; Supervisor results are jurisdiction-scoped

Detailed Phase 3 routes and validation evidence are recorded in `docs/PHASE_3_OPERATIONAL_IMPLEMENTATION.md`.

## Development workflow

```bash
pnpm lint
pnpm test
pnpm test:security
pnpm test:ux
pnpm test:load
pnpm test:load:certification
pnpm build
```

After schema changes, add an ordered SQL file to `database/migrations`; do not rewrite an already deployed migration. Run migrations before seeds. API inputs must use Zod validation, privileged routes must use authentication and authorization middleware, and security events must be audited.

## Production notes

Use HTTPS, a strong unique `JWT_SECRET`, a restricted database user, a production process manager, a reverse proxy, managed backups, and an external mail/SMS delivery provider. Set `NODE_ENV=production`, the exact HTTPS `FRONTEND_URL`, and `COOKIE_SECURE=true`. Run `pnpm install --frozen-lockfile`, migrations, `pnpm build`, and then `pnpm start:api`.

## Deployment independence and infrastructure

ECOCLEAN may deploy the complete platform to its own Linux, Windows/XAMPP-compatible, virtual-machine, or container infrastructure. Required services are Node.js 20+, pnpm, MariaDB/MySQL, TLS termination, persistent backup storage, and an ECOCLEAN-controlled domain. A self-hosted tile service is recommended for detailed offline GIS. Email/SMS, object storage, and monitoring must be connected through replaceable internal adapters rather than embedded vendor business logic.

The local fallback map is available at `/assets/map-tile.svg`; production should set `VITE_MAP_TILE_URL` to the ECOCLEAN tile service. Operational GIS records always remain in MariaDB.

## Vercel frontend deployment

The private GitHub repository is prepared for Vercel deployment through `vercel.json`. Import `winstonmandotucker-tuc/ecoclean-sl-platform` into Vercel with the Vite preset; Vercel will run the locked pnpm installation, build `dist`, provide HTTPS and redeploy from `main` automatically.

Vercel hosts the React frontend only in the recommended production topology. Before enabling authenticated workflows, configure `VITE_API_URL` in Vercel to the public HTTPS address of the separately hosted Express API. The MariaDB database, uploads, backup jobs, notification workers and operational services remain on ECOCLEAN-controlled persistent infrastructure.

## Phase 2 status

Completed: database foundation, migrations, role/permission seeding, real registration/login/logout/session restoration, password hashing and recovery tokens, protected API middleware, core REST endpoints, environment separation, and frontend authentication migration.

Remaining: individual dashboard datasets still contain legacy local-storage/mock adapters; report/task/notification/GIS services exist but each screen must be migrated and acceptance-tested in later phases. File uploads, notification delivery providers, full automated test coverage, refresh-token rotation/revocation, and production observability are not yet complete.

## Phase 2.5 ownership status

Completed: removed Google/Gemini dependencies and claims, removed AI Studio and Cloud Run assumptions, localized fonts and demonstration assets, added an offline map fallback and configurable ECOCLEAN tile support, introduced server-generated hashed API keys, added proprietary ownership notices, and created dependency/SBOM/license/local-storage compliance documentation.

The remaining local-storage migration sequence is documented in `docs/LOCAL_STORAGE_MIGRATION_PLAN.md`.

## Phase 3 operational status

Completed foundations: normalized report history, task history and notes, authenticated uploads, notification delivery tracking, announcements, Service Center tickets/conversations/messages, central settings, audit policies, RBAC APIs, role dashboards, API-based profile updates, database-backed operational compatibility state, and route-level frontend code splitting.

All operational browser `localStorage` usage has been removed. Only `ecoclean_onboarding_completed` and `ecoclean_last_view` remain as non-sensitive interface preferences. Citizen reports and Staff task/notification views load from normalized APIs. Legacy secondary modules now persist through the MariaDB operational-state adapter until each receives a dedicated normalized Phase 4 domain model.

Phase 4 implementation and measured limitations are recorded in `docs/PHASE_4_IMPLEMENTATION.md`. Startup, security, backup, notification, GIS, and testing runbooks are maintained in the corresponding files under `docs/`.

## Phase 4 pilot-hardening status

Completed foundations: all-role Service Center UI; normalized rewards, campaign, community, fleet, asset, contractor, and document tables/APIs; migration of 28 transitional records; provider-neutral notification queues; backup creation/history/retention; restore-request workflow; revocable device sessions and account lockout; upload scanning/quarantine adapter; GIS layers, markers, boundaries and communities; structured logs; operational health metrics; and live API integration tests.

Measured validation: TypeScript passed, the production build passed, 5/5 integration test groups passed, all five seeded roles authenticated, and XAMPP Apache/MariaDB plus frontend/API startup were verified locally. Known pilot blockers are real provider delivery tests, ClamAV installation, restore rehearsal, authoritative GIS boundary import, browser regression coverage, measured code coverage, load testing, Windows XAMPP validation, and operator UI for every new administration endpoint. Because these are material, the project does not yet claim the requested 94% production-readiness target.

## Troubleshooting

- API reports database unavailable: verify `DB_HOST`, `DB_PORT`, credentials, and `mysqladmin ping`.
- Browser login does not persist: ensure `FRONTEND_URL` exactly matches the browser origin and use HTTPS with `COOKIE_SECURE=true` in production.
- Upload rejected: allowed types are JPEG, PNG, WebP, and PDF; maximum size is 8 MB and file signatures are inspected.
- Map shows the ECOCLEAN fallback: configure `VITE_MAP_TILE_URL` for the ECOCLEAN-owned production tile server and rebuild the frontend.
- XAMPP reports MariaDB stopped while the API works: verify with `mysqladmin ping`; protected or stale PID files can make the XAMPP status script inaccurate.
- Frontend changes are missing: stop Vite, run `pnpm dev`, and reload the browser.

## Phase 5 production-validation status

The local backup restore, safe security probes, monitoring, and 1,000/5,000/10,000-request load stages passed. The 10,000-request stage completed with zero failures, 1,460.69 requests/second, p95 87.01 ms, and p99 135.98 ms. A malformed-JSON stack disclosure found during testing was corrected.

Production is **not certified** because real email/SMS/push credentials are absent, ClamAV is not installed, authoritative Sierra Leone boundaries are not imported, an independent penetration test is outstanding, and Windows XAMPP was not available for execution. The evidence rubric is [docs/FINAL_READINESS_AUDIT.md](docs/FINAL_READINESS_AUDIT.md); all Phase 5 reports are under `docs/`.

## Change log

- 21 July 2026 — corrected silent submit failures across Citizen reports and support, Staff task/evidence operations, Supervisor assignments/messages/verification, and Administrator users/reports/settings/broadcasts. Valid Sierra Leone district UI labels now resolve to canonical MariaDB scope, GPS uses device coordinates, and operational actions wait for API confirmation before showing success. Validation evidence is in [docs/FUNCTIONALITY_CORRECTION_REPORT.md](docs/FUNCTIONALITY_CORRECTION_REPORT.md).

## Authenticated dashboard identity status

All role dashboards and identity capsules now display the real authenticated profile returned by `/api/auth/me`, including full name, profile photo or real initial, role and municipality when configured. Login supports email or phone number. Placeholder identity names were removed. Registration, email login, phone login, logout/login persistence, API restart persistence and MariaDB restart persistence are recorded in [docs/AUTHENTICATED_PROFILE_VALIDATION.md](docs/AUTHENTICATED_PROFILE_VALIDATION.md).

## Report export status

Supervisors and Administrators can export real MariaDB incident reports as branded PDF, native formatted Excel (`.xlsx`), native branded Word (`.docx`), CSV, JSON, or GeoJSON. The document formats include an ECOCLEAN SL letterhead, report metadata, bordered tables, authorization areas, and official footers. Citizens and Staff are denied; Supervisor exports are restricted to the configured municipality/district; every successful export is recorded in `audit_logs`.

## Final local hardening status

The production worker now processes notification jobs, upload scans, backup retention and daily/weekly/monthly backup schedules. The Administrator System Health screen uses live MariaDB/API evidence instead of simulated infrastructure values. XAMPP MariaDB system tables were upgraded successfully, core ECOCLEAN tables analyze cleanly, and a repetitive 751 MB error log was safely rotated after preserving diagnostic evidence.

GitHub preparation is documented in [docs/GITHUB_REPOSITORY_SPECIFICATION.md](docs/GITHUB_REPOSITORY_SPECIFICATION.md). The recommended private repository name is `ecoclean-sl-platform`, with `v1.0.0-rc.1` as the first release candidate tag.

## Phase 5 certification status

The 10,000/25,000/50,000-request certification profile passed all 85,000 authenticated requests with zero failures. An isolated database restore reproduced 76 tables, 111 foreign keys and exact user/upload/report/GIS counts. Production now defaults to blocking media until its malware scan is clean.

ECOCLEAN is not production certified: ClamAV installation/signature validation, real email/SMS/push credentials, authoritative Sierra Leone boundary polygons, Windows XAMPP execution, independent penetration testing and production supervision/HA remain absent. See [docs/PHASE_5_PRODUCTION_CERTIFICATION.md](docs/PHASE_5_PRODUCTION_CERTIFICATION.md) and [docs/PRODUCTION_READINESS_SCORECARD.md](docs/PRODUCTION_READINESS_SCORECARD.md).

## Phase 4.5 user-experience and persistence status

Completed: normalized all-role profiles and preferences, real password changes, profile-photo lifecycle, Citizen report media, Staff task evidence, authenticated media access, report deletion rules, notification read/delete persistence, ticket closure, assignment/jurisdiction authorization and National Administrator profile access. Run `pnpm test:ux` for the live five-role acceptance journey.

Measured on 17 July 2026: TypeScript, production build, 5/5 integration groups and 8/8 security probes passed; all five temporary role journeys passed; MariaDB contained 76 tables and 111 foreign keys; persistence survived API restart; four browser breakpoints had no horizontal overflow. See [docs/PHASE_4_5_FINAL_REPORT.md](docs/PHASE_4_5_FINAL_REPORT.md).

Known Phase 4.5 limitations: real provider delivery, ClamAV, authoritative GIS boundaries, Windows execution and independent penetration testing remain deployment blockers. Image thumbnails/compression, video evidence, full physical-device camera/gallery testing and complete browser dashboard automation remain unfinished.

- Phase 2: converted simulated authentication to MariaDB-backed secure sessions; added the production data/API foundation and environment profiles without changing the existing design or navigation.
- Phase 2.5: hardened ownership, removed vendor remnants, localized runtime assets, made maps provider-neutral, and documented software ownership and dependencies.
- Phase 3: moved operational persistence to MariaDB APIs, added reports/tasks/uploads/notifications/Service Center/configuration workflows, expanded auditing, and reduced the initial frontend bundle through lazy loading.
- Phase 4 (in progress): integrated the all-role Service Center, normalized secondary domains, added notification/backup/security/GIS/monitoring foundations, and introduced live integration tests and pilot runbooks.
- Phase 5: completed local load/security/restore validation, hardened error and CORS handling, added portable XAMPP backup paths and deployment templates, and issued an evidence-based non-certification pending external integrations and host validation.
- Phase 4.5: completed normalized profile/settings/media workflows and evidence-backed five-role persistence validation without changing the existing visual design.
- Phase 5 certification: added strict production scan gating and the 10k/25k/50k load profile; completed a zero-failure 85k request run and isolated restore rehearsal; issued an evidence-based non-certification for unresolved external infrastructure gates.

## July 2026 operational completion update

The active platform scope is Sierra Leone only, with four roles: Citizen, Staff, Supervisor, and Administrator. National Administrator access and seed data have been removed. The operational geography now contains all 16 current Sierra Leone districts and their district/city councils.

Citizen waste reports support two explicit evidence paths without changing the visual design: take a new rear-camera photograph or select up to five JPEG, PNG, or WebP images from the device gallery. Staff must likewise submit at least one camera/gallery completion image before a task moves to verification pending; only a Supervisor or Administrator may verify closure.

Report intake, district-scoped report visibility, staff directory lookup, supervisor assignment, notifications, ticket visibility, and conversation replies now use MariaDB-backed APIs. Staff can see reports in their jurisdiction but cannot act until assigned. Supervisor/Admin task assignment validates jurisdiction, prevents duplicate active tasks, notifies the staff member and citizen, and writes an audit event.

Latest measured validation: TypeScript passed, the Vite production build passed, and all 7 live API integration tests passed. A controlled citizen workflow stored report `ECO-2026-241441`, persisted one image upload, and created assigned task `TASK-2026-557301` for the district staff account. Apache, MariaDB, API, and frontend remain active locally.
