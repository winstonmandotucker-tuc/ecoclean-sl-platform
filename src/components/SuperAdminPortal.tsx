import React, { useState, useEffect } from 'react';
import { operationalStore } from '../lib/operationalStore';
import ServiceCenter from './service/ServiceCenter';
import AdminProfile from './admin/AdminProfile';
import { 
  Layers, Map, Users, Sliders, Settings, ShieldCheck, 
  Activity, Bell, BarChart2, Radio, Database, Download, Cpu,
  Menu, X, LogOut, ChevronDown, User, ShieldAlert, Key, Globe, Terminal,
  Truck, Trash2, Shield, Calendar, Briefcase, Building, HelpCircle, Code2, MessageSquare
} from 'lucide-react';
import { User as UserType } from '../types';
import AuthenticatedAvatar from './AuthenticatedAvatar';

import { 
  COUNTRIES, DEFAULT_ADMIN_USERS, DEFAULT_AUDIT_LOGS, DEFAULT_RBAC_RULES, 
  DEFAULT_SYSTEM_CONFIG, CountryConfig, AdminUser, AuditLog, RBACRole 
} from '../lib/adminData';

import {
  FleetManagementView,
  SmartBinView,
  DisasterResponseView,
  CommunityEngagementView,
  AssetManagementView,
  ContractorManagementView,
  KnowledgeHubView,
  PublicApiView,
  NationalOperationsCenterView
} from './modules/EnterpriseModules';

interface SuperAdminPortalProps {
  user: UserType | null;
  onLogout: () => void;
}

type SuperAdminTab = 
  | 'overview'
  | 'security'
  | 'diagnostics'
  | 'settings'
  | 'audit'
  | 'fleet'
  | 'smart-bins'
  | 'disaster'
  | 'volunteers'
  | 'assets'
  | 'contractors'
  | 'docs'
  | 'apis'
  | 'noc'
  | 'service-center'
  | 'profile';

