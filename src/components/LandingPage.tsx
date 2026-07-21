import React, { useState } from 'react';
import { 
  Leaf, 
  MapPin, 
  Camera, 
  Truck, 
  Bell, 
  Layers, 
  PieChart, 
  Users, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  ShieldCheck, 
  ShieldAlert, 
  WifiOff, 
  TrendingUp, 
  Zap, 
  Building2, 
  HeartHandshake, 
  Award,
  BookOpen,
  ChevronRight,
  Globe,
  Clock,
  ExternalLink
} from 'lucide-react';
import { ViewState } from '../types';
import { PublicTransparencyView } from './modules/EnterpriseModules';

interface LandingPageProps {
  onNavigate: (view: ViewState) => void;
  onEnterOnboarding: () => void;
}

export default function LandingPage({ onNavigate, onEnterOnboarding }: LandingPageProps) {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showTransparency, setShowTransparency] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const features = [
    {
      title: 'Smart Waste Reporting',
      description: 'Snap photos of waste issues, describe the urgency, and transmit instantly to the nearest regional collection crew.',
      icon: Camera,
      badge: 'Citizen Power'
    },
    {
      title: 'GIS Geotagging & Mapping',
      description: 'Pin-point precise locations with or without GPS. Automatically flags specific municipal sectors and wards.',
      icon: MapPin,
      badge: 'Precision'
    },
    {
      title: 'Real-Time Dispatch Tracking',
      description: 'Watch collection progress in real-time. Citizens and supervisors receive live status updates from the field crews.',
      icon: Truck,
      badge: 'Transparency'
    },
    {
      title: 'Environmental Monitoring',
      description: 'Track localized environmental metrics, air health, solid waste build-ups, and coastal hygiene indicators.',
      icon: Layers,
      badge: 'Public Health'
    },
    {
      title: 'Smart Notifications',
      description: 'Get automated updates on recycling schedules, community clean-up alerts, and local administrative reports.',
      icon: Bell,
      badge: 'Civic Engagement'
    },
    {
      title: 'Offline Reporting Mode',
      description: 'No network? No problem. Reports are saved locally and synced automatically when GSM coverage is restored.',
      icon: WifiOff,
      badge: 'Sierra Leone Ready'
    },
    {
      title: 'Municipal Analytics Portal',
      description: 'Arm councils and supervisors with heatmaps, speed-of-resolution stats, and vehicle route optimization insights.',
      icon: PieChart,
      badge: 'Enterprise Gov'
    },
    {
      title: 'Community Rewards Program',
      description: 'Earn civic impact points for validated reports and community cleanup participation, redeemable for local rewards.',
      icon: Users,
      badge: 'Empowerment'
    }
  ];

  const stats = [
    { value: '25,000+', label: 'Citizens Connected' },
    { value: '10,000+', label: 'Reports Submitted' },
    { value: '7,500+', label: 'Issues Resolved' },
    { value: '25+', label: 'Municipal Zones' },
    { value: '500+', label: 'Collection Staff' },
    { value: '95%', label: 'Resolution Rate' }
  ];

  const stakeholders = [
    {
      role: 'Citizens',
      description: 'Report immediate issues, receive live response alerts, earn community honors, and help keep local neighborhoods vibrant and litter-free.',
      benefit: 'Civic Pride & Accountability',
      icon: Users,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-100'
    },
    {
      role: 'Collection Teams',
      description: 'Access route-optimized maps, log completions with photographic proof, and manage operational tasks through a dedicated field portal.',
      benefit: 'Reduced Travel & Clear Targets',
      icon: Truck,
      color: 'bg-green-50 text-green-800 border-green-100'
    },
    {
      role: 'Supervisors',
      description: 'Monitor daily collection loops, re-assign crews to bottleneck zones, and verify incident updates with authoritative oversight.',
      benefit: 'Live Operations Map View',
      icon: ShieldCheck,
      color: 'bg-teal-50 text-teal-800 border-teal-100'
    },
    {
      role: 'Municipal Councils',
      description: 'Examine detailed regional metrics, measure response times, generate compliance reports, and make data-backed funding decisions.',
      benefit: 'Unified Civic Control Deck',
      icon: Building2,
      color: 'bg-emerald-100/40 text-emerald-900 border-emerald-200'
    },
    {
      role: 'Environmental Agencies',
      description: 'Track waste trends, map illegal dumpsite hotspots, and model water/soil pollution prevention targets across regions.',
      benefit: 'National Ecological Health Guard',
      icon: Leaf,
      color: 'bg-[#C8E6C9]/30 text-emerald-950 border-emerald-300/40'
    },
    {
      role: 'Government Partners',
      description: 'Supervise infrastructure investments, track sustainable development goal (SDG) progress, and collaborate on state-wide initiatives.',
      benefit: 'Policy & Impact Optimization',
      icon: HeartHandshake,
      color: 'bg-green-100/50 text-emerald-900 border-green-200'
    }
  ];

  const successStories = [
    {
      title: 'Kroo Town Road Restoration',
      location: 'Freetown Council Zone 4',
      description: 'Historically plagued by massive illegal street dumping, this critical corridor achieved an 80% drop in waste stagnation following real-time geo-reporting and automated crew dispatch alerts.',
      impact: '80% Less Waste Stagnation',
      tag: 'Illegal Dumping Eradication'
    },
    {
      title: 'Bo Smart Municipal Grid',
      location: 'Bo Municipal District',
      description: 'By deploying the digital Supervisor portal, Bo City Council reorganized its fleet schedules to target dense market zones, reducing peak response delay from 36 hours to just 4 hours.',
      impact: 'Response time cut to 4 hours',
      tag: 'Optimized Fleet Dispatches'
    },
    {
      title: 'Kenema Clean Champions Initiative',
      location: 'Kenema East Ward',
      description: 'Over 120 community champions connected through ECOCLEAN to organize structural trash-to-compost bins, cleaning historical dump hills and creating urban green gardens.',
      impact: '15 Historic Dumps Restored',
      tag: 'Community Empowerment'
    },
    {
      title: 'Makeni Regional Cleanup Sync',
      location: 'Makeni Northern Province',
      description: 'Using offline-ready SMS sync protocols, Makeni marshalled 12 disparate rural suburbs into coordinated weekly collection schedules, raising safe plastic collection by 140%.',
      impact: '140% Increase in Safe Plastics',
      tag: 'Rural Synchronization'
    }
  ];

  const partners = [
    { name: 'Freetown City Council', role: 'Municipal Host' },
    { name: 'Bo City Council', role: 'Municipal Host' },
    { name: 'Kenema City Council', role: 'Municipal Host' },
    { name: 'Makeni City Council', role: 'Municipal Host' },
    { name: 'EPA Sierra Leone', role: 'Regulatory Patron' },
    { name: 'Ministry of Environment', role: 'Strategic Overseer' },
    { name: 'UNDP Sierra Leone', role: 'Development Sponsor' },
    { name: 'NGO Coalition SL', role: 'Civic Partner' }
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFDFC] text-[#1A201C] flex flex-col font-sans selection:bg-brand-accent selection:text-brand-primary">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-40 bg-[#FCFDFC]/95 backdrop-blur-md border-b border-gray-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-md">
              <Leaf className="w-5 h-5 text-brand-accent" strokeWidth={2} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-brand-primary">ECOCLEAN</span>
                <span className="bg-brand-accent/60 text-brand-primary text-[10px] font-extrabold px-1.5 py-0.5 rounded-md font-mono">SL</span>
              </div>
              <p className="text-[10px] text-gray-500 font-medium tracking-widest uppercase -mt-0.5">Sierra Leone</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-gray-600 hover:text-brand-primary transition-colors">Features</a>
            <button 
              onClick={() => setShowTransparency(true)}
              className="text-sm font-semibold text-brand-primary hover:text-brand-secondary cursor-pointer transition-colors font-bold flex items-center gap-1.5"
            >
              <Globe className="w-4 h-4 text-brand-accent fill-brand-primary/10" />
              <span>National Scores</span>
            </button>
            <a href="#stakeholders" className="text-sm font-semibold text-gray-600 hover:text-brand-primary transition-colors">Portals</a>
            <a href="#impact" className="text-sm font-semibold text-gray-600 hover:text-brand-primary transition-colors">Impact</a>
            <a href="#stories" className="text-sm font-semibold text-gray-600 hover:text-brand-primary transition-colors">Success Stories</a>
            <a href="#partners" className="text-sm font-semibold text-gray-600 hover:text-brand-primary transition-colors">Partners</a>
          </nav>

          {/* Header CTAs */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onEnterOnboarding}
              className="text-sm font-bold text-brand-primary hover:text-brand-secondary transition-colors px-4 py-2.5 rounded-lg border border-brand-accent hover:bg-brand-accent/10"
            >
              Start Onboarding
            </button>
            <button 
              onClick={() => onNavigate('login')}
              className="hidden sm:inline-flex bg-brand-primary hover:bg-brand-secondary text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all hover:scale-[1.02] active:scale-95"
            >
              Sign In
            </button>
          </div>

        </div>
      </header>

      {showTransparency ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in flex-1">
          <div className="mb-6 flex justify-between items-center">
            <button 
              onClick={() => setShowTransparency(false)}
              className="text-xs font-bold text-brand-primary hover:text-white hover:bg-brand-primary flex items-center gap-1.5 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm cursor-pointer transition-all duration-200"
            >
              &larr; Back to Landing Page
            </button>
            <div className="text-[10px] font-mono text-gray-400 font-bold bg-gray-50 border border-gray-150 px-3 py-1.5 rounded-lg">
              PUBLIC TRANSPARENCY DECK &bull; LIVE DATA
            </div>
          </div>
          <PublicTransparencyView />
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-brand-accent/10 via-transparent to-transparent">
        {/* Abstract shapes in background */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-brand-accent/20 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-green-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-accent/40 border border-brand-primary/10 text-brand-primary text-xs font-semibold px-4 py-1.5 rounded-full mb-8 animate-fade-in">
            <ShieldCheck className="w-4 h-4" />
            <span>National Smart City Platform Launch &bull; Sprint 1 Live</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight max-w-4xl mx-auto leading-[1.1] mb-6">
            Building Cleaner Communities <br />
            <span className="text-brand-primary bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">Through Smart Waste Management</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10">
            ECOCLEAN SL empowers citizens, municipalities, waste collection teams, and environmental agencies to work together through a modern digital platform that improves environmental health and operational efficiency.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 max-w-2xl mx-auto">
            <button 
              onClick={() => onNavigate('login')}
              className="w-full sm:w-auto bg-brand-primary hover:bg-brand-secondary text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg shadow-brand-primary/10 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Report Waste</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => onNavigate('login')}
              className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 font-bold text-base px-8 py-4 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Join Collection Team</span>
            </button>
            <button 
              onClick={() => onNavigate('login')}
              className="w-full sm:w-auto bg-emerald-50 hover:bg-brand-accent/20 text-brand-primary border border-brand-accent font-bold text-base px-8 py-4 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Municipal Portal</span>
            </button>
          </div>

          {/* Secondary Actions */}
          <div className="flex items-center justify-center gap-8 text-sm font-semibold">
            <a 
              href="#features" 
              className="text-gray-600 hover:text-brand-primary transition-colors flex items-center gap-1.5"
            >
              <span>Learn More</span>
              <span className="text-xs font-mono">&darr;</span>
            </a>
            <button 
              onClick={() => setShowDemoModal(true)}
              className="text-brand-primary hover:text-brand-secondary transition-colors flex items-center gap-2"
            >
              <span className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center">
                <Play className="w-3.5 h-3.5 text-brand-primary fill-brand-primary" />
              </span>
              <span>Watch Demo</span>
            </button>
          </div>

          {/* Callout to Public Transparency Portal */}
          <div className="bg-gradient-to-r from-emerald-950 via-[#0B2A0D] to-[#041205] text-white rounded-3xl p-6 md:p-8 max-w-4xl mx-auto border border-brand-accent/25 shadow-xl text-left relative overflow-hidden mt-16">
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-brand-accent/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -left-12 -top-12 w-48 h-48 bg-emerald-400/5 rounded-full blur-2xl pointer-events-none" />
            <div className="md:flex justify-between items-center gap-8 relative z-10">
              <div className="space-y-3 mb-6 md:mb-0 max-w-xl">
                <span className="text-[10px] bg-brand-accent/25 text-brand-accent font-extrabold px-3 py-1.5 rounded-full font-mono uppercase tracking-wider border border-brand-accent/20">
                  National Transparency Portal
                </span>
                <h3 className="text-xl font-bold tracking-tight text-white">Municipal SLA & Environmental Compliance Index</h3>
                <p className="text-xs text-emerald-100/75 leading-relaxed">
                  ECOCLEAN SL maintains an open GIS and environmental score dashboard to hold local councils, waste contractors, and zones accountable. Explore resolution times, recycling rates, and cleanliness rankings across Sierra Leone.
                </p>
              </div>
              <button
                onClick={() => setShowTransparency(true)}
                className="shrink-0 bg-brand-accent text-brand-primary hover:bg-white hover:text-brand-primary font-extrabold text-xs px-6 py-3.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-[1.02]"
              >
                <span>View Public Scores</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-brand-primary text-xs font-bold font-mono tracking-widest uppercase">System Capabilities</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-2">
              Advanced Tools for Modern Environment Stewardship
            </h2>
            <p className="text-gray-500 mt-4 leading-relaxed">
              ECOCLEAN SL bridges gaps by deploying mobile technologies, GIS spatial coordinates, and municipal administration tools directly onto our local city layouts.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={index}
                  className="bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm hover:shadow-md hover:border-brand-accent/40 transition-all flex flex-col group"
                >
                  <div className="w-12 h-12 bg-brand-accent/20 rounded-xl flex items-center justify-center mb-5 text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                    <Icon className="w-6 h-6" strokeWidth={1.75} />
                  </div>
                  <span className="text-[10px] font-mono font-bold tracking-wider text-brand-primary uppercase bg-brand-accent/10 px-2 py-0.5 rounded w-max mb-3">
                    {feat.badge}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-brand-primary transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed flex-1">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Impact Stats Section */}
      <section id="impact" className="py-24 bg-brand-primary text-white relative overflow-hidden">
        {/* Background mesh */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.2),transparent_70%)]" />
        <div className="absolute top-0 inset-x-0 h-px bg-white/20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            
            <div className="lg:col-span-1 space-y-4">
              <span className="text-brand-accent text-xs font-mono font-bold uppercase tracking-widest">Tangible Impact</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Empowering Clean Cities & Healthy Citizens
              </h2>
              <p className="text-emerald-100/80 leading-relaxed text-sm sm:text-base">
                Our database updates automatically to track national clean goals, verifying response speeds, spatial sanitization metrics, and active community volunteers.
              </p>
              <div className="pt-4">
                <button 
                  onClick={() => onNavigate('login')}
                  className="bg-brand-secondary hover:bg-emerald-500 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all inline-flex items-center gap-2 border border-emerald-400/20"
                >
                  <span>Connect Your Council</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
              {stats.map((stat, idx) => (
                <div 
                  key={idx}
                  className="bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-2xl flex flex-col justify-between"
                >
                  <span className="text-3xl sm:text-4xl font-black text-brand-accent tracking-tight block mb-2">
                    {stat.value}
                  </span>
                  <span className="text-sm font-medium text-emerald-100 font-sans">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* Stakeholders Section */}
      <section id="stakeholders" className="py-24 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-brand-primary text-xs font-bold font-mono tracking-widest uppercase">Platform Governance</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-2">
              A Connected Ecosystem for Dynamic Response
            </h2>
            <p className="text-gray-500 mt-4 leading-relaxed">
              ECOCLEAN SL provides distinct, customized digital gateways optimized for the exact operational needs of every environmental stakeholder.
            </p>
          </div>

          {/* Stakeholders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stakeholders.map((holder, idx) => {
              const HolderIcon = holder.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${holder.color}`}>
                      <HolderIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{holder.role}</h3>
                      <span className="text-xs text-brand-primary font-semibold">{holder.benefit}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-6">
                    {holder.description}
                  </p>
                  <button 
                    onClick={() => onNavigate('login')}
                    className="text-sm font-bold text-brand-primary hover:text-brand-secondary transition-colors inline-flex items-center gap-1 group self-start"
                  >
                    <span>Explore Gateway</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Success Stories Section */}
      <section id="stories" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-brand-primary text-xs font-bold font-mono tracking-widest uppercase">Verified Progress</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-2">
              Success Stories Across Sierra Leone
            </h2>
            <p className="text-gray-500 mt-4 leading-relaxed">
              Discover how municipal councils and dedicated community members are actively deploying clean frameworks to restructure public sanitation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {successStories.map((story, idx) => (
              <div 
                key={idx}
                className="bg-gradient-to-br from-brand-accent/5 to-emerald-50/10 border border-gray-100 p-8 rounded-2xl flex flex-col justify-between hover:border-brand-accent/30 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <span className="text-xs font-semibold text-brand-primary bg-brand-accent/30 px-3 py-1 rounded-full">
                      {story.tag}
                    </span>
                    <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {story.location}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{story.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">{story.description}</p>
                </div>
                <div className="bg-white border border-gray-100 p-4 rounded-xl flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Verified Outcome</span>
                  <span className="text-sm font-bold text-brand-primary font-mono">{story.impact}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <span className="text-brand-primary text-xs font-bold font-mono tracking-widest uppercase">Endorsed Ecosystem</span>
          <h2 className="text-2xl font-extrabold text-gray-900 mt-2 mb-12">
            In Collaboration with Sierra Leone Institutions
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {partners.map((partner, idx) => (
              <div 
                key={idx}
                className="bg-white border border-gray-200/70 p-6 rounded-xl shadow-sm flex flex-col items-center justify-center text-center group hover:border-brand-accent transition-colors"
              >
                <div className="w-12 h-12 bg-emerald-50 text-brand-primary rounded-full flex items-center justify-center mb-3 group-hover:bg-brand-accent/30 transition-colors">
                  <Building2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-gray-800 leading-tight">{partner.name}</h4>
                <p className="text-[10px] text-gray-400 font-semibold uppercase mt-1 tracking-wider">{partner.role}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white border border-gray-100 p-6 rounded-2xl inline-flex items-center gap-4 flex-wrap justify-center">
            <span className="text-xs text-gray-500 font-medium">Want to integrate ECOCLEAN into your region?</span>
            <button 
              onClick={() => onNavigate('login')}
              className="text-xs font-bold text-brand-primary hover:text-brand-secondary transition-colors inline-flex items-center gap-1 group"
            >
              <span>Submit Partner Inquiry</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

        </div>
      </section>

        </>
      )}

      {/* Interactive Footer & Newsletter */}
      <footer className="bg-[#051406] text-white pt-16 pb-8 border-t border-emerald-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 pb-12 border-b border-white/5">
            
            {/* Branding widget */}
            <div className="space-y-4 lg:col-span-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-secondary rounded-xl flex items-center justify-center text-white">
                  <Leaf className="w-5 h-5 text-brand-accent" strokeWidth={2} />
                </div>
                <div>
                  <span className="text-lg font-black tracking-tight block">ECOCLEAN <span className="text-brand-accent">SL</span></span>
                  <span className="text-[9px] text-emerald-300/60 font-mono tracking-widest block -mt-1">NATIONAL SMART INITIATIVE</span>
                </div>
              </div>
              <p className="text-xs text-emerald-100/60 leading-relaxed">
                Pioneering waste management infrastructure in Sierra Leone. Designed for civic health, municipal efficiency, and state policy compliance.
              </p>
              <div className="flex gap-3 pt-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-[10px] text-emerald-400 font-mono tracking-wider">ALL REGIONAL NETWORKS ACTIVE</span>
              </div>
            </div>

            {/* Links widget */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-brand-accent mb-4">MUNICIPAL HUB</h4>
              <ul className="space-y-2 text-xs text-emerald-100/60 font-medium">
                <li><a onClick={() => onNavigate('login')} className="hover:text-white cursor-pointer transition-colors block">Freetown City Portal</a></li>
                <li><a onClick={() => onNavigate('login')} className="hover:text-white cursor-pointer transition-colors block">Bo Municipal Portal</a></li>
                <li><a onClick={() => onNavigate('login')} className="hover:text-white cursor-pointer transition-colors block">Kenema Sanitation Board</a></li>
                <li><a onClick={() => onNavigate('login')} className="hover:text-white cursor-pointer transition-colors block">Makeni District Watch</a></li>
              </ul>
            </div>

            {/* Links widget */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-brand-accent mb-4">RESOURCES</h4>
              <ul className="space-y-2 text-xs text-emerald-100/60 font-medium">
                <li><a href="#features" className="hover:text-white transition-colors block">Platform Capabilities</a></li>
                <li><a onClick={onEnterOnboarding} className="hover:text-white cursor-pointer transition-colors block">Onboarding Walkthrough</a></li>
                <li><a onClick={() => onNavigate('login')} className="hover:text-white cursor-pointer transition-colors block">National Waste Standards</a></li>
                <li><a onClick={() => onNavigate('login')} className="hover:text-white cursor-pointer transition-colors block">Developer APIs</a></li>
                <li><a href="tel:*123%23" className="hover:text-white transition-colors block">USSD Demo: *123#</a></li>
              </ul>
            </div>

            {/* Newsletter form */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-brand-accent mb-4">STAY UPDATED</h4>
              <p className="text-xs text-emerald-100/60 leading-relaxed mb-4">
                Receive weekly analytics digests and environmental progress dispatches directly from the secretariat.
              </p>
              {newsletterSubscribed ? (
                <div className="bg-white/5 border border-white/10 p-3 rounded-lg text-emerald-300 text-xs text-center font-semibold">
                  ✓ Successfully subscribed to ECOCLEAN SL bulletins!
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <input 
                    type="email" 
                    required
                    placeholder="Enter email address" 
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 text-xs px-3 py-2 rounded-lg text-white focus:outline-none focus:border-brand-accent transition-colors"
                  />
                  <button 
                    type="submit"
                    className="bg-brand-secondary hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>

          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-emerald-100/40 gap-4">
            <div>
              <p>&copy; {new Date().getFullYear()} Samuel Mando Tucker. All Rights Reserved. ECOCLEAN SL.</p>
            </div>
            <div className="flex gap-6">
              <a onClick={() => onNavigate('login')} className="hover:text-white cursor-pointer transition-colors">Privacy Policy</a>
              <a onClick={() => onNavigate('login')} className="hover:text-white cursor-pointer transition-colors">Terms of Service</a>
              <a onClick={() => onNavigate('login')} className="hover:text-white cursor-pointer transition-colors">Security Rules</a>
            </div>
          </div>

        </div>
      </footer>

      {/* Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDemoModal(false)}
          />
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative z-10 border border-gray-100 shadow-2xl">
            <div className="flex items-center gap-3 mb-4 text-brand-primary">
              <div className="w-10 h-10 rounded-xl bg-brand-accent/20 flex items-center justify-center">
                <Play className="w-5 h-5 fill-brand-primary text-brand-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Watch ECOCLEAN SL Walkthrough</h3>
                <p className="text-xs text-gray-400 font-mono">Platform Demo Simulator</p>
              </div>
            </div>
            
            <div className="bg-gray-900 aspect-video rounded-xl flex flex-col items-center justify-center text-center p-6 text-white border border-gray-800 relative overflow-hidden mb-6">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
              <Leaf className="w-10 h-10 text-brand-accent mb-3 animate-bounce" />
              <p className="font-mono text-xs text-brand-accent">SIMULATOR ACTIVE &bull; SPRINT 1</p>
              <h4 className="text-sm font-bold mt-2 max-w-xs text-gray-100">"Sierra Leone’s Digitized Cleanup Operations Tour"</h4>
              <p className="text-[10px] text-gray-400 mt-2">Full video, voiceover instructions, and map-mockups will deploy in Sprint 2.</p>
              
              <div className="mt-4 flex items-center gap-1 text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded">
                <Clock className="w-3.5 h-3.5 text-brand-accent" />
                <span>Simulation runs for 1.5 minutes</span>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowDemoModal(false)}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-800 font-bold transition-colors"
              >
                Close Simulator
              </button>
              <button 
                onClick={() => {
                  setShowDemoModal(false);
                  onNavigate('login');
                }}
                className="bg-brand-primary hover:bg-brand-secondary text-white font-bold text-sm px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                Go to Portal Login
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
