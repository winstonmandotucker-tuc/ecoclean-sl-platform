# Pilot Deployment Report

Recommended pilot sequence: Freetown first, then Bo, Kenema and Makeni after two stable operating weeks. Each municipality requires verified boundary/licensing data, municipality-scoped Supervisor accounts, trained Staff, a support escalation owner and tested backup/restore access.

## Deployment checklist

1. Provision TLS domain, restricted MariaDB account, Node process supervisor and off-host backup destination.
2. Configure strong secrets, exact frontend origin, secure cookies and `REQUIRE_CLEAN_UPLOADS=true`.
3. Install/update ClamAV; prove clean and EICAR quarantine paths.
4. Configure one email, SMS and push adapter; prove delivery, retry and dead-letter behavior.
5. Import approved district/municipality/ward polygons with source and licence metadata.
6. Run migrations, build, security tests, restore rehearsal and role acceptance tests.
7. Enrol administrators, supervisors and field staff; publish citizen support channels.
8. Monitor error rate, DB latency, queue depth, disk, backups and unresolved security events daily.

Pilot readiness: **91/100**. A controlled internal pilot may proceed without external notifications only if that limitation is accepted; a public municipal pilot requires the critical items above.
