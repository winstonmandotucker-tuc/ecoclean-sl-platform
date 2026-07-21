# ECOCLEAN SL Functionality Correction Report

Date: 21 July 2026

## Confirmed defects corrected

- Citizen report submission rejected valid city-council labels because the UI municipality label did not match the district council stored in MariaDB. District scope is now resolved from the authoritative Sierra Leone district record and the canonical municipality is stored.
- Report submission previously cleared drafts and appeared successful before the API and evidence uploads completed. It now waits for persistence, prevents duplicate clicks, retains drafts on failure, and displays validation/API errors.
- GPS capture previously generated simulated coordinates. The action now requests real browser/device geolocation and reports permission or availability errors.
- Supervisor assignment displayed success before MariaDB confirmed task creation. It now waits for the assignment API and exposes failures.
- Staff task accept, reject, progress, evidence, and completion actions previously updated local UI without waiting for the API. They now update the interface only after backend confirmation.
- Task status transitions now synchronize the related report and notify the citizen after completion, verification, or rejection.
- The Staff Evidence Locker's general upload button previously inserted a demo image. It now opens the camera/gallery file picker and stores authenticated task evidence.
- Citizen support-ticket and reply buttons now use forms, validation, progress states, persistent APIs, and visible errors.
- Supervisor direct messages and broadcasts now create MariaDB notifications/announcements with audit records.
- Administrator report overrides, notification broadcasts, platform settings, account creation, account status, session revocation, and password-recovery requests now call real APIs instead of only changing compatibility state or displaying simulated success.
- Administrator user/report lists now refresh from MariaDB APIs.
- SMS/email broadcast options no longer claim success when no production provider is configured; the interface returns an explicit provider-unavailable message.

## Validation evidence

- TypeScript validation: passed.
- Production Vite build: passed.
- API integration: 9/9 passed, including all four roles, Bo City report submission, direct staff message, broadcast, settings persistence, exports, upload rejection, and authorization.
- Four-role acceptance workflow: passed for registration, bcrypt hashes, profiles, uploads, report/task lifecycle, notifications, support conversations, password changes, session expiry/revocation, audit logs, and MariaDB persistence.
- Report-submit database evidence: a report submitted using `Bo City Council (BCC)` was stored under the canonical `Bo District / Bo District Council` scope with `pending` status.

## Intentionally unavailable external actions

Real SMS, email, and push delivery still require production provider credentials. Those controls now fail honestly instead of displaying false delivery confirmation. Legacy prototype components that are not reachable from the four active production role menus are not treated as operational controls.

