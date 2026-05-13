import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Briefcase, UserRound, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const { signInWithGoogle, profile, error: authError } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (profile) {
      if (profile.role === 'recruiter') navigate('/recruiter');
      else navigate('/candidate');
    }
  }, [profile, navigate]);

  const handleSignIn = async (role: 'recruiter' | 'candidate') => {
    try {
      await signInWithGoogle(role);
    } catch (error) {
      // Error is now handled in AuthContext and exposed via authError
      console.error("Sign in catch block:", error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center items-center px-4 py-20 bg-slate-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full text-center mb-24"
      >
        <span className="inline-block px-4 py-1.5 mb-8 text-[11px] font-bold tracking-[0.2em] text-blue-600 uppercase bg-blue-50 border border-blue-100 rounded-sm">
          Precision Hiring Platform
        </span>
        <h1 className="text-7xl font-bold tracking-tighter text-slate-900 mb-8 leading-[0.9]">
          The Grid for <span className="text-blue-500">Elite</span> Talent.
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed font-medium mb-8">
          A geometrically balanced approach to connecting world-class recruiters with high-impact candidates.
        </p>

        {authError && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-100 p-4 rounded-sm max-w-md mx-auto text-red-600 text-xs font-bold uppercase tracking-widest leading-relaxed mb-8 shadow-sm"
          >
            System Error: {authError}
            <div className="mt-2 text-[10px] text-red-400 font-medium lowercase tracking-normal">
              Try opening the application in a new tab if popups fail.
            </div>
          </motion.div>
        )}
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 max-w-5xl w-full px-4">
        <motion.div 
          whileHover={{ y: -4 }}
          className="group relative bg-slate-900 text-white p-12 rounded-sm overflow-hidden cursor-pointer h-[420px] flex flex-col justify-between shadow-2xl"
          onClick={() => handleSignIn('recruiter')}
        >
          <div className="relative z-10">
            <div className="w-12 h-12 bg-blue-500 rounded-sm flex items-center justify-center mb-8">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-6 tracking-tight">Recruiter.</h2>
            <p className="text-slate-400 text-base leading-relaxed font-medium">
              Access the candidate pipeline, browse portfolios, and schedule interviews within a unified talent grid.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-bold tracking-widest uppercase group-hover:gap-5 transition-all relative z-10 text-blue-400">
            <span>Enter Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </div>
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </motion.div>

        <motion.div 
          whileHover={{ y: -4 }}
          className="group relative bg-white border border-slate-200 p-12 rounded-sm overflow-hidden cursor-pointer h-[420px] flex flex-col justify-between shadow-sm"
          onClick={() => handleSignIn('candidate')}
        >
          <div className="relative z-10">
            <div className="w-12 h-12 bg-slate-100 rounded-sm flex items-center justify-center mb-8">
              <UserRound className="w-6 h-6 text-slate-900" />
            </div>
            <h2 className="text-4xl font-bold mb-6 tracking-tight text-slate-900">Candidate.</h2>
            <p className="text-slate-500 text-base leading-relaxed font-medium">
              Build your professional showcase, track application statuses, and land interviews at top companies.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-bold tracking-widest uppercase text-slate-900 group-hover:gap-5 transition-all relative z-10">
            <span>Create Portfolio</span>
            <ArrowRight className="w-4 h-4" />
          </div>
          {/* Subtle accent line */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 -translate-y-16 translate-x-16 rounded-full rotate-45" />
        </motion.div>
      </div>

      <div className="mt-24 pt-12 border-t border-slate-200 flex flex-wrap justify-center gap-x-16 gap-y-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> Portfolio First</div>
        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div> Real-time Pipeline</div>
        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div> Secure Gateway</div>
        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div> System Reviews</div>
      </div>
    </div>
  );
}
