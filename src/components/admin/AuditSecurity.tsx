import React from 'react';
import { ShieldAlert, Server, ShieldCheck, Key, Lock, Globe } from 'lucide-react';
import { AuditLog, CountryConfig } from '../../lib/adminData';

interface AuditSecurityProps {
  country: CountryConfig;
  auditLogs: AuditLog[];
}

export default function AuditSecurity({ country, auditLogs }: AuditSecurityProps) {
  // Filter logs for this country
  const filteredLogs = auditLogs.filter(log => log.countryCode === country.code);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">Audit & Security Ledger</h2>
        <p className="text-xs text-gray-400 mt-1">
          Cryptographically signed operational logs and administrative access records under {country.name}'s node jurisdiction.
        </p>
      </div>

      {/* Security Status Box */}
      <div className="bg-emerald-50/20 border border-brand-primary/10 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-800 block">Admin MFA Enforced</span>
            <span className="text-[10px] text-gray-400 block font-mono">Status: Enabled (Duo Security)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-800 block">Geofencing Safeguard</span>
            <span className="text-[10px] text-gray-400 block font-mono">Restricted: ECOWAS IP Spaces</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center">
            <Key className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-800 block">Database Cryptography</span>
            <span className="text-[10px] text-gray-400 block font-mono">Encryption: AES-256 GCM</span>
          </div>
        </div>
      </div>

      {/* Audit Log Timeline */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider font-mono">National Security Timeline</h3>
          <span className="text-[10px] font-mono font-bold text-gray-400">Total Records: {filteredLogs.length}</span>
        </div>

        <div className="divide-y divide-gray-50 text-xs">
          {filteredLogs.length === 0 ? (
            <p className="p-8 text-center text-gray-400 font-semibold">No audit logs registered under this nation node.</p>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="p-5 hover:bg-gray-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded">
                      {log.id}
                    </span>
                    <span className="text-[10px] font-bold text-brand-primary font-mono bg-emerald-50 px-2 py-0.5 rounded">
                      {log.module}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400">{log.timestamp}</span>
                  </div>

                  <p className="text-xs font-bold text-gray-800">
                    {log.action}
                  </p>

                  <div className="flex items-center gap-4 text-[10px] text-gray-400 font-mono">
                    <span>Authorized Operator: {log.userEmail} ({log.userRole})</span>
                  </div>
                </div>

                <div className="flex flex-col items-start md:items-end gap-1 font-mono text-[10px]">
                  <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded ${
                    log.status === 'Success' 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : log.status === 'Failed' 
                      ? 'bg-red-50 text-red-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {log.status === 'Success' ? (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                    )}
                    <span>{log.status}</span>
                  </span>
                  <span className="text-gray-400">IP: {log.ipAddress}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
