const hostedApiFallback = typeof window !== 'undefined' && window.location.hostname.endsWith('vercel.app')
  ? '/api'
  : 'http://127.0.0.1:4000/api';
const API_URL = (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || hostedApiFallback).replace(/\/$/,'');

export class ApiError extends Error {
  constructor(message: string, public status: number, public fields?: Record<string,string[]>) { super(message); }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const isFormData=options.body instanceof FormData;
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: { ...(!isFormData?{'Content-Type':'application/json'}:{}), Accept:'application/json', ...options.headers },
  });
  if (response.status === 204) return undefined as T;
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(body.error || 'Request failed.', response.status, body.fields);
  return body as T;
}

export const mediaUrl=(relative:string|null|undefined)=>relative?`${API_URL.replace(/\/api$/,'')}${relative}`:null;
export async function downloadApi(path:string){const response=await fetch(`${API_URL}${path}`,{credentials:'include',headers:{Accept:'*/*'}});if(!response.ok){const body=await response.json().catch(()=>({}));throw new ApiError(body.error||'Export failed.',response.status);}const blob=await response.blob();const disposition=response.headers.get('content-disposition')||'';const encoded=disposition.match(/filename\*=UTF-8''([^;]+)/i)?.[1];const plain=disposition.match(/filename="?([^";]+)"?/i)?.[1];const filename=encoded?decodeURIComponent(encoded):plain||'ecoclean-export';const url=URL.createObjectURL(blob);const anchor=document.createElement('a');anchor.href=url;anchor.download=filename;document.body.appendChild(anchor);anchor.click();anchor.remove();URL.revokeObjectURL(url);return filename;}
