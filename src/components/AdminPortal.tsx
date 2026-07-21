import React, { useState, useEffect } from 'react';
import { operationalStore } from '../lib/operationalStore';
import ServiceCenter from './service/ServiceCenter';
import { 
  Layers, Map, Users, Sliders, Settings, ShieldCheck, 
  Activity, Bell, BarChart2, Radio, Database, Download, Cpu,
  Menu, X, ArrowLeft, LogOut, ChevronDown, User, ShieldAlert,
  Truck, Trash2, HelpCircle, Terminal, Briefcase, Building
} from 'lucide-react';
import { User as UserType } from '../types';
import AuthenticatedAvatar from './AuthenticatedAvatar';

// Import Admin child components
import AdminDashboard from './admin/AdminDashboard';
import GISCommandCenter from './admin/GISCommandCenter';
import UserManagement from './admin/UserManagement';
import MunicipalityManagement from './admin/MunicipalityManagement';
import ReportManagementCenter from './admin/ReportManagementCenter';
import NationalAnalytics from './admin/NationalAnalytics';
import EnvironmentalIntelligence from './admin/EnvironmentalIntelligence';
import AuditSecurity from './admin/AuditSecurity';
import SystemConfiguration from './admin/SystemConfiguration';
import RolePermissionManagement from './admin/RolePermissionManagement';
import DataExportSimulation from './admin/DataExportSimulation';
import NationalNotificationCenter from './admin/NationalNotificationCenter';
import SystemHealth from './admin/SystemHealth';
import AdminProfile from './admin/AdminProfile';

// Import Admin Data helpers
import { 
  COUNTRIES, DEFAULT_ADMIN_USERS, DEFAULT_AUDIT_LOGS, DEFAULT_RBAC_RULES, 
  DEFAULT_SYSTEM_CONFIG, CountryConfig, AdminUser, AuditLog, RBACRole, getCountryReports 
} from '../lib/adminData';
import { Report } from '../lib/citizenData';
import { adminUserService, reportService } from '../lib/services';

import {
  FleetManagementView,
  SmartBinView,
  DisasterResponseView,
  AssetManagementView,
  ContractorManagementView,
  KnowledgeHubView,
  PublicApiView,
  NationalOperationsCenterView
} from './modules/EnterpriseModules';

interface AdminPortalProps {
  user: UserType | null;
  onBackToSelection?: () => void;
  onLogout: () => void;
}

type AdminTab = 
  | 'dashboard'
  | 'map'
  | 'users'
  | 'municipalities'
  | 'reports'
  | 'analytics'
  | 'environment'
  | 'security'
  | 'settings'
  | 'rbac'
  | 'exports'
  | 'notifications'
  | 'system-health'
  | 'profile'
  | 'noc'
  | 'fleet'
  | 'smart-bins'
  | 'disaster'
  | 'assets'
  | 'contractors'
  | 'docs'
  | 'apis'
  | 'service-center';

