import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Link as LinkIcon, FileText, Code, Award, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function CandidatePortfolioForm() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState(0);
  const [resumeUrl, setResumeUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  useEffect(() => {
    if (!user || profile?.role !== 'candidate') {
      navigate('/');
      return;
    }

    const fetchCandidateData = async () => {
      try {
        const docRef = doc(db, 'candidates', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setBio(data.bio || '');
          setSkills(data.skills?.join(', ') || '');
          setExperience(data.experience || 0);
          setResumeUrl(data.resumeUrl || '');
          setPortfolioUrl(data.portfolioUrl || '');
        }
      } catch (error) {
        console.error("Error fetching candidate data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateData();
  }, [user, profile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    const candidateData = {
      userId: user.uid,
      bio,
      skills: skills.split(',').map(s => s.trim()).filter(s => s !== ''),
      experience: Number(experience),
      resumeUrl,
      portfolioUrl,
      updatedAt: serverTimestamp(),
    };

    try {
      await setDoc(doc(db, 'candidates', user.uid), candidateData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `candidates/${user.uid}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <span className="label-eyebrow mb-4 block">Information Gateway</span>
        <h1 className="text-4xl font-bold tracking-tighter text-slate-900 mb-4">Portfolio Blueprint</h1>
        <p className="text-slate-400 text-sm font-medium">Define your professional identity for the recruitment network.</p>
      </div>

      <div className="bg-white border border-slate-100 rounded-sm shadow-sm p-10 sm:p-16">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Bio Section */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              <User className="w-3.5 h-3.5" />
              Professional Bio
            </label>
            <textarea
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Your professional mission and core competencies..."
              className="w-full h-32 p-4 bg-slate-50 border border-slate-100 rounded-sm focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none text-sm font-medium"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-10">
            {/* Skills */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                <Code className="w-3.5 h-3.5" />
                Skill Stack
              </label>
              <input
                type="text"
                required
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Comma separated list"
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-sm focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
              />
            </div>

            {/* Experience */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                <Award className="w-3.5 h-3.5" />
                Experience (Years)
              </label>
              <input
                type="number"
                min="0"
                required
                value={experience}
                onChange={(e) => setExperience(Number(e.target.value))}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-sm focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-10">
            {/* Resume URL */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                <FileText className="w-3.5 h-3.5" />
                Resume Repository
              </label>
              <input
                type="url"
                required
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="Cloud storage link"
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-sm focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
              />
            </div>

            {/* Portfolio URL */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                <LinkIcon className="w-3.5 h-3.5" />
                Portfolio Hub
              </label>
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="Public showcase link"
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-sm focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {success && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-emerald-600 font-bold text-[11px] uppercase tracking-widest"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Grid Synced
                </motion.div>
              )}
            </div>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Processing...' : 'Publish Profile'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="mt-12 bg-slate-50 p-8 rounded-sm border-l-4 border-l-slate-900 border border-slate-100 text-slate-600 flex items-start gap-4 shadow-sm">
        <div className="p-2 bg-slate-900 rounded-sm text-white mt-1">
          <Award className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-bold text-[11px] uppercase tracking-widest mb-2 text-slate-900 underline decoration-blue-500 underline-offset-4">Success Strategy</h3>
          <p className="text-xs font-medium leading-relaxed">Ensure your portfolio hub contains visual case studies. Mathematical balance between skills and project proof yields 3x higher recruiter engagement.</p>
        </div>
      </div>
    </div>
  );
}
