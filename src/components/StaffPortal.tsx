import React, { useState, useEffect } from 'react';
import { operationalStore } from '../lib/operationalStore';
import { authService, notificationService, taskService, uploadService } from '../lib/services';
import { mediaUrl } from '../lib/api';
import { 
  Truck, CheckSquare, Map, Camera, Calendar, Bell, Star, User, 
  ArrowLeft, LogOut, Menu, X, Layers, AlertTriangle, Clock, HelpCircle, ChevronRight, Trophy 
} from 'lucide-react';
import { User as UserType } from '../types';
import AuthenticatedAvatar from './AuthenticatedAvatar';

// Import sub components
import StaffDashboard from './staff/StaffDashboard';
import AssignedTasks from './staff/AssignedTasks';
import TaskDetails from './staff/TaskDetails';
import TaskExecution from './staff/TaskExecution';
import RouteManagement from './staff/RouteManagement';
import EvidenceManagement from './staff/EvidenceManagement';
import StaffScheduleView from './staff/StaffScheduleView';
import StaffNotifications from './staff/StaffNotifications';
import StaffProfile from './staff/StaffProfile';
import StaffPerformanceView from './staff/StaffPerformanceView';
import ServiceCenter from './service/ServiceCenter';

// Import mock data seeders
import { 
  DEFAULT_STAFF_TASKS, DEFAULT_STAFF_SCHEDULES, DEFAULT_STAFF_NOTIFICATIONS, DEFAULT_STAFF_PERFORMANCE,
  StaffTask, StaffSchedule, StaffNotification, StaffPerformance
} from '../lib/staffData';

interface StaffPortalProps {
  user: UserType | null;
  onBackToSelection?: () => void;
  onLogout: () => void;
}

type StaffTab = 
  | 'dashboard' 
  | 'tasks' 
  | 'task-details'
  | 'task-execute'
  | 'routes' 
  | 'evidence' 
  | 'schedule' 
  | 'notifications' 
  | 'profile'
  | 'performance'
  | 'service-center';

