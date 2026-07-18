import React, { useState } from 'react';
import { 
  Users, UserCheck, MessageSquare, Phone, Truck, 
  Search, ShieldAlert, Star, Fuel, CheckCircle, Send, X, ShieldCheck
} from 'lucide-react';
import { FieldStaff } from '../../lib/supervisorData';

interface StaffManagementProps {
  staff: FieldStaff[];
  onSendMessageToStaff: (staffId: string, message: string) => void;
  onUpdateStaffVessel: (staffId: string, newVessel: string) => void;
}

export default function StaffManagement({
  staff,
  onSendMessageToStaff,
  onUpdateStaffVessel
}: StaffManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedStaffForMsg, setSelectedStaffForMsg] = useState<FieldStaff | null>(null);
  const [messageText, setMessageText] = useState('');
  const [messageSuccess, setMessageSuccess] = useState(false);

  // Vessel edit state
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [vesselInput, setVesselInput] = useState('');

  const filteredStaff = staff.filter(s => {
    const matchesStatus = filterStatus === 'All' || s.status === filterStatus;
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.vessel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.municipality.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleSendMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffForMsg || !messageText.trim()) return;

    onSendMessageToStaff(selectedStaffForMsg.id, messageText);
    setMessageSuccess(true);
    setMessageText('');
    setTimeout(() => {
      setMessageSuccess(false);
      setSelectedStaffForMsg(null);
    }, 2000);
  };

  const handleVesselSave = (staffId: string) => {
    if (!vesselInput.trim()) return;
    onUpdateStaffVessel(staffId, vesselInput);
    setEditingStaffId(null);
    setVesselInput('');
  };

  const getStatusColor = (status: FieldStaff['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500';
      case 'On Duty':
        return 'bg-amber-500';
      case 'Offline':
        return 'bg-gray-300';
      case 'In Training':
        return 'bg-blue-400';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="staff-management">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Collection Crew Roster</h2>
          <p className="text-xs text-gray-500 mt-0.5">Track field staff, monitor vessel fuel levels, and dispatch real-time instructions</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-white border border-gray-150 rounded-lg text-xs font-mono font-bold text-gray-500">
            Total Staff: <span className="text-gray-900">{staff.length}</span>
          </span>
          <span className="px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-lg text-xs font-mono font-bold text-emerald-600">
            On Duty: <span className="text-emerald-950">{staff.filter(s => s.status === 'Active' || s.status === 'On Duty').length}</span>
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-gray-200/80 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search operator name, vessel serial, council or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand-primary rounded-xl"
          />
        </div>

        <div className="min-w-[150px]">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none cursor-pointer text-gray-700 font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="Active">🟢 Active (Idle)</option>
            <option value="On Duty">🟡 On Duty (In Route)</option>
            <option value="Offline">⚪ Offline</option>
          </select>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.length === 0 ? (
          <div className="col-span-full bg-white border border-gray-200 rounded-3xl p-8 text-center text-gray-400 font-medium">
            No active operators match your search queries.
          </div>
        ) : (
          filteredStaff.map((member) => {
            const isEditingVessel = editingStaffId === member.id;
            return (
              <div 
                key={member.id} 
                className="bg-white border border-gray-200/80 rounded-3xl p-5 shadow-sm space-y-4 hover:border-gray-300 transition-all"
              >
                {/* Header info */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center font-black text-brand-primary relative shrink-0">
                      {member.name.charAt(0)}
                      {/* Status indicator badge */}
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-gray-900 leading-tight">{member.name}</h4>
                      <span className="text-[10px] text-gray-400 font-mono tracking-wider block mt-0.5">{member.role} • {member.id}</span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 bg-gray-50 text-[10px] text-gray-500 font-mono font-bold rounded-lg border border-gray-150">
                    {member.district}
                  </span>
                </div>

                {/* Grid performance details */}
                <div className="grid grid-cols-2 gap-3.5 bg-gray-50/50 p-3 rounded-2xl border border-gray-100 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider font-mono block">Vessel Assigned</span>
                    {isEditingVessel ? (
                      <div className="flex gap-1 items-center mt-1">
                        <input
                          type="text"
                          value={vesselInput}
                          onChange={(e) => setVesselInput(e.target.value)}
                          placeholder="Compactor SL-XX"
                          className="w-full text-[10px] p-1 bg-white border border-gray-200 rounded focus:outline-none"
                        />
                        <button 
                          onClick={() => handleVesselSave(member.id)}
                          className="px-2 py-1 bg-brand-primary text-white text-[9px] rounded font-bold hover:bg-brand-secondary cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <span className="font-extrabold text-gray-800 truncate">{member.vessel}</span>
                        <button 
                          onClick={() => {
                            setEditingStaffId(member.id);
                            setVesselInput(member.vessel);
                          }}
                          className="text-[9px] text-brand-primary hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider font-mono block">Fuel Level Balance</span>
                    <span className="font-mono font-bold text-gray-800 flex items-center gap-1">
                      <Fuel className="w-3.5 h-3.5 text-gray-400 shrink-0" /> {member.fuelBalance}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider font-mono block">Performance Score</span>
                    <span className="font-bold text-gray-800 flex items-center gap-1 text-[11px]">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 shrink-0" /> {member.rating} / 5.0
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider font-mono block">Completed Duties</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1 font-mono">
                      <CheckCircle className="w-3.5 h-3.5 shrink-0" /> {member.completedTasks} tasks
                    </span>
                  </div>
                </div>

                {/* Card footer actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {member.phone}
                  </span>

                  <button
                    onClick={() => {
                      setSelectedStaffForMsg(member);
                      setMessageSuccess(false);
                    }}
                    className="px-3 py-1.5 bg-gray-50 hover:bg-emerald-50 hover:text-brand-primary text-gray-600 text-[10px] font-bold rounded-lg border border-gray-150 hover:border-emerald-200 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Communicate</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Message Modal Sheet overlay */}
      {selectedStaffForMsg && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl p-6 max-w-sm w-full space-y-4 animate-scale-up">
            
            <div className="flex justify-between items-start pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-brand-primary" /> Send Dispatch Message
                </h3>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5">Recipient: {selectedStaffForMsg.name} ({selectedStaffForMsg.role})</p>
              </div>
              <button 
                onClick={() => setSelectedStaffForMsg(null)} 
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendMessageSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">Supervisor Message Text</label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="e.g. Please expedite the Kroo Town task. Major flood block reported..."
                  required
                  rows={4}
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-primary"
                />
              </div>

              {messageSuccess && (
                <div className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-lg text-center text-[10px] font-bold animate-pulse">
                  ✓ Dispatch instruction sent to operator's mobile console!
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedStaffForMsg(null)}
                  className="flex-1 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!messageText.trim() || messageSuccess}
                  className="flex-1 py-2 bg-brand-primary hover:bg-brand-secondary text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-brand-accent" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
