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
  
  if (loading) return null;
  if (!user) return <Navigate to="/" />;
  if (role && profile?.role !== role) return <Navigate to="/" />;
  
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
