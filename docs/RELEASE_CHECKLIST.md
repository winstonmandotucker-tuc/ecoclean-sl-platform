# Release Checklist

- [ ] Create a private ECOCLEAN-owned Git repository and protect the release branch.
- [ ] Confirm `.env`, `.env.local`, `.env.production`, logs, dependencies and build outputs are ignored.
- [ ] Scan history and working tree for secrets; rotate any previously shared credentials.
- [ ] Replace development seed password through `SEED_PASSWORD`; never seed production.
- [ ] Run frozen install, migrations, TypeScript, integration, security, UX, load and build checks.
- [ ] Record database and upload backup SHA-256 values and complete restore approval.
- [ ] Sign/tag the release only after the production scorecard blockers are closed.
- [ ] Publish SBOM, licence attribution, deployment guide and rollback owner.
