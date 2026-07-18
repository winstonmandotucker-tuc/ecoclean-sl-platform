import { 
  Users, 
  Truck, 
  ShieldCheck, 
  Sliders, 
  ArrowRight, 
  LogOut, 
  Sparkles,
  User,
  Layers,
  ChevronRight,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import { User as UserType, ViewState } from '../types';

interface PortalSelectionProps {
  user: UserType | null;
  onSelectPortal: (portal: 'citizen' | 'staff' | 'supervisor' | 'admin') => void;
  onLogout: () => void;
}

export default function PortalSelection({ user, onSelectPortal, onLogout }: PortalSelectionProps) {
  
  const portals = [
    {
      id: 'citizen' as const,
      title: 'Citizen Portal',
      description: 'Report immediate waste issues, drop pins on GIS maps, track crew dispatches, earn civic rewards, and help keep our community clean.',
      badge: 'Civic Engagement',
      actionText: 'Continue as Citizen',
      route: '/citizen/dashboard',
      icon: Users,
      color: 'border-emerald-200 bg-emerald-50/40 text-emerald-950',
      tagline: 'Earn Rewards & Report Waste'
    },
    {
      id: 'staff' as const,
      title: 'Staff Portal',
      description: 'Review collection checklists, accept task assignments, access GPS-optimized routing schedules, and verify incident completions with photo-logs.',
      badge: 'Field Operations',
      actionText: 'Continue as Staff',
      route: '/staff/dashboard',
      icon: Truck,
      color: 'border-green-200 bg-green-50/40 text-green-950',
      tagline: 'GPS Dispatches & Route Checklists'
    },
    {
      id: 'supervisor' as const,
      title: 'Supervisor Portal',
      description: 'Direct field operators, manage zone allocations, verify critical incidents, oversee crews, and monitor dispatch efficiency maps.',
      badge: 'Operational Oversight',
      actionText: 'Continue as Supervisor',
      route: '/supervisor/dashboard',
      icon: ShieldCheck,
      color: 'border-teal-200 bg-teal-50/40 text-teal-950',
      tagline: 'Crew Dispatches & Verifications'
    },
    {
      id: 'admin' as const,
      title: 'Administrator Portal',
      description: 'Manage users, authorize council zones, analyze long-term sustainability metrics, coordinate policy reports, and oversee platform security.',
      badge: 'Platform Governance',
      actionText: 'Continue as Administrator',
      route: '/admin/dashboard',
      icon: Sliders,
      color: 'border-emerald-300 bg-emerald-100/30 text-emerald-950',
      tagline: 'Full Secretariat Controls & Audits'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F2F6F3] to-[#E9EFEA] flex flex-col font-sans selection:bg-brand-accent selection:text-brand-primary py-12 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Decorative background gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-green-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="max-w-6xl mx-auto w-full flex justify-between items-center mb-12 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white">
            <Layers className="w-4.5 h-4.5 text-brand-accent" />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-brand-primary">ECOCLEAN SL</span>
        </div>
        
        <button 
          onClick={onLogout}
          className="text-xs font-semibold text-gray-500 hover:text-brand-error transition-colors flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-gray-100 shadow-sm"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Workspace</span>
        </button>
      </div>

      {/* Main picker stage */}
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col justify-center relative z-10">
        
        {/* Welcome banner */}
        <div className="text-center mb-12 max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-brand-primary/10 border border-brand-primary/15 px-3 py-1 rounded-full text-brand-primary text-xs font-mono font-bold uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Authorized Security Access</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Welcome back, <span className="text-brand-primary">{user?.fullName}</span>
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Select your destination workspace to authorize your secure digital session. Developers and reviewers are fully authorized to inspect and toggle all four portal interfaces.
          </p>
        </div>

        {/* Portal selection cards layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {portals.map((portal) => {
            const PortalIcon = portal.icon;
            const isRecommended = user?.role === portal.id;

            return (
              <div 
                key={portal.id}
                className={`relative bg-white rounded-3xl border p-6 lg:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-brand-primary/30 group ${
                  isRecommended 
                    ? 'ring-2 ring-brand-primary/40 border-brand-primary bg-emerald-50/10' 
                    : 'border-gray-200/80 shadow-sm'
                }`}
              >
                {/* Recommended Indicator badge */}
                {isRecommended && (
                  <span className="absolute -top-3 right-6 bg-brand-primary text-brand-accent text-[9px] font-bold font-mono px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>Your Primary Role</span>
                  </span>
                )}

                {/* Card Top */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${portal.color}`}>
                      <PortalIcon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold tracking-wider text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-0.5 rounded uppercase">
                      {portal.badge}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-brand-primary transition-colors flex items-center gap-1.5">
                      <span>{portal.title}</span>
                    </h2>
                    <p className="text-[11px] text-brand-primary font-semibold font-mono tracking-wide mt-0.5">
                      {portal.tagline}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mt-3">
                      {portal.description}
                    </p>
                  </div>
                </div>

                {/* Card CTA */}
                <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-400 font-mono">Route: {portal.route}</span>
                  <button
                    onClick={() => onSelectPortal(portal.id)}
                    className={`text-xs font-bold px-4.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-95 ${
                      isRecommended 
                        ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/10 hover:bg-brand-secondary' 
                        : 'bg-gray-100 hover:bg-brand-accent/20 text-gray-700 hover:text-brand-primary'
                    }`}
                  >
                    <span>{portal.actionText}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Informational tip at footer of selection */}
        <div className="bg-white border border-gray-200/80 p-4.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-50 text-brand-warning border border-amber-100 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">Sprint 1 Validation Note</p>
              <p className="text-[11px] text-gray-400">All database models, forms, and workflows are simulated to test the onboarding and authentication security layers.</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="text-xs font-bold text-brand-primary hover:text-brand-secondary transition-colors inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Landing Page</span>
          </button>
        </div>

      </div>

    </div>
  );
}
