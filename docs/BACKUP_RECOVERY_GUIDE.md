# Backup and Recovery Guide

The local backup service stores history in `backups` and artifacts under `storage/backups`. It supports database, uploads, configuration, and full backups through `POST /api/backups`. Daily backups retain 14 days, weekly backups 90 days, monthly backups 365 days, and manual backups 30 days. `POST /api/backups/enforce-retention` expires overdue artifacts.

The database dump intentionally exports tables and triggers but not stored routines. ECOCLEAN currently defines no stored application routines, and omitting them avoids XAMPP installations with stale `mysql.proc` metadata. If routines are introduced later, run the vendor-supported MariaDB upgrade and add explicit routine backup validation.

Production scheduling must invoke the authenticated backup workflow or an ECOCLEAN-controlled command runner daily, weekly, and monthly. Copy completed artifacts to a second ECOCLEAN-controlled host, encrypt them at rest, and monitor failed records.

Restore is a two-person workflow: an Administrator creates `/api/backups/:id/restore-request`; a National Administrator reviews it. Before restoration, verify the SHA-256 checksum, stop writes, take a safety backup, restore into an isolated database, run smoke tests, then promote it. The application intentionally does not execute destructive restoration from an HTTP request. Record approval, start/end time, operator, validation evidence, and rollback result in the restore audit trail.

Recovery testing remains required on a separate host before pilot approval. A backup record alone is not proof of recoverability.