export default function StaffPortal({ user, onBackToSelection, onLogout }: StaffPortalProps) {
  // Mobile drawer control
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<StaffTab>('dashboard');

  // Core Reactive States (synced with LocalStorage)
  const [tasks, setTasks] = useState<StaffTask[]>([]);
  const [schedules, setSchedules] = useState<StaffSchedule[]>([]);
  const [notifications, setNotifications] = useState<StaffNotification[]>([]);
  const [performance, setPerformance] = useState<StaffPerformance | null>(null);

  // Detail & execute helpers
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Load and seed initial states
  useEffect(() => {
    try {
      // 1. Tasks
      const storedTasks = operationalStore.getItem('ecoclean_staff_tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      } else {
        setTasks(DEFAULT_STAFF_TASKS);
        operationalStore.setItem('ecoclean_staff_tasks', JSON.stringify(DEFAULT_STAFF_TASKS));
      }

      // 2. Schedules
      const storedSchedules = operationalStore.getItem('ecoclean_staff_schedules');
      if (storedSchedules) {
        setSchedules(JSON.parse(storedSchedules));
      } else {
        setSchedules(DEFAULT_STAFF_SCHEDULES);
        operationalStore.setItem('ecoclean_staff_schedules', JSON.stringify(DEFAULT_STAFF_SCHEDULES));
      }

      // 3. Notifications
      const storedNotifs = operationalStore.getItem('ecoclean_staff_notifications');
      if (storedNotifs) {
        setNotifications(JSON.parse(storedNotifs));
      } else {
        setNotifications(DEFAULT_STAFF_NOTIFICATIONS);
        operationalStore.setItem('ecoclean_staff_notifications', JSON.stringify(DEFAULT_STAFF_NOTIFICATIONS));
      }

      // 4. Performance
      const storedPerformance = operationalStore.getItem('ecoclean_staff_performance');
      if (storedPerformance) {
        setPerformance(JSON.parse(storedPerformance));
      } else {
        setPerformance(DEFAULT_STAFF_PERFORMANCE);
        operationalStore.setItem('ecoclean_staff_performance', JSON.stringify(DEFAULT_STAFF_PERFORMANCE));
      }
    } catch (e) {
      console.error('Error loading staff portal state:', e);
    }
  }, []);

  useEffect(()=>{void Promise.all([taskService.list(),notificationService.list()]).then(([taskResponse,notificationResponse])=>{
    setTasks(taskResponse.data.map((row:any)=>({id:String(row.id),reportId:row.report_id?String(row.report_id):undefined,referenceNumber:row.reference,title:row.title,category:'Waste Operations',description:row.description||row.title,location:'Assigned GIS location',district:'Western Urban',municipality:'Freetown City Council (FCC)',ward:'Assigned ward',zone:'Assigned zone',priority:String(row.priority).replace(/^./,(c:string)=>c.toUpperCase()),status:String(row.status).split('_').map((part:string)=>part[0].toUpperCase()+part.slice(1)).join(' '),date:String(row.created_at||''),deadline:String(row.due_at||'No deadline'),photosBefore:[],photosAfter:[],gps:{lat:8.4842,lng:-13.2514,x:14,y:44},assignedSupervisor:'ECOCLEAN Supervisor',notes:[]})) as StaffTask[]);
    setNotifications(notificationResponse.data.map((row:any)=>({id:String(row.id),title:row.title,body:row.body,date:String(row.created_at||''),type:row.type==='supervisor_message'?'Supervisor Message':'System Alert',read:Boolean(row.read_at),taskId:row.data_json?.taskId?String(row.data_json.taskId):undefined,canReply:row.type==='supervisor_message'})) as StaffNotification[]);
  }).catch(error=>console.error('Staff operational data load failed',error));},[]);

  // Sync state helpers
  const saveTasksState = (newTasks: StaffTask[]) => {
    setTasks(newTasks);
    operationalStore.setItem('ecoclean_staff_tasks', JSON.stringify(newTasks));
  };

  const saveNotificationsState = (newNotifs: StaffNotification[]) => {
    setNotifications(newNotifs);
    operationalStore.setItem('ecoclean_staff_notifications', JSON.stringify(newNotifs));
  };

  const savePerformanceState = (newPerf: StaffPerformance) => {
    setPerformance(newPerf);
    operationalStore.setItem('ecoclean_staff_performance', JSON.stringify(newPerf));
  };

  const handleTabChange = (tab: StaffTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Actions
  const handleSelectTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    handleTabChange('task-details');
  };

  const handleExecuteTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    handleTabChange('task-execute');
  };

  const handleAcceptTask = async (taskId: string) => {
    try{await taskService.update(taskId,{status:'accepted',note:'Operator accepted and acknowledged dispatch.'});}catch(error){alert(error instanceof Error?error.message:'The assignment could not be accepted.');return;}
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'Accepted' as const,
          notes: ['Operator accepted and acknowledged dispatch.', ...t.notes]
        };
      }
      return t;
    });
    saveTasksState(updated);

    // Create a new notification log
    const newNotif: StaffNotification = {
      id: `SN-${Math.floor(100 + Math.random() * 900)}`,
      title: 'Dispatch Accepted',
      body: `You acknowledged task ${taskId}. Travel routing coordinates are unlocked in the map section.`,
      date: 'Just Now',
      type: 'Supervisor Message',
      read: false,
      taskId
    };
    saveNotificationsState([newNotif, ...notifications]);
  };

  const handleRejectTask = async (taskId: string) => {
    try{await taskService.update(taskId,{status:'rejected',note:'Operator declined the assignment; supervisor review required.'});}catch(error){alert(error instanceof Error?error.message:'The assignment could not be declined.');return;}
    alert(`Task ${taskId} decline signal sent to supervisor. Adjusting rosters...`);
    handleTabChange('tasks');
  };

  const handleUpdateStatus = async (
    taskId: string, 
    newStatus: StaffTask['status'], 
    notes: string[], 
    photosAfter: string[]
  ) => {
    const apiStatus:Record<StaffTask['status'],string>={Assigned:'assigned',Accepted:'accepted',Traveling:'in_progress','In Progress':'in_progress','Verification Pending':'completed',Completed:'completed'};
    try{await taskService.update(taskId,{status:apiStatus[newStatus],note:notes[0]});}catch(error){alert(error instanceof Error?error.message:'The task status could not be saved.');throw error;}
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: newStatus,
          notes,
          photosAfter: photosAfter.length > 0 ? photosAfter : t.photosAfter
        };
      }
      return t;
    });
    saveTasksState(updated);

    // Trigger state audits and rating points if completed
    if (newStatus === 'Completed' && performance) {
      const updatedPerf: StaffPerformance = {
        ...performance,
        completedTasks: performance.completedTasks + 1,
        citizenSatisfaction: Math.min(5.0, Number((performance.citizenSatisfaction + 0.02).toFixed(2)))
      };
      savePerformanceState(updatedPerf);

      // Notify operator
      const newNotif: StaffNotification = {
        id: `SN-${Math.floor(100 + Math.random() * 900)}`,
        title: 'Assignment Completed & Verified',
        body: `Your completion proofs for task ${taskId} have been authorized by Superintendent. Performance score updated.`,
        date: 'Just now',
        type: 'System Alert',
        read: false
      };
      saveNotificationsState([newNotif, ...notifications]);
    } else {
      // General alert logs
      const newNotif: StaffNotification = {
        id: `SN-${Math.floor(100 + Math.random() * 900)}`,
        title: `Dispatch state: ${newStatus}`,
        body: `Task ${taskId} transitioned to ${newStatus} status cleanly.`,
        date: 'Just now',
        type: 'Schedule Update',
        read: false,
        taskId
      };
      saveNotificationsState([newNotif, ...notifications]);
    }
  };

  const handleSyncSchedules = () => {
    // Simulated remote sync
    const newSchedules = schedules.map(s => {
      if (s.status === 'Upcoming') {
        // Maybe do a small change to simulate activity
        return s;
      }
      return s;
    });
    setSchedules(newSchedules);
  };

  const handleMarkRead = (id: string) => {
    void notificationService.markRead(Number(id));
    saveNotificationsState(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = () => {
    void notificationService.markAllRead();
    saveNotificationsState(notifications.map(n => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (id: string) => {
    void notificationService.remove(id);
    saveNotificationsState(notifications.filter(n => n.id !== id));
  };

  const handleUploadGeneralEvidence = async (file:File,taskId:string) => {
    const result=await uploadService.upload('task_evidence',file,{taskId});const url=mediaUrl(result.data[0].url);if(!url)throw new Error('Evidence upload did not return a valid media record.');
    saveTasksState(tasks.map(task=>task.id===taskId?{...task,photosAfter:[url,...task.photosAfter]}:task));
    const newNotif: StaffNotification = {
      id: `SN-${Math.floor(100 + Math.random() * 900)}`,
      title: 'General Photo Evidence Logged',
      body: `Evidence stored for task ${taskId}.`,
      date: 'Just Now',
      type: 'System Alert',
      read: false
    };
    saveNotificationsState([newNotif, ...notifications]);
  };

  const handleUpdateUser = (updated: any) => {
    void authService.updateProfile(updated);
  };

  // Active task details reference lookup
  const activeTaskDetails = tasks.find(t => t.id === selectedTaskId) || null;

  // Active Sidebar Links List
  const navLinks = [
    { id: 'dashboard' as const, label: 'Control Overview', icon: Layers },
    { id: 'tasks' as const, label: 'Assigned Dispatches', icon: CheckSquare, badgeCount: tasks.filter(t => t.status !== 'Completed').length },
    { id: 'routes' as const, label: 'Optimized Maps', icon: Map },
    { id: 'evidence' as const, label: 'Evidence Locker', icon: Camera },
    { id: 'schedule' as const, label: 'Shift Schedules', icon: Calendar },
    { id: 'notifications' as const, label: 'Alert Inbox', icon: Bell, badgeCount: notifications.filter(n => !n.read).length },
    { id: 'service-center' as const, label: 'Service Center', icon: HelpCircle },
    { id: 'performance' as const, label: 'Performance Score', icon: Trophy },
    { id: 'profile' as const, label: 'My Profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex flex-col md:flex-row font-sans selection:bg-brand-accent selection:text-brand-primary">
      
      {/* 1. SIDEBAR - COLLAPSIBLE ON MOBILE, PERSISTENT ON DESKTOP */}
      <aside className="hidden md:flex md:w-64 bg-white border-r border-gray-200/80 p-6 flex-col justify-between shrink-0 h-screen sticky top-0">
        <div className="space-y-8 overflow-y-auto pr-1">
          
          {/* Logo brand */}
          <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white">
              <Layers className="w-4.5 h-4.5 text-brand-accent" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-brand-primary block leading-none">ECOCLEAN</span>
              <span className="text-[9px] text-gray-400 font-mono tracking-widest uppercase font-semibold block mt-0.5">Operations</span>
            </div>
          </div>

          {/* User profile capsule */}
          <div className="bg-gray-50 border border-gray-100 p-3.5 rounded-2xl flex items-center gap-3">
            <AuthenticatedAvatar user={user} className="w-9 h-9" textClassName="text-xs"/>
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-800 truncate leading-none">{user?.fullName}</p>
              <p className="text-[10px] text-brand-primary font-bold font-mono tracking-wider uppercase mt-1 leading-none">{user?.roleLabel||'Staff'}{user?.municipality?` • ${user.municipality}`:''}</p>
            </div>
          </div>

          {/* Navigation link menu items */}
          <nav className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block px-3 mb-2 font-mono">Workspace Menu</span>
            {navLinks.map((link) => {
              const LinkIcon = link.icon;
              const isSelected = activeTab === link.id || 
                                 (link.id === 'tasks' && (activeTab === 'task-details' || activeTab === 'task-execute'));

              return (
                <button
                  key={link.id}
                  onClick={() => handleTabChange(link.id)}
                  className={`w-full text-left text-xs font-bold px-3 py-2.5 rounded-xl flex items-center justify-between transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/10'
                      : 'text-gray-500 hover:text-brand-primary hover:bg-emerald-50/10'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <LinkIcon className="w-4 h-4 shrink-0" />
                    <span>{link.label}</span>
                  </span>
                  {link.badgeCount !== undefined && link.badgeCount > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                      isSelected ? 'bg-white text-brand-primary' : 'bg-red-500 text-white'
                    }`}>
                      {link.badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer details */}
        <div className="pt-6 border-t border-gray-100 space-y-2">
          {onBackToSelection && (
            <button 
              onClick={onBackToSelection}
              className="w-full text-left text-xs font-bold text-brand-primary hover:text-brand-secondary transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-brand-accent/10 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Workspace Picker</span>
            </button>
          )}
          <button 
            onClick={onLogout}
            className="w-full text-left text-xs font-bold text-gray-400 hover:text-brand-error transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* 2. MOBILE HEADER BAR */}
      <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3.5 flex items-center justify-between shrink-0 relative z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-brand-primary rounded-lg flex items-center justify-center text-white">
            <Layers className="w-4 h-4 text-brand-accent" />
          </div>
          <div>
            <span className="font-extrabold text-xs tracking-tight text-brand-primary block leading-none">ECOCLEAN SL</span>
            <span className="text-[8px] text-gray-400 font-mono tracking-wider uppercase leading-none block mt-0.5">Staff Ops</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Unread Bell Notification Trigger */}
          <button
            onClick={() => handleTabChange('notifications')}
            className="p-2 bg-gray-50 border border-gray-150 rounded-lg relative cursor-pointer"
          >
            <Bell className="w-4.5 h-4.5 text-gray-500" />
            {notifications.some(n => !n.read) && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            )}
          </button>

          {/* Menu triggers drawer */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 bg-gray-50 border border-gray-150 rounded-lg text-gray-600 focus:outline-none cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* 3. MOBILE DRAWER NAVIGATION MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-20 flex" id="mobile-navigation-menu">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          
          <div className="relative bg-white w-64 max-w-xs h-full flex flex-col justify-between p-5 shadow-2xl relative z-10 animate-slide-in-left">
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-400 font-mono">ECOCLEAN STAFF</span>
                <button onClick={() => setMobileMenuOpen(false)} className="cursor-pointer">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <nav className="space-y-1">
                {navLinks.map((link) => {
                  const LinkIcon = link.icon;
                  const isSelected = activeTab === link.id || 
                                     (link.id === 'tasks' && (activeTab === 'task-details' || activeTab === 'task-execute'));

                  return (
                    <button
                      key={link.id}
                      onClick={() => handleTabChange(link.id)}
                      className={`w-full text-left text-xs font-bold px-3 py-2.5 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-brand-primary text-white shadow-md'
                          : 'text-gray-500 hover:text-brand-primary hover:bg-emerald-50/10'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <LinkIcon className="w-4 h-4 shrink-0" />
                        <span>{link.label}</span>
                      </span>
                      {link.badgeCount !== undefined && link.badgeCount > 0 && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                          isSelected ? 'bg-white text-brand-primary' : 'bg-red-500 text-white'
                        }`}>
                          {link.badgeCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-2">
              <button 
                onClick={onBackToSelection}
                className="w-full text-left text-xs font-bold text-brand-primary hover:text-brand-secondary flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-brand-accent/10"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Workspace Picker</span>
              </button>
              <button 
                onClick={onLogout}
                className="w-full text-left text-xs font-bold text-gray-400 hover:text-brand-error flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. PRIMARY WINDOW VIEW SWITCHER */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-24 md:pb-8">
        
        {/* Dynamic tab contents switch */}
        {activeTab === 'dashboard' && (
          <StaffDashboard 
            user={user}
            tasks={tasks}
            schedules={schedules}
            notifications={notifications}
            performance={performance || DEFAULT_STAFF_PERFORMANCE}
            onNavigateTab={(t) => handleTabChange(t)}
            onExecuteTask={handleExecuteTask}
          />
        )}

        {activeTab === 'tasks' && (
          <AssignedTasks 
            tasks={tasks}
            onSelectTask={handleSelectTask}
            onExecuteTask={handleExecuteTask}
          />
        )}

        {activeTab === 'task-details' && (
          <TaskDetails 
            task={activeTaskDetails}
            onBackToList={() => handleTabChange('tasks')}
            onExecuteTask={handleExecuteTask}
            onAcceptTask={handleAcceptTask}
            onRejectTask={handleRejectTask}
          />
        )}

        {activeTab === 'task-execute' && (
          <TaskExecution 
            task={activeTaskDetails}
            onBackToDetails={() => handleTabChange('task-details')}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        {activeTab === 'routes' && (
          <RouteManagement 
            tasks={tasks}
            onExecuteTask={handleExecuteTask}
          />
        )}

        {activeTab === 'evidence' && (
          <EvidenceManagement 
            tasks={tasks}
            onUploadGeneralEvidence={handleUploadGeneralEvidence}
          />
        )}

        {activeTab === 'schedule' && (
          <StaffScheduleView 
            schedules={schedules}
            onSyncSchedules={handleSyncSchedules}
          />
        )}

        {activeTab === 'notifications' && (
          <StaffNotifications 
            notifications={notifications}
            onMarkRead={handleMarkRead}
            onMarkAllRead={handleMarkAllRead}
            onDeleteNotification={handleDeleteNotification}
            onExecuteTask={handleExecuteTask}
            onReply={(id)=>{const body=window.prompt('Reply to your Supervisor');if(body?.trim())void notificationService.reply(id,body.trim()).then(()=>alert('Reply sent to Supervisor.')).catch(error=>alert(error instanceof Error?error.message:'Reply failed.'));}}
          />
        )}

        {activeTab === 'profile' && (
          <StaffProfile 
            user={user}
            onUpdateUser={handleUpdateUser}
            onLogout={onLogout}
            onBackToSelection={onBackToSelection}
          />
        )}

        {activeTab === 'performance' && performance && (
          <StaffPerformanceView 
            performance={performance}
          />
        )}
        {activeTab === 'service-center' && <ServiceCenter user={user} />}

      </main>

    </div>
  );
}
