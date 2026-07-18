# GitHub Deployment Guide

The current project folder is not a Git repository, so publication was not executed. Create a private repository owned by ECOCLEAN SL, initialize it from this exact project root, review ignored files, run a secret scanner, commit intentionally, and enable protected branches plus required test/build checks.

Never commit `.env.production`, database dumps, upload bytes, provider credentials, JWT secrets or production user exports. Use repository secrets only for deployment transport; operational secrets must be stored on ECOCLEAN-controlled infrastructure. Release deployment should use `pnpm install --frozen-lockfile`, `pnpm db:migrate`, `pnpm build`, and a supervised `pnpm start:api` process.