export default function AdminPortal({ user, onBackToSelection, onLogout }: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const selectedCountryCode = 'SL';

  // Core Persistent States
  const [countriesList, setCountriesList] = useState<CountryConfig[]>([]);
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [rbacRules, setRbacRules] = useState<RBACRole[]>([]);
  const [systemConfig, setSystemConfig] = useState<typeof DEFAULT_SYSTEM_CONFIG | null>(null);

  // 1. Initial State Seeding & Loading
  useEffect(() => {
    try {
      // Load or seed countries
      const storedCountries = operationalStore.getItem('ecoclean_countries');
      if (storedCountries) {
        setCountriesList((JSON.parse(storedCountries) as CountryConfig[]).filter(country=>country.code==='SL'));
      } else {
        setCountriesList(COUNTRIES.filter(country=>country.code==='SL'));
        operationalStore.setItem('ecoclean_countries', JSON.stringify(COUNTRIES.filter(country=>country.code==='SL')));
      }

      // Load or seed core reports
      const storedReports = operationalStore.getItem('ecoclean_reports');
      let loadedReports: Report[] = [];
      if (storedReports) {
        loadedReports = JSON.parse(storedReports);
      } else {
        // Collect all default reports for all countries to start with a rich combined list
        loadedReports = getCountryReports('SL');
        operationalStore.setItem('ecoclean_reports', JSON.stringify(loadedReports));
      }
      setAllReports(loadedReports);

      // Load or seed users list
      const storedUsers = operationalStore.getItem('ecoclean_admin_users');
      if (storedUsers) {
        setAdminUsers((JSON.parse(storedUsers) as AdminUser[]).filter(account=>account.countryCode==='SL'));
      } else {
        setAdminUsers(DEFAULT_ADMIN_USERS.filter(account=>account.countryCode==='SL'));
        operationalStore.setItem('ecoclean_admin_users', JSON.stringify(DEFAULT_ADMIN_USERS.filter(account=>account.countryCode==='SL')));
      }

      // Load or seed audit logs
      const storedLogs = operationalStore.getItem('ecoclean_audit_logs');
      if (storedLogs) {
        setAuditLogs(JSON.parse(storedLogs));
      } else {
        setAuditLogs(DEFAULT_AUDIT_LOGS);
        operationalStore.setItem('ecoclean_audit_logs', JSON.stringify(DEFAULT_AUDIT_LOGS));
      }

      // Load or seed rbac rules
      const storedRbac = operationalStore.getItem('ecoclean_rbac_rules');
      if (storedRbac) {
        setRbacRules(JSON.parse(storedRbac));
      } else {
        setRbacRules(DEFAULT_RBAC_RULES);
        operationalStore.setItem('ecoclean_rbac_rules', JSON.stringify(DEFAULT_RBAC_RULES));
      }

      // Load or seed system configuration
      const storedConfig = operationalStore.getItem('ecoclean_system_config');
      if (storedConfig) {
        setSystemConfig(JSON.parse(storedConfig));
      } else {
        setSystemConfig(DEFAULT_SYSTEM_CONFIG);
        operationalStore.setItem('ecoclean_system_config', JSON.stringify(DEFAULT_SYSTEM_CONFIG));
      }
    } catch (e) {
      console.error('Error seeding admin portal resources:', e);
    }
  }, []);

  useEffect(()=>{void Promise.all([adminUserService.list(),reportService.list()]).then(([userResult,reportResult])=>{
    setAdminUsers(userResult.data.filter((row:any)=>row.role!=='NATIONAL_ADMIN').map((row:any)=>({id:String(row.id),fullName:row.full_name,email:row.email,phone:row.phone||undefined,role:row.role==='ADMINISTRATOR'?'admin':String(row.role).toLowerCase(),countryCode:'SL',municipality:'',status:row.status==='active'?'Active':row.status==='pending'?'Pending':'Suspended',lastActive:'Database account'})) as AdminUser[]);
    setAllReports(reportResult.data.map((row:any)=>({id:String(row.id),referenceNumber:row.reference,title:row.title,category:row.category,description:row.description,location:row.address||'GIS location recorded',district:row.district||'Unassigned',municipality:row.municipality||'Unassigned',ward:row.ward||'Unassigned',zone:row.zone||'Unassigned',priority:String(row.priority||'medium').replace(/^./,(value:string)=>value.toUpperCase()),status:String(row.status||'pending').split('_').map((part:string)=>part[0].toUpperCase()+part.slice(1)).join(' '),date:String(row.created_at||'').slice(0,10),photos:[],gps:{lat:Number(row.latitude||8.4844),lng:Number(row.longitude||-13.2344)}})) as Report[]);
  }).catch(error=>console.error('Admin operational data could not be loaded.',error));},[]);

  // Save updates helper functions
  const saveReportsState = (newReports: Report[]) => {
    setAllReports(newReports);
    operationalStore.setItem('ecoclean_reports', JSON.stringify(newReports));
  };

  const saveAdminUsersState = (newUsers: AdminUser[]) => {
    setAdminUsers(newUsers);
    operationalStore.setItem('ecoclean_admin_users', JSON.stringify(newUsers));
  };

  const saveAuditLogsState = (newLogs: AuditLog[]) => {
    setAuditLogs(newLogs);
    operationalStore.setItem('ecoclean_audit_logs', JSON.stringify(newLogs));
  };

  const saveRbacRulesState = (newRbac: RBACRole[]) => {
    setRbacRules(newRbac);
    operationalStore.setItem('ecoclean_rbac_rules', JSON.stringify(newRbac));
  };

  const saveSystemConfigState = (newConfig: typeof DEFAULT_SYSTEM_CONFIG) => {
    setSystemConfig(newConfig);
    operationalStore.setItem('ecoclean_system_config', JSON.stringify(newConfig));
  };

  // Callback to update specific country stats (e.g. daily waste collected, carbon)
  const handleUpdateCountryStats = (countryCode: string, fields: Partial<CountryConfig['stats']>) => {
    const updatedCountries = countriesList.map(c => {
      if (c.code === countryCode) {
        return {
          ...c,
          stats: {
            ...c.stats,
            ...fields
          }
        };
      }
      return c;
    });
    setCountriesList(updatedCountries);
    operationalStore.setItem('ecoclean_countries', JSON.stringify(updatedCountries));
  };

  // Safe navigation tab switcher
  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get active country configuration object
  const activeCountry = countriesList.find(c => c.code === selectedCountryCode) || COUNTRIES[0];

  // Filter report lists that relate to selected country context
  // This release operates only within Sierra Leone. Foreign demo records are never exposed.
  const countryReports = allReports.filter(r =>
    !/^R-(LR|GH|NG|GN|GM)-/.test(r.id) &&
    !/(Monrovia|Paynesville|Accra|Kumasi|LAWMA|Ikeja|Abuja|Conakry|Kaloum|Ratoma|Banjul|Kanifing)/i.test(r.municipality)
  );

  // Nav Links for the sidebar, grouped logically
  const navLinks = [
    { id: 'dashboard' as const, label: 'Command Overview', icon: Layers },
    { id: 'map' as const, label: 'GIS Command Center', icon: Map },
    { id: 'reports' as const, label: 'Reports & Assignment', icon: ShieldCheck, badgeCount: countryReports.filter(r => r.status === 'Pending').length },
    { id: 'users' as const, label: 'Users', icon: Users },
    { id: 'municipalities' as const, label: 'Districts & Municipalities', icon: Sliders },
    { id: 'service-center' as const, label: 'Communications', icon: HelpCircle },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'exports' as const, label: 'Exports', icon: Download },
    { id: 'security' as const, label: 'Audit Logs', icon: ShieldAlert },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
    { id: 'system-health' as const, label: 'System Health', icon: Cpu },
    { id: 'profile' as const, label: 'My Profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex flex-col md:flex-row font-sans selection:bg-brand-accent selection:text-brand-primary">
      
      {/* 1. PERSISTENT SIDEBAR ON DESKTOP */}
      <aside className="hidden md:flex md:w-64 bg-slate-900 text-slate-300 p-6 flex-col justify-between shrink-0 h-screen sticky top-0 border-r border-slate-950 z-30">
        <div className="space-y-6 overflow-y-auto pr-1">
          
          {/* Brand header */}
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white">
              <Layers className="w-4.5 h-4.5 text-brand-accent" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-white block leading-none">ECOCLEAN</span>
              <span className="text-[9px] text-brand-accent font-mono tracking-widest uppercase font-bold block mt-1">Secretariat</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl flex items-center gap-3"><AuthenticatedAvatar user={user} className="w-9 h-9" textClassName="text-xs"/><div className="min-w-0"><span className="text-xs font-bold text-white block truncate">{user?.fullName}</span><span className="text-[8px] text-brand-accent font-mono uppercase font-bold block mt-1">{user?.roleLabel||'Administrator'}{user?.municipality?` • ${user.municipality}`:''}</span></div></div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2"><span className="text-[10px] font-bold text-brand-accent uppercase tracking-wider font-mono">🇸🇱 Sierra Leone Operations</span></div>

          {/* Sidebar Menu Navigation */}
          <nav className="space-y-1 pt-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block px-1 mb-2 font-mono">Consensus Nodes</span>
            {navLinks.map((link) => {
              const LinkIcon = link.icon;
              const isSelected = activeTab === link.id;

              return (
                <button
                  key={link.id}
                  onClick={() => handleTabChange(link.id)}
                  className={`w-full text-left text-xs font-bold px-3 py-2 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <LinkIcon className="w-4 h-4 shrink-0 text-brand-accent" />
                    <span>{link.label}</span>
                  </span>
                  {link.badgeCount !== undefined && link.badgeCount > 0 && (
                    <span className={`text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-white text-brand-primary' : 'bg-brand-accent text-brand-primary'
                    }`}>
                      {link.badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-slate-800 space-y-2">
          {onBackToSelection && (
            <button 
              onClick={onBackToSelection}
              className="w-full text-left text-xs font-bold text-brand-accent hover:text-white transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Workspace Picker</span>
            </button>
          )}
          <button 
            onClick={onLogout}
            className="w-full text-left text-xs font-bold text-slate-500 hover:text-brand-error transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800/40 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* 2. MOBILE HEADER BAR */}
      <header className="md:hidden bg-slate-900 text-white px-4 py-3.5 flex items-center justify-between shrink-0 relative z-40 border-b border-slate-950">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-brand-primary rounded-lg flex items-center justify-center text-white">
            <Layers className="w-4 h-4 text-brand-accent" />
          </div>
          <div>
            <span className="font-extrabold text-xs tracking-tight text-white block leading-none">ECOCLEAN</span>
            <span className="text-[8px] text-brand-accent font-mono tracking-wider uppercase leading-none block mt-1">Secretariat</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs font-bold">🇸🇱</span>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-950 border border-slate-800"
          >
            {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
          </button>
        </div>
      </header>

      {/* 3. MOBILE MENU SLIDE OVER */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-900 z-35 flex flex-col justify-between p-6 pt-20 animate-fade-in text-slate-300">
          <nav className="space-y-1.5 overflow-y-auto max-h-[70vh]">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block px-1 mb-2 font-mono">Consensus Nodes</span>
            {navLinks.map((link) => {
              const LinkIcon = link.icon;
              const isSelected = activeTab === link.id;

              return (
                <button
                  key={link.id}
                  onClick={() => handleTabChange(link.id)}
                  className={`w-full text-left text-xs font-bold px-3 py-2.5 rounded-xl flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-brand-primary text-white shadow-md'
                      : 'text-slate-400 hover:bg-slate-800/40'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <LinkIcon className="w-4 h-4 text-brand-accent" />
                    <span>{link.label}</span>
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-slate-800 space-y-2">
            <button 
              onClick={onBackToSelection}
              className="w-full text-left text-xs font-bold text-brand-accent flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Workspace Picker</span>
            </button>
            <button 
              onClick={onLogout}
              className="w-full text-left text-xs font-bold text-slate-500 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800/40"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. MAIN CENTRAL CONTENT WORKSPACE */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full overflow-y-auto">
        {activeTab === 'dashboard' && (
          <AdminDashboard 
            user={user}
            country={activeCountry} 
            reports={countryReports}
            users={adminUsers}
            auditLogs={auditLogs}
            onNavigateTab={handleTabChange}
          />
        )}

        {activeTab === 'map' && (
          <GISCommandCenter country={activeCountry} />
        )}

        {activeTab === 'users' && (
          <UserManagement 
            users={adminUsers} 
            onSaveUsers={saveAdminUsersState} 
            selectedCountryCode={selectedCountryCode}
          />
        )}

        {activeTab === 'municipalities' && (
          <MunicipalityManagement 
            country={activeCountry} 
            onUpdateCountryStats={handleUpdateCountryStats}
          />
        )}

        {activeTab === 'reports' && (
          <ReportManagementCenter 
            country={activeCountry}
            reports={countryReports}
            onSaveReports={saveReportsState}
          />
        )}

        {activeTab === 'analytics' && (
          <NationalAnalytics country={activeCountry} />
        )}

        {activeTab === 'environment' && (
          <EnvironmentalIntelligence country={activeCountry} />
        )}

        {activeTab === 'security' && (
          <AuditSecurity country={activeCountry} auditLogs={auditLogs} />
        )}

        {activeTab === 'settings' && (
          <SystemConfiguration onSaveConfig={saveSystemConfigState} />
        )}

        {activeTab === 'rbac' && (
          <RolePermissionManagement 
            rbacRules={rbacRules} 
            onSaveRBACRules={saveRbacRulesState}
          />
        )}

        {activeTab === 'exports' && (
          <DataExportSimulation country={activeCountry} />
        )}

        {activeTab === 'notifications' && systemConfig && (
          <NationalNotificationCenter 
            country={activeCountry}
            systemConfig={systemConfig}
            onSaveConfig={saveSystemConfigState}
          />
        )}

        {activeTab === 'system-health' && (
          <SystemHealth country={activeCountry} />
        )}

        {activeTab === 'profile' && (
          <AdminProfile user={user} />
        )}

        {activeTab === 'noc' && (
          <NationalOperationsCenterView />
        )}

        {activeTab === 'fleet' && (
          <FleetManagementView />
        )}

        {activeTab === 'smart-bins' && (
          <SmartBinView />
        )}

        {activeTab === 'disaster' && (
          <DisasterResponseView />
        )}

        {activeTab === 'assets' && (
          <AssetManagementView />
        )}

        {activeTab === 'contractors' && (
          <ContractorManagementView />
        )}

        {activeTab === 'docs' && (
          <KnowledgeHubView />
        )}

        {activeTab === 'apis' && (
          <PublicApiView />
        )}
        {activeTab === 'service-center' && <ServiceCenter user={user} />}
      </main>

    </div>
  );
}
