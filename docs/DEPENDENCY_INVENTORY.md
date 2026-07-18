# Dependency inventory

Inventory date: 2026-07-16. The authoritative resolved versions are in `pnpm-lock.yaml`.

## Runtime and build dependencies

| Package | Purpose | License | Ownership classification |
|---|---|---|---|
| React / React DOM | UI runtime | MIT | Open-source library |
| Vite / React Vite plugin | Build and development server | MIT | Open-source tooling |
| Tailwind CSS / Tailwind Vite plugin | Styling and CSS compilation | MIT | Open-source tooling |
| Plus Jakarta Sans | Locally packaged UI font | OFL-1.1 | Redistributable font asset |
| JetBrains Mono | Locally packaged monospaced font | OFL-1.1 | Redistributable font asset |
| Express | ECOCLEAN-hosted API runtime | MIT | Open-source framework |
| mysql2 | MariaDB/MySQL connection | MIT | Open-source driver |
| bcryptjs | Password hashing | BSD-3-Clause | Open-source security library |
| jsonwebtoken | Signed session tokens | MIT | Open-source security library |
| Helmet | HTTP security headers | MIT | Open-source security library |
| cors | Controlled browser API access | MIT | Open-source middleware |
| express-rate-limit | API abuse controls | MIT | Open-source middleware |
| Zod | API input validation | MIT | Open-source library |
| dotenv | Self-hosted environment configuration | BSD-2-Clause | Open-source library |
| Leaflet | GIS map rendering | BSD-2-Clause | Open-source mapping library |
| Lucide React | Interface icons | ISC | Open-source UI library |
| Motion | Existing UI animations | MIT | Open-source UI library |
| Multer | XAMPP-compatible authenticated multipart uploads | MIT | Open-source middleware |

## Development-only dependencies

TypeScript (Apache-2.0), esbuild (MIT), tsx (MIT), Autoprefixer (MIT), Tailwind CSS (MIT), Vite (MIT), and the TypeScript declaration packages for Node, Express, CORS, JWT, and Leaflet (MIT).

## External services

There is no mandatory proprietary business service. The browser connects only to the configured ECOCLEAN API and map tile URL. The default map tile is local. Production may use an ECOCLEAN-owned tile server through `VITE_MAP_TILE_URL`. Email/SMS delivery is not yet connected and must be implemented through an optional replaceable adapter.

## Removed dependencies

`@google/genai` and its transitive Google authentication/runtime packages were removed. Google-hosted fonts, Unsplash images, CARTO hardcoding, Google AI Studio metadata, and Cloud Run assumptions were also removed.
