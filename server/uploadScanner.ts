import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import { pool } from './db.js';
import { config } from './config.js';

const run=promisify(execFile);
const uploadRoot=path.resolve('storage/uploads');
const quarantineRoot=path.resolve('storage/quarantine');

export async function processUploadScans(limit=20){
  const scanner=[config.clamScanBinary,'/opt/homebrew/bin/clamdscan','/usr/local/bin/clamdscan','/usr/bin/clamdscan','/opt/homebrew/bin/clamscan','/usr/local/bin/clamscan','/usr/bin/clamscan'].filter(Boolean).find(candidate=>existsSync(candidate!));
  const [rows]=await pool.query<any[]>("SELECT s.id scan_id,u.id upload_id,u.stored_name FROM upload_scans s JOIN uploads u ON u.id=s.upload_id WHERE s.status IN ('queued','error') ORDER BY s.id LIMIT ?",[limit]);
  if(!scanner){for(const row of rows)await pool.query("UPDATE upload_scans SET status='unavailable',details='ClamAV is not installed on this host.',scanned_at=NOW() WHERE id=?",[row.scan_id]);return{processed:rows.length,clean:0,infected:0,unavailable:rows.length};}
  await fs.mkdir(quarantineRoot,{recursive:true});let clean=0,infected=0;
  for(const row of rows){const source=path.join(uploadRoot,path.basename(row.stored_name));await pool.query("UPDATE upload_scans SET status='scanning' WHERE id=?",[row.scan_id]);try{await run(scanner,['--no-summary',source]);await pool.query("UPDATE upload_scans SET status='clean',scanned_at=NOW(),details=NULL WHERE id=?",[row.scan_id]);clean++;}catch(error:any){if(error?.code===1){const target=path.join(quarantineRoot,path.basename(row.stored_name));await fs.rename(source,target);await pool.query("UPDATE upload_scans SET status='infected',signature_name=?,scanned_at=NOW() WHERE id=?",[String(error?.stdout||'Malware detected').slice(0,255),row.scan_id]);await pool.query('INSERT INTO quarantined_files(upload_id,quarantine_path,reason) VALUES(?,?,?)',[row.upload_id,target,'Malware signature detected by ClamAV']);infected++;}else await pool.query("UPDATE upload_scans SET status='error',details=?,scanned_at=NOW() WHERE id=?",[String(error?.message||'Scan failed').slice(0,1000),row.scan_id]);}}
  return{processed:rows.length,clean,infected,unavailable:0};
}
