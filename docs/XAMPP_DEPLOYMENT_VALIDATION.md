# XAMPP Deployment Validation

Local validation on macOS XAMPP used Apache 8080 and MariaDB 3308. MariaDB answered live queries and the API health endpoint returned `database: connected`. Vite served the frontend on 3000 and Express served the API on 4000.

MariaDB stopped once after the regression suite and was successfully restarted with XAMPP. This intermittent local service event is a deployment warning: production must use service supervision, startup-on-boot, disk-capacity monitoring and MariaDB log alerts. Windows execution remains covered only by the separate runbook and is not certified without a Windows host test.

Deployment order: start MariaDB; run migrations/seeds; verify writable `storage/uploads`; start the API under a process manager; build the frontend; configure Apache reverse proxy/static hosting; verify `/api/health`, authenticated upload/download and role login.
