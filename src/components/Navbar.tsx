import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Briefcase, User, LogOut, Bell, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="border-b border-slate-100 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-sm flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white"></div>
            </div>
            <span className="text-slate-900 font-bold tracking-tight text-xl uppercase tracking-tighter">HireHub</span>
          </Link>

          <div className="flex items-center gap-6">
            {profile ? (
              <>
                <Link 
                  to={profile.role === 'recruiter' ? '/recruiter' : '/candidate'} 
                  className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                
                <div className="relative">
                  <Bell className="w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-900 transition-colors" />
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                </div>

                <div className="h-4 w-px bg-slate-200" />

                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-slate-900 leading-none">{profile.displayName}</p>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-1">{profile.role}</p>
                  </div>
                  {profile.photoURL ? (
                    <img src={profile.photoURL} alt={profile.displayName} className="w-9 h-9 rounded bg-slate-100 border border-slate-200" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-9 h-9 rounded bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-400">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="p-1.5 hover:bg-slate-100 rounded transition-colors text-slate-400 hover:text-slate-900"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <Link 
                to="/" 
                className="btn-primary"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
