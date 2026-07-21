import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  ArrowRight, 
  Leaf, 
  ShieldCheck, 
  AlertCircle, 
  ArrowLeft, 
  CheckCircle2, 
  UserCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { ViewState, User as UserType } from '../types';
import { ApiError } from '../lib/api';
import { authService } from '../lib/services';

interface AuthScreensProps {
  currentSubView: 'login' | 'register' | 'forgot';
  onNavigateSubView: (subView: 'login' | 'register' | 'forgot') => void;
  onLoginSuccess: (user: UserType) => void;
  onBackToLanding: () => void;
}

export default function AuthScreens({ 
  currentSubView, 
  onNavigateSubView, 
  onLoginSuccess,
  onBackToLanding 
}: AuthScreensProps) {
  // Common states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Registration states
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Recovery states
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);

  // Errors state
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Demo account options for instant testing
  const demoAccounts = [
    { label: 'Citizen', email: 'citizen@ecoclean.sl', role: 'citizen' as const },
    { label: 'Staff', email: 'staff@ecoclean.sl', role: 'staff' as const },
    { label: 'Supervisor', email: 'supervisor@ecoclean.sl', role: 'supervisor' as const },
    { label: 'Admin', email: 'admin@ecoclean.sl', role: 'admin' as const },
  ];

  const handleQuickFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword(import.meta.env.VITE_DEMO_PASSWORD || '');
    setErrorMsg('');
  };

  const validateEmail = (inputEmail: string) => {
    return /\S+@\S+\.\S+/.test(inputEmail);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    if (!email || !password) {
        setErrorMsg('Please fill in all credentials.');
        setIsLoading(false);
        return;
    }

    try {
      const { user } = await authService.login(email,password,rememberMe);
      onLoginSuccess(user);
    } catch (error) {
      setErrorMsg(error instanceof ApiError ? error.message : 'Unable to reach the authentication service.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    if (!fullName || !email || !phoneNumber || !password || !confirmPassword) {
        setErrorMsg('All fields are mandatory. Please fill in all details.');
        setIsLoading(false);
        return;
    }

      if (fullName.trim().length < 3) {
        setErrorMsg('Please enter a valid full name.');
        setIsLoading(false);
        return;
      }

      if (!validateEmail(email)) {
        setErrorMsg('Please enter a valid email address.');
        setIsLoading(false);
        return;
      }

      if (phoneNumber.trim().length < 7) {
        setErrorMsg('Please enter a valid phone number.');
        setIsLoading(false);
        return;
      }

      if (password.length < 10) {
        setErrorMsg('Password must be at least 10 characters.');
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please verify.');
        setIsLoading(false);
        return;
      }

    try {
      const { user } = await authService.register(fullName,email,phoneNumber,password);
      onLoginSuccess(user);
    } catch (error) {
      setErrorMsg(error instanceof ApiError ? error.message : 'Registration service is unavailable.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    if (!recoveryEmail || !validateEmail(recoveryEmail)) {
      setErrorMsg('Please enter a valid registered email address.');
      setIsLoading(false);
      return;
    }
    try {
      const result = await authService.forgotPassword(recoveryEmail);
      if (result.developmentToken) setVerificationCode(result.developmentToken);
      setRecoverySent(true);
    } catch (error) {
      setErrorMsg(error instanceof ApiError ? error.message : 'Password recovery service is unavailable.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    if (!verificationCode || !newPassword || !confirmNewPassword) {
      setErrorMsg('Please fill in all details to update your password.');
      setIsLoading(false);
      return;
    }
    if (newPassword.length < 10) {
      setErrorMsg('New password must be at least 10 characters.');
      setIsLoading(false);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMsg('Passwords do not match.');
      setIsLoading(false);
      return;
    }
    try {
      await authService.resetPassword(recoveryEmail, verificationCode, newPassword);
      setPasswordResetSuccess(true);
    } catch (error) {
      setErrorMsg(error instanceof ApiError ? error.message : 'Password reset service is unavailable.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex flex-col lg:flex-row font-sans selection:bg-brand-accent selection:text-brand-primary">
      
      {/* Left side: Premium Brand Story & Quick stats */}
      <div className="lg:w-5/12 bg-gradient-to-b from-brand-primary to-green-950 text-white p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Ambient Lights */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(67,160,71,0.25)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Logo click back to landing */}
          <div 
            onClick={onBackToLanding}
            className="flex items-center gap-3 cursor-pointer group w-max"
          >
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/20 transition-all group-hover:scale-105">
              <Leaf className="w-5 h-5 text-brand-accent" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-extrabold tracking-tight">ECOCLEAN</span>
                <span className="bg-brand-accent/20 text-brand-accent text-[9px] font-extrabold px-1.5 py-0.5 rounded font-mono">SL</span>
              </div>
              <p className="text-[9px] text-emerald-300/80 font-mono tracking-widest uppercase -mt-0.5">Sierra Leone</p>
            </div>
          </div>
        </div>

        {/* Dynamic content depending on auth state */}
        <div className="my-12 relative z-10 max-w-sm">
          {currentSubView === 'login' && (
            <div className="space-y-4">
              <span className="bg-brand-accent/10 text-brand-accent border border-brand-accent/20 text-xs font-mono px-3 py-0.5 rounded-full uppercase tracking-wider">
                Identity Gateway
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight">Secure Portal Authorization</h2>
              <p className="text-emerald-100/70 text-sm leading-relaxed">
                Log in to coordinate municipal dispatches, track active incident logs, or file environmental issues securely.
              </p>
              
              {/* Quick instructions */}
              {import.meta.env.DEV && <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mt-6">
                <p className="text-xs text-brand-accent font-semibold mb-2 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Development Accounts Available</span>
                </p>
                <p className="text-[11px] text-emerald-100/60 leading-relaxed">
                  Select a seeded role below to populate its credentials and securely authenticate against the application database.
                </p>
              </div>}
            </div>
          )}

          {currentSubView === 'register' && (
            <div className="space-y-4">
              <span className="bg-brand-accent/10 text-brand-accent border border-brand-accent/20 text-xs font-mono px-3 py-0.5 rounded-full uppercase tracking-wider">
                Civic Access
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight">Join the Clean Salone Mission</h2>
              <p className="text-emerald-100/70 text-sm leading-relaxed">
                Connect your household to municipal collection grids, gain community rewards, and direct environmental updates in your district.
              </p>
              <div className="space-y-2 mt-6">
                <div className="flex items-center gap-2 text-xs text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-brand-accent" />
                  <span>Interactive Map Reports</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-brand-accent" />
                  <span>Earn Civic Rewards Points</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-brand-accent" />
                  <span>Direct Municipal Notifications</span>
                </div>
              </div>
            </div>
          )}

          {currentSubView === 'forgot' && (
            <div className="space-y-4">
              <span className="bg-brand-accent/10 text-brand-accent border border-brand-accent/20 text-xs font-mono px-3 py-0.5 rounded-full uppercase tracking-wider">
                Recovery Deck
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight">Access Recovery Protocol</h2>
              <p className="text-emerald-100/70 text-sm leading-relaxed">
                Sierra Leone Digital Services secures your data. Re-verify your identity below to reset your secure portal passcode.
              </p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="text-xs text-emerald-300/40 font-mono relative z-10">
          <span>SECURE PROTOCOL SHA-256 &bull; GOSL</span>
        </div>

      </div>

      {/* Right side: Form Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-20 relative">
        <div className="max-w-md w-full">
          
          {/* Back button */}
          <button 
            onClick={onBackToLanding}
            className="mb-8 text-sm font-semibold text-gray-500 hover:text-brand-primary transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Homepage</span>
          </button>

          {/* Form container card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-8 sm:p-10">
            
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                {currentSubView === 'login' && 'Authorize Portal'}
                {currentSubView === 'register' && 'Create ECOCLEAN ID'}
                {currentSubView === 'forgot' && 'Reset Password'}
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {currentSubView === 'login' && 'Secure access to your operational space.'}
                {currentSubView === 'register' && 'Register to begin reporting and tracking.'}
                {currentSubView === 'forgot' && 'Follow secure instructions to restore access.'}
              </p>
            </div>

            {/* Error notifications */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-100 text-brand-error text-xs p-4 rounded-xl flex items-start gap-2.5 mb-6 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Authorization alert: </span>
                  {errorMsg}
                </div>
              </div>
            )}

            {/* 1. LOGIN SCREEN */}
            {currentSubView === 'login' && (
              <form onSubmit={handleLogin} className="space-y-5">
                
                {/* Email or phone field */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Email or Phone Number</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-gray-400" />
                    <input 
                      type="text"
                      required
                      placeholder="Email address or +232 phone number"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:bg-white focus:border-brand-primary transition-colors text-gray-800"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">Password</label>
                    <button 
                      type="button"
                      onClick={() => onNavigateSubView('forgot')}
                      className="text-xs font-semibold text-brand-primary hover:text-brand-secondary transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-gray-400" />
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-11 text-sm focus:outline-none focus:bg-white focus:border-brand-primary transition-colors text-gray-800"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <div className="flex items-center">
                  <input 
                    id="remember_me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary"
                  />
                  <label htmlFor="remember_me" className="ml-2 block text-xs font-semibold text-gray-500 select-none cursor-pointer">
                    Remember my credentials on this device
                  </label>
                </div>

                {/* Submit button */}
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-75"
                >
                  {isLoading ? 'Verifying Credentials...' : 'Sign In to Portal'}
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Create account trigger */}
                <div className="text-center pt-2">
                  <span className="text-xs text-gray-400">New to ECOCLEAN SL? </span>
                  <button 
                    type="button"
                    onClick={() => onNavigateSubView('register')}
                    className="text-xs font-bold text-brand-primary hover:text-brand-secondary transition-colors"
                  >
                    Create Free Account
                  </button>
                </div>

                {/* Demo account helper row */}
                {import.meta.env.DEV && <div className="pt-6 border-t border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center mb-3">Quick Login (Development Accounts)</p>
                  <div className="grid grid-cols-2 gap-2">
                    {demoAccounts.map((account) => (
                      <button
                        key={account.email}
                        type="button"
                        onClick={() => handleQuickFill(account.email)}
                        className={`text-xs p-2 text-left rounded-lg border border-gray-200/70 hover:border-brand-primary hover:bg-brand-accent/10 transition-all flex flex-col justify-between ${
                          email === account.email ? 'border-brand-primary bg-brand-accent/20' : ''
                        }`}
                      >
                        <span className="font-bold text-gray-700">{account.label}</span>
                        <span className="text-[10px] text-gray-400 truncate">{account.email}</span>
                      </button>
                    ))}
                  </div>
                </div>}

              </form>
            )}

            {/* 2. REGISTRATION SCREEN */}
            {currentSubView === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-gray-400" />
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Winston Tucker"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:bg-white focus:border-brand-primary transition-colors text-gray-800"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-gray-400" />
                    <input 
                      type="tel"
                      required
                      placeholder="e.g. +232 76 123456"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:bg-white focus:border-brand-primary transition-colors text-gray-800"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-gray-400" />
                    <input 
                      type="email"
                      required
                      placeholder="e.g. winston@domain.sl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:bg-white focus:border-brand-primary transition-colors text-gray-800"
                    />
                  </div>
                </div>

                {/* Password Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                      <input 
                        type="password"
                        required
                        placeholder="At least 6 chars"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-9 pr-3 text-xs focus:outline-none focus:bg-white focus:border-brand-primary transition-colors text-gray-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Confirm</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                      <input 
                        type="password"
                        required
                        placeholder="Re-type password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-9 pr-3 text-xs focus:outline-none focus:bg-white focus:border-brand-primary transition-colors text-gray-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Terms agreement */}
                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 text-[11px] text-gray-500 leading-relaxed">
                  By signing up, you agree to the national environmental standards guidelines and municipal safety rules of Sierra Leone.
                </div>

                {/* Submit */}
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-75"
                >
                  {isLoading ? 'Creating secure ID...' : 'Register Account'}
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Sign in toggle */}
                <div className="text-center pt-1">
                  <span className="text-xs text-gray-400">Already registered? </span>
                  <button 
                    type="button"
                    onClick={() => onNavigateSubView('login')}
                    className="text-xs font-bold text-brand-primary hover:text-brand-secondary transition-colors"
                  >
                    Login to Portal
                  </button>
                </div>

              </form>
            )}

            {/* 3. FORGOT PASSWORD SCREEN */}
            {currentSubView === 'forgot' && (
              <div className="space-y-6">
                {!recoverySent ? (
                  <form onSubmit={handleForgotPasswordSubmit} className="space-y-5">
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Enter your authorized portal email below. A single-use recovery token will be issued through the configured delivery service.
                    </p>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Registered Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-gray-400" />
                        <input 
                          type="email"
                          required
                          placeholder="e.g. administrator@ecoclean.sl"
                          value={recoveryEmail}
                          onChange={(e) => setRecoveryEmail(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:bg-white focus:border-brand-primary transition-colors text-gray-800"
                        />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-75"
                    >
                      {isLoading ? 'Dispatching SMS/Email Token...' : 'Transmit Recovery Code'}
                    </button>

                    <div className="text-center pt-2">
                      <button 
                        type="button"
                        onClick={() => onNavigateSubView('login')}
                        className="text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1 mx-auto"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Cancel and return</span>
                      </button>
                    </div>
                  </form>
                ) : !passwordResetSuccess ? (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    {/* Token dispatch notification */}
                    <div className="bg-emerald-50 border border-emerald-100 text-brand-success text-xs p-4 rounded-xl flex items-start gap-2.5">
                      <CheckCircle2 className="w-4.5 h-4.5 shrink-0 text-brand-success mt-0.5" />
                      <div>
                        <span className="font-bold">Token Sent! </span>
                        A single-use recovery token has been issued. In development mode it is securely prefilled below; production delivery uses the configured notification provider.
                      </div>
                    </div>

                    {/* Code input */}
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Recovery Token</label>
                      <input 
                        type="text"
                        required
                        maxLength={128}
                        placeholder="Paste recovery token"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-center text-lg font-mono font-bold focus:outline-none focus:bg-white focus:border-brand-primary transition-colors tracking-widest text-gray-800"
                      />
                    </div>

                    {/* Password Fields */}
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">New Password</label>
                      <input 
                        type="password"
                        required
                        placeholder="At least 10 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:bg-white focus:border-brand-primary transition-colors text-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Confirm New Password</label>
                      <input 
                        type="password"
                        required
                        placeholder="Confirm new password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:bg-white focus:border-brand-primary transition-colors text-gray-800"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center text-sm disabled:opacity-75"
                    >
                      {isLoading ? 'Updating credentials...' : 'Reset My Password'}
                    </button>

                    <div className="text-center pt-1">
                      <button 
                        type="button"
                        onClick={() => {
                          setRecoverySent(false);
                          setErrorMsg('');
                        }}
                        className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        Resend code
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center space-y-5 py-4">
                    <div className="w-16 h-16 bg-brand-accent/20 text-brand-primary rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-gray-900">Password Updated Successfully</h3>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        Your secure ECOCLEAN ID credentials have been updated and are active for our national portals.
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        onNavigateSubView('login');
                        setPasswordResetSuccess(false);
                        setRecoverySent(false);
                        setEmail('');
                        setPassword('');
                        setErrorMsg('');
                      }}
                      className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3.5 rounded-xl transition-all text-sm"
                    >
                      Return to Sign In
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  );
}
