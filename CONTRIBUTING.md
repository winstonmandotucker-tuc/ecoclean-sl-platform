# Contributing to ECOCLEAN SL

ECOCLEAN SL is proprietary software. Contributions are accepted only from people explicitly authorized by Samuel Mando Tucker. Authorization to contribute does not grant ownership, redistribution, deployment, or commercial-use rights.

Use a feature branch based on `develop`, preserve the established architecture and visual design, include migrations for schema changes, validate all API inputs, enforce RBAC, add audit events for operational mutations, and never commit credentials, uploads, backups, database dumps, logs, or generated runtime files.

Before review, run `pnpm lint`, `pnpm test`, and `pnpm build`. Describe database, API, security, and user-impact changes in the pull request.
