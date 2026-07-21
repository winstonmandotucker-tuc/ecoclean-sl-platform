import React, { useState, useEffect } from 'react';
import { operationalStore } from '../lib/operationalStore';
import { authService, notificationService, reportService, uploadService } from '../lib/services';
import { mediaUrl } from '../lib/api';
import { 
  Users, Calendar, Bell, User, LayoutDashboard, PlusCircle, FileText, Award, 
  ArrowLeft, LogOut, Menu, X, Layers, AlertTriangle, Clock, HelpCircle, ChevronRight, Map
} from 'lucide-react';
import { User as UserType } from '../types';

// Import sub components
import CitizenDashboard from './citizen/CitizenDashboard';
import ReportWaste from './citizen/ReportWaste';
import ReportSuccess from './citizen/ReportSuccess';
import MyReports from './citizen/MyReports';
import ReportDetails from './citizen/ReportDetails';
import CollectionSchedules from './citizen/CollectionSchedules';
import NotificationsList from './citizen/NotificationsList';
import CommunityHub from './citizen/CommunityHub';
import RewardsStore from './citizen/RewardsStore';
import ProfileSettings from './citizen/ProfileSettings';
import CitizenReportMap from './citizen/CitizenReportMap';
import ServiceCenter from './service/ServiceCenter';

// Default mock data seeders
import { 
  DEFAULT_REPORTS, DEFAULT_NOTIFICATIONS, DEFAULT_EVENTS, DEFAULT_BADGES, DEFAULT_LEADERBOARD,
  Report, Notification, CommunityEvent, Badge, LeaderboardUser 
} from '../lib/citizenData';

import {
  CommunityEngagementView,
  KnowledgeHubView
} from './modules/EnterpriseModules';

interface CitizenPortalProps {
  user: UserType | null;
  onBackToSelection?: () => void;
  onLogout: () => void;
}

type CitizenTab = 
  | 'dashboard' 
  | 'report' 
  | 'report-map'
  | 'success' 
  | 'reports' 
  | 'report-details' 
  | 'schedules' 
  | 'notifications' 
  | 'community' 
  | 'rewards' 
  | 'profile'
  | 'volunteers'
  | 'knowledge'
  | 'service-center';

