import crypto from 'node:crypto';import fs from 'node:fs/promises';import path from 'node:path';import {execFile} from 'node:child_process';import {promisify} from 'node:util';import {config} from './config.js';import {pool} from './db.js';
const run=promisify(execFile);const root=path.resolve('storage/backups');await fs.mkdir(root,{recursive:true});
const checksum=async(file:string)=>crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex');
export async function createBackup(type:'database'|'uploads'|'configuration'|'full',userId:number|null,schedule:'manual'|'daily'|'weekly'|'monthly'='manual'){const stamp=new Date().toISOString().replace(/[:.]/g,'-');const target=path.join(root,`${type}-${stamp}${type==='database'?'.sql':type==='configuration'?'.json':'.tar.gz'}`);const [record]=await pool.query<any>('INSERT INTO backups(backup_type,schedule_type,file_path,created_by) VALUES(?,?,?,?)',[type,schedule,target,userId]);try{if(type==='database')await run(config.dbDumpBinary,['-h',config.db.host,'-P',String(config.db.port),'-u',config.db.user,'--single-transaction','--triggers','--skip-lock-tables',config.db.database],{env:{...process.env,MYSQL_PWD:config.db.password},maxBuffer:100*1024*1024}).then(result=>fs.writeFile(target,result.stdout));else if(type==='uploads')await run(config.archiveBinary,['-czf',target,'-C',path.resolve('storage'),'uploads']);else if(type==='configuration'){const [settings]=await pool.query('SELECT setting_key,value_json FROM system_settings');await fs.writeFile(target,JSON.stringify({createdAt:new Date().toISOString(),environment:config.env,settings,requiredEnvironment:['JWT_SECRET','DB_HOST','DB_PORT','DB_DATABASE','DB_USERNAME','DB_PASSWORD','FRONTEND_URL']},null,2));}else await run(config.archiveBinary,['-czf',target,'storage/uploads','database/migrations','.env.production.example']);const info=await fs.stat(target),hash=await checksum(target);await pool.query("UPDATE backups SET status='completed',file_size=?,sha256=?,completed_at=NOW(),retention_until=DATE_ADD(NOW(),INTERVAL ? DAY) WHERE id=?",[info.size,hash,schedule==='daily'?14:schedule==='weekly'?90:schedule==='monthly'?365:30,record.insertId]);return{id:record.insertId,path:target,size:info.size,sha256:hash};}catch(error){await pool.query("UPDATE backups SET status='failed',error_message=?,completed_at=NOW() WHERE id=?",[error instanceof Error?error.message:'Backup failed',record.insertId]);throw error;}}
export async function enforceRetention(){const [rows]=await pool.query<any[]>("SELECT id,file_path FROM backups WHERE status='completed' AND retention_until<NOW()");for(const row of rows){await fs.rm(row.file_path,{force:true});await pool.query("UPDATE backups SET status='expired' WHERE id=?",[row.id]);}return rows.length;}
export async function runScheduledBackups(now=new Date()){
  const schedules:Array<{schedule:'daily'|'weekly'|'monthly';type:'database'|'full';due:boolean}>=[
    {schedule:'daily',type:'database',due:true},
    {schedule:'weekly',type:'full',due:now.getDay()===0},
    {schedule:'monthly',type:'full',due:now.getDate()===1},
  ];
  const created=[];
  for(const item of schedules){
    if(!item.due)continue;
    const [rows]=await pool.query<any[]>(`SELECT id FROM backups WHERE schedule_type=? AND status='completed' AND completed_at>=? LIMIT 1`,[item.schedule,item.schedule==='daily'?new Date(now.getFullYear(),now.getMonth(),now.getDate()):item.schedule==='weekly'?new Date(now.getTime()-7*86400000):new Date(now.getFullYear(),now.getMonth(),1)]);
    if(!rows[0])created.push(await createBackup(item.type,null,item.schedule));
  }
  return created;
}
