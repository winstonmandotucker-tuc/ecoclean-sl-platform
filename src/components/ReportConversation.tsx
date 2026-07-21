import React,{useEffect,useState} from 'react';
import {MessageCircle,Send} from 'lucide-react';
import {reportConversationService} from '../lib/services';

export default function ReportConversation({reportId}:{reportId:string|number}){
  const [messages,setMessages]=useState<any[]>([]);const [body,setBody]=useState('');const [closed,setClosed]=useState(false);const [notice,setNotice]=useState('');const [sending,setSending]=useState(false);
  const load=async()=>{try{const {data}=await reportConversationService.get(reportId);setMessages(data.messages||[]);setClosed(Boolean(data.closed));setNotice('');}catch(error){setNotice(error instanceof Error?error.message:'Conversation is not available yet.');}};
  useEffect(()=>{void load();},[reportId]);
  const send=async(e:React.FormEvent)=>{e.preventDefault();if(!body.trim()||sending)return;setSending(true);try{await reportConversationService.send(reportId,body.trim());setBody('');await load();}catch(error){setNotice(error instanceof Error?error.message:'Message could not be sent.');}finally{setSending(false);}};
  return <section className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm space-y-4" aria-label="Report conversation">
    <div><h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-2"><MessageCircle className="w-4 h-4 text-brand-primary"/>Report Conversation</h3><p className="text-xs text-gray-400 mt-1">Private communication between the citizen and assigned field staff until completion.</p></div>
    {notice&&<p className="rounded-xl bg-amber-50 border border-amber-100 p-3 text-xs font-semibold text-amber-700">{notice}</p>}
    <div className="max-h-64 overflow-y-auto space-y-2" aria-live="polite">{messages.map(message=><div key={message.id} className="rounded-xl bg-gray-50 border border-gray-100 p-3"><div className="flex justify-between gap-3 text-[10px] font-bold uppercase text-gray-400"><span>{message.sender_name} · {String(message.sender_role).toLowerCase()}</span><time>{new Date(message.created_at).toLocaleString()}</time></div><p className="text-xs text-gray-700 mt-1 whitespace-pre-wrap">{message.body}</p></div>)}{!messages.length&&!notice&&<p className="text-xs text-gray-400 italic">No messages yet. Start the work conversation here.</p>}</div>
    {closed?<p className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl p-3">Conversation closed because the reported work is complete.</p>:<form onSubmit={send} className="flex gap-2"><input value={body} onChange={e=>setBody(e.target.value)} maxLength={5000} placeholder="Write a message…" className="flex-1 rounded-xl border border-gray-200 px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary/20"/><button disabled={sending||!body.trim()} className="rounded-xl bg-brand-primary text-white px-4 text-xs font-bold disabled:opacity-50 flex items-center gap-1"><Send className="w-3.5 h-3.5"/>{sending?'Sending…':'Send'}</button></form>}
  </section>;
}
