# Local-storage migration plan

Local storage is not a vendor dependency, but operational records stored there are not centrally controlled. UI preferences may remain; business records must migrate to ECOCLEAN APIs and MariaDB.

| Dataset | Current keys | Classification | Migration target | Priority |
|---|---|---|---|---|
| Reports | `ecoclean_reports`, `ecoclean_citizen_reports`, draft report | Operational | Reports API, uploads, offline queue table | Critical |
| Tasks | `ecoclean_staff_tasks`, schedules, performance | Operational | Tasks/assignments APIs | Critical |
| Notifications | Citizen/staff/supervisor notification keys | Operational | Notification and delivery tables | High |
| GIS | `ecoclean_gis_hierarchy` | Master data | Municipality/district/ward/zone APIs | Critical |
| Security/RBAC | users, audit logs, RBAC rules, system configuration | Security-critical | Admin APIs, roles/permissions/audit tables | Critical |
| Analytics | `ecoclean_kpis`, supervisor regions | Derived operational | Server aggregation and snapshots | High |
| Campaigns/community | citizen events, `eco_events` | Community operations | Campaign/event APIs | Medium |
| Rewards | points, badges, leaderboard | Financial/reputation-like | Reward ledger with immutable transactions | High |
| Fleet/assets | fleet, bins, assets, contractors | Operational | Fleet/asset/contractor tables and APIs | High |
| Support/documents | disaster, documents | Support/content | Support ticket, incident and document APIs | High |
| UI preferences | onboarding completion, last view | Non-sensitive UI | May remain locally; validate values | Low |
| Legacy session copies | `ecoclean_session_user` writes in profile flows | Obsolete/security | Remove; rely exclusively on `/auth/me` | Critical |

Migration order: remove legacy session writes; migrate central configuration/RBAC; Citizen reports and media; Staff tasks; Supervisor assignment/verification; notifications; GIS administration; analytics; campaigns/rewards/community; fleet/support/documents. Each cutover requires server validation, RBAC, audit logging, loading/error/empty states, and acceptance tests before deleting the associated key.
