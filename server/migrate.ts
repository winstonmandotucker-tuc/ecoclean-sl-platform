import fs from 'node:fs/promises';
import path from 'node:path';
import mysql from 'mysql2/promise';
import { config } from './config.js';

const root = await mysql.createConnection({ host: config.db.host, port: config.db.port, user: config.db.user, password: config.db.password, multipleStatements: true });
await root.query(`CREATE DATABASE IF NOT EXISTS \`${config.db.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
await root.end();
const connection = await mysql.createConnection({ ...config.db, multipleStatements: true });
await connection.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
  filename VARCHAR(255) PRIMARY KEY,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB`);
const directory = path.resolve('database/migrations');
for (const file of (await fs.readdir(directory)).filter(file => file.endsWith('.sql')).sort()) {
  const [applied] = await connection.query<mysql.RowDataPacket[]>('SELECT filename FROM schema_migrations WHERE filename=? LIMIT 1', [file]);
  if (applied.length) {
    console.log(`Skipped ${file}`);
    continue;
  }
  await connection.query(await fs.readFile(path.join(directory, file), 'utf8'));
  await connection.query('INSERT INTO schema_migrations(filename) VALUES(?)', [file]);
  console.log(`Applied ${file}`);
}
await connection.end();
