import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Leaf, 
  MapPin, 
  Trash2, 
  ShieldCheck, 
  ChevronRight, 
  ArrowRight, 
  Sparkles, 
  Compass, 
  TrendingUp, 
  Award,
  Smartphone
} from 'lucide-react';
import { ViewState } from '../types';

interface SplashOnboardingProps {
  onComplete: (nextView: ViewState) => void;
  onBackToLanding: () => void;
}

export default function SplashOnboarding({ onComplete, onBackToLanding }: SplashOnboardingProps) {
  const [currentStep, setCurrentStep] = useState<number>(0); // 0 = Splash, 1-6 = Onboarding steps
  const [direction, setDirection] = useState<number>(1);

  // Auto-advance from Splash to Screen 1 after 2.5 seconds
  useEffect(() => {
    if (currentStep === 0) {
      const timer = setTimeout(() => {
        handleNext();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const steps = [
    {
      title: 'ECOCLEAN SL',
      subtitle: 'Smart City Initiative',
      description: 'Sierra Leone’s premier smart waste management platform, engineered to transform urban environmental health and governance.',
      icon: Leaf,
      color: 'from-emerald-800 to-green-950',
      badge: 'Sierra Leone Government Initiative'
    },
    {
      title: 'Welcome to ECOCLEAN SL',
      subtitle: 'The Smart City Vision',
      description: 'A unified digital platform connecting citizens, municipal councils, collection teams, and government partners for a cleaner Sierra Leone.',
      icon: ShieldCheck,
      color: 'from-green-800 to-emerald-950',
      badge: 'National Launch'
    },
    {
      title: 'Cleaner Communities',
      subtitle: 'Direct Reporting',
      description: 'Report waste piles instantly. Drop a pin on the GIS map, snap a photo, and notify the nearest collection crew in Freetown, Bo, Kenema, or Makeni.',
      icon: Sparkles,
      color: 'from-emerald-700 to-green-900',
      badge: 'Community Action'
    },
    {
      title: 'Smarter Waste Management',
      subtitle: 'GIS-Optimized Operations',
      description: 'Enabling municipal crews and private operators to track bins, utilize real-time routing, and respond swiftly to waste challenges.',
      icon: Trash2,
      color: 'from-green-700 to-emerald-900',
      badge: 'Operational Excellence'
    },
    {
      title: 'Environmental Impact',
      subtitle: 'Data-Driven Future',
      description: 'Pioneering ecological tracking. Understand waste metrics, track collection rates, and work together to preserve the natural beauty of Salone.',
      icon: TrendingUp,
      color: 'from-emerald-800 to-emerald-950',
      badge: 'Eco Analytics'
    },
    {
      title: 'Smart City Vision',
      subtitle: 'Ready for Deployment',
      description: 'Modernizing national public service delivery, fostering government transparency, and creating clean green opportunities for all citizens.',
      icon: Compass,
      color: 'from-green-800 to-green-950',
      badge: 'Governance 2.0'
    },
    {
      title: 'Get Started Now',
      subtitle: 'Create Your Account',
      description: 'Select your portal and play your part in keeping our communities beautiful. Log in with a demo account or sign up below.',
      icon: Award,
      color: 'from-emerald-900 to-green-950',
      badge: 'Join Us Today'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete('login');
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    } else if (currentStep === 1) {
      onBackToLanding();
    }
  };

  const handleSkip = () => {
    onComplete('login');
  };

  // Render Splash (step 0)
  if (currentStep === 0) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-[#1B5E20] to-[#0A320F] flex flex-col items-center justify-center text-white p-6 z-50 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(67,160,71,0.2)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(200,230,201,0.15)_0%,transparent_50%)]" />
        
        {/* Animated Leaf Grid */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="text-center relative z-10 flex flex-col items-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(200,230,201,0.3)] border border-white/20 mb-6"
          >
            <Leaf className="w-12 h-12 text-[#C8E6C9]" strokeWidth={1.5} />
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight"
          >
            ECOCLEAN <span className="text-[#C8E6C9]">SL</span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-emerald-200/80 text-sm font-mono tracking-widest mt-2 uppercase"
          >
            Smart Waste & Environment System
          </motion.p>
          
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 140 }}
            transition={{ delay: 0.9, duration: 1 }}
            className="h-1 bg-gradient-to-r from-emerald-400 to-green-300 rounded-full mt-6"
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="mt-12 flex items-center gap-2 text-xs text-emerald-200/60 font-mono"
          >
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
            <span>INITIALIZING NATIONAL GATEWAY...</span>
          </motion.div>
        </div>
      </div>
    );
  }

  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData.icon;

  return (
    <div className="fixed inset-0 bg-[#071909] text-white flex flex-col z-50 overflow-hidden font-sans">
      {/* Top Banner & Skip */}
      <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center z-20">
        <button 
          onClick={onBackToLanding}
          className="text-sm font-medium text-emerald-200/70 hover:text-white transition-colors flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5"
        >
          <span>← Back to Site</span>
        </button>
        <button 
          onClick={handleSkip}
          className="text-sm font-medium text-emerald-300 hover:text-emerald-100 transition-colors bg-emerald-950/40 border border-emerald-800/50 px-4 py-1.5 rounded-full"
        >
          Skip Onboarding
        </button>
      </div>

      {/* Screen Slide Content */}
      <div className={`flex-1 flex flex-col items-center justify-center relative bg-gradient-to-b ${currentStepData.color} transition-all duration-1000 px-6 py-20`}>
        {/* Ambient Lights */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(200,230,201,0.15)_0%,transparent_60%)] pointer-events-none" />
        
        <div className="max-w-md w-full text-center relative z-10 flex flex-col items-center">
          
          {/* Badge */}
          <motion.span 
            key={`badge-${currentStep}`}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 bg-emerald-300/10 text-emerald-300 border border-emerald-500/20 text-xs font-mono px-3.5 py-1 rounded-full uppercase tracking-wider"
          >
            {currentStepData.badge}
          </motion.span>

          {/* Icon Stage */}
          <div className="relative mb-10">
            <motion.div 
              key={`icon-glow-${currentStep}`}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1.1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              className="absolute inset-0 bg-emerald-400/20 blur-3xl rounded-full scale-125"
            />
            <motion.div 
              key={`icon-${currentStep}`}
              initial={{ scale: 0.8, rotate: direction * 15, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
              className="w-28 h-28 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] flex items-center justify-center shadow-2xl relative"
            >
              <StepIcon className="w-14 h-14 text-emerald-200" strokeWidth={1.5} />
            </motion.div>
          </div>

          {/* Title & Description */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${currentStep}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="space-y-4"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {currentStepData.title}
              </h2>
              <p className="text-emerald-300 font-medium text-lg">
                {currentStepData.subtitle}
              </p>
              <p className="text-emerald-100/80 leading-relaxed text-sm md:text-base max-w-sm mx-auto">
                {currentStepData.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Form Actions (Only for final Step: Welcome Screen 6) */}
          {currentStep === steps.length - 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full grid grid-cols-2 gap-4 mt-8"
            >
              <button 
                onClick={() => onComplete('login')}
                className="bg-white text-emerald-950 font-bold px-6 py-3.5 rounded-xl hover:bg-emerald-50 active:scale-95 transition-all text-sm shadow-lg flex items-center justify-center gap-2"
              >
                Log In
              </button>
              <button 
                onClick={() => onComplete('register')}
                className="bg-emerald-600 hover:bg-emerald-500 border border-emerald-400/30 text-white font-bold px-6 py-3.5 rounded-xl active:scale-95 transition-all text-sm shadow-lg flex items-center justify-center gap-2"
              >
                Register
              </button>
            </motion.div>
          )}

        </div>
      </div>

      {/* Bottom Controls / Stepper */}
      <div className="bg-[#051406]/95 border-t border-emerald-900/40 px-6 py-6 flex items-center justify-between z-20">
        {/* Step Indicator Bullets */}
        <div className="flex gap-1.5">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (idx > 0) {
                  setDirection(idx > currentStep ? 1 : -1);
                  setCurrentStep(idx);
                }
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === 0 ? 'hidden' : ''
              } ${
                idx === currentStep 
                  ? 'w-6 bg-emerald-400' 
                  : 'w-2 bg-emerald-800/60 hover:bg-emerald-700'
              }`}
              title={`Go to step ${idx}`}
            />
          ))}
        </div>

        {/* Prev & Next Controls */}
        <div className="flex items-center gap-3">
          {currentStep > 1 && (
            <button 
              onClick={handlePrev}
              className="px-5 py-2.5 rounded-xl border border-emerald-800/60 text-emerald-300 hover:text-white hover:bg-emerald-950/40 text-sm font-semibold transition-colors"
            >
              Back
            </button>
          )}
          
          {currentStep < steps.length - 1 ? (
            <button 
              onClick={handleNext}
              className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 text-sm"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4 text-emerald-950" />
            </button>
          ) : (
            currentStep !== steps.length - 1 && (
              <button 
                onClick={handleSkip}
                className="bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 text-sm"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 text-emerald-950" />
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
