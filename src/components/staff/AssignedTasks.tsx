import React, { useState, useMemo } from 'react';
import { 
  Search, ListFilter, AlertCircle, MapPin, Clock, Calendar, ShieldCheck, 
  ChevronRight, CheckCircle2, Play, AlertTriangle 
} from 'lucide-react';
import { StaffTask } from '../../lib/staffData';

interface AssignedTasksProps {
  tasks: StaffTask[];
  onSelectTask: (taskId: string) => void;
  onExecuteTask: (taskId: string) => void;
}

export default function AssignedTasks({ tasks, onSelectTask, onExecuteTask }: AssignedTasksProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            task.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            task.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            task.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = selectedPriority === 'All' || task.priority === selectedPriority;
      const matchesStatus = selectedStatus === 'All' || task.status === selectedStatus;
      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [tasks, searchQuery, selectedPriority, selectedStatus]);

  // Priority count badges
  const highPriorityCount = tasks.filter(t => t.status !== 'Completed' && t.priority === 'High').length;
  const inProgressCount = tasks.filter(t => t.status === 'In Progress' || t.status === 'Traveling').length;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Title & brief description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Assigned Dispatches Grid</h2>
          <p className="text-xs text-gray-400 mt-1">Review, coordinate, and log all environmental collection tasks across Sierra Leone.</p>
        </div>

        {/* Dynamic status pill stack */}
        <div className="flex gap-2">
          <span className="bg-red-50 border border-red-100 text-red-600 text-[10px] font-mono font-bold px-2.5 py-1 rounded-xl">
            🔴 {highPriorityCount} High Urgency
          </span>
          <span className="bg-amber-50 border border-amber-100 text-amber-600 text-[10px] font-mono font-bold px-2.5 py-1 rounded-xl">
            🟡 {inProgressCount} In Progress
          </span>
        </div>
      </div>

      {/* Filter and search control bar */}
      <div className="bg-white rounded-3xl border border-gray-250/80 p-5 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Title, ID, Reference, Location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200/80 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:bg-white focus:border-brand-primary text-gray-800"
          />
        </div>

        {/* Priority & Status dropdown controls */}
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3.5">
          <div className="flex items-center gap-2">
            <ListFilter className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="text-xs text-gray-400 font-medium">Filter by:</span>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-700 focus:outline-none focus:bg-white flex-1 sm:flex-initial cursor-pointer"
            >
              <option value="All">All Urgency</option>
              <option value="High">🔴 High Priority</option>
              <option value="Medium">🟡 Medium Priority</option>
              <option value="Low">🟢 Low Priority</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-700 focus:outline-none focus:bg-white flex-1 sm:flex-initial cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Assigned">Assigned</option>
              <option value="Accepted">Accepted</option>
              <option value="Traveling">Traveling</option>
              <option value="In Progress">In Progress</option>
              <option value="Verification Pending">Verification Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

      </div>

      {/* Grid of Task cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.length === 0 ? (
          <div className="col-span-full bg-white border border-gray-200 rounded-3xl p-12 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto" />
            <div>
              <h3 className="text-sm font-bold text-gray-800">No Assignments Found</h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed max-w-sm mx-auto">
                No collection tasks correspond to your active filter or search tags. Try adjusting filters or reloading the workspace.
              </p>
            </div>
            {(selectedPriority !== 'All' || selectedStatus !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedPriority('All');
                  setSelectedStatus('All');
                  setSearchQuery('');
                }}
                className="text-xs font-bold text-brand-primary underline"
              >
                Reset Filter Queries
              </button>
            )}
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isHigh = task.priority === 'High';
            const isCompleted = task.status === 'Completed';
            const isPendingVerification = task.status === 'Verification Pending';
            const isActionActive = task.status === 'In Progress' || task.status === 'Traveling' || task.status === 'Accepted';

            return (
              <div 
                key={task.id} 
                className={`bg-white rounded-3xl border shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between p-6 space-y-5 relative group ${
                  isCompleted 
                    ? 'border-gray-200/80 opacity-80' 
                    : isHigh 
                    ? 'border-red-100 hover:border-red-300' 
                    : 'border-emerald-100 hover:border-brand-primary/30'
                }`}
              >
                {/* Header elements */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-black bg-gray-50 border border-gray-100 px-2 py-0.5 rounded text-gray-500">
                        {task.id}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        task.priority === 'High' 
                          ? 'bg-red-50 text-red-600 border border-red-100/50' 
                          : task.priority === 'Medium'
                          ? 'bg-amber-50 text-amber-600 border border-amber-100/50'
                          : 'bg-emerald-50 text-emerald-600 border border-emerald-100/50'
                      }`}>
                        {task.priority} Priority
                      </span>
                    </div>

                    <span className={`text-[10px] font-mono font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      isCompleted 
                        ? 'bg-emerald-50 text-brand-success' 
                        : isPendingVerification
                        ? 'bg-purple-50 text-purple-600 border border-purple-100'
                        : isActionActive
                        ? 'bg-amber-50 text-amber-600 border border-amber-100 animate-pulse'
                        : 'bg-brand-primary/10 text-brand-primary'
                    }`}>
                      {task.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-gray-800 leading-snug group-hover:text-brand-primary transition-colors cursor-pointer" onClick={() => onSelectTask(task.id)}>
                      {task.title}
                    </h4>
                    <p className="text-[11px] text-brand-primary font-bold font-mono tracking-wide mt-0.5">
                      Reference: {task.referenceNumber}
                    </p>
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                      {task.description}
                    </p>
                  </div>
                </div>

                {/* Body Details Card metadata */}
                <div className="bg-gray-50/50 rounded-2xl p-3 border border-gray-100 text-xs space-y-2">
                  <p className="text-gray-600 flex items-start gap-1.5 min-w-0">
                    <span className="shrink-0 text-brand-primary mt-0.5">📍</span>
                    <span className="truncate">{task.location}</span>
                  </p>
                  <p className="text-gray-400 flex items-center gap-1.5 font-mono text-[10px]">
                    <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>Deadline: <strong className="text-gray-600 font-bold">{task.deadline}</strong></span>
                  </p>
                </div>

                {/* Card footer buttons */}
                <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
                  <button
                    onClick={() => onSelectTask(task.id)}
                    className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs py-2.5 rounded-xl transition-all text-center cursor-pointer shadow-sm"
                  >
                    Details View
                  </button>

                  {isCompleted ? (
                    <div className="flex-1 bg-emerald-50 text-brand-success text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completed</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => onExecuteTask(task.id)}
                      className="flex-1 bg-brand-primary hover:bg-brand-secondary text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer shadow-md shadow-brand-primary/5"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Execute</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
