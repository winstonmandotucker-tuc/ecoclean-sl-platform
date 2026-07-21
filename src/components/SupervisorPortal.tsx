import React, { useState, useEffect } from 'react';
import { operationalStore } from '../lib/operationalStore';
import ServiceCenter from './service/ServiceCenter';
import { 
  Layers, MessageSquare, CheckSquare, Users, Map, Bell, 
  Activity, Camera, Building, User, Menu, X, ArrowLeft, LogOut, ChevronRight,
  Truck, Trash2, Shield
} from 'lucide-react';
import { User as UserType } from '../types';
import AuthenticatedAvatar from './AuthenticatedAvatar';
import { Report, DEFAULT_REPORTS } from '../lib/citizenData';
import { StaffTask, DEFAULT_STAFF_TASKS } from '../lib/staffData';

import {
  FleetManagementView,
  SmartBinView,
  DisasterResponseView
} from './modules/EnterpriseModules';

// Import supervisor child components
import SupervisorDashboard from './supervisor/SupervisorDashboard';
import ReportReviewCenter from './supervisor/ReportReviewCenter';
import TaskAssignmentCenter from './supervisor/TaskAssignmentCenter';
import StaffManagement from './supervisor/StaffManagement';
import LiveOperationsMonitor from './supervisor/LiveOperationsMonitor';
import SLAMonitoring from './supervisor/SLAMonitoring';
import VerificationCenter from './supervisor/VerificationCenter';
import MunicipalityPerformance from './supervisor/MunicipalityPerformance';
import SupervisorNotifications from './supervisor/SupervisorNotifications';
import SupervisorProfile from './supervisor/SupervisorProfile';
import { authService, notificationService, reportService, staffDirectoryService, taskService } from '../lib/services';

// Import supervisor defaults
import { 
  DEFAULT_FIELD_STAFF, DEFAULT_SUPERVISOR_NOTIFICATIONS, DEFAULT_REGION_PERFORMANCE,
  FieldStaff, SupervisorNotification, RegionPerformance
} from '../lib/supervisorData';

interface SupervisorPortalProps {
  user: UserType | null;
  onBackToSelection?: () => void;
  onLogout: () => void;
}

type SupervisorTab = 
  | 'dashboard' 
  | 'reports' 
  | 'assignments' 
  | 'staff' 
  | 'operations' 
  | 'sla' 
  | 'verification' 
  | 'performance' 
  | 'notifications' 
  | 'profile'
  | 'fleet'
  | 'smart-bins'
  | 'disaster'
  | 'service-center';

