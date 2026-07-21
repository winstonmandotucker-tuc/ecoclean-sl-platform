import React, { useState } from 'react';
import { Search, UserPlus, SlidersHorizontal, CheckCircle2, AlertTriangle, Trash2, Shield, MoreVertical } from 'lucide-react';
import { AdminUser, COUNTRIES } from '../../lib/adminData';
import { adminUserService, authService } from '../../lib/services';

interface UserManagementProps {
  users: AdminUser[];
  onSaveUsers: (newUsers: AdminUser[]) => void;
  selectedCountryCode: string;
}

export default function UserManagement({ users, onSaveUsers, selectedCountryCode }: UserManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');

  // New User Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<'citizen' | 'staff' | 'supervisor' | 'admin'>('citizen');
  const [newCountry, setNewCountry] = useState(selectedCountryCode);
  const [newMuni, setNewMuni] = useState('');
  const [newPassword,setNewPassword]=useState('');
  const [submitting,setSubmitting]=useState(false);
  const [error,setError]=useState('');

  const refreshUsers=async()=>{const {data}=await adminUserService.list();onSaveUsers(data.filter((row:any)=>row.role!=='NATIONAL_ADMIN').map((row:any)=>({id:String(row.id),fullName:row.full_name,email:row.email,phone:row.phone||undefined,role:row.role==='ADMINISTRATOR'?'admin':String(row.role).toLowerCase(),countryCode:'SL',municipality:row.municipality||'',status:row.status==='active'?'Active':row.status==='pending'?'Pending':'Suspended',lastActive:'Database account'})) as AdminUser[]);};

  // Explicit user status update handler
  const handleSetStatus = async (userId: string, newStatus: 'Active' | 'Suspended' | 'Pending') => {
    setError('');try{await adminUserService.update(userId,{status:newStatus.toLowerCase()});await refreshUsers();}catch(cause){setError(cause instanceof Error?cause.message:'Account status could not be updated.');}
  };

  // Explicit password reset handler
  const handleResetPassword = async (email: string) => {
    setError('');try{await authService.forgotPassword(email);alert('A password recovery request was created. Delivery depends on the configured email provider.');}catch(cause){setError(cause instanceof Error?cause.message:'Password recovery could not be requested.');}
  };

  // Delete User Handler
  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to revoke this account? This will revoke all database access immediately.')) {
      setError('');try{await adminUserService.update(userId,{status:'disabled'});await adminUserService.revokeSessions(userId);await refreshUsers();}catch(cause){setError(cause instanceof Error?cause.message:'Account access could not be revoked.');}
    }
  };

  // Create User Handler
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newEmail || !newPhone || newPassword.length<10) return;
    setSubmitting(true);setError('');
    try{await adminUserService.create({fullName:newFullName,email:newEmail,phone:newPhone,password:newPassword,role:newRole==='admin'?'ADMINISTRATOR':newRole.toUpperCase()});await refreshUsers();
    
    // Reset Form
    setNewFullName('');
    setNewEmail('');
    setNewPhone('');
    setNewMuni('');
    setNewPassword('');
    setShowAddForm(false);
    }catch(cause){setError(cause instanceof Error?cause.message:'The account could not be created.');}finally{setSubmitting(false);}
  };

  // Filter logic
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (u.phone && u.phone.includes(searchQuery));
    
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    const matchesCountry = countryFilter === 'all' || u.countryCode === countryFilter;

    return matchesSearch && matchesRole && matchesStatus && matchesCountry;
  });

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">Identity & Directory Services</h2>
          <p className="text-xs text-gray-400 mt-1">
            Manage credentials, operational roles, and municipal clearance zones across Sierra Leone.
          </p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-xs font-bold px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-brand-accent" />
          <span>Provision New Account</span>
        </button>
      </div>
      {error&&!showAddForm&&<div role="alert" className="bg-red-50 text-red-700 border border-red-100 p-3 rounded-xl text-xs font-semibold">{error}</div>}

      {/* Account Provisioning Drawer Form */}
      {showAddForm && (
        <form onSubmit={handleCreateUser} className="bg-emerald-50/20 border border-brand-primary/10 rounded-2xl p-5 space-y-4 shadow-sm animate-fade-in">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider font-mono">Provision New Core User Credentials</h3>
          {error&&<div role="alert" className="bg-red-50 text-red-700 border border-red-100 p-3 rounded-xl text-xs font-semibold">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 font-mono">Full Name</label>
              <input 
                type="text" 
                required
                value={newFullName} 
                onChange={e => setNewFullName(e.target.value)}
                placeholder="Dr. Samuel Koroma"
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 font-mono">Temporary Password</label>
              <input type="password" required minLength={10} value={newPassword} onChange={e=>setNewPassword(e.target.value)} placeholder="At least 10 characters" className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-primary"/>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 font-mono">Security Clearance Email</label>
              <input 
                type="email" 
                required
                value={newEmail} 
                onChange={e => setNewEmail(e.target.value)}
                placeholder="s.koroma@ecoclean.gov.sl"
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 font-mono">Telephone</label>
              <input 
                type="text" 
                required
                value={newPhone} 
                onChange={e => setNewPhone(e.target.value)}
                placeholder="+232 77 000111"
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 font-mono">Security Role Assignment</label>
              <select 
                value={newRole}
                onChange={e => setNewRole(e.target.value as any)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-primary"
              >
                <option value="citizen">Citizen Advocate (Public)</option>
                <option value="staff">Field Sanitary Staff (Operational)</option>
                <option value="supervisor">Municipal Supervisor (Control)</option>
                <option value="admin">ECOCLEAN Administrator</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 font-mono">Sovereignty Country Context</label>
              <select 
                value={newCountry}
                onChange={e => setNewCountry(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-primary"
              >
                {COUNTRIES.filter(c=>c.code==='SL').map(c => (
                  <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 font-mono">Designated Council Boundary</label>
              <input 
                type="text" 
                value={newMuni} 
                onChange={e => setNewMuni(e.target.value)}
                placeholder="e.g. Freetown City Council (FCC)"
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <button 
              type="button" 
              onClick={() => setShowAddForm(false)}
              className="text-xs font-bold px-3 py-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className="text-xs font-bold px-4 py-1.5 rounded-lg bg-brand-primary text-white hover:bg-brand-secondary cursor-pointer"
            >
              {submitting?'Creating Account…':'Confirm Authorization'}
            </button>
          </div>
        </form>
      )}

      {/* Directory Filter Bar */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search box */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search users by full name, credential email, or telephone..."
              className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="citizen">Citizen</option>
              <option value="staff">Staff</option>
              <option value="supervisor">Supervisor</option>
              <option value="admin">Admin</option>
            </select>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Pending">Pending</option>
            </select>

            <select
              value={countryFilter}
              onChange={e => setCountryFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
            >
              <option value="all">Sierra Leone</option>
              {COUNTRIES.filter(c=>c.code==='SL').map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold font-mono text-gray-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Core Account</th>
                <th className="p-4">Jurisdiction</th>
                <th className="p-4">Authorization</th>
                <th className="p-4">Session Logs</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400 font-semibold">
                    No authorized accounts match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const countryDef = COUNTRIES.find(c => c.code === u.countryCode);

                  return (
                    <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-50 text-brand-primary flex items-center justify-center font-bold text-xs uppercase font-mono">
                            {u.fullName.slice(0, 2)}
                          </div>
                          <div>
                            <span className="font-extrabold text-gray-900 block">{u.fullName}</span>
                            <span className="text-[10px] text-gray-400 font-mono block">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-gray-700 flex items-center gap-1">
                            <span>{countryDef?.flag}</span>
                            <span>{countryDef?.name}</span>
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono block truncate max-w-[150px]">
                            {u.municipality}
                          </span>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full text-[10px] font-mono capitalize ${
                          u.role === 'admin'
                            ? 'bg-purple-50 text-purple-700 border border-purple-100' 
                            : u.role === 'supervisor'
                            ? 'bg-blue-50 text-blue-700 border border-blue-100'
                            : u.role === 'staff'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-gray-50 text-gray-600 border border-gray-100'
                        }`}>
                          <Shield className="w-3 h-3" />
                          <span>{u.role}</span>
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="space-y-0.5">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold rounded-full font-mono ${
                            u.status === 'Active' 
                              ? 'text-emerald-700' 
                              : u.status === 'Suspended'
                              ? 'text-red-700'
                              : 'text-amber-700'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              u.status === 'Active' ? 'bg-emerald-500' : u.status === 'Suspended' ? 'bg-red-500' : 'bg-amber-500'
                            }`} />
                            <span>{u.status}</span>
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono block">Last: {u.lastActive}</span>
                        </div>
                      </td>

                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {u.status !== 'Suspended' ? (
                            <button 
                              onClick={() => handleSetStatus(u.id, 'Suspended')}
                              title="Suspend User Account"
                              className="text-[10px] font-mono font-bold px-2 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 rounded-lg cursor-pointer"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleSetStatus(u.id, 'Active')}
                              title="Activate Suspended Account"
                              className="text-[10px] font-mono font-bold px-2 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-lg cursor-pointer"
                            >
                              Activate
                            </button>
                          )}

                          <button 
                            onClick={() => handleResetPassword(u.email)}
                            title="Issue New Password Reset Key"
                            className="text-[10px] font-mono font-bold px-2 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-lg cursor-pointer"
                          >
                            Reset PW
                          </button>
                          
                          <button 
                            onClick={() => handleDeleteUser(u.id)}
                            title="Deactivate & Revoke Account"
                            className="w-7 h-7 rounded-lg text-gray-400 hover:text-brand-error hover:bg-red-50 border border-transparent hover:border-red-100 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
