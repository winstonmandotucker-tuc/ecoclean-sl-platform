import React, { useState } from 'react';
import { Send, Bell, CheckCircle2, Sliders, Globe, ShieldCheck, Mail, Smartphone } from 'lucide-react';
import { CountryConfig, DEFAULT_SYSTEM_CONFIG } from '../../lib/adminData';

interface NationalNotificationCenterProps {
  country: CountryConfig;
  systemConfig: typeof DEFAULT_SYSTEM_CONFIG;
  onSaveConfig: (newConfig: typeof DEFAULT_SYSTEM_CONFIG) => void;
}

export default function NationalNotificationCenter({ 
  country, 
  systemConfig, 
  onSaveConfig 
}: NationalNotificationCenterProps) {
  const [targetGroup, setTargetGroup] = useState('All Citizens & Staff');
  const [broadcastChannel, setBroadcastChannel] = useState('in_app');
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationBody, setNotificationBody] = useState('');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Active notifications lists
  const [notifs, setNotifs] = useState(systemConfig.notifications);

  const handleDispatchNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notificationTitle || !notificationBody) return;

    const newNotif = {
      id: `N-MAS-${Math.floor(100 + Math.random() * 900)}`,
      title: notificationTitle,
      body: notificationBody,
      date: new Date().toISOString().slice(0, 10),
      target: targetGroup,
      author: 'Dr. Josephus Johnson (Secretariat)',
      status: 'Sent'
    };

    const updatedNotifs = [newNotif, ...notifs];
    setNotifs(updatedNotifs);
    
    // Sync to parent settings
    onSaveConfig({
      ...systemConfig,
      notifications: updatedNotifs
    });

    setNotificationTitle('');
    setNotificationBody('');
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">National Broadcast & Notifications</h2>
        <p className="text-xs text-gray-400 mt-1">
          Issue mass notifications, SMS circulars, and environmental warnings to citizen devices, field operators, or local councils in {country.name}.
        </p>
      </div>

      {broadcastSuccess && (
        <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 p-4 rounded-xl flex items-center gap-2 font-semibold text-xs animate-fade-in">
          <ShieldCheck className="w-5 h-5 text-emerald-500 animate-bounce" />
          <span>Sovereign announcement pushed over cellular gateways and in-app feeds successfully.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns: Compose Notification Form */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider font-mono flex items-center gap-2 border-b border-gray-50 pb-3">
            <Sliders className="w-4.5 h-4.5 text-brand-primary" />
            <span>Compose Sovereign Broadcast</span>
          </h3>

          <form onSubmit={handleDispatchNotification} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 font-mono">Target Recipient Group</label>
                <select 
                  value={targetGroup}
                  onChange={e => setTargetGroup(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-primary focus:bg-white"
                >
                  <option value="All Citizens & Staff">All Public Citizens & Operational Staff</option>
                  <option value="Supervisors & Staff">Local Supervisors & Crews Only</option>
                  <option value="Only Freetown Municipal">Freetown Municipality Area Exclusively</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 font-mono">Pumping Channel Gateway</label>
                <select 
                  value={broadcastChannel}
                  onChange={e => setBroadcastChannel(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-primary focus:bg-white"
                >
                  <option value="in_app">ECOCLEAN Mobile App Push Notification</option>
                  <option value="sms">Cellular GSM Gateway SMS (Sierra Leone Only)</option>
                  <option value="email">National Email Secretariat Circular</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 font-mono">Notification Header Title</label>
              <input 
                type="text"
                required
                value={notificationTitle}
                onChange={e => setNotificationTitle(e.target.value)}
                placeholder="e.g. Mass Cleanup Initiative This Saturday"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-brand-primary focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 font-mono">Message Narrative Body</label>
              <textarea 
                required
                rows={4}
                value={notificationBody}
                onChange={e => setNotificationBody(e.target.value)}
                placeholder="Narrative instructions, dates, and civic parameters..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-primary focus:bg-white resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button 
                type="submit"
                className="text-xs font-bold px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4 text-brand-accent" />
                <span>Transmit Broadcast</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Outgoing circulars stream */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider font-mono flex items-center gap-2 border-b border-gray-50 pb-3">
            <Bell className="w-4.5 h-4.5 text-brand-primary" />
            <span>Circular Outbox</span>
          </h3>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {notifs.map((notif) => (
              <div key={notif.id} className="border border-gray-100 p-3.5 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono font-bold text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded uppercase">
                    {notif.id}
                  </span>
                  <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase">
                    {notif.status}
                  </span>
                </div>
                
                <div>
                  <h4 className="text-xs font-extrabold text-gray-800 line-clamp-1">{notif.title}</h4>
                  <p className="text-[10px] text-gray-500 line-clamp-2 mt-0.5 leading-relaxed">{notif.body}</p>
                </div>

                <div className="flex justify-between items-center text-[9px] text-gray-400 font-mono border-t border-gray-50 pt-2 mt-2">
                  <span>To: {notif.target}</span>
                  <span>{notif.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
