import React,{useEffect,useRef,useState} from 'react';
import {Camera,Loader2,Trash2} from 'lucide-react';
import {mediaUrl} from '../lib/api';
import {profileService} from '../lib/services';

export default function ProfilePhotoControl({fullName}: {fullName:string}){
  const input=useRef<HTMLInputElement>(null);const [url,setUrl]=useState<string|null>(null);const [busy,setBusy]=useState(false);const [error,setError]=useState('');
  useEffect(()=>{void profileService.get().then(({data})=>setUrl(mediaUrl(data.profileImageUrl))).catch(()=>setError('Photo service unavailable.'));},[]);
  const upload=async(file?:File)=>{if(!file)return;if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>8*1024*1024){setError('Use a JPG, PNG, or WebP image up to 8 MB.');return;}setBusy(true);setError('');try{const {data}=await profileService.uploadPhoto(file);setUrl(mediaUrl(data[0].url));}catch(e:any){setError(e?.message||'Photo upload failed.');}finally{setBusy(false);if(input.current)input.current.value='';}};
  const remove=async()=>{setBusy(true);setError('');try{await profileService.deletePhoto();setUrl(null);}catch(e:any){setError(e?.message||'Photo deletion failed.');}finally{setBusy(false);}};
  return <div className="flex flex-col items-center gap-2">
    <div className="relative w-24 h-24 rounded-full overflow-hidden bg-brand-primary/10 border-2 border-brand-primary/20 flex items-center justify-center text-brand-primary font-black text-3xl shadow-inner">
      {url?<img src={url} alt={`${fullName} profile`} className="w-full h-full object-cover"/>:fullName.charAt(0)}
      {busy&&<span className="absolute inset-0 bg-black/40 flex items-center justify-center"><Loader2 className="w-5 h-5 text-white animate-spin"/></span>}
    </div>
    <div className="flex gap-2">
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={e=>void upload(e.target.files?.[0])}/>
      <button type="button" onClick={()=>input.current?.click()} disabled={busy} className="text-[10px] font-bold text-brand-primary flex items-center gap-1 cursor-pointer disabled:opacity-50"><Camera className="w-3 h-3"/> {url?'Replace':'Upload'}</button>
      {url&&<button type="button" onClick={()=>void remove()} disabled={busy} className="text-[10px] font-bold text-red-600 flex items-center gap-1 cursor-pointer disabled:opacity-50"><Trash2 className="w-3 h-3"/> Delete</button>}
    </div>
    {error&&<p className="text-[10px] text-red-600 max-w-48 text-center">{error}</p>}
  </div>;
}
