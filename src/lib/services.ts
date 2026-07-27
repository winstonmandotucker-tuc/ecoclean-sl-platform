import type { User } from '../types';
import { api, audioApi, downloadApi } from './api';

export const authService = {
  login: (identifier:string,password:string,remember=false) => api<{user:User}>('/auth/login',{method:'POST',body:JSON.stringify({identifier,password,remember})}),
  register: (fullName:string,email:string,phone:string,password:string) => api<{user:User}>('/auth/register',{method:'POST',body:JSON.stringify({fullName,email,phone,password})}),
  me: () => api<{user:User}>('/auth/me'),
  logout: () => api<void>('/auth/logout',{method:'POST'}),
  forgotPassword: (email:string) => api<{message:string;developmentToken?:string}>('/auth/forgot-password',{method:'POST',body:JSON.stringify({email})}),
  resetPassword: (email:string,token:string,password:string) => api<{message:string}>('/auth/reset-password',{method:'POST',body:JSON.stringify({email,token,password})}),
  updateProfile: (profile:any) => api<{message:string}>('/profile',{method:'PATCH',body:JSON.stringify(profile)}),
};

export const profileService = {
  get: () => api<{data:any}>('/profile'),
  update: (profile:any) => api<{message:string}>('/profile',{method:'PATCH',body:JSON.stringify(profile)}),
  preferences: (preferences:any) => api<void>('/profile/preferences',{method:'PUT',body:JSON.stringify(preferences)}),
  changePassword: (currentPassword:string,newPassword:string) => api<{message:string}>('/auth/change-password',{method:'POST',body:JSON.stringify({currentPassword,newPassword})}),
  uploadPhoto: (file:File) => { const body=new FormData();body.append('purpose','profile_image');body.append('files',file);return api<{data:any[]}>('/uploads',{method:'POST',body}); },
  deletePhoto: () => api<void>('/profile/photo',{method:'DELETE'}),
};

export const uploadService = {
  list: (reportId?:number|string) => api<{data:any[]}>(`/uploads${reportId?`?reportId=${reportId}`:''}`),
  upload: (purpose:'report_evidence'|'task_evidence'|'ticket_attachment',file:File,relation:{reportId?:number|string;taskId?:number|string;ticketId?:number|string}) => {const body=new FormData();body.append('purpose',purpose);body.append('files',file);for(const [key,value] of Object.entries(relation))if(value!=null)body.append(key,String(value));return api<{data:any[]}>('/uploads',{method:'POST',body});},
  remove: (id:number|string) => api<void>(`/uploads/${id}`,{method:'DELETE'}),
};

