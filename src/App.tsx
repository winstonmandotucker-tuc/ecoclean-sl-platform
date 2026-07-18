import { lazy, Suspense, useState, useEffect } from 'react';
import { ViewState, User as UserType } from './types';
import LandingPage from './components/LandingPage';
import SplashOnboarding from './components/SplashOnboarding';
import AuthScreens from './components/AuthScreens';
const PortalSelection=lazy(()=>import('./components/PortalSelection'));
const DashboardPlaceholders=lazy(()=>import('./components/DashboardPlaceholders'));
const CitizenPortal=lazy(()=>import('./components/CitizenPortal'));
const StaffPortal=lazy(()=>import('./components/StaffPortal'));
const SupervisorPortal=lazy(()=>import('./components/SupervisorPortal'));
const AdminPortal=lazy(()=>import('./components/AdminPortal'));
const SuperAdminPortal=lazy(()=>import('./components/SuperAdminPortal'));
const Unauthorized=lazy(()=>import('./components/Unauthorized'));
import { authService } from './lib/services';
import { operationalStore } from './lib/operationalStore';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [user, setUser] = useState<UserType | null>(null);

  // Restore the server-issued HttpOnly session; local storage only retains UI preferences.
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { user: restoredUser } = await authService.me();
        await operationalStore.load();
        setUser(restoredUser);
        
        // Enforce strict route protection on session restoration
        const lastView = localStorage.getItem('ecoclean_last_view');
        if (lastView && lastView.endsWith('-dashboard')) {
          const expectedDashboard = `${restoredUser.role}-dashboard`;
          if (lastView === expectedDashboard) {
            setCurrentView(lastView as ViewState);
          } else {
            setCurrentView('unauthorized');
          }
        } else {
          // Redirect directly to the correct dashboard based on role
          setCurrentView(`${restoredUser.role}-dashboard` as ViewState);
        }
      } catch {
        const onboardingDone = localStorage.getItem('ecoclean_onboarding_completed');
        setCurrentView(onboardingDone ? 'landing' : 'onboarding');
      }
    };
    void restoreSession();
  }, []);

  // Sync state transitions to local storage with absolute RouteGuard validation
  const handleNavigate = (view: ViewState) => {
    // Deprecate Portal Selection and redirect to actual role dashboard instead
    if (view === 'portal-selection') {
      if (user) {
        const target = `${user.role}-dashboard` as ViewState;
        setCurrentView(target);
        localStorage.setItem('ecoclean_last_view', target);
        return;
      } else {
        setCurrentView('login');
        localStorage.setItem('ecoclean_last_view', 'login');
        return;
      }
    }

    // Guard dashboard viewports from cross-access
    if (view.endsWith('-dashboard')) {
      if (!user) {
        setCurrentView('login');
        localStorage.setItem('ecoclean_last_view', 'login');
        return;
      }

      const expectedDashboard = `${user.role}-dashboard`;
      if (view !== expectedDashboard) {
        setCurrentView('unauthorized');
        localStorage.setItem('ecoclean_last_view', 'unauthorized');
        return;
      }
    }

    setCurrentView(view);
    localStorage.setItem('ecoclean_last_view', view);
  };

  const handleOnboardingComplete = (nextView: ViewState) => {
    localStorage.setItem('ecoclean_onboarding_completed', 'true');
    handleNavigate(nextView);
  };

  const handleLoginSuccess = async (loggedInUser: UserType) => {
    await operationalStore.load();
    setUser(loggedInUser);
    
    // Auto detect role and redirect directly to correct dashboard
    const targetDashboard = `${loggedInUser.role}-dashboard` as ViewState;
    // The new user state is committed on the next React render, so route with the
    // authenticated result directly instead of re-reading the previous state.
    setCurrentView(targetDashboard);
    localStorage.setItem('ecoclean_last_view', targetDashboard);
  };

  const handleLogout = async () => {
    try { await authService.logout(); } catch { /* Clear local UI state even if the API is unavailable. */ }
    setUser(null);
    operationalStore.clearMemory();
    localStorage.removeItem('ecoclean_last_view');
    handleNavigate('landing');
  };

  const handleSelectPortal = (portal: 'citizen' | 'staff' | 'supervisor' | 'admin') => {
    handleNavigate(`${portal}-dashboard` as ViewState);
  };

  const handleBackToLanding = () => {
    handleNavigate('landing');
  };

  // Main render switch with absolute viewport coverage
  return (
    <main className="min-h-screen bg-[#FCFDFC] relative text-[#1A201C] overflow-x-hidden antialiased">
      <Suspense fallback={<div className="min-h-screen bg-[#F4F7F5] flex items-center justify-center text-brand-primary font-bold">Loading secure ECOCLEAN workspace…</div>}>
      
      {currentView === 'onboarding' && (
        <SplashOnboarding 
          onComplete={handleOnboardingComplete}
          onBackToLanding={handleBackToLanding}
        />
      )}

      {currentView === 'landing' && (
        <LandingPage 
          onNavigate={(view) => handleNavigate(view)}
          onEnterOnboarding={() => setCurrentView('onboarding')}
        />
      )}

      {(currentView === 'login' || currentView === 'register' || currentView === 'forgot') && (
        <AuthScreens 
          currentSubView={currentView}
          onNavigateSubView={(sub) => handleNavigate(sub)}
          onLoginSuccess={handleLoginSuccess}
          onBackToLanding={handleBackToLanding}
        />
      )}

      {currentView === 'portal-selection' && (
        <PortalSelection 
          user={user}
          onSelectPortal={handleSelectPortal}
          onLogout={handleLogout}
        />
      )}

      {currentView === 'citizen-dashboard' && (
        <CitizenPortal 
          user={user}
          onLogout={handleLogout}
        />
      )}

      {currentView === 'staff-dashboard' && (
        <StaffPortal 
          user={user}
          onLogout={handleLogout}
        />
      )}

      {currentView === 'supervisor-dashboard' && (
        <SupervisorPortal 
          user={user}
          onLogout={handleLogout}
        />
      )}

      {currentView === 'admin-dashboard' && (
        <AdminPortal 
          user={user}
          onLogout={handleLogout}
        />
      )}

      {currentView === 'super-admin-dashboard' && (
        <SuperAdminPortal 
          user={user}
          onLogout={handleLogout}
        />
      )}

      {currentView === 'unauthorized' && (
        <Unauthorized 
          onLogout={handleLogout}
          onGoHome={() => {
            if (user) {
              handleNavigate(`${user.role}-dashboard` as ViewState);
            } else {
              handleNavigate('landing');
            }
          }}
        />
      )}

      {(currentView.endsWith('-dashboard') && 
        currentView !== 'citizen-dashboard' && 
        currentView !== 'staff-dashboard' && 
        currentView !== 'supervisor-dashboard' && 
        currentView !== 'admin-dashboard' &&
        currentView !== 'super-admin-dashboard') && (
        <DashboardPlaceholders 
          user={user}
          activePortal={currentView.split('-')[0] as 'citizen' | 'staff' | 'supervisor' | 'admin'}
          onBackToSelection={() => handleNavigate('portal-selection')}
          onLogout={handleLogout}
        />
      )}

      </Suspense>
    </main>
  );
}
