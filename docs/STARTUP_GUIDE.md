# ECOCLEAN SL Startup Guide

## Local XAMPP sequence

1. Start XAMPP Apache and MariaDB. This verified workstation uses Apache `8080` and MariaDB `3308`.
2. Verify MariaDB: `/Applications/XAMPP/xamppfiles/bin/mysqladmin -h127.0.0.1 -P3308 -uroot ping`.
3. In the project root run `pnpm install --frozen-lockfile`, `pnpm db:migrate`, `pnpm db:seed`, then `pnpm db:normalize`.
4. Start the API with `pnpm dev:api`; verify `http://127.0.0.1:4000/api/health`.
5. Start the frontend with `pnpm dev`; open `http://127.0.0.1:3000`.
6. Run `pnpm lint`, `pnpm test`, and `pnpm build`.

For production set a unique `JWT_SECRET`, restricted MariaDB credentials, the exact HTTPS `FRONTEND_URL`, `COOKIE_SECURE=true`, provider adapter secrets, and an ECOCLEAN tile URL. Serve `dist/` through Apache and proxy `/api` to the managed Node process. Keep `storage/uploads`, `storage/quarantine`, and `storage/backups` writable by the API account but inaccessible as public Apache directories.

## Recovery

If MariaDB is unavailable, confirm the port and credentials before restarting it. If sessions fail after deployment, confirm the same JWT secret is present on every API process. If a migration fails, stop deployment, restore the most recent verified database backup, correct the new migration, and rerun it. Do not edit a migration already deployed to production.

