# Backup Restore Report

Source artifact: Phase 4 MariaDB dump, 191,853 bytes, SHA-256 `cfff39c19c357d1b4ac71bee2f9bc36506c6c60c73f31d40b846e72ac15d63ab`.

The dump was restored into disposable database `ecoclean_restore_drill_20260717`. Comparison results matched exactly: 74/74 tables, 108/108 foreign keys, 5/5 users, and 3/3 reports. The temporary database was dropped and a schema lookup returned zero remaining instances.

Backup executables are now environment-configurable (`DB_DUMP_BINARY`, `ARCHIVE_BINARY`) instead of hardcoded to macOS. One earlier failed backup remains in history as audit evidence of stale XAMPP `mysql.proc`; routine export was removed because this application defines no stored routines.

Backup rubric: **10/10** for the defined local drill: checksum recorded, isolated restore completed, structural and representative row counts matched, cleanup verified, and failure history retained. Off-host encrypted copy and scheduled restore drills remain operational requirements.

