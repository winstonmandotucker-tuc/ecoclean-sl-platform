import React, { useState } from 'react';
import { ShieldAlert, User, ShieldCheck, Key, Lock, Edit2 } from 'lucide-react';
import { RBACRole, DEFAULT_RBAC_RULES } from '../../lib/adminData';

interface RolePermissionManagementProps {
  rbacRules: RBACRole[];
  onSaveRBACRules: (newRules: RBACRole[]) => void;
}

export default function RolePermissionManagement({ rbacRules, onSaveRBACRules }: RolePermissionManagementProps) {
  const [activeRoleIndex, setActiveRoleIndex] = useState<number>(3); // Default to admin for viewing
  const [editingRules, setEditingRules] = useState<RBACRole[]>(rbacRules);
  const [successMsg, setSuccessMsg] = useState(false);

  const selectedRule = editingRules[activeRoleIndex] || editingRules[3];

  const handleToggleAudit = () => {
    const updated = [...editingRules];
    updated[activeRoleIndex] = {
      ...selectedRule,
      permissions: {
        ...selectedRule.permissions,
        audit: !selectedRule.permissions.audit
      }
    };
    setEditingRules(updated);
    onSaveRBACRules(updated);
    triggerSuccess();
  };

  const handleSelectChange = (field: keyof RBACRole['permissions'], value: string) => {
    const updated = [...editingRules];
    updated[activeRoleIndex] = {
      ...selectedRule,
      permissions: {
        ...selectedRule.permissions,
        [field]: value
      }
    };
    setEditingRules(updated);
    onSaveRBACRules(updated);
    triggerSuccess();
  };

  const triggerSuccess = () => {
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 2000);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">Role-Based Access (RBAC) Controls</h2>
        <p className="text-xs text-gray-400 mt-1">
          Regulate fine-grained database read/write permissions for mobile citizens, sanitarians, municipal supervisors, and secretariat administrators.
        </p>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 p-3.5 rounded-xl flex items-center gap-2 text-xs font-semibold animate-fade-in">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <span>RBAC permission matrices synchronized and re-enforced in security middleware.</span>
        </div>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Roles selection */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Select Security Group</h3>
          {editingRules.map((rule, idx) => (
            <button 
              key={rule.role}
              onClick={() => setActiveRoleIndex(idx)}
              className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                activeRoleIndex === idx 
                  ? 'border-brand-primary bg-emerald-50/20 shadow-sm' 
                  : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-gray-900 text-sm capitalize">{rule.name}</span>
                <span className="text-[10px] font-mono font-bold text-gray-400 capitalize">{rule.role}</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-2 line-clamp-2">{rule.description}</p>
            </button>
          ))}
        </div>

        {/* Right Columns: Permissions Matrix Form */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-50 pb-4">
            <div>
              <span className="text-xs font-bold text-brand-primary font-mono uppercase">Jurisdictional Clearance Level</span>
              <h3 className="text-base font-black text-gray-800 uppercase mt-0.5">{selectedRule.name} matrix</h3>
            </div>
            <Lock className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {/* Reports permission */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-gray-50/25 border border-gray-50 rounded-xl">
              <div>
                <span className="text-xs font-bold text-gray-800 block">Incident Registry Authorization</span>
                <p className="text-[10px] text-gray-400">Controls report visibility and registry override permissions.</p>
              </div>
              <select 
                value={selectedRule.permissions.reports}
                onChange={e => handleSelectChange('reports', e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none"
              >
                <option value="none">None (Deny Read/Write)</option>
                <option value="view_own">View Own Reports Only</option>
                <option value="view_zone">View Ward Reports Only</option>
                <option value="edit_zone">Edit Ward Status overrides</option>
                <option value="full_control">Full Command Center Overrides</option>
              </select>
            </div>

            {/* Users permission */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-gray-50/25 border border-gray-50 rounded-xl">
              <div>
                <span className="text-xs font-bold text-gray-800 block">Directory Services Authorization</span>
                <p className="text-[10px] text-gray-400">Regulates search access to operator telephone lists and emails.</p>
              </div>
              <select 
                value={selectedRule.permissions.users}
                onChange={e => handleSelectChange('users', e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none"
              >
                <option value="none">None (Deny Directory)</option>
                <option value="view_own">View Own Profile Details</option>
                <option value="view_all">View Regional Operators List</option>
                <option value="full_control">Provision/Revoke User Credentials</option>
              </select>
            </div>

            {/* Dispatch permission */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-gray-50/25 border border-gray-50 rounded-xl">
              <div>
                <span className="text-xs font-bold text-gray-800 block">Dispatch & Routing Control</span>
                <p className="text-[10px] text-gray-400">Determines ability to assign crews and configure skip schedules.</p>
              </div>
              <select 
                value={selectedRule.permissions.dispatch}
                onChange={e => handleSelectChange('dispatch', e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none"
              >
                <option value="none">No Dispatch Controls</option>
                <option value="receive">Receive Dispatched Checklists</option>
                <option value="assign">Assign Crews in Local Zone</option>
                <option value="full_control">Modify Fleet Route Boundaries</option>
              </select>
            </div>

            {/* Audit compliance checkbox */}
            <div className="flex items-center justify-between p-3 bg-gray-50/25 border border-gray-50 rounded-xl">
              <div>
                <span className="text-xs font-bold text-gray-800 block">Audit Logs Inspections</span>
                <p className="text-[10px] text-gray-400">Permits inspecting IP access logs and credential change traces.</p>
              </div>
              <button 
                onClick={handleToggleAudit}
                className="cursor-pointer"
              >
                {selectedRule.permissions.audit ? (
                  <span className="text-[10px] font-mono font-bold px-2 py-1 bg-emerald-50 text-brand-primary rounded border border-emerald-100 uppercase">
                    Granted
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-bold px-2 py-1 bg-red-50 text-red-700 rounded border border-red-100 uppercase">
                    Denied
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
