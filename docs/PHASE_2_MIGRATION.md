# Phase 2 migration strategy

## Baseline

The existing application is a React/Vite single-page prototype. `App.tsx` owns state-driven routing, portals own their feature state, and many feature datasets are initialized or persisted through local storage. The UI structure and visual system remain unchanged.

## Migration sequence

1. Identity foundation — completed. Replace the local-storage identity object with MariaDB users, bcrypt hashes, HttpOnly signed sessions, `/auth/me` restoration, server RBAC, and one-time password reset tokens.
2. Contract foundation — completed. Centralize credentialed HTTP handling and typed service modules for auth, reports, tasks, notifications, and GIS.
3. Operational data — next. Migrate one portal workflow at a time: Citizen reports, Staff tasks, Supervisor dispatch, Administrator management, then National analytics. A screen switches only after its read, write, loading, empty, and error states work against the API.
4. Media and communication — later phase. Replace data-URL/local uploads with validated object/file storage and connect notification delivery, messaging, and support-ticket APIs.
5. Decommission legacy persistence. Remove each local-storage key only after the matching API workflow and migration/seed path pass acceptance tests. UI preference keys such as onboarding completion may remain.

## Mock-data inventory

Authentication is real. Core service clients and database tables are real. Portal components still contain hardcoded or local-storage-backed reports, tasks, notifications, analytics, support content, and some GIS presentation data. These remain deliberately visible for staged migration; representing them as production data would be misleading.

## Database design

The core schema includes users, roles, permissions, reports, tasks, notifications, municipalities, districts, wards, zones, audit logs, and password reset tokens. Relationships use InnoDB foreign keys with restrictive deletion for ownership, `SET NULL` for optional historical links, and cascading deletion for role grants and user-owned notifications/tokens. Indexes cover authentication identifiers, role/status filtering, assignment/status filtering, hierarchy links, audit chronology, and map coordinates.

## Exit criteria for the next migration increment

- No selected workflow reads or writes feature data from local storage.
- API validation and server authorization cover every mutation.
- Loading, empty, permission-denied, validation, and network-failure states are tested.
- Migration and seed commands are repeatable.
- Existing layout, navigation, animations, typography, spacing, color, and branding remain unchanged.
