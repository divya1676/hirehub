import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, MapPin, X, Check } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

interface InterviewModalProps {
  candidateId: string;
  candidateName: string;
  recruiterId: string;
  onClose: () => void;
}

export default function InterviewModal({ candidateId, candidateName, recruiterId, onClose }: InterviewModalProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('Google Meet');
  const [loading, setLoading] = useState(false);
  const [scheduled, setScheduled] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First create a new application if none exists? 
      // For simplicity, let's just create an interview record linked to the candidate
      // in a real app, an application usually precedes an interview
      const scheduledAt = new Date(`${date}T${time}`);
      
      await addDoc(collection(db, 'interviews'), {
        candidateId,
        recruiterId,
        scheduledAt,
        status: 'scheduled',
        location,
        createdAt: serverTimestamp(),
      });

      // Also create a notification for the candidate
      await addDoc(collection(db, 'notifications'), {
        userId: candidateId,
        message: `New interview scheduled: ${location} at ${scheduledAt.toLocaleString()}`,
        read: false,
        type: 'interview',
        createdAt: serverTimestamp(),
      });

      setScheduled(true);
      setTimeout(onClose, 2000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'interviews');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-sm w-full max-w-md overflow-hidden relative shadow-2xl border border-slate-100"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-1.5 hover:bg-slate-100 rounded transition-colors text-slate-400 hover:text-slate-900"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-10 sm:p-12">
          <div className="w-10 h-10 bg-blue-500 rounded-sm flex items-center justify-center mb-8">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          
          <span className="label-eyebrow mb-2 block">Scheduling Protocol</span>
          <h2 className="text-3xl font-bold tracking-tighter text-slate-900 mb-2">Invite Talent</h2>
          <p className="text-slate-400 mb-10 text-sm font-medium">Proposal for <span className="text-slate-900 font-bold whitespace-nowrap">{candidateName}</span></p>

          {scheduled ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-sm flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8" />
              </div>
              <p className="font-bold text-[11px] uppercase tracking-widest text-emerald-600 mb-2">Protocol Successful</p>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-[0.2em]">Interview Synchronized</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input 
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-sm focus:ring-1 focus:ring-slate-200 focus:bg-white transition-all outline-none text-xs font-semibold"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Time</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input 
                      type="time"
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-sm focus:ring-1 focus:ring-slate-200 focus:bg-white transition-all outline-none text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Hub / Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input 
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Zoom, Meet, or Office Address"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-sm focus:ring-1 focus:ring-slate-200 focus:bg-white transition-all outline-none text-xs font-semibold"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full btn-primary h-14"
              >
                {loading ? 'Processing...' : 'Sync Interview'}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
