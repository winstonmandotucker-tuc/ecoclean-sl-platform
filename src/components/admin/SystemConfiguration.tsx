import React, { useState } from 'react';
import { Save, Server, Sliders, ShieldCheck, ToggleLeft, ToggleRight, Radio, RefreshCw } from 'lucide-react';
import { DEFAULT_SYSTEM_CONFIG } from '../../lib/adminData';

interface SystemConfigurationProps {
  onSaveConfig: (newConfig: typeof DEFAULT_SYSTEM_CONFIG) => void;
}

export default function SystemConfiguration({ onSaveConfig }: SystemConfigurationProps) {
  const [config, setConfig] = useState(DEFAULT_SYSTEM_CONFIG);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleToggleMfa = () => {
    const updated = { ...config, enforceMfaForAdmins: !config.enforceMfaForAdmins };
    setConfig(updated);
  };

  const handleToggleAnon = () => {
    const updated = { ...config, allowAnonymousReports: !config.allowAnonymousReports };
    setConfig(updated);
  };

  const handleSlaChange = (priority: 'High' | 'Medium' | 'Low', val: number) => {
    const updated = { ...config };
    if (priority === 'High') updated.defaultSlaHighHours = val;
    if (priority === 'Medium') updated.defaultSlaMediumHours = val;
    if (priority === 'Low') updated.defaultSlaLowHours = val;
    setConfig(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(config);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">System Configuration Control</h2>
          <p className="text-xs text-gray-400 mt-1">
            Override core platform parameters, default SLA thresholds, and API gateway routes for ECOCLEAN.
          </p>
        </div>

        <button 
          type="submit"
          className="text-xs font-bold px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Save className="w-4 h-4 text-brand-accent" />
          <span>Save Changes</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 p-4 rounded-xl flex items-center gap-2 font-semibold text-xs animate-fade-in">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <span>All operational settings have been re-compiled and distributed across container environments successfully.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: SLA & General Controls */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider font-mono flex items-center gap-2 border-b border-gray-50 pb-3">
            <Sliders className="w-4.5 h-4.5 text-brand-primary" />
            <span>SLA Resolution Deadlines</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 font-mono">High Severity SLA (Hours)</label>
              <input 
                type="number"
                value={config.defaultSlaHighHours}
                onChange={e => handleSlaChange('High', parseInt(e.target.value) || 0)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-brand-primary focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 font-mono">Medium Severity SLA (Hours)</label>
              <input 
                type="number"
                value={config.defaultSlaMediumHours}
                onChange={e => handleSlaChange('Medium', parseInt(e.target.value) || 0)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-brand-primary focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 font-mono">Low Severity SLA (Hours)</label>
              <input 
                type="number"
                value={config.defaultSlaLowHours}
                onChange={e => handleSlaChange('Low', parseInt(e.target.value) || 0)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-brand-primary focus:bg-white"
              />
            </div>
          </div>

          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider font-mono flex items-center gap-2 border-b border-gray-50 pt-4 pb-3">
            <Server className="w-4.5 h-4.5 text-brand-primary" />
            <span>Core Privacy & Auth Controls</span>
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-gray-50 bg-gray-50/20 rounded-xl">
              <div>
                <span className="text-xs font-bold text-gray-800 block">Enforce Admin Multi-Factor Authentication</span>
                <p className="text-[10px] text-gray-400">Forces 2FA codes for administrators accessing security ledgers.</p>
              </div>
              <button 
                type="button"
                onClick={handleToggleMfa}
                className="cursor-pointer"
              >
                {config.enforceMfaForAdmins ? (
                  <ToggleRight className="w-8 h-8 text-brand-primary" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-gray-300" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 border border-gray-50 bg-gray-50/20 rounded-xl">
              <div>
                <span className="text-xs font-bold text-gray-800 block">Allow Anonymous Citizen Incident Reports</span>
                <p className="text-[10px] text-gray-400">Allows reports without confirming voter/credential emails.</p>
              </div>
              <button 
                type="button"
                onClick={handleToggleAnon}
                className="cursor-pointer"
              >
                {config.allowAnonymousReports ? (
                  <ToggleRight className="w-8 h-8 text-brand-primary" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right column: External Integrations Status */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider font-mono flex items-center gap-2 border-b border-gray-50 pb-3">
            <Radio className="w-4.5 h-4.5 text-brand-primary" />
            <span>Core API Bridges</span>
          </h3>

          <div className="space-y-3">
            {Object.entries(config.integrations).map(([key, status]) => (
              <div key={key} className="border border-gray-50 bg-gray-50/10 p-3.5 rounded-xl space-y-1">
                <span className="text-[10px] font-mono font-bold text-gray-400 capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </span>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-800">{status}</span>
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-md shadow-emerald-500/20 animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400 font-mono">
            <RefreshCw className="w-4 h-4 text-gray-300" />
            <span>Automatic heartbeat query every 10s</span>
          </div>
        </div>
      </div>
    </form>
  );
}
