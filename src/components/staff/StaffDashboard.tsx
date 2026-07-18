import React from 'react';
import { 
  Truck, CheckSquare, Clock, ShieldCheck, AlertTriangle, Play, CheckCircle2, 
  Map, Calendar, Camera, Bell, User, Star, ChevronRight, MessageSquare 
} from 'lucide-react';
import { StaffTask, StaffSchedule, StaffNotification, StaffPerformance } from '../../lib/staffData';
import AuthenticatedAvatar from '../AuthenticatedAvatar';

interface StaffDashboardProps {
  user: any;
  tasks: StaffTask[];
  schedules: StaffSchedule[];
  notifications: StaffNotification[];
  performance: StaffPerformance;
  onNavigateTab: (tab: any) => void;
  onExecuteTask: (taskId: string) => void;
}

export default function StaffDashboard({
  user,
  tasks,
  schedules,
  notifications,
  performance,
  onNavigateTab,
  onExecuteTask
}: StaffDashboardProps) {

  // Derived tasks metrics
  const todayTasks = tasks.filter(t => t.status !== 'Completed');
  const pendingTasksCount = tasks.filter(t => t.status === 'Assigned').length;
  const inProgressTasksCount = tasks.filter(t => t.status === 'In Progress' || t.status === 'Traveling').length;
  const highPriorityCount = tasks.filter(t => t.status !== 'Completed' && t.priority === 'High').length;

  const urgentTasks = tasks
    .filter(t => t.status !== 'Completed' && t.priority === 'High')
    .slice(0, 2);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Welcome & Summary Header banner */}
      <div className="bg-gradient-to-r from-brand-primary to-emerald-950 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-md">
        {/* Abstract vector background layout */}
        <div className="absolute right-0 bottom-0 translate-y-12 translate-x-12 opacity-10 pointer-events-none">
          <Truck className="w-80 h-80" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5">
            <span className="bg-brand-accent/20 border border-brand-accent/30 text-brand-accent text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              Operational Duty Session
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Greetings, <span className="text-brand-accent">{user?.fullName}</span>
            </h2>
            <div className="flex items-center gap-3"><AuthenticatedAvatar user={user}/><div><p className="text-xs font-bold text-white">{user?.roleLabel||'Staff'}</p>{user?.municipality&&<p className="text-[10px] text-emerald-100/80">{user.municipality}</p>}</div></div>
            <p className="text-xs text-emerald-100/70 max-w-lg leading-relaxed">
              Your digital collection log is authorized for <strong className="text-white">{user?.municipality||user?.district||'your assigned jurisdiction'}</strong>. Check optimized routes and report closures with before/after photos.
            </p>
          </div>

          {/* Quick Shift Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl flex items-center gap-4 shrink-0 max-w-sm">
            <div className="w-10 h-10 rounded-xl bg-brand-accent/20 flex items-center justify-center text-brand-accent">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-emerald-200 block uppercase font-bold">Today's Dispatch Vehicle</span>
              <span className="text-sm font-bold text-white block mt-0.5">Compactor SL-02 (Freetown)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Numerical Performance Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-4.5 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-gray-400 font-bold block uppercase leading-none">My Active Tasks</span>
            <span className="text-xl font-bold text-gray-800 font-mono block mt-1 leading-none">{todayTasks.length}</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-4.5 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-gray-400 font-bold block uppercase leading-none">In Progress Loop</span>
            <span className="text-xl font-bold text-gray-800 font-mono block mt-1 leading-none">{inProgressTasksCount}</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-4.5 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-gray-400 font-bold block uppercase leading-none">High Urgency Tasks</span>
            <span className="text-xl font-bold text-red-600 font-mono block mt-1 leading-none">{highPriorityCount}</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-4.5 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-brand-primary flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 text-brand-success" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-gray-400 font-bold block uppercase leading-none">Performance Rank</span>
            <span className="text-sm font-bold text-gray-800 block mt-1 leading-none truncate">{performance.performanceRating}</span>
          </div>
        </div>

      </div>

      {/* Main Grid Content (Quick Actions & Today's Schedule) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        
        {/* Left Column (Quick Actions & Urgent List) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Actions Panel */}
          <div className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-gray-900 mb-4 uppercase tracking-wider text-gray-500">Quick Actions Hub</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              
              <button 
                onClick={() => onNavigateTab('tasks')}
                className="p-4 bg-gray-50 hover:bg-brand-primary/10 border border-gray-150 rounded-2xl text-left transition-all hover:border-brand-primary/20 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all">
                  <CheckSquare className="w-4.5 h-4.5" />
                </div>
                <h4 className="text-xs font-bold text-gray-800 mt-3 group-hover:text-brand-primary transition-colors">Assigned Tasks</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">Filter, inspect, start jobs</p>
              </button>

              <button 
                onClick={() => onNavigateTab('routes')}
                className="p-4 bg-gray-50 hover:bg-brand-primary/10 border border-gray-150 rounded-2xl text-left transition-all hover:border-brand-primary/20 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all">
                  <Map className="w-4.5 h-4.5" />
                </div>
                <h4 className="text-xs font-bold text-gray-800 mt-3 group-hover:text-brand-primary transition-colors">Interactive Route Map</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">District layers & GPS route</p>
              </button>

              <button 
                onClick={() => onNavigateTab('evidence')}
                className="p-4 bg-gray-50 hover:bg-brand-primary/10 border border-gray-150 rounded-2xl text-left transition-all hover:border-brand-primary/20 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all">
                  <Camera className="w-4.5 h-4.5" />
                </div>
                <h4 className="text-xs font-bold text-gray-800 mt-3 group-hover:text-brand-primary transition-colors">Upload Evidence</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">Submit photo logs</p>
              </button>

              <button 
                onClick={() => onNavigateTab('schedule')}
                className="p-4 bg-gray-50 hover:bg-brand-primary/10 border border-gray-150 rounded-2xl text-left transition-all hover:border-brand-primary/20 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Calendar className="w-4.5 h-4.5" />
                </div>
                <h4 className="text-xs font-bold text-gray-800 mt-3 group-hover:text-brand-primary transition-colors">My Schedule</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">View calendars & shifts</p>
              </button>

              <button 
                onClick={() => onNavigateTab('notifications')}
                className="p-4 bg-gray-50 hover:bg-brand-primary/10 border border-gray-150 rounded-2xl text-left transition-all hover:border-brand-primary/20 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all relative">
                  <Bell className="w-4.5 h-4.5" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <h4 className="text-xs font-bold text-gray-800 mt-3 group-hover:text-brand-primary transition-colors">Alert Inbox</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">Supervisor messages</p>
              </button>

              <button 
                onClick={() => onNavigateTab('performance')}
                className="p-4 bg-gray-50 hover:bg-brand-primary/10 border border-gray-150 rounded-2xl text-left transition-all hover:border-brand-primary/20 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-white transition-all">
                  <Star className="w-4.5 h-4.5" />
                </div>
                <h4 className="text-xs font-bold text-gray-800 mt-3 group-hover:text-brand-primary transition-colors">My Performance</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">Rating & Achievements</p>
              </button>

            </div>
          </div>

          {/* Urgent Dispatch Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider text-gray-500">
                🔴 Urgent Dispatches ({highPriorityCount})
              </h3>
              <button 
                onClick={() => onNavigateTab('tasks')}
                className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
              >
                <span>Inspect All Tasks</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {urgentTasks.length === 0 ? (
                <div className="sm:col-span-2 bg-emerald-50 border border-emerald-100 p-6 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-brand-success mx-auto" />
                  <p className="text-xs font-bold text-brand-primary">No High-Priority Bloat!</p>
                  <p className="text-[11px] text-gray-400">All high urgency dispatches in your assigned zones are completed.</p>
                </div>
              ) : (
                urgentTasks.map(task => (
                  <div key={task.id} className="bg-white border border-red-150 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono font-bold bg-red-50 text-red-600 px-2 py-0.5 rounded border border-red-100">
                          {task.id}
                        </span>
                        <span className="text-[10px] font-mono text-gray-400 font-bold">
                          Due: {task.deadline}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-gray-800 mt-1 leading-snug">{task.title}</h4>
                      <p className="text-[11px] text-gray-400 line-clamp-2">{task.description}</p>
                    </div>

                    <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                      <span className="text-[10px] text-gray-500 font-bold truncate max-w-[120px]">
                        📍 {task.location}
                      </span>
                      <button
                        onClick={() => onExecuteTask(task.id)}
                        className="bg-brand-primary hover:bg-brand-secondary text-white text-[10px] font-bold px-3.5 py-1.5 rounded-xl transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        <span>Execute</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Column (Upcoming Schedule & Notification feed) */}
        <div className="space-y-8">
          
          {/* Dispatch Shifts Roster */}
          <div className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                Shift Schedule
              </h3>
              <button 
                onClick={() => onNavigateTab('schedule')}
                className="text-[11px] font-bold text-brand-primary hover:underline"
              >
                Calendar
              </button>
            </div>

            <div className="space-y-3.5">
              {schedules.slice(0, 3).map((sched) => (
                <div key={sched.id} className="flex gap-3 items-start text-xs">
                  <div className={`p-2 rounded-xl shrink-0 ${
                    sched.status === 'In Progress' ? 'bg-amber-50 text-amber-600 animate-pulse' : 'bg-gray-50 text-gray-500'
                  }`}>
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <p className="font-bold text-gray-800 truncate leading-snug">{sched.title}</p>
                    <p className="text-[10px] text-gray-400 font-mono">
                      ⏱️ {sched.time} &bull; {sched.vessel}
                    </p>
                    <p className="text-[10px] text-brand-primary font-bold">
                      📍 {sched.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Operations Log Notifications */}
          <div className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                Operations Logs ({notifications.filter(n => !n.read).length})
              </h3>
              <button 
                onClick={() => onNavigateTab('notifications')}
                className="text-[11px] font-bold text-brand-primary hover:underline"
              >
                Open Inbox
              </button>
            </div>

            <div className="space-y-3">
              {notifications.slice(0, 3).map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-3 rounded-2xl text-xs space-y-1 border ${
                    notif.read ? 'bg-gray-50/50 border-transparent' : 'bg-red-50/30 border-red-100/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      notif.type === 'New Assignment' ? 'bg-brand-primary/10 text-brand-primary' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {notif.type}
                    </span>
                    <span className="text-[9px] font-mono text-gray-400">{notif.date}</span>
                  </div>
                  <h4 className="font-bold text-gray-800 leading-snug">{notif.title}</h4>
                  <p className="text-[10px] text-gray-500 leading-normal line-clamp-2">{notif.body}</p>
                  
                  {notif.taskId && (
                    <button
                      onClick={() => onExecuteTask(notif.taskId!)}
                      className="text-[10px] font-bold text-brand-primary hover:underline flex items-center gap-0.5 pt-1"
                    >
                      <span>Access assignment</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
