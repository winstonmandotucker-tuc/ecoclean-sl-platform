# Security Certification Report

Validation date: 17 July 2026. Scope: local ECOCLEAN Express API, MariaDB, JWT sessions, RBAC, uploads and security headers.

`pnpm test:security` passed eight live probes: unauthenticated privileged access 401, Citizen RBAC denial 403, tampered JWT 401, injection-shaped login 422, malformed JSON 400 without stack disclosure, traversal 404, untrusted CORS origin rejected, and required security headers present. The Phase 4.5 test additionally proved session expiry, forced logout, password-reset invalidation, assignment/jurisdiction media authorization and corrupt/executable upload rejection.

Production upload delivery now requires a `clean` scan when `REQUIRE_CLEAN_UPLOADS=true` (automatically true in production). Infected files return 423 and quarantine records are retained. ClamAV installation was attempted twice on this host but Homebrew download stalled; eight queued scans remain. Therefore malware scanning is **not certified**.

Internal security score: **90/100** after strict scan gating and live quarantine/scan monitoring. External production certification is withheld pending ClamAV/signature validation and an independent penetration test.
