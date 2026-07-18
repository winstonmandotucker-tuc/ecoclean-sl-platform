$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot
if (-not (Test-Path ".env.production")) { throw "Create .env.production from .env.production.example first." }
pnpm install --frozen-lockfile
pnpm db:migrate
pnpm build
pnpm start:api
