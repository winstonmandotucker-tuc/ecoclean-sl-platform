import React, { useEffect, useState } from 'react';
import { User, ShieldCheck, Key, Lock, Bell, RefreshCw, Mail, Phone, MapPin } from 'lucide-react';
import { User as UserType } from '../../types';
import { apiKeyService, profileService } from '../../lib/services';
import ProfilePhotoControl from '../ProfilePhotoControl';

interface AdminProfileProps {
  user: UserType | null;
}

export default function AdminProfile({ user }: AdminProfileProps) {
  const [fullName,setFullName]=useState(user?.fullName||'');
  const [email,setEmail]=useState(user?.email||'');
  const [phone, setPhone] = useState(user?.phone || '+232 77 123456');
  const [has2Fa, setHas2Fa] = useState(true);
  const [apiKey, setApiKey] = useState('No active key provisioned');
  const [copied, setCopied] = useState(false);
  const [saved,setSaved]=useState(false);

  useEffect(() => {
    void apiKeyService.current().then(({data}) => setApiKey(data?.maskedKey || 'No active key provisioned')).catch(() => setApiKey('Key service unavailable'));
  }, []);

  const handleCopyToken = async () => {
    const { data } = await apiKeyService.rotate();
    setApiKey(data.key);
    await navigator.clipboard.writeText(data.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">Secretariat Identity Profile</h2>
        <p className="text-xs text-gray-400 mt-1">
          Review personal clearance levels, adjust contact numbers, and access regional API tokens.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Profile Details card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col items-center text-center space-y-3 pb-4 border-b border-gray-50">
            <ProfilePhotoControl fullName={user?.fullName||'Administrator'}/>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">{fullName}</h3>
              <p className="text-xs font-mono font-bold text-brand-primary mt-1">Sovereign Clearance: Administrator</p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs text-gray-600">
            <div className="flex items-center gap-3">
              <Mail className="w-4.5 h-4.5 text-gray-400 shrink-0" />
              <div>
                <span className="text-[10px] font-mono font-bold text-gray-400 block uppercase">Clearance Email</span>
                <span className="font-semibold text-gray-800">{email || 'admin@ecoclean.gov.sl'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-4.5 h-4.5 text-gray-400 shrink-0" />
              <div>
                <span className="text-[10px] font-mono font-bold text-gray-400 block uppercase">Contact Number</span>
                <span className="font-semibold text-gray-800">{phone}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-4.5 h-4.5 text-gray-400 shrink-0" />
              <div>
                <span className="text-[10px] font-mono font-bold text-gray-400 block uppercase">Jurisdiction Seat</span>
                <span className="font-semibold text-gray-800">Freetown Central HQ</span>
              </div>
            </div>
          </div>
          <form className="space-y-3 border-t border-gray-50 pt-4" onSubmit={async e=>{e.preventDefault();await profileService.update({fullName,email,phone});setSaved(true);setTimeout(()=>setSaved(false),2000);}}>
            <input aria-label="Full name" value={fullName} onChange={e=>setFullName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs" required/>
            <input aria-label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs" required/>
            <input aria-label="Phone" value={phone} onChange={e=>setPhone(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs" required/>
            <button className="w-full bg-brand-primary text-white text-xs font-bold rounded-xl py-2.5 cursor-pointer">{saved?'Profile Saved':'Save Profile'}</button>
          </form>
        </div>

        {/* Right columns: Security settings & API Tokens */}
        <div className="lg:col-span-2 space-y-6">
          {/* Security Credentials card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider font-mono flex items-center gap-2 border-b border-gray-50 pb-3">
              <Lock className="w-4.5 h-4.5 text-brand-primary" />
              <span>Multi-Factor Security Clearance</span>
            </h3>

            <div className="flex items-center justify-between p-3.5 border border-gray-50 bg-gray-50/20 rounded-xl">
              <div>
                <span className="text-xs font-bold text-gray-800 block">ECOCLEAN Authenticator Verification</span>
                <p className="text-[10px] text-gray-400">Verifies the administrator before protected ledger extraction audits.</p>
              </div>
              <button 
                onClick={() => setHas2Fa(!has2Fa)}
                className="cursor-pointer"
              >
                {has2Fa ? (
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 bg-emerald-50 text-brand-primary rounded border border-emerald-100 uppercase">
                    Configured
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 bg-red-50 text-red-700 rounded border border-red-100 uppercase">
                    Setup Needed
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Secretariat API Credentials card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider font-mono flex items-center gap-2 border-b border-gray-50 pb-3">
              <Key className="w-4.5 h-4.5 text-brand-primary" />
              <span>Developer SDK Keys</span>
            </h3>

            <p className="text-xs text-gray-500 leading-relaxed">
              Use this secret token to integrate ECOCLEAN waste volume indices directly into National GIS agencies or external research systems.
            </p>

            <div className="border border-gray-100 bg-gray-50 rounded-xl p-3.5 flex items-center justify-between gap-4 font-mono text-xs">
              <span className="text-gray-800 truncate select-all">{apiKey}</span>
              <button 
                onClick={handleCopyToken}
                className="text-[10px] font-bold font-sans text-brand-primary hover:underline shrink-0 cursor-pointer"
              >
                {copied ? 'Generated & Copied' : 'Generate Secure Key'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
