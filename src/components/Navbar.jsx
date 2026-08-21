import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isUserAdmin = ['aman985284@gmail.com'].includes(user?.email);
  const userInitial = (user?.user_metadata?.full_name || user?.email || 'U')[0].toUpperCase();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/dashboard' },
    { name: 'Platform', path: '/platforms' },
    { name: 'Tasks', path: '/tasks' },
    { name: 'Notes', path: '/notes' },
    { name: 'Roadmap', path: '/browse' },
    { name: 'Leaderboard', path: '/leaderboard' },
  ];

  return (
    <div className="sticky top-0 z-50 bg-brand-navbar border-b border-theme-border px-6 py-4 relative overflow-visible">
      {/* Subtle grainy overlay for the vintage aesthetic */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}
      ></div>

      <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
        
        {/* Logo */}
        <h1 
          className="text-2xl font-black text-theme-text tracking-tight cursor-pointer" 
          onClick={() => navigate('/dashboard')}
        >
          Prep<span className="text-brand-primary">Log</span>
        </h1>

        {/* Center Navigation Tabs */}
        <div className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || 
                             (link.name === 'Roadmap' && location.pathname.startsWith('/roadmap'));
            return (
              <button
                key={link.name}
                onClick={() => navigate(link.path)}
                className={`px-5 py-2 rounded-xl font-medium transition-all ${
                  isActive 
                    ? 'bg-brand-muted text-brand-primary' 
                    : 'text-theme-textSec hover:text-theme-text'
                }`}
              >
                {link.name}
              </button>
            );
          })}
        </div>

        {/* Right Side Icons & Profile */}
        <div className="flex items-center gap-4">
          
          {isUserAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className="hidden md:flex items-center gap-2 bg-brand-muted text-brand-primary text-xs px-3 py-1.5 rounded-full font-bold border border-brand-primary/30 hover:bg-brand-primary/20 transition-all cursor-pointer"
            >
              ⚡ ADMIN
            </button>
          )}

          {/* Theme Toggle */}
          <div 
            onClick={toggleTheme}
            className={`flex w-14 h-8 rounded-full items-center px-1 cursor-pointer transition-colors border ${
              theme === 'dark' ? 'bg-[#111111] border-[#262626] justify-end' : 'bg-gray-200 border-gray-300 justify-start'
            }`}
          >
             <div className="w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center shadow-sm">
               {theme === 'dark' ? (
                 <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
               ) : (
                 <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
               )}
             </div>
          </div>

          {/* Notification Bell */}
          <button className="w-10 h-10 rounded-full border border-theme-border bg-transparent flex items-center justify-center text-theme-textSec hover:text-theme-text hover:bg-brand-dark transition-all cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          </button>

          {/* User Avatar Dropdown */}
          <div className="relative border-l border-theme-border pl-4 ml-1" ref={dropdownRef}>
            <div 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-lg shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
            >
              {userInitial}
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-brand-dark border border-theme-border rounded-xl shadow-xl py-2 z-50 text-sm">
                <button onClick={() => { navigate(`/profile/${user?.id}`); setDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 text-theme-textSec hover:text-theme-text hover:bg-brand-muted/30 transition-colors flex items-center gap-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  My profile
                </button>
                <button onClick={() => { navigate('/dashboard'); setDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 text-theme-textSec hover:text-theme-text hover:bg-brand-muted/30 transition-colors flex items-center gap-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                  My course
                </button>
                <button onClick={() => { navigate('/platforms'); setDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 text-theme-textSec hover:text-theme-text hover:bg-brand-muted/30 transition-colors flex items-center gap-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                  Platform
                </button>
                <button onClick={() => { navigate('/chat'); setDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 text-theme-textSec hover:text-theme-text hover:bg-brand-muted/30 transition-colors flex items-center gap-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                  Chat
                </button>
                <button onClick={() => { navigate('/tasks'); setDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 text-theme-textSec hover:text-theme-text hover:bg-brand-muted/30 transition-colors flex items-center gap-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                  Tasks
                </button>
                <button onClick={() => { navigate('/notes'); setDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 text-theme-textSec hover:text-theme-text hover:bg-brand-muted/30 transition-colors flex items-center gap-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                  Notes
                </button>
                <button onClick={() => { navigate('/browse'); setDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 text-theme-textSec hover:text-theme-text hover:bg-brand-muted/30 transition-colors flex items-center gap-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                  Roadmap
                </button>
                <button onClick={() => { navigate('/leaderboard'); setDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 text-theme-textSec hover:text-theme-text hover:bg-brand-muted/30 transition-colors flex items-center gap-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                  Leaderboard
                </button>
                <button onClick={() => { navigate('/activity'); setDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 text-theme-textSec hover:text-theme-text hover:bg-brand-muted/30 transition-colors flex items-center gap-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                  Activity
                </button>
                <div className="border-t border-theme-border my-1"></div>
                <button onClick={() => { signOut(); setDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
