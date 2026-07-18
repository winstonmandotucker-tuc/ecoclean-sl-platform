import React, { useState } from 'react';
import { 
  User, ShieldCheck, Mail, Phone, MapPin, 
  Settings, Save, Bell, Lock, ArrowLeft, LogOut, Award
} from 'lucide-react';
import { User as UserType } from '../../types';
import ProfilePhotoControl from '../ProfilePhotoControl';
import { profileService } from '../../lib/services';

interface SupervisorProfileProps {
  user: UserType | null;
  onUpdateUser: (updated: any) => void;
  onLogout: () => void;
  onBackToSelection: () => void;
}

export default function SupervisorProfile({
  user,
  onUpdateUser,
  onLogout,
  onBackToSelection
}: SupervisorProfileProps) {
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || 'kamara@fcc.gov.sl');
  const [phone, setPhone] = useState(user?.phone || '+232 76 541092');
  const [jurisdiction, setJurisdiction] = useState('Freetown City Council (FCC)');
  
  // Custom switch settings
  const [notifSla, setNotifSla] = useState(true);
  const [notifFuel, setNotifFuel] = useState(true);
  const [notifNewReports, setNotifNewReports] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try{await profileService.update({fullName,email,phone});onUpdateUser({
      ...user,
      fullName,
      email,
      phone
    });await profileService.preferences({theme:'system',language:'en',notificationPreferences:{sla:notifSla,fuel:notifFuel,newReports:notifNewReports},gisPreferences:{},dashboardPreferences:{jurisdiction}});}catch{return;}
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="supervisor-profile-center">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Supervisor Profile</h2>
        <p className="text-xs text-gray-500 mt-0.5">Manage credentials, jurisdiction permissions, and personal notification channels</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: Badge / Credentials summary */}
        <div className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-sm text-center space-y-5">
          <div className="flex flex-col items-center space-y-3">
            <ProfilePhotoControl fullName={fullName}/>
            
            <div>
              <h3 className="text-base font-extrabold text-gray-900 leading-tight">{fullName}</h3>
              <p className="text-xs font-mono text-brand-primary font-bold tracking-wider uppercase mt-1 leading-none">Superintendent</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-150 text-left space-y-3.5">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">Jurisdiction</span>
                <span className="text-xs font-black text-gray-800 leading-none">{jurisdiction}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Award className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">Secured Credentials</span>
                <span className="text-xs font-black text-emerald-700 leading-none flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-brand-accent shrink-0" /> Level-III Inspector Clearance
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <button
              onClick={onBackToSelection}
              className="w-full py-2.5 bg-gray-50 hover:bg-emerald-50 hover:text-brand-primary text-gray-600 text-xs font-bold rounded-xl border border-gray-150 hover:border-emerald-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Workspace Picker</span>
            </button>
            <button
              onClick={onLogout}
              className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl border border-red-100 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out of platform</span>
            </button>
          </div>
        </div>

        {/* Right Side: Configuration Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Profile form */}
          <div className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <Settings className="w-5 h-5 text-brand-primary" />
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider font-mono">Personal Account Details</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium text-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-primary font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">Government Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-primary font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">Sanitary Team Mobile phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-primary font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">Jurisdiction Scope Authority</label>
                  <input
                    type="text"
                    disabled
                    value={jurisdiction}
                    className="w-full text-xs p-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-400 cursor-not-allowed font-medium"
                  />
                </div>
              </div>

              {saveSuccess && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-center text-xs font-bold animate-pulse">
                  ✓ Profile coordinates synchronized successfully!
                </div>
              )}

              <button
                type="submit"
                disabled={saveSuccess}
                className="w-full py-2.5 bg-brand-primary hover:bg-brand-secondary text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4 text-brand-accent" />
                <span>Synchronize Changes</span>
              </button>
            </form>
          </div>

          {/* Alarm Notifications Config */}
          <div className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <Bell className="w-5 h-5 text-brand-primary" />
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider font-mono">Siren & Alert Stream Settings</h3>
            </div>

            <div className="space-y-4">
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-gray-900 block leading-tight">Emergency SLA Breach Siren Warnings</span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Send immediate browser buzzer if a High Priority task approaches the 4-hour limit.</span>
                </div>
                <button 
                  onClick={() => setNotifSla(!notifSla)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${notifSla ? 'bg-brand-primary' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifSla ? 'right-1' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-gray-900 block leading-tight">Fuel Allowance Authorization Signals</span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Alert if operators request diesel fuel dispatch codes during active routes.</span>
                </div>
                <button 
                  onClick={() => setNotifFuel(!notifFuel)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${notifFuel ? 'bg-brand-primary' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifFuel ? 'right-1' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-gray-900 block leading-tight">New Citizen Waste Reports Alerts</span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Notify instantly when verified citizens file overflowing bin or illegal dumping coordinates.</span>
                </div>
                <button 
                  onClick={() => setNotifNewReports(!notifNewReports)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${notifNewReports ? 'bg-brand-primary' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifNewReports ? 'right-1' : 'left-1'}`} />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
