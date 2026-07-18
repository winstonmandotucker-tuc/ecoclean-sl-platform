import React from 'react';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';

interface UnauthorizedProps {
  onLogout: () => void;
  onGoHome: () => void;
}

export default function Unauthorized({ onLogout, onGoHome }: UnauthorizedProps) {
  return (
    <div className="min-h-screen bg-[#F4F7F5] flex flex-col justify-center items-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl border border-gray-100 shadow-xl p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-red-50 text-red-600 border border-red-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
          <ShieldAlert className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Access Denied</h1>
          <p className="text-xs font-mono font-bold text-red-600 uppercase tracking-widest">Unauthorized Resource Protocol</p>
          <p className="text-sm text-gray-500 leading-relaxed pt-2">
            Your current security clearance role is not authorized to access this restricted government workspace environment.
          </p>
        </div>

        <div className="bg-red-50/50 rounded-2xl p-4 border border-red-100/40 text-left text-[11px] text-red-800 space-y-1 font-mono">
          <p>&gt; IP_LOGGED: 197.224.64.12</p>
          <p>&gt; PROTOCOL: SHIELD-RBAC-ENFORCED</p>
          <p>&gt; STATUS: SUSPICIOUS_CROSS_DOMAIN_ACCESS_ATTEMPT</p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onGoHome}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to My Dashboard</span>
          </button>
          
          <button
            onClick={onLogout}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all text-xs flex items-center justify-center gap-1.5 shadow-md shadow-red-600/10 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out & Re-auth</span>
          </button>
        </div>
      </div>
    </div>
  );
}
