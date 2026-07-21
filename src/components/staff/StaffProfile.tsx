import React, { useState } from 'react';
import { 
  User, Shield, ShieldCheck, Mail, Phone, Truck, MapPin, Sliders, LogOut, 
  Lock, Settings, Bell, RefreshCw, CheckCircle2, Award 
} from 'lucide-react';
import AuthenticatedAvatar from '../AuthenticatedAvatar';
import { profileService } from '../../lib/services';

interface StaffProfileProps {
  user: any;
  onUpdateUser: (updatedUser: any) => void;
  onLogout: () => void;
  onBackToSelection: () => void;
}

export default function StaffProfile({
  user,
  onUpdateUser,
  onLogout,
  onBackToSelection
}: StaffProfileProps) {
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '+232 77 482 914');
  const [email, setEmail] = useState(user?.email || '');
  const [truckCode, setTruckCode] = useState('Compactor SL-02');
  const [defaultZone, setDefaultZone] = useState('Zone 4 (West Freetown)');
  
  // Settings toggle states
  const [smsDispatches, setSmsDispatches] = useState(true);
  const [emailSummaries, setEmailSummaries] = useState(false);
  const [geoTracking, setGeoTracking] = useState(true);

  const [saving, setSaving] = useState(false);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await profileService.preferences({theme:'system',language:'en',notificationPreferences:{smsDispatches,emailSummaries},gisPreferences:{geoTracking},dashboardPreferences:{}});
      alert('Operator preferences updated successfully. Identity details are managed by your Supervisor or Administrator.');
    } catch(error:any){alert(error?.message||'Profile update failed.');} finally {setSaving(false);}
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Operator Profile</h2>
        <p className="text-xs text-gray-400 mt-1">Manage credentials, vehicle allocations, and secure communication relays.</p>
      </div>

      {/* Main Grid Card Layout (Card info Left, Fields Right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Card info block */}
        <div className="md:col-span-4 space-y-6">
          
          <div className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-sm text-center space-y-4">
            
            {/* Operator Avatar circle */}
            <div className="flex justify-center"><AuthenticatedAvatar user={user} className="w-24 h-24" textClassName="text-3xl"/></div>

            <div>
              <h3 className="text-base font-extrabold text-gray-900 truncate leading-snug">{fullName}</h3>
              <p className="text-xs text-brand-primary font-bold font-mono uppercase mt-0.5 tracking-wider">{user?.roleLabel||'Staff'}{user?.municipality?` • ${user.municipality}`:''}</p>
            </div>

            <div className="bg-gray-50/70 rounded-2xl p-3.5 border border-gray-100 text-left text-xs space-y-2.5">
              <div className="flex items-center gap-2 text-gray-500">
                <Award className="w-4 h-4 text-brand-primary shrink-0" />
                <span>Employee ID: <strong className="text-gray-800 font-mono">EC-SL-OP-401</strong></span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Truck className="w-4 h-4 text-brand-primary shrink-0" />
                <span className="truncate">Vehicle: <strong className="text-gray-800 font-bold">{truckCode}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin className="w-4 h-4 text-brand-primary shrink-0" />
                <span className="truncate">Zone: <strong className="text-gray-800 font-bold">Zone 4</strong></span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 space-y-2">
              <button
                onClick={onBackToSelection}
                className="w-full bg-emerald-50 hover:bg-emerald-100/50 text-brand-primary font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-100/30"
              >
                <span>Workspace Picker</span>
              </button>
              <button
                onClick={onLogout}
                className="w-full bg-red-50 hover:bg-red-100/50 text-red-600 font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out Session</span>
              </button>
            </div>

          </div>

          {/* Device Telemetry status */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 space-y-3.5">
            <span className="text-[9px] font-mono font-bold text-brand-accent uppercase tracking-wider block">GPS Device Sync Status</span>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between font-mono">
                <span>Relay Feed:</span>
                <span className="text-brand-success font-bold">● ACTIVE</span>
              </div>
              <div className="flex justify-between font-mono">
                <span>Accuracy Bound:</span>
                <span>&lt; 2.5 meters</span>
              </div>
              <div className="flex justify-between font-mono">
                <span>Signal strength:</span>
                <span>94% (GPRS)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Form Fields & Toggles */}
        <div className="md:col-span-8 space-y-6">
          
          {/* Profile fields form */}
          <form onSubmit={handleProfileSave} className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider font-mono">Employee Registry Info</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-gray-400 uppercase font-mono block">Operator Full Name</label>
                <input
                  type="text"
                  required
                  disabled
                  value={fullName}
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs text-gray-500 cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-gray-400 uppercase font-mono block">Duty Mobile Number</label>
                <input
                  type="text"
                  required
                  disabled
                  value={phone}
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs text-gray-500 cursor-not-allowed"
                />
              </div>

              <div className="space-y-2 col-span-full">
                <label className="text-xs font-extrabold text-gray-400 uppercase font-mono block">Secured Corporate Email</label>
                <input
                  type="email"
                  required
                  disabled
                  value={email}
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs text-gray-500 cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-gray-400 uppercase font-mono block">Assigned Vessel Roster</label>
                <input
                  type="text"
                  disabled
                  value={truckCode}
                  className="w-full bg-gray-100 border border-transparent rounded-xl py-2.5 px-3.5 text-xs text-gray-400 cursor-not-allowed font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-gray-400 uppercase font-mono block">Sector Council Zone</label>
                <input
                  type="text"
                  disabled
                  value={defaultZone}
                  className="w-full bg-gray-100 border border-transparent rounded-xl py-2.5 px-3.5 text-xs text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <p className="text-[11px] font-semibold text-amber-700">Identity and profile-photo changes require a Supervisor or Administrator.</p>
              <button
                type="submit"
                disabled={saving}
                className="bg-brand-primary hover:bg-brand-secondary text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving registry...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-3.5 h-3.5" />
                    <span>Save Operator Preferences</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Operational notification preferences */}
          <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider font-mono">Relay Channels Toggles</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-gray-800">Direct GSM SMS Dispatch dispatches</h4>
                  <p className="text-[11px] text-gray-400 max-w-sm">Receive immediate SMS notifications with coordinates when new jobs are flagged, bypassing cellular data dropouts.</p>
                </div>
                <input
                  type="checkbox"
                  checked={smsDispatches}
                  onChange={() => setSmsDispatches(!smsDispatches)}
                  className="accent-brand-primary w-4.5 h-4.5 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-50">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-gray-800">Weekly Performance summaries</h4>
                  <p className="text-[11px] text-gray-400 max-w-sm">Send a weekly summary email containing completion stats, satisfaction ranks, and fuel conservation indices.</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailSummaries}
                  onChange={() => setEmailSummaries(!emailSummaries)}
                  className="accent-brand-primary w-4.5 h-4.5 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-50">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-gray-800">Geospatial Telemetry log relays</h4>
                  <p className="text-[11px] text-gray-400 max-w-sm">Authorize secure background coordinates pinging to fuel optimization and route allocation servers.</p>
                </div>
                <input
                  type="checkbox"
                  checked={geoTracking}
                  onChange={() => setGeoTracking(!geoTracking)}
                  className="accent-brand-primary w-4.5 h-4.5 cursor-pointer"
                />
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
