# Report Export Validation

Implemented 18 July 2026 without changing existing navigation or visual identity.

Supported formats: Excel-compatible UTF-8 CSV, PDF, JSON and GeoJSON. Data is queried directly from normalized MariaDB report/user/jurisdiction tables. Supervisors receive only reports matching their configured municipality or district. Administrators and National Administrators receive national results. Citizen and Staff access is denied by server RBAC.

Actual validation generated a 2,135-byte CSV, a 1,305-byte PDF with `%PDF-1.4` signature, a 3,421-byte JSON export containing five records, and a 1,014-byte jurisdiction-scoped Supervisor CSV. Citizen access returned HTTP 403. Four initial export audit records were persisted. TypeScript and the production build passed after implementation.