export default function CitizenPortal({ user, onBackToSelection, onLogout }: CitizenPortalProps) {
  // Mobile menu control
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<CitizenTab>('dashboard');

  // Core Reactive States (synced with LocalStorage)
  const [reports, setReports] = useState<Report[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [userPoints, setUserPoints] = useState<number>(280);

  // Detail & success helpers
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [justSubmittedRef, setJustSubmittedRef] = useState<string>('EC-SL-2026-0000');

  // Load and seed initial states
  useEffect(() => {
    try {
      // 1. Reports
      const storedReports = operationalStore.getItem('ecoclean_citizen_reports');
      if (storedReports) {
        setReports(JSON.parse(storedReports));
      } else {
        setReports(DEFAULT_REPORTS);
        operationalStore.setItem('ecoclean_citizen_reports', JSON.stringify(DEFAULT_REPORTS));
      }

      // 2. Notifications
      const storedNotifs = operationalStore.getItem('ecoclean_citizen_notifications');
      if (storedNotifs) {
        setNotifications(JSON.parse(storedNotifs));
      } else {
        setNotifications(DEFAULT_NOTIFICATIONS);
        operationalStore.setItem('ecoclean_citizen_notifications', JSON.stringify(DEFAULT_NOTIFICATIONS));
      }

      // 3. Events
      const storedEvents = operationalStore.getItem('ecoclean_citizen_events');
      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      } else {
        setEvents(DEFAULT_EVENTS);
        operationalStore.setItem('ecoclean_citizen_events', JSON.stringify(DEFAULT_EVENTS));
      }

      // 4. Badges
      const storedBadges = operationalStore.getItem('ecoclean_citizen_badges');
      if (storedBadges) {
        setBadges(JSON.parse(storedBadges));
      } else {
        setBadges(DEFAULT_BADGES);
        operationalStore.setItem('ecoclean_citizen_badges', JSON.stringify(DEFAULT_BADGES));
      }

      // 5. Points
      const storedPoints = operationalStore.getItem('ecoclean_citizen_points');
      if (storedPoints) {
        setUserPoints(parseInt(storedPoints, 10));
      } else {
        setUserPoints(280);
        operationalStore.setItem('ecoclean_citizen_points', '280');
      }

      // 6. Leaderboard
      const storedLeaderboard = operationalStore.getItem('ecoclean_citizen_leaderboard');
      if (storedLeaderboard) {
        setLeaderboard(JSON.parse(storedLeaderboard));
      } else {
        const withUser = [...DEFAULT_LEADERBOARD, { rank: 14, name: user?.fullName || '', location: user?.municipality||user?.district||'Sierra Leone', points: 280, isCurrentUser: true }];
        setLeaderboard(withUser);
        operationalStore.setItem('ecoclean_citizen_leaderboard', JSON.stringify(withUser));
      }
    } catch (e) {
      console.error('Error loading local state:', e);
    }
  }, [user]);

  useEffect(() => {
    void Promise.all([reportService.list(),notificationService.list()]).then(([reportResponse,notificationResponse])=>{
      setReports(reportResponse.data.map((row:any)=>({
        id:String(row.id),referenceNumber:row.reference,title:row.title,category:row.category,description:row.description,
        location:row.address||'Location recorded by GPS',district:'Western Area Urban',municipality:'Freetown City Council (FCC)',ward:'Assigned ward',zone:'Assigned zone',
        priority:String(row.priority||'medium').replace(/^./,(c:string)=>c.toUpperCase()),status:String(row.status||'pending').split('_').map((part:string)=>part[0].toUpperCase()+part.slice(1)).join(' '),
        date:String(row.created_at||'').slice(0,10),photos:[],gps:{lat:Number(row.latitude),lng:Number(row.longitude)},assignedTeam:row.assigned_team,
      })) as Report[]);
      setNotifications(notificationResponse.data.map((row:any)=>({id:String(row.id),title:row.title,body:row.body,date:String(row.created_at||'').slice(0,16),type:'Report Update',read:Boolean(row.read_at),reportId:row.data_json?.reportId?String(row.data_json.reportId):undefined})) as Notification[]);
    }).catch(error=>console.error('Citizen operational data load failed',error));
  }, []);

  // Sync state helpers
  const saveReportsState = (newReports: Report[]) => {
    setReports(newReports);
    operationalStore.setItem('ecoclean_citizen_reports', JSON.stringify(newReports));
  };

  const saveNotificationsState = (newNotifs: Notification[]) => {
    setNotifications(newNotifs);
    operationalStore.setItem('ecoclean_citizen_notifications', JSON.stringify(newNotifs));
  };

  const saveEventsState = (newEvents: CommunityEvent[]) => {
    setEvents(newEvents);
    operationalStore.setItem('ecoclean_citizen_events', JSON.stringify(newEvents));
  };

  const savePointsState = (newPoints: number) => {
    setUserPoints(newPoints);
    operationalStore.setItem('ecoclean_citizen_points', String(newPoints));
    
    // Update leaderboard with new points as well
    const updatedLeaderboard = leaderboard.map(u => 
      u.isCurrentUser ? { ...u, points: newPoints } : u
    ).sort((a, b) => b.points - a.points);
    
    // Recalculate rank dynamically
    const reRanked = updatedLeaderboard.map((u, idx) => ({
      ...u,
      rank: idx + 1
    }));
    
    setLeaderboard(reRanked);
    operationalStore.setItem('ecoclean_citizen_leaderboard', JSON.stringify(reRanked));
  };

  const saveBadgesState = (newBadges: Badge[]) => {
    setBadges(newBadges);
    operationalStore.setItem('ecoclean_citizen_badges', JSON.stringify(newBadges));
  };

  // 1. Submit Waste Report Action
  const handleSubmitReport = async (reportData: Omit<Report, 'id' | 'referenceNumber' | 'status' | 'date'>) => {
    const {data}=await reportService.create({
      title:reportData.title,
      description:reportData.description,
      category:reportData.category,
      latitude:reportData.gps.lat,
      longitude:reportData.gps.lng,
      address:reportData.location,
      districtName:reportData.district,
      municipalityName:reportData.municipality,
      wardName:reportData.ward,
      zoneName:reportData.zone,
    });
    const evidenceFiles:File[]=(reportData as any).evidenceFiles||[];const persistedPhotos:string[]=[];for(const file of evidenceFiles){const uploaded=await uploadService.upload('report_evidence',file,{reportId:data.id});const url=mediaUrl(uploaded.data[0].url);if(url)persistedPhotos.push(url);}
    const randomRefNum = data.reference;
    const randomId = String(data.id);
    const todayStr = new Date().toISOString().split('T')[0];

    const newReport: Report = {
      ...reportData,
      photos:persistedPhotos,
      id: randomId,
      referenceNumber: randomRefNum,
      status: 'Pending',
      date: todayStr
    };

    const updatedReports = [newReport, ...reports];
    saveReportsState(updatedReports);

    // Track ref number for success screen
    setJustSubmittedRef(randomRefNum);
    setSelectedReportId(randomId);

    // Create automated Notification update
    const newNotif: Notification = {
      id: `nt-${Math.floor(1000 + Math.random() * 9000)}`,
      title: 'Report Logged Successfully',
      body: `Your issue ${randomRefNum} has been registered and is pending SLA dispatch. Estimating 48h turn.`,
      date: 'Just Now',
      type: 'Report Update',
      read: false,
      reportId: randomId
    };
    saveNotificationsState([newNotif, ...notifications]);

    // Update Points (+20 tokens for submitting reports)
    const newPoints = userPoints + 20;
    savePointsState(newPoints);

    // Check / Award top reporter badge if submitting 3+ reports
    if (updatedReports.length >= 3) {
      const updatedBadges = badges.map(b => 
        b.id === 'bd-2' ? { ...b, earned: true, dateEarned: todayStr } : b
      );
      saveBadgesState(updatedBadges);
    }

    // Switch view to success
    setActiveTab('success');
  };

  // 2. Joining Community Events
  const handleJoinEvent = (eventId: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const updatedEvents = events.map((ev) => {
      if (ev.id === eventId && !ev.userJoined) {
        // Create automated join log
        return {
          ...ev,
          volunteersJoined: ev.volunteersJoined + 1,
          userJoined: true
        };
      }
      return ev;
    });

    saveEventsState(updatedEvents);

    // Award +100 Points for cleanup volunteering!
    const newPoints = userPoints + 100;
    savePointsState(newPoints);

    // Award "Clean Community Champion" and "Community Volunteer" badge
    const updatedBadges = badges.map(b => {
      if (b.id === 'bd-1') { // Clean Community Champion
        return { ...b, earned: true, dateEarned: todayStr };
      }
      if (b.id === 'bd-4') { // Community Volunteer
        return { ...b, earned: true, dateEarned: todayStr };
      }
      return b;
    });
    saveBadgesState(updatedBadges);

    // Create Notification
    const newNotif: Notification = {
      id: `nt-${Math.floor(1000 + Math.random() * 9000)}`,
      title: 'Volunteer Slot Registered!',
      body: `You joined the cleanup team! Thank you. +100 Reward Points credited!`,
      date: 'Just Now',
      type: 'Community Event',
      read: false
    };
    saveNotificationsState([newNotif, ...notifications]);
  };

  // 3. Notification Handlers
  const handleMarkRead = (id: string) => {
    void notificationService.markRead(Number(id));
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    saveNotificationsState(updated);
  };

  const handleMarkAllRead = () => {
    void notificationService.markAllRead();
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveNotificationsState(updated);
  };

  const handleDeleteNotification = (id: string) => {
    void notificationService.remove(id);
    const updated = notifications.filter(n => n.id !== id);
    saveNotificationsState(updated);
  };

  // 4. Update Profile Info
  const handleUpdateProfile = (updatedInfo: any) => {
    if (user) {
      void authService.updateProfile(updatedInfo);
    }
  };

  const handleTabChange = (tab: CitizenTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  // Resolve selected report details
  const getSelectedReport = () => {
    return reports.find(r => r.id === selectedReportId) || reports[0];
  };

  // Navigation link configuration
  const navLinks = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'report' as const, label: 'Report Waste', icon: PlusCircle },
    { id: 'report-map' as const, label: 'Public Report Map', icon: Map },
    { id: 'reports' as const, label: 'My Reports', icon: FileText },
    { id: 'schedules' as const, label: 'Collection Schedules', icon: Calendar },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell, badgeCount: notifications.filter(n => !n.read).length },
    { id: 'service-center' as const, label: 'Service Center', icon: HelpCircle },
    { id: 'community' as const, label: 'Community Hub', icon: Users },
    { id: 'volunteers' as const, label: 'Civic Campaigns', icon: Users },
    { id: 'knowledge' as const, label: 'Policy & Guides', icon: HelpCircle },
    { id: 'rewards' as const, label: 'Rewards Store', icon: Award },
    { id: 'profile' as const, label: 'Profile Settings', icon: User }
  ];

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex flex-col font-sans selection:bg-brand-accent selection:text-brand-primary">
      
      {/* SPRINT 2 ACTIVE STAGE BAR */}
      <div className="bg-emerald-950 text-white text-[11px] px-4 py-2.5 flex items-center justify-between font-mono font-bold tracking-wide relative z-40 border-b border-emerald-900 shadow-sm shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span>PORTAL ACTIVE: CITIZEN EXPERIENCE SECURED</span>
        </div>
        {onBackToSelection && (
          <button 
            onClick={onBackToSelection}
            className="bg-brand-secondary/20 hover:bg-brand-secondary/40 border border-brand-secondary/30 px-3 py-1 rounded text-[10px] font-bold tracking-wider transition-all cursor-pointer"
          >
            Exit Citizen
          </button>
        )}
      </div>

      {/* Main Container Layout */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        
        {/* SIDEBAR FOR DESKTOP & TABLETS */}
        <aside className="hidden md:flex md:w-64 bg-white border-r border-gray-200 p-5 flex-col justify-between shrink-0">
          <div className="space-y-6">
            
            {/* Sidebar Logo */}
            <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
              <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white">
                <Layers className="w-4.5 h-4.5 text-brand-accent" />
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-tight text-brand-primary block leading-none">ECOCLEAN</span>
                <span className="text-[9px] text-gray-400 font-mono tracking-widest uppercase font-semibold">Sierra Leone</span>
              </div>
            </div>

            {/* Sidebar navigation list */}
            <nav className="space-y-1">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block px-2.5 mb-2.5">Portal Navigation</span>
              {navLinks.map((link) => {
                const LinkIcon = link.icon;
                const isSelected = activeTab === link.id || (link.id === 'reports' && activeTab === 'report-details');

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

        {/* MOBILE PORTABLE HEADER BAR */}
        <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3.5 flex items-center justify-between shrink-0 relative z-30">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-brand-primary rounded-lg flex items-center justify-center text-white">
              <Layers className="w-4 h-4 text-brand-accent" />
            </div>
            <div>
              <span className="font-extrabold text-xs tracking-tight text-brand-primary block leading-none">ECOCLEAN SL</span>
              <span className="text-[8px] text-gray-400 font-mono tracking-wider uppercase leading-none">Citizen Port</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification Indicator icon */}
            <button
              onClick={() => handleTabChange('notifications')}
              className="p-2 bg-gray-50 border border-gray-150 rounded-lg relative"
            >
              <Bell className="w-4.5 h-4.5 text-gray-500" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            {/* Menu trigger button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-gray-50 border border-gray-150 rounded-lg text-gray-600 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* MOBILE DRAWER OVERLAY */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-20 flex" id="mobile-navigation-menu">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            
            <div className="relative bg-white w-64 max-w-xs h-full flex flex-col justify-between p-5 shadow-2xl relative z-10 animate-slide-in-left">
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-xs font-bold text-gray-400 font-mono">ECOCLEAN MENU</span>
                  <button onClick={() => setMobileMenuOpen(false)}>
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navLinks.map((link) => {
                    const LinkIcon = link.icon;
                    const isSelected = activeTab === link.id || (link.id === 'reports' && activeTab === 'report-details');

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

        {/* PRIMARY MAIN DASHBOARD WINDOW */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-24 md:pb-8">
          
          {/* HEADER PATH NAVIGATION INDICATION */}
          <div className="hidden md:flex justify-between items-center mb-6 border-b border-gray-200/50 pb-4">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium font-mono">
              <span>citizen</span>
              <span>/</span>
              <span className="text-gray-600 font-bold">{activeTab === 'success' ? 'report' : activeTab === 'report-details' ? 'reports' : activeTab}</span>
            </div>

            {/* Micro Time Indicator clock */}
            <div className="text-[10px] font-mono text-gray-400 font-semibold">
              TIME STATUS: {new Date().toLocaleString('en-SL',{timeZone:'Africa/Freetown',hour12:false})} GMT
            </div>
          </div>

          {/* DYNAMIC RENDERING PANEL SWITCHBOARD */}
          <div className="transition-all duration-300">
            {activeTab === 'dashboard' && (
              <CitizenDashboard 
                reports={reports}
                userPoints={userPoints}
                notifications={notifications}
                onNavigateTab={(tab) => handleTabChange(tab)}
                onSelectReportId={(id) => setSelectedReportId(id)}
                user={user}
              />
            )}

            {activeTab === 'report' && (
              <ReportWaste 
                onSubmit={handleSubmitReport}
                onCancel={() => handleTabChange('dashboard')}
              />
            )}

            {activeTab === 'report-map' && (
              <CitizenReportMap reports={reports} />
            )}

            {activeTab === 'success' && (
              <ReportSuccess 
                referenceNumber={justSubmittedRef}
                onTrackReport={() => handleTabChange('reports')}
                onSubmitAnother={() => handleTabChange('report')}
                onReturnDashboard={() => handleTabChange('dashboard')}
              />
            )}

            {activeTab === 'reports' && (
              <MyReports 
                reports={reports}
                onViewDetails={(id) => {void reportService.get(id).then(({data})=>{setReports(current=>current.map(report=>report.id===id?{...report,photos:(data.attachments||[]).filter((item:any)=>item.mime_type?.startsWith('image/')).map((item:any)=>mediaUrl(item.url)!).filter(Boolean)}:report));setSelectedReportId(id);handleTabChange('report-details');});}}
                onNavigateToReport={() => handleTabChange('report')}
              />
            )}

            {activeTab === 'report-details' && (
              <ReportDetails 
                report={getSelectedReport()}
                onBack={() => handleTabChange('reports')}
                onDelete={()=>{const id=selectedReportId;if(!id)return;void reportService.remove(id).then(()=>{setReports(current=>current.filter(report=>report.id!==id));handleTabChange('reports');});}}
              />
            )}

            {activeTab === 'schedules' && (
              <CollectionSchedules />
            )}

            {activeTab === 'notifications' && (
              <NotificationsList 
                notifications={notifications}
                onMarkRead={handleMarkRead}
                onMarkAllRead={handleMarkAllRead}
                onDelete={handleDeleteNotification}
                onViewReportDetails={(reportId) => {
                  setSelectedReportId(reportId);
                  handleTabChange('report-details');
                }}
              />
            )}

            {activeTab === 'community' && (
              <CommunityHub 
                events={events}
                onJoinEvent={handleJoinEvent}
                userPoints={userPoints}
              />
            )}

            {activeTab === 'rewards' && (
              <RewardsStore 
                userPoints={userPoints}
                badges={badges}
                leaderboard={leaderboard}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileSettings 
                user={user}
                onLogout={onLogout}
                onUpdateProfile={handleUpdateProfile}
              />
            )}

            {activeTab === 'volunteers' && (
              <CommunityEngagementView />
            )}

            {activeTab === 'knowledge' && (
              <KnowledgeHubView />
            )}
            {activeTab === 'service-center' && <ServiceCenter user={user} />}
          </div>

        </main>

        {/* BOTTOM MOBILE TAB NAVIGATION BAR */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 py-2.5 px-2 flex justify-around items-center z-30 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] rounded-t-2xl shrink-0">
          <button
            onClick={() => handleTabChange('dashboard')}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
              activeTab === 'dashboard' ? 'text-brand-primary font-bold' : 'text-gray-400'
            }`}
          >
            <LayoutDashboard className="w-4.5 h-4.5" />
            <span className="text-[9px]">Home</span>
          </button>

          <button
            onClick={() => handleTabChange('report')}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
              activeTab === 'report' ? 'text-brand-primary font-bold' : 'text-gray-400'
            }`}
          >
            <PlusCircle className="w-4.5 h-4.5" />
            <span className="text-[9px]">Report</span>
          </button>

          <button
            onClick={() => handleTabChange('reports')}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
              activeTab === 'reports' || activeTab === 'report-details' ? 'text-brand-primary font-bold' : 'text-gray-400'
            }`}
          >
            <FileText className="w-4.5 h-4.5" />
            <span className="text-[9px]">History</span>
          </button>

          <button
            onClick={() => handleTabChange('schedules')}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
              activeTab === 'schedules' ? 'text-brand-primary font-bold' : 'text-gray-400'
            }`}
          >
            <Calendar className="w-4.5 h-4.5" />
            <span className="text-[9px]">Schedules</span>
          </button>

          <button
            onClick={() => handleTabChange('rewards')}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
              activeTab === 'rewards' ? 'text-brand-primary font-bold' : 'text-gray-400'
            }`}
          >
            <Award className="w-4.5 h-4.5" />
            <span className="text-[9px]">Rewards</span>
          </button>

          <button
            onClick={() => handleTabChange('profile')}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
              activeTab === 'profile' ? 'text-brand-primary font-bold' : 'text-gray-400'
            }`}
          >
            <User className="w-4.5 h-4.5" />
            <span className="text-[9px]">Profile</span>
          </button>
        </nav>

      </div>

    </div>
  );
}
