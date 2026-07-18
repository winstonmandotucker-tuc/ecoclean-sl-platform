# Windows XAMPP Validation

No Windows host or Windows virtual machine was available. **Windows XAMPP execution is not validated.**

Static portability work completed: backup and archive executable paths are environment-controlled; ClamAV path is configurable; the clean command is Node-based rather than `rm -rf`; an Apache 2.4 virtual-host template and PowerShell startup script are under `deployment/`.

Local XAMPP evidence was produced on macOS only: Apache 2.4.56, PHP 8.2.4, MariaDB 10.4.28; Apache, MariaDB, frontend, API, backups, and restore all ran. Windows certification requires a clean Windows machine with XAMPP, Node, pnpm, `tar.exe`, and ClamAV; run install, migration, build, API service setup, Apache proxy/static routing, uploads, backup/restore, reboot persistence, firewall, and path-with-spaces tests.

Infrastructure/Windows rubric contribution: **2/5** — portable configuration and deployment templates exist; actual Windows execution, service persistence, permissions, and recovery are unverified.

