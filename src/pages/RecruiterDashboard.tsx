import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { UserProfile, CandidateProfile, Application } from '../types';
import CandidateCard from '../components/CandidateCard';
import InterviewModal from '../components/InterviewModal';
import { Search, Filter, Briefcase, Users, LayoutDashboard, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function RecruiterDashboard() {
  const { user, profile } = useAuth();
  const [candidates, setCandidates] = useState<{ user: UserProfile, candidate: CandidateProfile }[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSkill, setFilterSkill] = useState('');
  const [minExperience, setMinExperience] = useState(0);
  
  // UI State
  const [activeTab, setActiveTab] = useState<'browse' | 'applications'>('browse');
  const [selectedCandidate, setSelectedCandidate] = useState<{ id: string, name: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all candidates
        const candidateSnap = await getDocs(collection(db, 'candidates'));
        const userSnap = await getDocs(query(collection(db, 'users'), where('role', '==', 'candidate')));
        
        const userMap = new Map();
        userSnap.docs.forEach(doc => userMap.set(doc.id, { id: doc.id, ...doc.data() }));

        const candidateList = candidateSnap.docs.map(doc => ({
          user: userMap.get(doc.id) as UserProfile,
          candidate: { userId: doc.id, ...doc.data() } as CandidateProfile
        })).filter(item => item.user);

        setCandidates(candidateList);

        // Fetch applications for this recruiter
        if (user) {
          const appSnap = await getDocs(query(collection(db, 'applications'), where('recruiterId', '==', user.uid)));
          setApplications(appSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Application));
        }

      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'candidates/applications');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const filteredCandidates = candidates.filter(item => {
    const matchesSkill = filterSkill 
      ? item.candidate.skills?.some(s => s.toLowerCase().includes(filterSkill.toLowerCase()))
      : true;
    const matchesExperience = item.candidate.experience >= minExperience;
    return matchesSkill && matchesExperience;
  });

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 border-b border-slate-100 pb-8">
        <div>
          <span className="label-eyebrow mb-3 block">Recruiter Hub</span>
          <h1 className="text-4xl font-bold tracking-tighter text-slate-900 mb-2 underline decoration-blue-500 decoration-4 underline-offset-8">Candidate Pipeline</h1>
          <p className="text-slate-400 text-sm font-medium">Manage and Discover the next generation of engineering talent.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-sm">
          <button 
            onClick={() => setActiveTab('browse')}
            className={`px-8 py-2.5 rounded-sm text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === 'browse' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Talent Grid
          </button>
          <button 
            onClick={() => setActiveTab('applications')}
            className={`px-8 py-2.5 rounded-sm text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === 'applications' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Applications
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-12">
        <div className="p-6 border border-slate-100 rounded-sm bg-white shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Talent in Pipeline</p>
          <p className="text-3xl font-bold text-slate-900">{candidates.length}</p>
        </div>
        <div className="p-6 border border-slate-100 rounded-sm bg-white shadow-sm border-l-4 border-l-blue-500">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">New Applications</p>
          <p className="text-3xl font-bold text-slate-900">{applications.length}</p>
        </div>
        <div className="p-6 border border-slate-100 rounded-sm bg-white shadow-sm border-l-4 border-l-slate-900">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Hire Rate</p>
          <p className="text-3xl font-bold text-slate-900">8%</p>
        </div>
      </div>

      {activeTab === 'browse' ? (
        <div className="grid lg:grid-cols-[280px_1fr] gap-10">
          <aside className="space-y-6">
            <div className="bg-white border border-slate-100 rounded-sm p-8 sticky top-24 shadow-sm">
              <div className="flex items-center gap-2 mb-8 text-[11px] font-bold uppercase tracking-widest text-slate-900">
                <Filter className="w-4 h-4 text-blue-500" />
                Talent Filters
              </div>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-4 uppercase tracking-widest">Skill Search</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input 
                      type="text"
                      placeholder="e.g. React, Node"
                      value={filterSkill}
                      onChange={(e) => setFilterSkill(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-sm border-none focus:ring-1 focus:ring-slate-200 outline-none transition-all text-xs font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Experience</label>
                    <span className="text-xs font-bold text-slate-900">{minExperience}Y+</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="20"
                    value={minExperience}
                    onChange={(e) => setMinExperience(Number(e.target.value))}
                    className="w-full accent-slate-900 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="pt-8 border-t border-slate-100">
                  <button 
                    onClick={() => { setFilterSkill(''); setMinExperience(0); }}
                    className="w-full py-3 text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-[0.2em]"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <main className="space-y-8">
             <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCandidates.map(item => (
                  <CandidateCard 
                    key={item.user.id} 
                    user={item.user} 
                    candidate={item.candidate}
                    onViewPortfolio={(id) => {}}
                    onScheduleInterview={(id) => setSelectedCandidate({ id, name: item.user.displayName })}
                  />
                ))}
                {filteredCandidates.length === 0 && (
                  <div className="col-span-full py-32 text-center border-2 border-dashed border-slate-200 rounded-sm bg-slate-50">
                     <Users className="w-12 h-12 text-slate-200 mx-auto mb-6" />
                     <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No matching talent in grid.</p>
                  </div>
                )}
              </div>
          </main>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-sm overflow-hidden shadow-sm">
          <div className="bg-slate-50 p-6 border-b border-slate-100 grid grid-cols-4 text-[10px] font-bold uppercase text-slate-400 tracking-widest">
            <span>Candidate</span>
            <span>Current Status</span>
            <span>Submission Date</span>
            <span className="text-right">Manage</span>
          </div>
          <div className="divide-y divide-slate-50">
            {applications.length > 0 ? applications.map(app => (
              <div key={app.id} className="grid grid-cols-4 p-6 items-center hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-[10px]">
                    {app.candidateId.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-slate-900">{app.candidateId}</span>
                </div>
                <div>
                  <span className={`px-2 py-1 rounded-sm text-[9px] font-bold uppercase tracking-[0.15em] border ${
                    app.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                    app.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {app.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium">{new Date(app.createdAt?.seconds * 1000).toLocaleDateString()}</div>
                <div className="text-right">
                  <button className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest">Pipeline Review</button>
                </div>
              </div>
            )) : (
              <div className="py-24 text-center text-slate-300 font-bold uppercase tracking-[0.25em] text-[10px] bg-slate-50/50">
                Pipeline is currently empty.
              </div>
            )}
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedCandidate && (
          <InterviewModal 
            candidateId={selectedCandidate.id}
            candidateName={selectedCandidate.name}
            recruiterId={user?.uid || ''}
            onClose={() => setSelectedCandidate(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
