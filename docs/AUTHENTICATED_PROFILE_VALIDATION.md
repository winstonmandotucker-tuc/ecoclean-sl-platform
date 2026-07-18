# Authenticated Profile Validation

Validated 18 July 2026 against the live Express API and XAMPP MariaDB database.

## Registration validation

Registered `Mariama Profile Validation` through `POST /api/auth/register`. MariaDB created user ID 33 with role `CITIZEN`, a 60-character bcrypt hash, a normalized `user_profiles` row and a `user_preferences` row. No browser-only identity record was used.

## Login validation

The registered account authenticated successfully using both its email address and its phone number (`+23288180718`) with the same password. Invalid roles remain protected by the existing server RBAC. `GET /api/auth/me` returned the database-backed public profile.

## Dashboard personalization validation

The authenticated session contract now returns full name, phone, role, role label, municipality, municipality ID, district and profile-photo URL. Citizen, Staff, Supervisor, Administrator and National Administrator dashboards/sidebars consume this object. Profile photos use the authenticated upload endpoint and fall back only to the real user's initial when no photo exists. Source search returned no remaining `Salone Citizen`, `Demo Citizen`, `Demo User`, `Test User` or `Sample User` identity placeholders.

## Profile persistence validation

The validation account was updated to `Mariama Database Profile`, Freetown City Council, Western Area Urban, address `18 Persistence Road`, and profile upload ID 19. The same values were returned after logout/email login, phone login, API restart and MariaDB stop/start. The authenticated photo endpoint returned HTTP 200 and 68 persisted bytes after restart.

## Database verification

MariaDB showed: user ID 33, `CITIZEN`, Freetown City Council, Western Area Urban, the saved address, profile upload ID 19 and bcrypt hash length 60. Registration, authentication and profile state are therefore database-backed and restart-persistent.

## Automated verification

The integration suite includes phone login and verifies that `/api/auth/me` contains the real identity, role label, municipality and profile-photo fields. Existing five-role authentication, RBAC, export and upload tests remain enabled.
