# Penetration Test Report

This was a safe automated application security validation, not an independent professional penetration test.

Passed controls: unauthenticated privileged access returned 401; Citizen access to security events returned 403; tampered JWT returned 401; injection-shaped login input returned 422; traversal returned 404; untrusted CORS origin was not authorized; Helmet supplied CSP, SAMEORIGIN, and `nosniff`; request IDs were present; `X-Powered-By` was absent.

The initial malformed-JSON probe exposed an Express development stack and local path. Phase 5 added a centralized 400 JSON response (`Malformed JSON request.`) and the test now asserts the sanitized body. CORS was also changed to emit credentials permission only for the configured frontend origin or non-browser clients.

Unverified: OWASP ZAP/Burp assessment, dependency CVE scan with a current advisory database, business-logic abuse, sustained rate-limit testing, MFA, ClamAV malware signatures, TLS configuration, host hardening, and infrastructure privilege review.

Measured security rubric: **15/20** — 8/8 local probes pass (10 points), revocable sessions/account lockout/upload signatures exist (5 points), while external penetration testing, malware scanning, TLS/host validation, and MFA evidence are absent (5 points withheld).

