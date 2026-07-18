import bcrypt from 'bcryptjs';
import { pool } from './db.js';

const roles = [
  ['CITIZEN', 'Citizen'], ['STAFF', 'Staff'], ['SUPERVISOR', 'Supervisor'],
  ['ADMINISTRATOR', 'Administrator'], ['NATIONAL_ADMIN', 'National Admin'],
];
for (const role of roles) await pool.query('INSERT INTO roles (code,name) VALUES (?,?) ON DUPLICATE KEY UPDATE name=VALUES(name)', role);
const permissions = ['reports.create','reports.view','reports.manage','tasks.view','tasks.manage','notifications.view','users.manage','audit.view','gis.view'];
for (const code of permissions) await pool.query('INSERT IGNORE INTO permissions (code,name) VALUES (?,?)', [code, code]);
const grants: Record<string,string[]> = {
  CITIZEN: ['reports.create','reports.view','notifications.view','gis.view'],
  STAFF: ['reports.view','tasks.view','notifications.view','gis.view'],
  SUPERVISOR: ['reports.view','reports.manage','tasks.view','tasks.manage','notifications.view','gis.view'],
  ADMINISTRATOR: permissions,
  NATIONAL_ADMIN: permissions,
};
for (const [role, codes] of Object.entries(grants)) {
  for (const code of codes) await pool.query(`INSERT IGNORE INTO role_permissions (role_id,permission_id) SELECT r.id,p.id FROM roles r,permissions p WHERE r.code=? AND p.code=?`, [role, code]);
}
const demoPassword = process.env.SEED_DEMO_PASSWORD;
if (!demoPassword || demoPassword.length < 10) throw new Error('SEED_DEMO_PASSWORD must contain at least 10 characters.');
const passwordHash = await bcrypt.hash(demoPassword, 12);
const users = [
  ['Samuel Koroma','citizen@ecoclean.sl','+23276000001','CITIZEN'],
  ['Abdul Kamara','staff@ecoclean.sl','+23276000002','STAFF'],
  ['Regional Supervisor','supervisor@ecoclean.sl','+23276000003','SUPERVISOR'],
  ['Admin Director','admin@ecoclean.sl','+23276000004','ADMINISTRATOR'],
  ['National Secretariat','nationaladmin@ecoclean.sl','+23276000005','NATIONAL_ADMIN'],
];
for (const user of users) await pool.query(`INSERT INTO users (full_name,email,phone,password_hash,role_id,status,email_verified_at)
  SELECT ?,?,?,?,r.id,'active',NOW() FROM roles r WHERE r.code=?
  ON DUPLICATE KEY UPDATE full_name=VALUES(full_name),phone=VALUES(phone),password_hash=VALUES(password_hash),role_id=VALUES(role_id),status='active'`, [user[0],user[1],user[2],passwordHash,user[3]]);
await pool.query(`INSERT INTO reports(reference,citizen_id,title,description,category,priority,status,latitude,longitude,address)
  SELECT 'ECO-2026-100001',u.id,'Kroo Town Waste Accumulation','Household and plastic waste is blocking the public walkway.','Illegal Dumping','high','in_progress',8.4844000,-13.2344000,'Kroo Town Road, Freetown'
  FROM users u WHERE u.email='citizen@ecoclean.sl' ON DUPLICATE KEY UPDATE title=VALUES(title)`);
await pool.query(`INSERT INTO reports(reference,citizen_id,title,description,category,priority,status,latitude,longitude,address)
  SELECT 'ECO-2026-100002',u.id,'Central Bo Overflowing Bin','The communal collection bin requires urgent clearance.','Overflowing Waste Bin','medium','pending',7.9628000,-11.7401000,'Bo Town Central, Bo'
  FROM users u WHERE u.email='citizen@ecoclean.sl' ON DUPLICATE KEY UPDATE title=VALUES(title)`);
await pool.query(`INSERT INTO tasks(reference,report_id,assigned_to,assigned_by,title,description,status,priority,due_at)
  SELECT 'TASK-2026-100001',r.id,staff.id,supervisor.id,'Clear Kroo Town Waste Accumulation','Collect waste and submit photographic evidence.','assigned','high',DATE_ADD(NOW(),INTERVAL 1 DAY)
  FROM reports r,users staff,users supervisor WHERE r.reference='ECO-2026-100001' AND staff.email='staff@ecoclean.sl' AND supervisor.email='supervisor@ecoclean.sl'
  ON DUPLICATE KEY UPDATE assigned_to=VALUES(assigned_to),assigned_by=VALUES(assigned_by)`);
await pool.query(`INSERT INTO notifications(user_id,type,title,body,data_json)
  SELECT u.id,'welcome','ECOCLEAN operational account ready','Your secure ECOCLEAN account is connected to the operational database.',JSON_OBJECT('seed',true)
  FROM users u WHERE NOT EXISTS(SELECT 1 FROM notifications n WHERE n.user_id=u.id AND n.type='welcome')`);
await pool.query("INSERT INTO municipalities (name,code) VALUES ('Freetown City Council','FCC') ON DUPLICATE KEY UPDATE name=VALUES(name)");
await pool.query("INSERT INTO districts (municipality_id,name,code) SELECT id,'Western Area Urban','WAU' FROM municipalities WHERE code='FCC' ON DUPLICATE KEY UPDATE name=VALUES(name),municipality_id=VALUES(municipality_id)");
await pool.query("UPDATE users SET municipality_id=(SELECT id FROM municipalities WHERE code='FCC'),district_id=(SELECT id FROM districts WHERE code='WAU') WHERE email IN ('supervisor@ecoclean.sl','staff@ecoclean.sl')");
await pool.query("INSERT INTO wards (district_id,name,code) SELECT id,'Central Freetown','FCC-CENTRAL' FROM districts WHERE code='WAU' ON DUPLICATE KEY UPDATE name=VALUES(name),district_id=VALUES(district_id)");
await pool.query("INSERT INTO zones (ward_id,name,code) SELECT id,'Central Operations Zone','FCC-CENTRAL-01' FROM wards WHERE code='FCC-CENTRAL' ON DUPLICATE KEY UPDATE name=VALUES(name)");
console.log('Seeded roles, permissions, geography, and five development accounts.');
await pool.end();
