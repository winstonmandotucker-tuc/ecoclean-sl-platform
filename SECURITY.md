# ECOCLEAN SL Security Policy

Report suspected vulnerabilities privately to the project owner or an explicitly authorized ECOCLEAN SL security contact. Do not disclose vulnerabilities publicly, access data beyond what is required to demonstrate the issue, degrade services, or test production accounts without written authorization.

Reports should include the affected component, reproduction steps, impact, evidence, and suggested remediation. Secrets must never be placed in issues or commits.

The supported release is the latest release candidate on `main`. Security controls include bcrypt password hashing, verified JWT-backed sessions, HttpOnly cookies, RBAC, rate limiting, Zod validation, upload type/size/signature checks, scan/quarantine records, jurisdiction enforcement, and audit logging. Production requires HTTPS, secure cookies, strong rotated secrets, restricted database credentials, malware scanning, backups, monitoring, and provider credential rotation.
