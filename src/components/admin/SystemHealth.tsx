import React, { useCallback, useEffect, useState } from 'react';
import { Activity, Server, Database, CloudLightning, ShieldAlert, FileText, Wifi, RefreshCw } from 'lucide-react';
import { CountryConfig } from '../../lib/adminData';
import { operationsService } from '../../lib/services';

interface SystemHealthProps { country: CountryConfig; }
const value=(input:any)=>Number(input||0);

export default function SystemHealth({ country }: SystemHealthProps) {
  const [health,setHealth]=useState<any>(null);
  const [logs,setLogs]=useState<any[]>([]);
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(true);
  const load=useCallback(async()=>{setLoading(true);try{const [healthResult,logResult]=await Promise.all([operationsService.health(),operationsService.logs()]);setHealth(healthResult.data);setLogs(logResult.data.slice(0,20));setError('');}catch(reason){setError(reason instanceof Error?reason.message:'Monitoring data is unavailable.');}finally{setLoading(false);}},[]);
  useEffect(()=>{void load();const timer=setInterval(()=>void load(),30000);return()=>clearInterval(timer);},[load]);
  const runMaintenance=async()=>{setLoading(true);try{await operationsService.runMaintenance();await load();}catch(reason){setError(reason instanceof Error?reason.message:'Maintenance failed.');setLoading(false);}};
  const cards=[
    {label:'API Uptime',value:health?`${Math.floor(value(health.api?.uptimeSeconds)/60)} min`:'—',detail:'Measured process uptime',icon:Wifi},
    {label:'Database Latency',value:health?`${value(health.database?.latencyMs)} ms`:'—',detail:health?.database?.status||'Checking',icon:CloudLightning},
    {label:'API Memory',value:health?`${value(health.api?.memoryRssMb).toFixed(1)} MB`:'—',detail:`Heap ${value(health?.api?.heapUsedMb).toFixed(1)} MB`,icon:Activity},
    {label:'Pending Scans',value:health?String(value(health.uploads?.pending)):'—',detail:'Queued, unavailable or failed',icon:ShieldAlert},
  ];
  return <div className="space-y-6 font-sans">
    <div className="flex items-start justify-between gap-4"><div><h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">System Infrastructure Health</h2><p className="text-xs text-gray-400 mt-1">Live diagnostics for the ECOCLEAN {country.name} platform.</p></div><button onClick={runMaintenance} disabled={loading} className="px-4 py-2 rounded-xl bg-gray-950 text-white text-xs font-bold flex items-center gap-2 disabled:opacity-50"><RefreshCw className={`w-4 h-4 ${loading?'animate-spin':''}`}/>Run Maintenance</button></div>
    {error&&<div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-semibold">{error}</div>}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{cards.map(card=><div key={card.label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><div className="flex justify-between items-center mb-3"><span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-wider">{card.label}</span><card.icon className="w-4 h-4 text-emerald-500"/></div><span className="text-2xl font-black text-gray-950">{card.value}</span><p className="text-[10px] text-gray-400 mt-2">{card.detail}</p></div>)}</div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"><h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider font-mono flex items-center gap-2 border-b border-gray-50 pb-3"><Server className="w-4 h-4 text-brand-primary"/>Live Services</h3><div className="grid sm:grid-cols-2 gap-3 mt-4">{[
        ['API',health?.status||'checking'],['MariaDB',health?.database?.status||'checking'],['Notification queue',`${value(health?.queue?.queued)} queued / ${value(health?.queue?.dead)} dead`],['Backups',health?.backups?.latest?new Date(health.backups.latest).toLocaleString():'No completed backup'],['Active sessions',String(value(health?.sessions?.active))],['Security events',`${value(health?.security?.unresolved)} unresolved`]
      ].map(([name,status])=><div key={name} className="p-3 border border-gray-100 rounded-xl flex justify-between gap-3"><span className="text-xs font-bold text-gray-800">{name}</span><span className="text-[10px] font-mono text-gray-500 text-right">{status}</span></div>)}</div></div>
      <div className="bg-slate-900 border border-slate-950 rounded-2xl p-5 shadow-inner"><h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-800 pb-3 mb-3"><FileText className="w-4 h-4 text-brand-accent"/>Diagnostic Log Feed</h3><div className="text-[10px] font-mono leading-relaxed space-y-2 max-h-[280px] overflow-y-auto">{logs.length?logs.map(log=><p key={log.id} className={log.log_level==='error'?'text-red-400':log.log_level==='warn'?'text-yellow-400':'text-emerald-400'}>[{new Date(log.created_at).toLocaleTimeString()}] {String(log.log_level).toUpperCase()}: {log.message}</p>):<p className="text-slate-500">No log records available.</p>}</div><div className="border-t border-slate-800 pt-3 mt-3 flex items-center gap-2 text-[9px] text-slate-500 font-mono"><Database className="w-4 h-4 text-brand-accent"/><span>MariaDB-backed monitoring evidence</span></div></div>
    </div>
  </div>;
}