export default function SuperAdminPortal({ user, onLogout }: SuperAdminPortalProps) {
  const [activeTab, setActiveTab] = useState<SuperAdminTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [usersList, setUsersList] = useState<AdminUser[]>([]);
  const [systemProperties, setSystemProperties] = useState(DEFAULT_SYSTEM_CONFIG);

  useEffect(() => {
    // Load local seed states
    const storedLogs = operationalStore.getItem('ecoclean_audit_logs');
    if (storedLogs) {
      setLogs(JSON.parse(storedLogs));
    } else {
      setLogs(DEFAULT_AUDIT_LOGS);
    }

    const storedUsers = operationalStore.getItem('ecoclean_admin_users');
    if (storedUsers) {
      setUsersList(JSON.parse(storedUsers));
    } else {
      setUsersList(DEFAULT_ADMIN_USERS);
    }
  }, []);

  const handleTabChange = (tab: SuperAdminTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  // Super Admin action handlers
  const handleToggleMfa = () => {
    const updated = { ...systemProperties, enforceMfaForAdmins: !systemProperties.enforceMfaForAdmins };
    setSystemProperties(updated);
    operationalStore.setItem('ecoclean_system_config', JSON.stringify(updated));
  };

  const handleCycleLogLevel = () => {
    const nextLevel: Record<string, string> = {
      'Detailed-Debug': 'Secure-Hashing-Only',
      'Secure-Hashing-Only': 'Sovereign-Audit-Strict',
      'Sovereign-Audit-Strict': 'Detailed-Debug'
    };
    const updated = { ...systemProperties, logLevel: nextLevel[systemProperties.logLevel] || 'Detailed-Debug' };
    setSystemProperties(updated);
    operationalStore.setItem('ecoclean_system_config', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex flex-col md:flex-row font-sans selection:bg-brand-accent selection:text-brand-primary">
      
      {/* SPRINT ACTIVE STAGE BAR */}
      <div className="md:hidden bg-slate-950 text-white text-[10px] px-4 py-2 flex items-center justify-between font-mono font-bold tracking-wide relative z-40 border-b border-slate-900 shadow-sm shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
          <span>SUPER PROTOCOL ACTIVE</span>
        </div>
        <span className="text-purple-400 font-bold">SOVEREIGN ACCESS LEVEL</span>
      </div>

      {/* 1. PERSISTENT SIDEBAR ON DESKTOP */}
      <aside className="hidden md:flex md:w-64 bg-slate-950 text-slate-300 p-6 flex-col justify-between shrink-0 h-screen sticky top-0 border-r border-slate-900 z-30">
        <div className="space-y-6 overflow-y-auto pr-1">
          
          {/* Brand header */}
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
            <div className="w-8 h-8 bg-purple-900 rounded-lg flex items-center justify-center text-white">
              <Key className="w-4.5 h-4.5 text-purple-300 animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-white block leading-none">ECOCLEAN</span>
              <span className="text-[9px] text-purple-400 font-mono tracking-widest uppercase font-bold block mt-1">Super Secretariat</span>
            </div>
          </div>

          <div className="bg-purple-950/40 border border-purple-900/40 p-3 rounded-xl flex items-center gap-3">
            <AuthenticatedAvatar user={user} className="w-8 h-8" textClassName="text-[10px]"/>
            <div className="min-w-0">
              <span className="text-xs font-bold text-white block truncate leading-none">{user?.fullName}</span>
              <span className="text-[8px] text-purple-300 font-mono tracking-wider uppercase font-bold block mt-1">{user?.roleLabel||'National Admin'}{user?.municipality?` • ${user.municipality}`:''}</span>
            </div>
          </div>

          {/* Sidebar Menu Navigation */}
          <nav className="space-y-1 pt-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block px-1 mb-2 font-mono">Core Tiers</span>
            
            <button
              onClick={() => handleTabChange('overview')}
              className={`w-full text-left text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-purple-900 text-white shadow-lg shadow-purple-900/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Globe className="w-4 h-4 shrink-0 text-purple-400" />
              <span>Global Sovereign Map</span>
            </button>

            <button
              onClick={() => handleTabChange('audit')}
              className={`w-full text-left text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-purple-900 text-white shadow-lg shadow-purple-900/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <ShieldAlert className="w-4 h-4 shrink-0 text-purple-400" />
              <span>Ledger Security Audit</span>
            </button>

            <button onClick={() => handleTabChange('service-center')} className={`w-full text-left text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer ${activeTab==='service-center'?'bg-purple-900 text-white shadow-lg shadow-purple-900/10':'text-slate-400 hover:text-white hover:bg-slate-900'}`}>
              <MessageSquare className="w-4 h-4 shrink-0 text-purple-400"/><span>National Service Center</span>
            </button>

            <button
              onClick={() => handleTabChange('diagnostics')}
              className={`w-full text-left text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'diagnostics'
                  ? 'bg-purple-900 text-white shadow-lg shadow-purple-900/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Cpu className="w-4 h-4 shrink-0 text-purple-400" />
              <span>Server Diagnostics</span>
            </button>

            <button
              onClick={() => handleTabChange('settings')}
              className={`w-full text-left text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-purple-900 text-white shadow-lg shadow-purple-900/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Sliders className="w-4 h-4 shrink-0 text-purple-400" />
              <span>Global Settings</span>
            </button>

            <button onClick={() => handleTabChange('profile')} className={`w-full text-left text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer ${activeTab==='profile'?'bg-purple-900 text-white shadow-lg shadow-purple-900/10':'text-slate-400 hover:text-white hover:bg-slate-900'}`}>
              <User className="w-4 h-4 shrink-0 text-purple-400"/><span>My Identity</span>
            </button>

            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block px-1 pt-4 mb-2 font-mono">Operations & IoT</span>

            <button
              onClick={() => handleTabChange('noc')}
              className={`w-full text-left text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'noc'
                  ? 'bg-purple-900 text-white shadow-lg shadow-purple-900/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Radio className="w-4 h-4 shrink-0 text-purple-400" />
              <span>National Ops Center</span>
            </button>

            <button
              onClick={() => handleTabChange('fleet')}
              className={`w-full text-left text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'fleet'
                  ? 'bg-purple-900 text-white shadow-lg shadow-purple-900/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Truck className="w-4 h-4 shrink-0 text-purple-400" />
              <span>Fleet Management</span>
            </button>

            <button
              onClick={() => handleTabChange('smart-bins')}
              className={`w-full text-left text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'smart-bins'
                  ? 'bg-purple-900 text-white shadow-lg shadow-purple-900/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Trash2 className="w-4 h-4 shrink-0 text-purple-400" />
              <span>Smart Bin Matrix</span>
            </button>

            <button
              onClick={() => handleTabChange('disaster')}
              className={`w-full text-left text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'disaster'
                  ? 'bg-purple-900 text-white shadow-lg shadow-purple-900/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 shrink-0 text-purple-400" />
              <span>Disaster Response</span>
            </button>

            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block px-1 pt-4 mb-2 font-mono">Enterprise G2B</span>

            <button
              onClick={() => handleTabChange('volunteers')}
              className={`w-full text-left text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'volunteers'
                  ? 'bg-purple-900 text-white shadow-lg shadow-purple-900/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Users className="w-4 h-4 shrink-0 text-purple-400" />
              <span>Civic Volunteers</span>
            </button>

            <button
              onClick={() => handleTabChange('assets')}
              className={`w-full text-left text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'assets'
                  ? 'bg-purple-900 text-white shadow-lg shadow-purple-900/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Briefcase className="w-4 h-4 shrink-0 text-purple-400" />
              <span>Asset Registry</span>
            </button>

            <button
              onClick={() => handleTabChange('contractors')}
              className={`w-full text-left text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'contractors'
                  ? 'bg-purple-900 text-white shadow-lg shadow-purple-900/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Building className="w-4 h-4 shrink-0 text-purple-400" />
              <span>Contractors & SLAs</span>
            </button>

            <button
              onClick={() => handleTabChange('docs')}
              className={`w-full text-left text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'docs'
                  ? 'bg-purple-900 text-white shadow-lg shadow-purple-900/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <HelpCircle className="w-4 h-4 shrink-0 text-purple-400" />
              <span>Policy Knowledge Hub</span>
            </button>

            <button
              onClick={() => handleTabChange('apis')}
              className={`w-full text-left text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'apis'
                  ? 'bg-purple-900 text-white shadow-lg shadow-purple-900/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Terminal className="w-4 h-4 shrink-0 text-purple-400" />
              <span>Developer APIs</span>
            </button>

          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-slate-800">
          <button 
            onClick={onLogout}
            className="w-full text-left text-xs font-bold text-slate-500 hover:text-red-400 transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-900 cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-purple-400" />
            <span>Sign out Securely</span>
          </button>
        </div>
      </aside>

      {/* 2. MOBILE HEADER BAR */}
      <header className="md:hidden bg-slate-950 text-white px-4 py-3.5 flex items-center justify-between shrink-0 relative z-40 border-b border-slate-900">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-purple-900 rounded-lg flex items-center justify-center text-white">
            <Key className="w-4 h-4 text-purple-300" />
          </div>
          <div>
            <span className="font-extrabold text-xs tracking-tight text-white block leading-none">ECOCLEAN</span>
            <span className="text-[8px] text-purple-400 font-mono tracking-wider uppercase leading-none block mt-1">Super Secretariat</span>
          </div>
        </div>

        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
        >
          {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
        </button>
      </header>

      {/* 3. MOBILE MENU SLIDE OVER */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-950 z-35 flex flex-col justify-between p-6 pt-20 animate-fade-in text-slate-300">
          <nav className="space-y-1.5 overflow-y-auto max-h-[70vh]">
            <button
              onClick={() => handleTabChange('overview')}
              className={`w-full text-left text-xs font-bold px-3 py-2.5 rounded-xl flex items-center gap-2 transition-all ${
                activeTab === 'overview' ? 'bg-purple-900 text-white' : 'text-slate-400'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Global Sovereign Map</span>
            </button>
            <button
              onClick={() => handleTabChange('audit')}
              className={`w-full text-left text-xs font-bold px-3 py-2.5 rounded-xl flex items-center gap-2 transition-all ${
                activeTab === 'audit' ? 'bg-purple-900 text-white' : 'text-slate-400'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Ledger Security Audit</span>
            </button>
            <button
              onClick={() => handleTabChange('diagnostics')}
              className={`w-full text-left text-xs font-bold px-3 py-2.5 rounded-xl flex items-center gap-2 transition-all ${
                activeTab === 'diagnostics' ? 'bg-purple-900 text-white' : 'text-slate-400'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Server Diagnostics</span>
            </button>
            <button
              onClick={() => handleTabChange('settings')}
              className={`w-full text-left text-xs font-bold px-3 py-2.5 rounded-xl flex items-center gap-2 transition-all ${
                activeTab === 'settings' ? 'bg-purple-900 text-white' : 'text-slate-400'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Global Settings</span>
            </button>
          </nav>
          <div className="pt-6 border-t border-slate-800">
            <button 
              onClick={onLogout}
              className="w-full text-center text-xs font-bold bg-purple-900 text-white py-3 rounded-xl hover:bg-purple-800"
            >
              Sign Out Securely
            </button>
          </div>
        </div>
      )}

      {/* 4. MAIN WORKSPACE CONTENT */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full space-y-6">
        
        {/* Banner with absolute priority credentials */}
        <div className="bg-gradient-to-r from-slate-900 to-purple-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden border border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(139,92,246,0.15)_0%,transparent_50%)]" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                Cryptographic Secretariat Command Node
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Sovereign Super Administrator Deck</h1>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                Aggregating West African municipal networks, auditing administrative changes, overriding system configurations, and monitoring blockchain-level compliance keys.
              </p>
            </div>
            
            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex items-center gap-4.5 font-mono text-[11px] text-slate-400 shadow-inner">
              <div className="space-y-1">
                <span className="text-slate-500 block text-[9px] uppercase font-bold">Ledger Security status</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span>DECENTRALIZED-SYNC</span>
                </span>
              </div>
              <div className="h-8 w-[1px] bg-slate-800" />
              <div className="space-y-1">
                <span className="text-slate-500 block text-[9px] uppercase font-bold">MFA enforcement</span>
                <span className={systemProperties.enforceMfaForAdmins ? 'text-emerald-400 font-bold' : 'text-amber-500 font-bold'}>
                  {systemProperties.enforceMfaForAdmins ? 'STRICT-ACTIVE' : 'DEGRADED'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* National Statistics grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Total Federated Nations</p>
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-black text-slate-900 font-mono">6</p>
                  <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full font-mono">WEST-AFRICA</span>
                </div>
                <p className="text-[11px] text-gray-500">SL, LR, GH, NG, GN, GM synced</p>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Active Citizens Registered</p>
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-black text-slate-900 font-mono">203,140</p>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-mono">+12.4%</span>
                </div>
                <p className="text-[11px] text-gray-500">Public environmental advocates</p>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Staff & Municipal Crews</p>
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-black text-slate-900 font-mono">4,115</p>
                  <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full font-mono">ACTIVE</span>
                </div>
                <p className="text-[11px] text-gray-500">Dispatched across 24 zones</p>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Total Waste Collected</p>
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-black text-slate-900 font-mono">5,130T</p>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-mono">DAILY</span>
                </div>
                <p className="text-[11px] text-gray-500">Avg 89.2% SLA clearance compliance</p>
              </div>
            </div>

            {/* Federation Countries List */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Sovereign National Jurisdictions</h2>
                <p className="text-xs text-gray-400">Platform telemetry for the ECOCLEAN Secretariat environmental compliance ledger.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COUNTRIES.map(c => (
                  <div key={c.code} className="border border-gray-100 rounded-xl p-4.5 hover:border-purple-200 transition-all space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{c.flag}</span>
                        <div>
                          <span className="font-extrabold text-slate-900 block">{c.name}</span>
                          <span className="text-[10px] font-mono text-gray-400 block">{c.agencyName}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-slate-50 border border-gray-100 text-slate-600 px-2 py-0.5 rounded">
                        {c.code}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <span className="text-[9px] text-gray-400 uppercase font-mono block">Reports</span>
                        <span className="font-bold text-slate-950 block">{c.stats.totalReports}</span>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <span className="text-[9px] text-gray-400 uppercase font-mono block">SLA Compliance</span>
                        <span className="font-bold text-slate-950 block">{c.stats.slaCompliance}%</span>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <span className="text-[9px] text-gray-400 uppercase font-mono block">Mitigation</span>
                        <span className="font-bold text-emerald-600 block">{c.stats.carbonMitigation}T</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LEDGER SECURITY AUDIT */}
        {activeTab === 'audit' && (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Decentralized Cryptographic Audit Logs</h2>
                <p className="text-xs text-gray-400">Immutably signed security and database action logs synced across all Secretariat nodes.</p>
              </div>
              <button
                onClick={() => {
                  alert('Generating security report export token...');
                }}
                className="text-xs font-bold px-3.5 py-2 rounded-xl border border-gray-200 text-slate-600 hover:bg-gray-50 cursor-pointer"
              >
                Export Audit Logs
              </button>
            </div>

            <div className="overflow-x-auto border border-gray-100 rounded-xl">
              <table className="w-full text-left border-collapse font-sans text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-100 font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <th className="p-3 pl-5">Timestamp</th>
                    <th className="p-3">Actor Identity</th>
                    <th className="p-3">Sovereign Action</th>
                    <th className="p-3">Log Module</th>
                    <th className="p-3">IP Clearance</th>
                    <th className="p-3 pr-5 text-right">Verification Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-mono text-[11px] text-slate-600">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50">
                      <td className="p-3 pl-5 font-semibold">{log.timestamp}</td>
                      <td className="p-3">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-900 block">{log.userEmail}</span>
                          <span className="text-[9px] text-purple-600 font-bold block">{log.userRole}</span>
                        </div>
                      </td>
                      <td className="p-3 font-semibold text-slate-800">{log.action}</td>
                      <td className="p-3">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] font-bold">{log.module}</span>
                      </td>
                      <td className="p-3 font-semibold">{log.ipAddress}</td>
                      <td className="p-3 pr-5 text-right">
                        <span className={`inline-flex items-center gap-1.5 font-bold ${
                          log.status === 'Success' ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            log.status === 'Success' ? 'bg-emerald-500' : 'bg-red-500'
                          }`} />
                          <span>{log.status === 'Success' ? 'IMMUTABLE' : 'FAILED'}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DIAGNOSTICS TAB */}
        {activeTab === 'diagnostics' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-slate-900 text-slate-200 rounded-2xl p-6 border border-slate-950 font-mono space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-purple-400" />
                  <span className="text-sm font-bold text-white uppercase tracking-wider">Secretariat Decryption Console</span>
                </div>
                <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800/60 px-2.5 py-0.5 rounded font-bold">
                  SECURE-SHELL-V2
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <p className="text-slate-500">// Bootstrapping sovereign consensus nodes...</p>
                <p className="text-emerald-400">✓ Node Freetown-SL: ONLINE [Hash: 8b6f7a... compliance ledger verified]</p>
                <p className="text-emerald-400">✓ Node Monrovia-LR: ONLINE [Hash: 3c9d1a... telemetry active]</p>
                <p className="text-emerald-400">✓ Node Accra-GH: ONLINE [Hash: a5f2b3... synced 100%]</p>
                <p className="text-emerald-400">✓ Node Lagos-NG: ONLINE [Hash: f4e8d2... workload normal]</p>
                <p className="text-emerald-400">✓ Node Conakry-GN: ONLINE [Hash: 2b9c5f... processing queue cleared]</p>
                <p className="text-emerald-400">✓ Node Banjul-GM: ONLINE [Hash: d7e6a1... standby status active]</p>
                <p className="text-slate-500">// Cryptographic identity logs validated.</p>
                <p className="text-purple-300">&gt; ecoclean --validate-rbac-rule-integrity</p>
                <p className="text-slate-300">RBAC configuration contains exactly 5 authoritative security tiers.</p>
                <p className="text-slate-300">Validation success: All route barriers and clearance hashes align perfectly.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest font-mono">Server Resource Telemetry</h3>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-gray-600">
                      <span>Global API Gateway Latency</span>
                      <span className="font-mono text-emerald-600">14ms [Optimum]</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '15%' }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-gray-600">
                      <span>Sovereign Ledger CPU Allocations</span>
                      <span className="font-mono text-purple-600">34.2%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-600 h-full rounded-full" style={{ width: '34%' }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-gray-600">
                      <span>Synchronized Databases Memory Limit</span>
                      <span className="font-mono text-purple-600">1.4 GB / 8.0 GB</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: '18%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest font-mono mb-3">Cryptographic Key Signatures</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Sovereign root security keys are refreshed every 24 hours. The Super Secretariat can manually trigger a ledger rekey in emergency conditions.
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100/60 font-mono text-[10px] text-purple-950 space-y-1">
                  <p>ROOT-KEY-SHA256: 0x9f1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o</p>
                  <p>EXPIRY: 2026-07-17 05:30:35 UTC [Synced]</p>
                </div>
                <button
                  onClick={() => {
                    alert('Ledger rekey sequence initiated. Regenerating all sovereign session barriers...');
                  }}
                  className="w-full text-xs font-bold py-3 bg-slate-950 hover:bg-purple-900 text-white rounded-xl transition-colors cursor-pointer"
                >
                  Manually Rotate Encryption Keys
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Global Secretariat Properties</h2>
              <p className="text-xs text-gray-400">Configure core parameters that govern security rules and SLA timers across all jurisdictions.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-5">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 block">Enforce Admin Multi-Factor (MFA)</span>
                    <span className="text-[10px] text-gray-400 block">Mandate structural token validation for all level 4 admins</span>
                  </div>
                  <button
                    onClick={handleToggleMfa}
                    className={`w-12 h-6.5 rounded-full p-1 transition-all ${
                      systemProperties.enforceMfaForAdmins ? 'bg-purple-600 text-right' : 'bg-gray-300 text-left'
                    }`}
                  >
                    <span className="inline-block w-4.5 h-4.5 bg-white rounded-full shadow-sm" />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 block">Sovereign Logging Level</span>
                    <span className="text-[10px] text-gray-400 block">Current level: {systemProperties.logLevel}</span>
                  </div>
                  <button
                    onClick={handleCycleLogLevel}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 cursor-pointer"
                  >
                    Cycle Log Level
                  </button>
                </div>
              </div>

              <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-gray-100">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest font-mono">SLA Timeline Configuration (Hours)</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase font-mono block">High Priority</label>
                    <input
                      type="number"
                      value={systemProperties.defaultSlaHighHours}
                      onChange={(e) => setSystemProperties({ ...systemProperties, defaultSlaHighHours: parseInt(e.target.value) || 18 })}
                      className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-center font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase font-mono block">Medium</label>
                    <input
                      type="number"
                      value={systemProperties.defaultSlaMediumHours}
                      onChange={(e) => setSystemProperties({ ...systemProperties, defaultSlaMediumHours: parseInt(e.target.value) || 36 })}
                      className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-center font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase font-mono block">Low Priority</label>
                    <input
                      type="number"
                      value={systemProperties.defaultSlaLowHours}
                      onChange={(e) => setSystemProperties({ ...systemProperties, defaultSlaLowHours: parseInt(e.target.value) || 72 })}
                      className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-center font-bold"
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    alert('Global SLA parameters synchronized successfully.');
                  }}
                  className="w-full text-xs font-bold py-2.5 bg-purple-900 hover:bg-purple-800 text-white rounded-xl transition-all"
                >
                  Save Timers
                </button>
              </div>
            </div>
          </div>
        )}

        {/* NOC TAB */}
        {activeTab === 'noc' && (
          <div className="animate-fade-in space-y-6">
            <NationalOperationsCenterView />
          </div>
        )}

        {/* FLEET TAB */}
        {activeTab === 'fleet' && (
          <div className="animate-fade-in space-y-6">
            <FleetManagementView />
          </div>
        )}

        {/* SMART BINS TAB */}
        {activeTab === 'smart-bins' && (
          <div className="animate-fade-in space-y-6">
            <SmartBinView />
          </div>
        )}

        {/* DISASTER TAB */}
        {activeTab === 'disaster' && (
          <div className="animate-fade-in space-y-6">
            <DisasterResponseView />
          </div>
        )}

        {/* VOLUNTEERS TAB */}
        {activeTab === 'volunteers' && (
          <div className="animate-fade-in space-y-6">
            <CommunityEngagementView />
          </div>
        )}

        {/* ASSETS TAB */}
        {activeTab === 'assets' && (
          <div className="animate-fade-in space-y-6">
            <AssetManagementView />
          </div>
        )}

        {/* CONTRACTORS TAB */}
        {activeTab === 'contractors' && (
          <div className="animate-fade-in space-y-6">
            <ContractorManagementView />
          </div>
        )}

        {/* DOCS TAB */}
        {activeTab === 'docs' && (
          <div className="animate-fade-in space-y-6">
            <KnowledgeHubView />
          </div>
        )}

        {/* APIS TAB */}
        {activeTab === 'apis' && (
          <div className="animate-fade-in space-y-6">
            <PublicApiView />
          </div>
        )}
        {activeTab === 'service-center' && <ServiceCenter user={user} />}
        {activeTab === 'profile' && <AdminProfile user={user} />}

      </main>

    </div>
  );
}
