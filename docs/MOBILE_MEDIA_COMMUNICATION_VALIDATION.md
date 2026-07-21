# Mobile, Media, and Communication Validation

Validated locally on 21 July 2026 against the MariaDB-backed Express API.

## Implemented

- Citizen report submission no longer fails when a mobile browser denies GPS. Device coordinates are preferred; otherwise an approximate district point is paired with the required written street/landmark.
- New report, task, ticket, and profile images are stored as binary content in MariaDB and retained on the local storage disk as a compatibility copy.
- Citizens and the Staff member assigned to a report can exchange persisted messages until the work is completed. Supervisors and Administrators can monitor the same report conversation within their authorization scope.
- Staff can reply to direct Supervisor notifications.
- Ten named Staff development accounts are seeded and assigned to the Freetown/Western Area Urban operating scope.
- Staff identity fields and profile-photo controls are read-only. The API rejects Staff self-edits; a scoped Supervisor or Administrator can update Staff identity through the Staff Directory API.

## Measured evidence

- TypeScript check: passed.
- Production Vite build: passed.
- Integration suite: 9/9 passed.
- Staff directory returned 13 active local records (the ten canonical seeded Staff accounts plus three previously created local records).
- Staff self-edit returned HTTP 403.
- Citizen report-conversation read returned HTTP 200.
- Citizen message creation returned HTTP 201.
- Assigned Staff reply returned HTTP 201.
- A 46,363-byte JPEG upload stored exactly 46,363 bytes in `uploads.content_blob` and was served back with HTTP 200 at the same byte length.

## Operational note

Approximate district coordinates are not represented as device GPS. Field crews must use the submitted street/landmark and the report conversation to confirm the exact location when device permission is unavailable.
