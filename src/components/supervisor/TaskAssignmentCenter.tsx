import React, { useState } from 'react';
import { 
  CheckSquare, Calendar, User, Clock, ShieldCheck, 
  Search, Filter, AlertTriangle, RefreshCw, Edit, X, Save
} from 'lucide-react';
import { StaffTask } from '../../lib/staffData';
import { FieldStaff } from '../../lib/supervisorData';

interface TaskAssignmentCenterProps {
  tasks: StaffTask[];
  staff: FieldStaff[];
  onReassignTask: (taskId: string, newStaffId: string) => void;
  onUpdateDeadline: (taskId: string, newDeadline: string) => void;
}

export default function TaskAssignmentCenter({
  tasks,
  staff,
  onReassignTask,
  onUpdateDeadline
}: TaskAssignmentCenterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  
  // Modal states for reassignment or deadline editing
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [modalType, setModalType] = useState<'reassign' | 'deadline' | null>(null);
  const [tempStaffId, setTempStaffId] = useState('');
  const [tempDeadline, setTempDeadline] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const filteredTasks = tasks.filter(t => {
    const matchesStatus = filterStatus === 'All' || t.status === filterStatus;
    const matchesPriority = filterPriority === 'All' || t.priority === filterPriority;
    const matchesSearch = 
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.assignedSupervisor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const handleOpenModal = (taskId: string, type: 'reassign' | 'deadline') => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    setEditingTaskId(taskId);
    setModalType(type);
    if (type === 'reassign') {
      const currentStaff = staff.find(s => s.vessel === task.vesselNo || s.name === task.assignedSupervisor);
      setTempStaffId(currentStaff?.id || '');
    } else {
      setTempDeadline(task.deadline);
    }
  };

  const handleCloseModal = () => {
    setEditingTaskId(null);
    setModalType(null);
    setTempStaffId('');
    setTempDeadline('');
    setSuccessMsg('');
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTaskId) return;

    if (modalType === 'reassign') {
      onReassignTask(editingTaskId, tempStaffId);
      setSuccessMsg('Task successfully reassigned!');
    } else if (modalType === 'deadline') {
      onUpdateDeadline(editingTaskId, tempDeadline);
      setSuccessMsg('Deadline updated successfully!');
    }

    setTimeout(() => {
      handleCloseModal();
    }, 1500);
  };

  const getStatusColor = (status: StaffTask['status']) => {
    switch (status) {
      case 'Assigned':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Accepted':
        return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Traveling':
        return 'bg-cyan-50 text-cyan-700 border-cyan-100';
      case 'In Progress':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Verification Pending':
        return 'bg-orange-50 text-orange-700 border-orange-100 animate-pulse';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="task-assignment-center">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight font-sans">Task Assignment Center</h2>
          <p className="text-xs text-gray-500 mt-0.5">Track live crew assignments, re-route vessels, and update operational deadlines</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-white border border-gray-150 rounded-lg text-xs font-mono font-bold text-gray-500">
            Active: <span className="text-gray-900">{tasks.filter(t => t.status !== 'Completed').length}</span>
          </span>
          <span className="px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-lg text-xs font-mono font-bold text-emerald-600">
            Completed: <span className="text-emerald-950">{tasks.filter(t => t.status === 'Completed').length}</span>
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-gray-200/80 p-4 rounded-2xl shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search dispatch title, reference code or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand-primary rounded-xl"
            />
          </div>

          <div className="flex items-center gap-1.5 min-w-[150px]">
            <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full text-xs p-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none cursor-pointer text-gray-700 font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Assigned">👤 Assigned</option>
              <option value="Accepted">✓ Accepted</option>
              <option value="Traveling">🚚 Traveling</option>
              <option value="In Progress">⚡ In Progress</option>
              <option value="Verification Pending">🔔 Verification Pending</option>
              <option value="Completed">✓ Completed</option>
            </select>
          </div>

          <div className="min-w-[150px]">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full text-xs p-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none cursor-pointer text-gray-700 font-medium"
            >
              <option value="All">All Priorities</option>
              <option value="High">🔴 High</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Low">⚪ Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks Table/List View */}
      <div className="bg-white border border-gray-200/80 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-150 text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">
                <th className="p-4 pl-6">Reference / Title</th>
                <th className="p-4">Location & District</th>
                <th className="p-4">Assigned Crew</th>
                <th className="p-4">SLA Deadline</th>
                <th className="p-4">Status & Priority</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400 font-medium">
                    No active task assignments match your search filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  return (
                    <tr key={task.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* Ref / Title */}
                      <td className="p-4 pl-6 space-y-1">
                        <span className="text-[10px] font-mono text-gray-400 font-bold block">{task.referenceNumber}</span>
                        <span className="font-extrabold text-gray-900 block max-w-[200px] truncate">{task.title}</span>
                        <span className="text-[10px] text-brand-primary font-mono block">{task.category}</span>
                      </td>

                      {/* Location */}
                      <td className="p-4 space-y-0.5">
                        <p className="font-bold text-gray-800 truncate max-w-[180px]">{task.location}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{task.district} • {task.ward}</p>
                      </td>

                      {/* Assigned Crew */}
                      <td className="p-4 space-y-0.5">
                        <p className="font-bold text-gray-800 flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          {task.assignedSupervisor}
                        </p>
                        <p className="text-[10px] text-brand-primary font-mono tracking-wider uppercase font-semibold">{task.vesselNo || 'Standby compactor'}</p>
                      </td>

                      {/* SLA Deadline */}
                      <td className="p-4 text-gray-600 font-mono font-bold space-y-0.5">
                        <span className="block">{task.deadline}</span>
                        <span className="text-[9px] text-gray-400 block font-normal">Assigned: {task.date}</span>
                      </td>

                      {/* Status / Priority */}
                      <td className="p-4 space-y-1.5">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider border ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-mono">
                          <span className={`w-1.5 h-1.5 rounded-full ${task.priority === 'High' ? 'bg-red-500' : task.priority === 'Medium' ? 'bg-yellow-500' : 'bg-gray-400'}`} />
                          <span>{task.priority} Priority</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 pr-6 text-right space-x-1.5 shrink-0">
                        {task.status !== 'Completed' && (
                          <>
                            <button
                              onClick={() => handleOpenModal(task.id, 'reassign')}
                              title="Reassign Task"
                              className="p-2 hover:bg-emerald-50 hover:text-brand-primary text-gray-400 rounded-lg border border-gray-150 hover:border-emerald-200 transition-all cursor-pointer"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenModal(task.id, 'deadline')}
                              title="Adjust Deadline"
                              className="p-2 hover:bg-emerald-50 hover:text-brand-primary text-gray-400 rounded-lg border border-gray-150 hover:border-emerald-200 transition-all cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        {task.status === 'Completed' && (
                          <span className="text-emerald-600 font-bold font-mono text-[10px] flex items-center justify-end gap-1">
                            <ShieldCheck className="w-4 h-4 text-brand-accent" /> Audited
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal (Inline Overlay/Sheet for clean modular build) */}
      {editingTaskId && modalType && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl p-6 max-w-sm w-full space-y-4 animate-scale-up">
            
            <div className="flex justify-between items-start pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider font-mono">
                  {modalType === 'reassign' ? 'Reassign Operations Crew' : 'Adjust SLA Deadline'}
                </h3>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5">Task ID: {editingTaskId}</p>
              </div>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              {modalType === 'reassign' ? (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">Select Alternate Operator</label>
                  <select
                    value={tempStaffId}
                    onChange={(e) => setTempStaffId(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-primary cursor-pointer text-gray-700 font-medium"
                  >
                    <option value="">Choose standby crew...</option>
                    {staff.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.role} - {s.vessel})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">Specify New Deadline</label>
                  <input
                    type="text"
                    required
                    value={tempDeadline}
                    onChange={(e) => setTempDeadline(e.target.value)}
                    placeholder="e.g. Today, 19:00 or 2026-07-17 12:00"
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand-primary rounded-xl text-gray-700 font-medium font-mono"
                  />
                  <span className="text-[9px] text-gray-400 block leading-tight">Must match clear human-readable or regional ISO layouts.</span>
                </div>
              )}

              {successMsg && (
                <div className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-lg text-center text-[10px] font-bold">
                  {successMsg}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!!successMsg}
                  className="flex-1 py-2 bg-brand-primary hover:bg-brand-secondary text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 text-brand-accent" />
                  <span>Save Change</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
