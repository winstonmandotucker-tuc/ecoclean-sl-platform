import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { config } from './config.js';
import { pool } from './db.js';

export type RoleCode = 'CITIZEN' | 'STAFF' | 'SUPERVISOR' | 'ADMINISTRATOR' | 'NATIONAL_ADMIN';
export interface AuthUser { id: number; email: string; fullName: string; phone?: string; role: RoleCode; municipality?: string|null; municipalityId?:number|null; district?:string|null; profileUploadId?:number|null; }

declare global {
  namespace Express { interface Request { authUser?: AuthUser } }
}

const cookieValue = (request: Request, name: string) => {
  const cookies = request.headers.cookie?.split(';').map(value => value.trim()) || [];
  const pair = cookies.find(value => value.startsWith(`${name}=`));
  return pair ? decodeURIComponent(pair.slice(name.length + 1)) : undefined;
};

export const requestDeviceHash=(request:Request)=>crypto.createHash('sha256').update(`${request.headers['user-agent']||'unknown'}|${request.headers['accept-language']||''}`).digest('hex');
export const issueSession = async (request:Request,response: Response, user: AuthUser, remember = false) => {
  const sessionId=crypto.randomUUID();const maxAge=remember ? 30 * 24 * 60 * 60 * 1000 : 8*60*60*1000;
  const token = jwt.sign({ sub: user.id, role: user.role, sid:sessionId }, config.jwtSecret, { expiresIn: remember ? '30d' : '8h' });
  await pool.query('INSERT INTO user_sessions(id,user_id,token_hash,device_hash,ip_address,user_agent,expires_at) VALUES(?,?,?,?,?,?,?)',[sessionId,user.id,crypto.createHash('sha256').update(token).digest('hex'),requestDeviceHash(request),request.ip,String(request.headers['user-agent']||'').slice(0,500),new Date(Date.now()+maxAge)]);
  response.cookie('ecoclean_session', token, {
    httpOnly: true,
    secure: config.cookieSecure,
    sameSite: 'strict',
    path: '/',
    maxAge: remember ? maxAge : undefined,
  });
};

export const clearSession = (response: Response) => response.clearCookie('ecoclean_session', { path: '/' });

export async function authenticate(request: Request, response: Response, next: NextFunction) {
  try {
    const token = cookieValue(request, 'ecoclean_session');
    if (!token) return response.status(401).json({ error: 'Authentication required.' });
    const payload = jwt.verify(token, config.jwtSecret) as jwt.JwtPayload;
    if(!payload.sid)return response.status(401).json({error:'Legacy session must sign in again.'});
    const tokenHash=crypto.createHash('sha256').update(token).digest('hex');
    const [sessions]=await pool.query<any[]>('SELECT id FROM user_sessions WHERE id=? AND user_id=? AND token_hash=? AND revoked_at IS NULL AND expires_at>NOW() LIMIT 1',[payload.sid,payload.sub,tokenHash]);
    if(!sessions[0])return response.status(401).json({error:'Session was revoked or expired.'});
    const [rows] = await pool.query<any[]>(`
      SELECT u.id,u.email,u.full_name AS fullName,u.phone,r.code AS role,u.municipality_id municipalityId,m.name municipality,d.name district,p.profile_upload_id profileUploadId
      FROM users u JOIN roles r ON r.id=u.role_id LEFT JOIN municipalities m ON m.id=u.municipality_id LEFT JOIN districts d ON d.id=u.district_id LEFT JOIN user_profiles p ON p.user_id=u.id
      WHERE u.id = ? AND u.status = 'active' AND u.deleted_at IS NULL LIMIT 1`, [payload.sub]);
    if (!rows[0]) return response.status(401).json({ error: 'Session is no longer valid.' });
    await pool.query('UPDATE user_sessions SET last_seen_at=NOW() WHERE id=?',[payload.sid]);
    request.authUser = rows[0];
    next();
  } catch {
    clearSession(response);
    return response.status(401).json({ error: 'Session is invalid or expired.' });
  }
}

export const authorize = (...roles: RoleCode[]) => (request: Request, response: Response, next: NextFunction) => {
  if (!request.authUser || !roles.includes(request.authUser.role)) return response.status(403).json({ error: 'Insufficient permission.' });
  next();
};