export default function SupervisorPortal({ user, onBackToSelection, onLogout }: SupervisorPortalProps) {
  const [activeTab, setActiveTab] = useState<SupervisorTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core Persistent States
  const [reports, setReports] = useState<Report[]>([]);
  const [tasks, setTasks] = useState<StaffTask[]>([]);
  const [staff, setStaff] = useState<FieldStaff[]>([]);
  const [notifications, setNotifications] = useState<SupervisorNotification[]>([]);
  const [regions, setRegions] = useState<RegionPerformance[]>([]);

  // Load and seed datasets from LocalStorage
  useEffect(() => {
    try {
      // 1. Reports (Load shared or defaults)
      const storedReports = operationalStore.getItem('ecoclean_reports');
      if (storedReports) {
        setReports(JSON.parse(storedReports));
      } else {
        setReports(DEFAULT_REPORTS);
        operationalStore.setItem('ecoclean_reports', JSON.stringify(DEFAULT_REPORTS));
      }

      // 2. Tasks (Load shared or defaults)
      const storedTasks = operationalStore.getItem('ecoclean_staff_tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      } else {
        setTasks(DEFAULT_STAFF_TASKS);
        operationalStore.setItem('ecoclean_staff_tasks', JSON.stringify(DEFAULT_STAFF_TASKS));
      }

      // 3. Field Staff
      const storedStaff = operationalStore.getItem('ecoclean_supervisor_staff');
      if (storedStaff) {
        setStaff(JSON.parse(storedStaff));
      } else {
        setStaff(DEFAULT_FIELD_STAFF);
        operationalStore.setItem('ecoclean_supervisor_staff', JSON.stringify(DEFAULT_FIELD_STAFF));
      }

      // 4. Notifications
      const storedNotifs = operationalStore.getItem('ecoclean_supervisor_notifications');
      if (storedNotifs) {
        setNotifications(JSON.parse(storedNotifs));
      } else {
        setNotifications(DEFAULT_SUPERVISOR_NOTIFICATIONS);
        operationalStore.setItem('ecoclean_supervisor_notifications', JSON.stringify(DEFAULT_SUPERVISOR_NOTIFICATIONS));
      }

      // 5. Region Performance
      const storedRegions = operationalStore.getItem('ecoclean_supervisor_regions');
      if (storedRegions) {
        setRegions(JSON.parse(storedRegions));
      } else {
        setRegions(DEFAULT_REGION_PERFORMANCE);
        operationalStore.setItem('ecoclean_supervisor_regions', JSON.stringify(DEFAULT_REGION_PERFORMANCE));
      }

    } catch (e) {
      console.error('Error seeding supervisor portal state:', e);
    }
  }, []);

  useEffect(()=>{
    void Promise.all([reportService.list(),staffDirectoryService.list()]).then(([reportResponse,staffResponse])=>{
      setReports(reportResponse.data.map((item:any)=>({id:String(item.id),referenceNumber:item.reference,title:item.title,description:item.description,category:item.category,priority:(item.priority?.[0]?.toUpperCase()+item.priority?.slice(1))||'Medium',status:String(item.status||'pending').split('_').map((word:string)=>word[0]?.toUpperCase()+word.slice(1)).join(' '),date:String(item.created_at||'').slice(0,10),location:item.address||'Location not supplied',district:item.district||'',municipality:item.municipality||'',ward:item.ward||'',zone:item.zone||'',photos:[],gps:{lat:Number(item.latitude),lng:Number(item.longitude)}})));
      setStaff(staffResponse.data.map((item:any)=>({id:String(item.id),name:item.name,role:'Collector',status:'Active',vessel:'Unassigned',phone:item.phone||'Not supplied',district:item.district||'',municipality:item.municipality||'',rating:0,completedTasks:0,fuelBalance:'N/A',gps:{lat:0,lng:0}})));
    }).catch(error=>console.error('Unable to load live supervisor operations.',error));
  },[]);

  // Save states helper
  const saveReportsState = (newReports: Report[]) => {
    setReports(newReports);
    operationalStore.setItem('ecoclean_reports', JSON.stringify(newReports));
  };

  const saveTasksState = (newTasks: StaffTask[]) => {
    setTasks(newTasks);
    operationalStore.setItem('ecoclean_staff_tasks', JSON.stringify(newTasks));
  };

  const saveStaffState = (newStaff: FieldStaff[]) => {
    setStaff(newStaff);
    operationalStore.setItem('ecoclean_supervisor_staff', JSON.stringify(newStaff));
  };

  const saveNotificationsState = (newNotifs: SupervisorNotification[]) => {
    setNotifications(newNotifs);
    operationalStore.setItem('ecoclean_supervisor_notifications', JSON.stringify(newNotifs));
  };

  const handleTabChange = (tab: SupervisorTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Assign Report Callback
  const handleAssignReport = async (
    reportId: string, 
    staffId: string, 
    priority: 'Low' | 'Medium' | 'High', 
    notesText: string, 
    fuelCode: string
  ) => {
    const selectedStaff = staff.find(s => s.id === staffId);
    const selectedRep = reports.find(r => r.id === reportId);
    if (!selectedStaff || !selectedRep) return;

    let persistedTask:any;
    try {
      const response=await taskService.create({reportId:Number(reportId),assignedTo:Number(staffId),title:`Dispatch: ${selectedRep.title}`,description:notesText,priority:priority.toLowerCase(),dueAt:new Date(Date.now()+(priority==='High'?8:24)*60*60*1000).toISOString()});
      persistedTask=response.data;
    } catch (error) {
      alert(error instanceof Error?error.message:'The assignment could not be saved.');
      return;
    }

    // A. Update the view after MariaDB confirms the assignment.
    const updatedReports = reports.map(r => {
      if (r.id === reportId) {
        return {
          ...r,
          status: 'Assigned' as const,
          assignedTeam: `${selectedStaff.name} (Vessel: ${selectedStaff.vessel})`
        };
      }
      return r;
    });
    saveReportsState(updatedReports);

    // B. Generate and insert new staff task to staff tasks list (synchronized live)
    const newTaskId = String(persistedTask.id);
    const newStaffTask: StaffTask = {
      id: newTaskId,
      referenceNumber: persistedTask.reference||selectedRep.referenceNumber,
      title: `Dispatch: ${selectedRep.title}`,
      category: selectedRep.category,
      description: selectedRep.description,
      location: selectedRep.location,
      district: selectedRep.district,
      municipality: selectedRep.municipality,
      ward: selectedRep.ward || 'Ward 301',
      zone: selectedRep.zone || 'Zone 1',
      priority,
      status: 'Assigned' as const,
      date: new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString().slice(0, 5),
      deadline: priority === 'High' ? 'Today, 15:00' : 'Tomorrow, 12:00',
      photosBefore: selectedRep.photos || [],
      photosAfter: [],
      gps: { lat: selectedRep.gps.lat, lng: selectedRep.gps.lng, x: 25, y: 55 },
      assignedSupervisor: selectedStaff.name,
      notes: [notesText, `Fuel allowance allocated code: ${fuelCode}`],
      fuelEstimate: fuelCode ? '20 Liters' : undefined,
      vesselNo: selectedStaff.vessel
    };

    saveTasksState([newStaffTask, ...tasks]);

    // C. Update field staff active task pointer
    const updatedStaff = staff.map(s => {
      if (s.id === staffId) {
        return {
          ...s,
          status: 'On Duty' as const,
          activeTaskId: newTaskId
        };
      }
      return s;
    });
    saveStaffState(updatedStaff);

    // D. Pushes live notification to staff terminal
    const storedStaffNotifs = operationalStore.getItem('ecoclean_staff_notifications');
    let staffNotifs = [];
    if (storedStaffNotifs) staffNotifs = JSON.parse(storedStaffNotifs);
    
    const newStaffNotification = {
      id: `SN-${Math.floor(100 + Math.random() * 900)}`,
      title: 'Urgent Dispatch Assignment',
      body: `Supervisor Kamara assigned Task ${newTaskId} to your vessel. Priority: ${priority}. Deadline: Today. Fuel approved.`,
      date: 'Just Now',
      type: 'New Assignment' as const,
      read: false,
      taskId: newTaskId
    };
    operationalStore.setItem('ecoclean_staff_notifications', JSON.stringify([newStaffNotification, ...staffNotifs]));

    // E. Add audit supervisor notification log
    const newSupNotif: SupervisorNotification = {
      id: `SVN-${Math.floor(100 + Math.random() * 900)}`,
      title: 'Dispatch Task Created',
      body: `Dispatched ${selectedStaff.name} (${selectedStaff.vessel}) for clearing ${selectedRep.title}. Ref: ${selectedRep.referenceNumber}`,
      date: 'Just Now',
      type: 'System Message',
      read: false,
      referenceId: newTaskId
    };
    saveNotificationsState([newSupNotif, ...notifications]);
  };

  // 2. Communicate Message Callback
  const handleSendMessageToStaff = (staffId: string, message: string) => {
    const selectedStaff = staff.find(s => s.id === staffId);
    if (!selectedStaff) return;

    // Pushes message notification directly to operator's console
    const storedStaffNotifs = operationalStore.getItem('ecoclean_staff_notifications');
    let staffNotifs = [];
    if (storedStaffNotifs) staffNotifs = JSON.parse(storedStaffNotifs);
    
    const newStaffNotification = {
      id: `SN-${Math.floor(100 + Math.random() * 900)}`,
      title: 'Instruction from Control Center',
      body: message,
      date: 'Just Now',
      type: 'Supervisor Message' as const,
      read: false
    };
    operationalStore.setItem('ecoclean_staff_notifications', JSON.stringify([newStaffNotification, ...staffNotifs]));

    // Log supervisor warning audit trace
    const newSupNotif: SupervisorNotification = {
      id: `SVN-${Math.floor(100 + Math.random() * 900)}`,
      title: 'Dispatch Msg Transmitted',
      body: `Control message dispatched to ${selectedStaff.name}: "${message.slice(0, 40)}..."`,
      date: 'Just Now',
      type: 'System Message',
      read: false
    };
    saveNotificationsState([newSupNotif, ...notifications]);
  };

  // 3. Update staff vessel serial
  const handleUpdateStaffVessel = (staffId: string, newVessel: string) => {
    const updated = staff.map(s => s.id === staffId ? { ...s, vessel: newVessel } : s);
    saveStaffState(updated);
  };

  // 4. Reassign Task
  const handleReassignTask = (taskId: string, newStaffId: string) => {
    const selectedStaff = staff.find(s => s.id === newStaffId);
    if (!selectedStaff) return;

    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          assignedSupervisor: selectedStaff.name,
          vesselNo: selectedStaff.vessel,
          notes: [`Task reassigned to ${selectedStaff.name} by Supervisor.`, ...t.notes]
        };
      }
      return t;
    });
    saveTasksState(updatedTasks);
  };

  // 5. Update Task Deadline
  const handleUpdateDeadline = (taskId: string, newDeadline: string) => {
    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          deadline: newDeadline,
          notes: [`Deadline extended to ${newDeadline} by Supervisor.`, ...t.notes]
        };
      }
      return t;
    });
    saveTasksState(updatedTasks);
  };

  // 6. Expedite Task Alert
  const handleExpediteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Send urgent reminder to operator
    const storedStaffNotifs = operationalStore.getItem('ecoclean_staff_notifications');
    let staffNotifs = [];
    if (storedStaffNotifs) staffNotifs = JSON.parse(storedStaffNotifs);
    
    const newStaffNotification = {
      id: `SN-${Math.floor(100 + Math.random() * 900)}`,
      title: '🚨 EXTREME URGENT: Expedite Dispatch',
      body: `Supervisor Kamara has triggered an urgent speed warning for Task ${taskId}. Deadline approaches!`,
      date: 'Just Now',
      type: 'System Alert' as const,
      read: false,
      taskId
    };
    operationalStore.setItem('ecoclean_staff_notifications', JSON.stringify([newStaffNotification, ...staffNotifs]));

    const newSupNotif: SupervisorNotification = {
      id: `SVN-${Math.floor(100 + Math.random() * 900)}`,
      title: 'Expedite Command Pushed',
      body: `Expedite warning signal successfully transmitted to crew leader ${task.assignedSupervisor}.`,
      date: 'Just Now',
      type: 'SLA Alert',
      read: false,
      referenceId: taskId
    };
    saveNotificationsState([newSupNotif, ...notifications]);
  };

  // 7. Approve Quality Verification
  const handleApproveVerification = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // A. Update Task status
    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'Completed' as const,
          notes: ['Quality inspection APPROVED by supervisor. Case formal closure.', ...t.notes]
        };
      }
      return t;
    });
    saveTasksState(updatedTasks);

    // B. Find associated citizen report and close it too
    const updatedReports = reports.map(r => {
      if (r.referenceNumber === task.referenceNumber || r.id === task.id.replace('T-', 'R-')) {
        return {
          ...r,
          status: 'Completed' as const
        };
      }
      return r;
    });
    saveReportsState(updatedReports);

    // C. Update citizen reward points and post notice
    const storedCitizenNotifs = operationalStore.getItem('ecoclean_notifications');
    let citizenNotifs = [];
    if (storedCitizenNotifs) citizenNotifs = JSON.parse(storedCitizenNotifs);

    const newCitizenNotif = {
      id: `nt-${Math.floor(100 + Math.random() * 900)}`,
      title: 'Report Verified & Completed!',
      body: `Your reported waste incident ${task.referenceNumber} has been verified clean by Municipal Inspectors. +50 Civic Points credited!`,
      date: 'Just Now',
      type: 'Report Update' as const,
      read: false,
      reportId: task.referenceNumber
    };
    operationalStore.setItem('ecoclean_notifications', JSON.stringify([newCitizenNotif, ...citizenNotifs]));

    // D. Update staff metrics
    const updatedStaff = staff.map(s => {
      if (s.name === task.assignedSupervisor) {
        return {
          ...s,
          status: 'Active' as const, // return to idle standby
          completedTasks: s.completedTasks + 1,
          rating: Math.min(5.0, Number((s.rating + 0.05).toFixed(2)))
        };
      }
      return s;
    });
    saveStaffState(updatedStaff);

    // E. Send supervisor congratulations log
    const newSupNotif: SupervisorNotification = {
      id: `SVN-${Math.floor(100 + Math.random() * 900)}`,
      title: 'Task Formally Closed',
      body: `Completed audit review. Incidents ${task.referenceNumber} has been marked verified on citizen portal map.`,
      date: 'Just Now',
      type: 'System Message',
      read: false,
      referenceId: taskId
    };
    saveNotificationsState([newSupNotif, ...notifications]);
  };

  // 8. Reject Quality Verification
  const handleRejectVerification = (taskId: string, feedback: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // A. Put task back to "In Progress"
    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'In Progress' as const,
          notes: [`Supervisor audit REJECTED: "${feedback}". Re-execution dispatch.`, ...t.notes]
        };
      }
      return t;
    });
    saveTasksState(updatedTasks);

    // B. Send decline notice to operator's terminal
    const storedStaffNotifs = operationalStore.getItem('ecoclean_staff_notifications');
    let staffNotifs = [];
    if (storedStaffNotifs) staffNotifs = JSON.parse(storedStaffNotifs);
    
    const newStaffNotification = {
      id: `SN-${Math.floor(100 + Math.random() * 900)}`,
      title: 'Quality Verification DECLINED',
      body: `Task ${taskId} is returned to In Progress state. Reason: ${feedback}`,
      date: 'Just Now',
      type: 'Supervisor Message' as const,
      read: false,
      taskId
    };
    operationalStore.setItem('ecoclean_staff_notifications', JSON.stringify([newStaffNotification, ...staffNotifs]));
  };

  // 9. Send Broadcast Alert to all cells
  const handleSendBroadcast = (alertMsg: string) => {
    // Pushes broadcast alerts to both citizen notifications and staff notifications
    const storedCitizenNotifs = operationalStore.getItem('ecoclean_notifications');
    let citizenNotifs = [];
    if (storedCitizenNotifs) citizenNotifs = JSON.parse(storedCitizenNotifs);

    const newCitizenNotif = {
      id: `nt-${Math.floor(100 + Math.random() * 900)}`,
      title: '🚨 Municipal Safety Alert',
      body: alertMsg,
      date: 'Just Now',
      type: 'Environmental Alert' as const,
      read: false
    };
    operationalStore.setItem('ecoclean_notifications', JSON.stringify([newCitizenNotif, ...citizenNotifs]));

    const storedStaffNotifs = operationalStore.getItem('ecoclean_staff_notifications');
    let staffNotifs = [];
    if (storedStaffNotifs) staffNotifs = JSON.parse(storedStaffNotifs);
    
    const newStaffNotification = {
      id: `SN-${Math.floor(100 + Math.random() * 900)}`,
      title: '🚨 HQ Operational Alert',
      body: alertMsg,
      date: 'Just Now',
      type: 'Environmental Alert' as const,
      read: false
    };
    operationalStore.setItem('ecoclean_staff_notifications', JSON.stringify([newStaffNotification, ...staffNotifs]));
  };

  // 10. Dispatch Fast Standby Crew
  const handleDispatchFastCrew = (category: string) => {
    // Find first Active (idle) staff member
    const standbyStaff = staff.find(s => s.status === 'Active');
    if (!standbyStaff) {
      alert('Error: All operations crews are currently On Duty. Please re-route active tasks.');
      return;
    }

    // A. Generate fake urgent report
    const newReportId = `R-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRep: Report = {
      id: newReportId,
      referenceNumber: `EC-SL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `Urgent Clearance: ${category}`,
      category,
      description: 'System-generated fast response dispatch. Standard clearance requested by supervisor central command.',
      location: 'Main Bypass Sector, Freetown',
      district: 'Western Area Urban',
      municipality: 'Freetown City Council (FCC)',
      ward: 'Ward 301',
      zone: 'Zone 1 (Aberdeen)',
      priority: 'High',
      status: 'In Progress',
      date: new Date().toISOString().split('T')[0],
      photos: [],
      gps: { lat: 8.4842, lng: -13.2514 },
      assignedTeam: standbyStaff.name
    };
    saveReportsState([newRep, ...reports]);

    // B. Trigger dispatch assigning automatically
    handleAssignReport(newRep.id, standbyStaff.id, 'High', 'Emergency rapid cleanup task authorized.', 'SL-FUL-AUTO');
    alert(`Standby Vessel ${standbyStaff.vessel} (${standbyStaff.name}) has been dispatched immediately!`);
  };

  const handleMarkNotificationRead = (id: string) => {
    void notificationService.markRead(Number(id));
    saveNotificationsState(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllNotificationsRead = () => {
    void notificationService.markAllRead();
    saveNotificationsState(notifications.map(n => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (id: string) => {
    void notificationService.remove(id);
    saveNotificationsState(notifications.filter(n => n.id !== id));
  };

  // Notification action click -> navigate tab and trigger view
  const handleNotificationActionClick = (type: string, referenceId?: string) => {
    if (type === 'Verification Request' || type === 'SLA Alert') {
      handleTabChange('verification');
    } else if (type === 'New Report') {
      handleTabChange('reports');
    } else {
      handleTabChange('assignments');
    }
  };

  // Active Sidebar Links List
  const navLinks = [
    { id: 'dashboard' as const, label: 'Control Overview', icon: Layers },
    { id: 'reports' as const, label: 'Report Review', icon: MessageSquare, badgeCount: reports.filter(r => r.status === 'Pending').length },
    { id: 'assignments' as const, label: 'Crew Assignments', icon: CheckSquare },
    { id: 'staff' as const, label: 'Crew Roster', icon: Users },
    { id: 'operations' as const, label: 'Live GIS Monitor', icon: Map },
    { id: 'fleet' as const, label: 'Fleet & Vessels', icon: Truck },
    { id: 'smart-bins' as const, label: 'Smart Bins (IoT)', icon: Trash2 },
    { id: 'disaster' as const, label: 'Disaster Response', icon: Shield },
    { id: 'sla' as const, label: 'SLA Performance', icon: Activity },
    { id: 'verification' as const, label: 'Quality Verification', icon: Camera, badgeCount: tasks.filter(t => t.status === 'Verification Pending').length },
    { id: 'performance' as const, label: 'Municipality Performance', icon: Building },
    { id: 'notifications' as const, label: 'Alert Command', icon: Bell, badgeCount: notifications.filter(n => !n.read).length },
    { id: 'service-center' as const, label: 'Service Center', icon: MessageSquare },
    { id: 'profile' as const, label: 'My Profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex flex-col md:flex-row font-sans selection:bg-brand-accent selection:text-brand-primary">
      
      {/* 1. SIDEBAR - PERSISTENT ON DESKTOP */}
      <aside className="hidden md:flex md:w-64 bg-white border-r border-gray-200/80 p-6 flex-col justify-between shrink-0 h-screen sticky top-0">
        <div className="space-y-8 overflow-y-auto pr-1">
          
          {/* Logo brand */}
          <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white">
              <Layers className="w-4.5 h-4.5 text-brand-accent" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-brand-primary block leading-none">ECOCLEAN</span>
              <span className="text-[9px] text-gray-400 font-mono tracking-widest uppercase font-semibold block mt-0.5">Control HQ</span>
            </div>
          </div>

          {/* User profile capsule */}
          <div className="bg-gray-50 border border-gray-100 p-3.5 rounded-2xl flex items-center gap-3">
            <AuthenticatedAvatar user={user} className="w-9 h-9" textClassName="text-xs"/>
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-800 truncate leading-none">{user?.fullName}</p>
              <p className="text-[10px] text-brand-primary font-bold font-mono tracking-wider uppercase mt-1 leading-none">{user?.roleLabel||'Supervisor'}{user?.municipality?` • ${user.municipality}`:''}</p>
            </div>
          </div>

          {/* Navigation link menu items */}
          <nav className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block px-3 mb-2 font-mono">Operations Deck</span>
            {navLinks.map((link) => {
              const LinkIcon = link.icon;
              const isSelected = activeTab === link.id;

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

        {/* Sidebar Footer */}
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
      <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3.5 flex items-center justify-between shrink-0 relative z-35">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-brand-primary rounded-lg flex items-center justify-center text-white">
            <Layers className="w-4 h-4 text-brand-accent" />
          </div>
          <div>
            <span className="font-extrabold text-xs tracking-tight text-brand-primary block leading-none">ECOCLEAN SL</span>
            <span className="text-[8px] text-gray-400 font-mono tracking-wider uppercase leading-none block mt-0.5">Control HQ</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Unread Bell notifications */}
          <button
            onClick={() => handleTabChange('notifications')}
            className="p-2 bg-gray-50 border border-gray-150 rounded-lg relative cursor-pointer"
          >
            <Bell className="w-4.5 h-4.5 text-gray-500" />
            {notifications.some(n => !n.read) && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            )}
          </button>

          {/* Menu triggers */}
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
        <div className="md:hidden fixed inset-0 z-20 flex" id="mobile-supervisor-navigation">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          
          <div className="relative bg-white w-64 max-w-xs h-full flex flex-col justify-between p-5 shadow-2xl relative z-10 animate-slide-in-left">
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-400 font-mono">ECOCLEAN CONTROL</span>
                <button onClick={() => setMobileMenuOpen(false)} className="cursor-pointer">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <nav className="space-y-1">
                {navLinks.map((link) => {
                  const LinkIcon = link.icon;
                  const isSelected = activeTab === link.id;

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
                className="w-full text-left text-xs font-bold text-brand-primary hover:text-brand-secondary flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-brand-accent/10 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Workspace Picker</span>
              </button>
              <button 
                onClick={onLogout}
                className="w-full text-left text-xs font-bold text-gray-400 hover:text-brand-error flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-red-50 cursor-pointer"
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
        
        {activeTab === 'dashboard' && (
          <SupervisorDashboard 
            user={user}
            reports={reports}
            tasks={tasks}
            staff={staff}
            regions={regions}
            onNavigateTab={(t) => handleTabChange(t)}
            onDispatchFastCrew={handleDispatchFastCrew}
            onSendBroadcast={handleSendBroadcast}
          />
        )}

        {activeTab === 'reports' && (
          <ReportReviewCenter 
            reports={reports}
            staff={staff}
            onAssignReport={handleAssignReport}
          />
        )}

        {activeTab === 'assignments' && (
          <TaskAssignmentCenter 
            tasks={tasks}
            staff={staff}
            onReassignTask={handleReassignTask}
            onUpdateDeadline={handleUpdateDeadline}
          />
        )}

        {activeTab === 'staff' && (
          <StaffManagement 
            staff={staff}
            onSendMessageToStaff={handleSendMessageToStaff}
            onUpdateStaffVessel={handleUpdateStaffVessel}
          />
        )}

        {activeTab === 'operations' && (
          <LiveOperationsMonitor 
            staff={staff}
          />
        )}

        {activeTab === 'sla' && (
          <SLAMonitoring 
            tasks={tasks}
            onExpediteTask={handleExpediteTask}
          />
        )}

        {activeTab === 'verification' && (
          <VerificationCenter 
            tasks={tasks}
            onApproveVerification={handleApproveVerification}
            onRejectVerification={handleRejectVerification}
          />
        )}

        {activeTab === 'performance' && (
          <MunicipalityPerformance 
            regions={regions}
          />
        )}

        {activeTab === 'notifications' && (
          <SupervisorNotifications 
            notifications={notifications}
            onMarkRead={handleMarkNotificationRead}
            onMarkAllRead={handleMarkAllNotificationsRead}
            onDeleteNotification={handleDeleteNotification}
            onActionClick={handleNotificationActionClick}
          />
        )}

        {activeTab === 'profile' && (
          <SupervisorProfile 
            user={user}
            onUpdateUser={(updated)=>{void authService.updateProfile(updated);}}
            onLogout={onLogout}
            onBackToSelection={onBackToSelection}
          />
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
        {activeTab === 'service-center' && <ServiceCenter user={user} />}
      </main>

    </div>
  );
}
