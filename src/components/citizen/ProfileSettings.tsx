import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Sliders, ShieldAlert, LogOut, Save, Key, Bell, ShieldCheck, Eye, EyeOff, Edit3, Check } from 'lucide-react';
import { DISTRICTS, MUNICIPALITIES } from '../../lib/citizenData';
import { User as UserType } from '../../types';
import { profileService } from '../../lib/services';
import ProfilePhotoControl from '../ProfilePhotoControl';

interface ProfileSettingsProps {
  user: UserType | null;
  onLogout: () => void;
  onUpdateProfile: (updated: any) => void;
}

export default function ProfileSettings({ user, onLogout, onUpdateProfile }: ProfileSettingsProps) {
  // Edit Profile States
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '+232 76 543210');
  const [address, setAddress] = useState('24 Kroo Town Road');
  const [district, setDistrict] = useState(DISTRICTS[0]);
  const [municipality, setMunicipality] = useState(MUNICIPALITIES[DISTRICTS[0]][0]);
  const [municipalityId,setMunicipalityId]=useState<number|null>(null);
  const [districtId,setDistrictId]=useState<number|null>(null);
  const [emergencyContactName,setEmergencyContactName]=useState('');
  const [emergencyContactPhone,setEmergencyContactPhone]=useState('');
  const [biography,setBiography]=useState('');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);

  // Change Password States
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passSuccessMsg, setPassSuccessMsg] = useState<string | null>(null);
  const [passErrorMsg, setPassErrorMsg] = useState<string | null>(null);

  // Notification toggles
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [environmentalAlerts, setEnvironmentalAlerts] = useState(true);
  const [weeklySchedules, setWeeklySchedules] = useState(false);
  const [notifSuccess, setNotifSuccess] = useState(false);

  // Privacy toggles
  const [shareGpsLocation, setShareGpsLocation] = useState(true);
  const [publicLeaderboard, setPublicLeaderboard] = useState(true);
  const [privacySuccess, setPrivacySuccess] = useState(false);

  useEffect(()=>{void profileService.get().then(({data})=>{setFullName(data.fullName);setEmail(data.email);setPhone(data.phone||'');setAddress(data.address||'');setMunicipality(data.municipality||municipality);setDistrict(data.district||district);setMunicipalityId(data.municipalityId||null);setDistrictId(data.districtId||null);setEmergencyContactName(data.emergencyContactName||'');setEmergencyContactPhone(data.emergencyContactPhone||'');setBiography(data.biography||'');const n=data.notificationPreferences||{};setSmsAlerts(n.sms??true);setEmailAlerts(n.email??true);setEnvironmentalAlerts(n.environmental??true);setWeeklySchedules(n.weeklySchedules??false);const g=data.gisPreferences||{};setShareGpsLocation(g.shareLocation??true);setPublicLeaderboard(data.dashboardPreferences?.publicLeaderboard??true);}).catch(()=>setProfileSuccessMsg('Unable to load the saved profile.'));},[]);

  const handleDistrictChange = (dist: string) => {
    setDistrict(dist);
    const list = MUNICIPALITIES[dist];
    if (list && list.length > 0) {
      setMunicipality(list[0]);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try{await profileService.update({fullName,email,phone,address,municipalityId,districtId,emergencyContactName,emergencyContactPhone,biography});onUpdateProfile({fullName,email,phone,address,district,municipality});setIsEditing(false);setProfileSuccessMsg('Profile updated successfully!');}catch(error:any){setProfileSuccessMsg(error?.message||'Profile update failed.');}
    setTimeout(() => setProfileSuccessMsg(null), 3000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassErrorMsg(null);
    setPassSuccessMsg(null);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPassErrorMsg('All fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassErrorMsg('New passwords do not match.');
      return;
    }
    if (newPassword.length < 10) {
      setPassErrorMsg('Password must be at least 10 characters.');
      return;
    }
    try{await profileService.changePassword(oldPassword,newPassword);}catch(error:any){setPassErrorMsg(error?.message||'Password change failed.');return;}
    setPassSuccessMsg('Password changed successfully. Sign in again with the new password.');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPassSuccessMsg(null), 3500);
  };

  const handleSaveNotifications = async () => {
    await profileService.preferences({theme:'system',language:'en',notificationPreferences:{sms:smsAlerts,email:emailAlerts,environmental:environmentalAlerts,weeklySchedules},gisPreferences:{shareLocation:shareGpsLocation},dashboardPreferences:{publicLeaderboard}});
    setNotifSuccess(true);
    setTimeout(() => setNotifSuccess(false), 2500);
  };

  const handleSavePrivacy = async () => {
    await profileService.preferences({theme:'system',language:'en',notificationPreferences:{sms:smsAlerts,email:emailAlerts,environmental:environmentalAlerts,weeklySchedules},gisPreferences:{shareLocation:shareGpsLocation},dashboardPreferences:{publicLeaderboard}});
    setPrivacySuccess(true);
    setTimeout(() => setPrivacySuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto" id="profile-settings-panel">
      
      {/* Upper Grid: Profile Overview & Edit Profile */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: Avatar & Quick Info card (5 cols) */}
        <div className="md:col-span-5 bg-white rounded-3xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="text-center space-y-4 pt-4">
            {/* Avatar block */}
            <ProfilePhotoControl fullName={fullName}/>

            <div>
              <h2 className="text-base font-extrabold text-gray-900 leading-tight">{fullName}</h2>
              <span className="text-[10px] font-mono font-bold tracking-wider text-brand-primary bg-brand-primary/5 border border-brand-primary/10 px-2.5 py-0.5 rounded-full uppercase inline-block mt-1">
                Citizen Account
              </span>
              <p className="text-xs text-gray-400 mt-2 flex items-center justify-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{address}, {district}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1"><label className="block text-[10px] font-bold text-gray-400 uppercase">Emergency Contact Name</label><input type="text" disabled={!isEditing} value={emergencyContactName} onChange={e=>setEmergencyContactName(e.target.value)} className="w-full bg-gray-50/50 disabled:bg-gray-100/30 border border-gray-200 rounded-xl p-2.5 text-xs"/></div>
              <div className="space-y-1"><label className="block text-[10px] font-bold text-gray-400 uppercase">Emergency Contact Phone</label><input type="tel" disabled={!isEditing} value={emergencyContactPhone} onChange={e=>setEmergencyContactPhone(e.target.value)} className="w-full bg-gray-50/50 disabled:bg-gray-100/30 border border-gray-200 rounded-xl p-2.5 text-xs"/></div>
              <div className="space-y-1 sm:col-span-2"><label className="block text-[10px] font-bold text-gray-400 uppercase">Biography</label><textarea disabled={!isEditing} value={biography} onChange={e=>setBiography(e.target.value)} rows={3} className="w-full bg-gray-50/50 disabled:bg-gray-100/30 border border-gray-200 rounded-xl p-2.5 text-xs resize-none"/></div>
            </div>
          </div>

          {/* Quick Stats list */}
          <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-100 text-xs text-gray-500 space-y-2 font-medium">
            <div className="flex justify-between">
              <span>Primary Email:</span>
              <span className="font-bold text-gray-700 truncate max-w-[150px]">{email}</span>
            </div>
            <div className="flex justify-between">
              <span>Mobile Phone:</span>
              <span className="font-bold text-gray-700">{phone}</span>
            </div>
            <div className="flex justify-between">
              <span>Council Region:</span>
              <span className="font-bold text-gray-700 truncate max-w-[150px]">{municipality}</span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-full bg-red-50 hover:bg-red-100 border border-red-100 text-brand-error text-xs font-bold py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of ECOCLEAN</span>
          </button>
        </div>

        {/* Right Column: Edit Profile Form (7 cols) */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-extrabold text-gray-900">Personal Information</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Edit and update your civic contact card.</p>
            </div>
            
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs font-bold text-brand-primary bg-brand-accent/20 hover:bg-brand-accent/40 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            )}
          </div>

          {profileSuccessMsg && (
            <div className="p-3.5 bg-emerald-50 text-brand-success text-xs font-bold rounded-xl border border-emerald-100 flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>{profileSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-gray-400 uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  disabled={!isEditing}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-gray-50/50 disabled:bg-gray-100/30 border border-gray-200 disabled:text-gray-500 rounded-xl p-2.5 text-xs text-gray-800 focus:outline-none focus:border-brand-primary font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-gray-400 uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  disabled={!isEditing}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50/50 disabled:bg-gray-100/30 border border-gray-200 disabled:text-gray-500 rounded-xl p-2.5 text-xs text-gray-800 focus:outline-none focus:border-brand-primary font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-gray-400 uppercase">Phone Number</label>
                <input
                  type="tel"
                  required
                  disabled={!isEditing}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-gray-50/50 disabled:bg-gray-100/30 border border-gray-200 disabled:text-gray-500 rounded-xl p-2.5 text-xs text-gray-800 focus:outline-none focus:border-brand-primary font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-gray-400 uppercase">District</label>
                <select
                  disabled={!isEditing}
                  value={district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full bg-gray-50/50 disabled:bg-gray-100/30 border border-gray-200 disabled:text-gray-500 rounded-xl p-2.5 text-xs text-gray-800 focus:none cursor-pointer"
                >
                  {DISTRICTS.map((dst) => (
                    <option key={dst} value={dst}>{dst}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-gray-400 uppercase">Municipality</label>
                <input
                  type="text"
                  readOnly
                  value={municipality}
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-400 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-gray-400 uppercase">Street Address</label>
                <input
                  type="text"
                  required
                  disabled={!isEditing}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-gray-50/50 disabled:bg-gray-100/30 border border-gray-200 disabled:text-gray-500 rounded-xl p-2.5 text-xs text-gray-800 focus:outline-none focus:border-brand-primary font-medium"
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFullName(user?.fullName || '');
                    setEmail(user?.email || '');
                  }}
                  className="text-xs font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-xs font-bold text-white bg-brand-primary hover:bg-brand-secondary px-5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </button>
              </div>
            )}
          </form>

        </div>

      </div>

      {/* Lower Grid: Change Password & Preferences Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Change Password Form Card */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
            <div className="p-2 bg-brand-primary/5 rounded-xl text-brand-primary border border-brand-primary/10">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-gray-900">Change Password</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Secure your authentication gateway credentials.</p>
            </div>
          </div>

          {passErrorMsg && (
            <div className="p-3 bg-red-50 text-brand-error text-xs font-bold rounded-xl border border-red-100">
              {passErrorMsg}
            </div>
          )}

          {passSuccessMsg && (
            <div className="p-3 bg-emerald-50 text-brand-success text-xs font-bold rounded-xl border border-emerald-100 flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>{passSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-1 relative">
              <label className="block text-[10px] font-bold text-gray-400 uppercase">Old Password</label>
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-800 focus:outline-none focus:border-brand-primary pr-10 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-7 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-gray-400 uppercase">New Password</label>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-800 focus:outline-none focus:border-brand-primary font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-gray-400 uppercase">Confirm Password</label>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-800 focus:outline-none focus:border-brand-primary font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gray-100 hover:bg-brand-primary hover:text-white text-gray-700 text-xs font-bold py-3 px-4 rounded-xl transition-all cursor-pointer text-center border border-gray-200/50"
            >
              Update Gateway Password
            </button>
          </form>
        </div>

        {/* Preferences / Toggles panel Card */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
          {/* Notification settings block */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
              <div className="p-2 bg-brand-primary/5 rounded-xl text-brand-primary border border-brand-primary/10">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-gray-900">Notifications & Alerts</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Toggle live SMS channels, events, and reports update logs.</p>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              {/* sms toggle */}
              <label className="flex items-center justify-between text-xs cursor-pointer group">
                <div className="space-y-0.5 pr-4">
                  <span className="font-bold text-gray-800 group-hover:text-brand-primary transition-colors">Immediate SMS Updates</span>
                  <p className="text-[11px] text-gray-400">Receive instant SMS alerts when supervisors close tickets.</p>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="w-4 h-4 accent-brand-primary rounded cursor-pointer"
                />
              </label>

              {/* email alerts toggle */}
              <label className="flex items-center justify-between text-xs cursor-pointer group">
                <div className="space-y-0.5 pr-4">
                  <span className="font-bold text-gray-800 group-hover:text-brand-primary transition-colors">Email Newsletters & Highlights</span>
                  <p className="text-[11px] text-gray-400">Monthly reports detailing municipal sanitation impacts.</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 accent-brand-primary rounded cursor-pointer"
                />
              </label>

              {/* environmental warning toggle */}
              <label className="flex items-center justify-between text-xs cursor-pointer group">
                <div className="space-y-0.5 pr-4">
                  <span className="font-bold text-gray-800 group-hover:text-brand-primary transition-colors">Environmental Alerts</span>
                  <p className="text-[11px] text-gray-400">Receive high-priority warnings from the Met Office.</p>
                </div>
                <input
                  type="checkbox"
                  checked={environmentalAlerts}
                  onChange={(e) => setEnvironmentalAlerts(e.target.checked)}
                  className="w-4 h-4 accent-brand-primary rounded cursor-pointer"
                />
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSaveNotifications}
                className="text-xs font-bold text-brand-primary hover:text-brand-success bg-brand-accent/20 px-4.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1"
              >
                {notifSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Notification Alerts</span>
                )}
              </button>
            </div>
          </div>

          {/* Privacy settings block */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-5 h-5 text-gray-400" />
              <div>
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Privacy Settings</h4>
                <p className="text-[10px] text-gray-400">Manage GPS telemetry and leaderboard access.</p>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <label className="flex items-center justify-between text-xs cursor-pointer group">
                <div className="space-y-0.5 pr-4">
                  <span className="font-bold text-gray-800 group-hover:text-brand-primary transition-colors">Share Exact GPS Coordinates</span>
                  <p className="text-[11px] text-gray-400">Speeds up dispatch, but tags exact coordinates of your device.</p>
                </div>
                <input
                  type="checkbox"
                  checked={shareGpsLocation}
                  onChange={(e) => setShareGpsLocation(e.target.checked)}
                  className="w-4 h-4 accent-brand-primary rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between text-xs cursor-pointer group">
                <div className="space-y-0.5 pr-4">
                  <span className="font-bold text-gray-800 group-hover:text-brand-primary transition-colors">Show Profile on Leaderboard</span>
                  <p className="text-[11px] text-gray-400">Toggle public visibility of your points standing.</p>
                </div>
                <input
                  type="checkbox"
                  checked={publicLeaderboard}
                  onChange={(e) => setPublicLeaderboard(e.target.checked)}
                  className="w-4 h-4 accent-brand-primary rounded cursor-pointer"
                />
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSavePrivacy}
                className="text-xs font-bold text-brand-primary hover:text-brand-success bg-brand-accent/20 px-4.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1"
              >
                {privacySuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Privacy Controls</span>
                )}
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
