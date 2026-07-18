# Phase 3 operational implementation

## Database additions

Migrations `003_operational_platform.sql` and `004_delivery_and_geography.sql` add countries, country/municipality expansion links, system settings, audit policies, report categories/history, task history/notes, support tickets, conversations, participants, messages, uploads, notification deliveries, announcements, and transitional operational states. The deployed schema contains 30 tables, 46 foreign-key constraints, and an in-app delivery-tracking trigger.

## Operational APIs

- Identity: `PATCH /api/auth/profile`
- Reports: list, create, detail/history/attachments, ownership-controlled edit and status update
- Tasks: list, assign, detail/history/notes, update, reassign, complete and verify
- Notifications: list, read, mark all read, delete, role announcements
- Uploads: multipart creation and authenticated download with MIME, size, signature, ownership, hash, and audit controls
- Service Center: ticket list/create/assign/escalate/resolve plus authorized conversation messages
- Administration: settings, RBAC, audit logs, users, GIS hierarchy and markers
- Dashboards: role-scoped report, task, notification, and ticket totals
- Compatibility: authorized MariaDB operational state for secondary legacy view models

## Validation evidence

On 2026-07-16, all five seeded roles authenticated. A Citizen created and retrieved a database report; a Citizen ticket was assigned and answered by a Supervisor; a Supervisor assigned a task; Staff accepted and completed it; Supervisor verified it; Staff uploaded validated PNG evidence; an Administrator issued a Citizen announcement; a National Administrator updated central settings. Dashboard, GIS, audit, RBAC, notification, and compatibility-state endpoints passed.

Apache passed syntax validation and answered with its expected redirect on port 8080, PHP 8.2.4 was available, MariaDB 10.4.28 answered on port 3308, the API answered on port 4000, and Vite served the frontend on port 3000. The XAMPP status helper could not read the protected MariaDB PID file, but `mysqladmin ping`, migrations, seeds, live API queries, and direct SQL all confirmed the database was running.

## Performance

Portal components are route-lazy-loaded. The initial production JavaScript bundle fell from approximately 1.3 MB to 486 KB. Role chunks are emitted separately, with the largest portal chunk approximately 203 KB before gzip.

## Remaining normalization

Citizen reports and Staff task/notification screens use normalized APIs. Secondary community, rewards, campaign, fleet, asset, contractor, document, and some administrative presentation models use the MariaDB operational-state adapter rather than browser local storage. These require dedicated domain schemas and APIs in Phase 4. The Service Center APIs are complete but need a dedicated existing-design UI entry point in the next UI-safe implementation phase.
