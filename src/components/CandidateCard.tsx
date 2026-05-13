import React from 'react';
import { UserProfile, CandidateProfile } from '../types';
import { Briefcase, MapPin, ExternalLink, Calendar, PlusCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface CandidateCardProps {
  user: UserProfile;
  candidate: CandidateProfile;
  onViewPortfolio: (id: string) => void;
  onScheduleInterview: (id: string) => void;
  onApply?: (id: string) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({ user, candidate, onViewPortfolio, onScheduleInterview, onApply }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-100 rounded-xl p-6 hover:shadow-lg transition-all group flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName} className="w-12 h-12 rounded bg-slate-100 object-cover border border-slate-100" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-12 h-12 rounded bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-sm">
              {user.displayName.substring(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="text-sm font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">{user.displayName}</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              {candidate.experience} Years Exp.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8 flex-grow">
        <p className="text-slate-500 line-clamp-3 text-xs leading-relaxed font-medium mb-6 italic">
          "{candidate.bio}"
        </p>
        <div className="flex flex-wrap gap-2">
          {candidate.skills?.slice(0, 4).map(skill => (
            <span key={skill} className="px-2 py-1 bg-slate-50 text-slate-500 text-[9px] font-bold uppercase tracking-[0.15em] rounded-sm border border-slate-100">
              {skill}
            </span>
          ))}
          {candidate.skills?.length > 4 && (
            <span className="px-2 py-1 text-slate-300 text-[9px] font-bold uppercase tracking-widest">
              +{candidate.skills.length - 4} MORE
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-6 border-t border-slate-100">
        <button 
          onClick={() => candidate.portfolioUrl && window.open(candidate.portfolioUrl, '_blank')}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 text-slate-900 text-[10px] font-bold uppercase tracking-widest rounded transition-colors hover:bg-slate-100"
        >
          <ExternalLink className="w-3 h-3" />
          PORTFOLIO
        </button>
        <button 
          onClick={() => onScheduleInterview(user.id)}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded transition-colors hover:bg-slate-800"
        >
          <Calendar className="w-3 h-3" />
          INTERVIEW
        </button>
      </div>
    </motion.div>
  );
};

export default CandidateCard;
