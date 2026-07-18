import type { AuthUser } from './auth.js';
import { pool } from './db.js';

export async function accessibleUpload(id:string|number,user:AuthUser){
  const [rows]=await pool.query<any[]>(`SELECT up.*,r.citizen_id,r.municipality_id report_municipality_id,r.district_id report_district_id,t.assigned_to
    FROM uploads up LEFT JOIN reports r ON r.id=up.report_id LEFT JOIN tasks t ON t.id=up.task_id
    WHERE up.id=? AND up.deleted_at IS NULL LIMIT 1`,[id]);
  const upload=rows[0];if(!upload)return null;
  if(upload.owner_user_id===user.id||user.role==='ADMINISTRATOR'||user.role==='NATIONAL_ADMIN')return upload;
  if(user.role==='STAFF'){
    const [access]=await pool.query<any[]>(`SELECT 1 FROM tasks WHERE assigned_to=? AND (id=? OR (report_id IS NOT NULL AND report_id=?)) LIMIT 1`,[user.id,upload.task_id||0,upload.report_id||0]);
    return access[0]?upload:null;
  }
  if(user.role==='SUPERVISOR'){
    const [scope]=await pool.query<any[]>('SELECT municipality_id,district_id FROM users WHERE id=?',[user.id]);
    const assigned=scope[0]&&(scope[0].district_id||scope[0].municipality_id)&&(scope[0].district_id===upload.report_district_id||scope[0].municipality_id===upload.report_municipality_id);
    return assigned?upload:null;
  }
  return null;
}

