import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import CandidatePortfolioForm from './pages/CandidatePortfolioForm';
import RecruiterDashboard from './pages/RecruiterDashboard';
import CandidateDashboard from './pages/CandidateDashboard';

function ProtectedRoute({ children, role }: { children: React.ReactNode, role?: 'candidate' | 'recruiter' }) {
  const { user, profile, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/" />;
  
  // If we are waiting for profile but have user, we might be in a transitional state
  if (!profile && role) {
    // This is the "taking details" phase or loading profile phase
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Synchronizing Profile...</p>
      </div>
    );
  }

  if (role && profile?.role !== role) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            
            {/* Candidate Routes */}
            <Route path="/candidate" element={
              <ProtectedRoute role="candidate">
                <CandidateDashboard />
              </ProtectedRoute>
            } />
            <Route path="/candidate/edit-portfolio" element={
              <ProtectedRoute role="candidate">
                <CandidatePortfolioForm />
              </ProtectedRoute>
            } />

            {/* Recruiter Routes */}
            <Route path="/recruiter" element={
              <ProtectedRoute role="recruiter">
                <RecruiterDashboard />
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