export const reportService = {
  list: () => api<{data:any[]}>('/reports-scoped'),
  get: (id:number|string) => api<{data:any}>(`/reports/${id}`),
  create: (payload:unknown) => api<{data:any}>('/reports-operational',{method:'POST',body:JSON.stringify(payload)}),
  update: (id:number|string,payload:unknown) => api<{message:string}>(`/reports/${id}`,{method:'PATCH',body:JSON.stringify(payload)}),
  remove: (id:number|string) => api<void>(`/reports/${id}`,{method:'DELETE'}),
};
export const reportConversationService={
  get:(reportId:number|string)=>api<{data:{conversationId:number;messages:any[];closed:boolean}}>(`/reports/${reportId}/conversation`),
  send:(reportId:number|string,body:string)=>api<{data:any}>(`/reports/${reportId}/messages`,{method:'POST',body:JSON.stringify({body})}),
};
export const speechService={
  capabilities:()=>api<{data:{enabled:boolean;provider:string;languages:{code:string;name:string}[];audioRetention:string}}>('/speech/capabilities'),
  transcribe:(file:File,language:string)=>{const body=new FormData();body.append('audio',file);body.append('language',language);body.append('consent','true');return api<{data:{id:number;language:string;languageName:string;originalTranscript:string;englishTranslation:string;requiresConfirmation:boolean}}>('/speech/transcribe',{method:'POST',body});},
  confirm:(id:number|string)=>api<void>(`/speech/jobs/${id}/confirm`,{method:'POST'}),
  synthesize:(text:string,language:string)=>audioApi('/speech/synthesize',{text,language,consent:true}),
};
export type ReportExportFormat='csv'|'pdf'|'xlsx'|'docx'|'json'|'geojson';
export const reportExportService={download:(format:ReportExportFormat,filters:{dateRange?:string;status?:string;priority?:string}={})=>{const query=new URLSearchParams({format,...Object.fromEntries(Object.entries(filters).filter(([,value])=>value&&value!=='All')) as Record<string,string>});return downloadApi(`/reports/export-professional?${query}`);}};
export const taskService = {
  list: () => api<{data:any[]}>('/tasks'),
  get: (id:number|string) => api<{data:any}>(`/tasks/${id}`),
  create: (payload:unknown) => api<{data:any}>('/tasks-operational',{method:'POST',body:JSON.stringify(payload)}),
  update: (id:number|string,payload:unknown) => api<{message:string}>(`/tasks/${id}`,{method:'PATCH',body:JSON.stringify(payload)}),
};
export const staffDirectoryService={list:()=>api<{data:any[]}>('/staff-directory'),update:(id:number|string,payload:unknown)=>api<void>(`/staff-directory/${id}`,{method:'PATCH',body:JSON.stringify(payload)})};
export const notificationService = {
  list: () => api<{data:any[]}>('/notifications'),
  markRead: (id:number) => api<void>(`/notifications/${id}/read`,{method:'PATCH'}),
  markAllRead: () => api<void>('/notifications/mark-all-read',{method:'POST'}),
  remove: (id:number|string) => api<void>(`/notifications/${id}`,{method:'DELETE'}),
  reply: (id:number|string,body:string) => api<{data:any}>(`/notifications/${id}/reply`,{method:'POST',body:JSON.stringify({body})}),
};
export const supportService = {
  listTickets: () => api<{data:any[]}>('/support/tickets-scoped'),
  metrics: () => api<{data:any}>('/support/metrics'),
  createTicket: (payload:unknown) => api<{data:any}>('/support/tickets-operational',{method:'POST',body:JSON.stringify(payload)}),
  updateTicket: (id:number|string,payload:unknown) => api<{message:string}>(`/support/tickets/${id}`,{method:'PATCH',body:JSON.stringify(payload)}),
  messages: (conversationId:number|string) => api<{data:any[]}>(`/support/conversations/${conversationId}/messages`),
  sendMessage: (conversationId:number|string,body:string) => api<{data:any}>(`/support/conversations/${conversationId}/messages-operational`,{method:'POST',body:JSON.stringify({body})}),
  closeTicket: (id:number|string) => api<void>(`/support/tickets/${id}/close`,{method:'POST'}),
};
export const dashboardService = { get: () => api<{data:any}>('/dashboard') };
export const adminUserService = {
  list: () => api<{data:any[]}>('/users'),
  create: (payload:unknown) => api<{data:any}>('/admin/users',{method:'POST',body:JSON.stringify(payload)}),
  update: (id:number|string,payload:unknown) => api<void>(`/admin/users/${id}`,{method:'PATCH',body:JSON.stringify(payload)}),
  revokeSessions: (id:number|string) => api<void>(`/auth/users/${id}/revoke-sessions`,{method:'POST'}),
};
export const announcementService = { publish:(payload:unknown)=>api<{data:any}>('/announcements',{method:'POST',body:JSON.stringify(payload)}) };
export const directNotificationService = { send:(userId:number|string,title:string,body:string)=>api<{data:any}>('/notifications/direct',{method:'POST',body:JSON.stringify({userId:Number(userId),title,body})}) };
export const systemSettingsService = {
  get: () => api<{data:Record<string,unknown>}>('/system/settings'),
  save: (key:string,value:unknown) => api<void>(`/system/settings/${key}`,{method:'PUT',body:JSON.stringify({value})}),
};
export const operationsService = {
  health: () => api<{data:any}>('/operations/health'),
  metrics: () => api<{data:any[]}>('/operations/metrics'),
  logs: () => api<{data:any[]}>('/operations/logs'),
  runMaintenance: () => api<{data:any}>('/operations/run-maintenance',{method:'POST'}),
};
export const gisService = {
  hierarchy: () => api<{data:unknown[]}>('/gis/hierarchy'),
  reports: () => api<{data:unknown[]}>('/gis/reports'),
};
export const apiKeyService = {
  current: () => api<{data:null|{id:number;maskedKey:string;createdAt:string;expiresAt:string|null}}>('/api-keys/current'),
  rotate: () => api<{data:{id:number;key:string;maskedKey:string;message:string}}>('/api-keys/rotate',{method:'POST'}),
};
