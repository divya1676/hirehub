import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, getDocs, query, where, orderBy, doc, getDoc } from 'firebase/firestore';
import { Application, Interview, Notification } from '../types';
import { LayoutDashboard, Calendar, Clock, Bell, Settings, FileText, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';

export default function CandidateDashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // First check if candidate document exists, if not redirect to setup
        const candidateDocRef = doc(db, 'candidates', user.uid);
        const candidateDocSnap = await getDoc(candidateDocRef);
        
        if (!candidateDocSnap.exists()) {
          console.log("Candidate profile missing, redirecting to setup...");
          navigate('/candidate/edit-portfolio');
          return;
        }

        // Fetch applications
        const appSnap = await getDocs(query(collection(db, 'applications'), where('candidateId', '==', user.uid)));
        setApplications(appSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Application));

        // Fetch interviews
        const intSnap = await getDocs(query(collection(db, 'interviews'), where('candidateId', '==', user.uid)));
        setInterviews(intSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Interview));

        // Fetch notifications
        const notifSnap = await getDocs(query(collection(db, 'notifications'), where('userId', '==', user.uid)));
        setNotifications(notifSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Notification));

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 border-b border-slate-100 pb-8">
        <div>
          <span className="label-eyebrow mb-3 block">Candidate Portal</span>
          <h1 className="text-4xl font-bold tracking-tighter text-slate-900 mb-2">Workspace Overview</h1>
          <p className="text-slate-400 text-sm font-medium">Track your applications, upcoming interviews, and professional network.</p>
        </div>
        <Link 
          to="/candidate/edit-portfolio"
          className="btn-secondary flex items-center gap-2"
        >
          <Settings className="w-3.5 h-3.5" />
          Edit Portfolio
        </Link>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-10">
        <div className="space-y-12">
          {/* Applications Section */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 uppercase tracking-tighter">Active Applications</h2>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{applications.length} Items</span>
            </div>
            
            <div className="space-y-3">
              {applications.length > 0 ? applications.map(app => (
                <motion.div 
                  key={app.id}
                  whileHover={{ x: 2 }}
                  className="bg-white border border-slate-100 rounded-sm p-6 flex items-center justify-between hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-10 h-10 bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-colors rounded-sm">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Recruiter ID: {app.recruiterId.substring(0, 8)}...</h4>
                      <p className="text-[10px] text-slate-400 font-bold tracking-[0.15em] uppercase mt-1">Submitted {new Date(app.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <span className={`px-3 py-1 rounded-sm text-[9px] font-bold uppercase tracking-[0.2em] border ${
                      app.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      app.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      app.status === 'interviewing' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      'bg-slate-50 text-slate-500 border-slate-100'
                    }`}>
                      {app.status}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-200" />
                  </div>
                </motion.div>
              )) : (
                <div className="py-16 px-6 border border-dashed border-slate-200 rounded-sm text-center bg-slate-50">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">No active applications currently.</p>
                </div>
              )}
            </div>
          </section>

          {/* Past Reviews / Status section */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-8 text-slate-900 uppercase tracking-tighter">System Feedback</h2>
            <div className="bg-slate-50 rounded-sm p-12 text-center border border-slate-100 border-l-4 border-l-blue-500">
               <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Feedback from recruiters will be visualized here.</p>
            </div>
          </section>
        </div>

        <aside className="space-y-8">
          {/* Upcoming Interviews */}
          <div className="bg-slate-900 text-white rounded-sm p-8 shadow-xl">
            <h3 className="text-[11px] font-bold mb-8 flex items-center gap-2 uppercase tracking-[0.25em] text-blue-400">
              <Calendar className="w-4 h-4" />
              Interview Grid
            </h3>
            <div className="space-y-8">
              {interviews.length > 0 ? interviews.map(item => (
                <div key={item.id} className="border-l border-slate-700 pl-5 py-1">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                    {new Date(item.scheduledAt?.seconds * 1000).toLocaleDateString()}
                  </p>
                  <p className="text-sm font-bold mb-2 tracking-tight">{item.location}</p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(item.scheduledAt?.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              )) : (
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest text-center py-4">No scheduled events.</p>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white border border-slate-100 rounded-sm p-8 shadow-sm">
            <h3 className="text-[11px] font-bold mb-8 flex items-center gap-2 uppercase tracking-[0.25em] text-slate-900">
              <Bell className="w-4 h-4 text-blue-500" />
              Communication
            </h3>
            <div className="space-y-3">
              {notifications.length > 0 ? notifications.slice(0, 5).map(notif => (
                <div key={notif.id} className={`p-4 rounded-sm border ${notif.read ? 'bg-white border-slate-50 opacity-40' : 'bg-slate-50 border-slate-100'}`}>
                  <p className="text-[11px] font-bold text-slate-700 leading-tight mb-2 tracking-tight">{notif.message}</p>
                  <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                    {new Date(notif.createdAt?.seconds * 1000).toLocaleDateString()}
                  </span>
                </div>
              )) : (
                <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest text-center py-4">Status: Optimal</p>
              )}
            </div>
            {notifications.length > 5 && (
              <button className="w-full mt-8 py-3 text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-[0.2em] border-t border-slate-50">
                Full Log
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
