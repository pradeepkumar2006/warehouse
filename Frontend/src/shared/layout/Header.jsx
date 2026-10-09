import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  Bell, 
  User, 
  Sun, 
  Moon, 
  LogOut, 
  ChevronDown, 
  Sparkles,
  Lock
} from 'lucide-react';

export default function Header({
  activeTitle = 'Command Center Overview',
  isAdmin = true,
  currentUser,
  onSwitchRole,
  onNavigateAlerts,
  alertsCount = 5,
  onOpenProfile,
  onLogout,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between shadow-2xs">
      
      {/* Left: Breadcrumb & Title */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-400">
          <span>TwinFlow</span>
          <span>/</span>
          <span className="text-slate-950 font-extrabold">{activeTitle}</span>
        </div>
        <div className="hidden md:flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-mono font-bold border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Edge Synced</span>
        </div>
      </div>

      {/* Right: PERSISTENT VIOLET ADMIN BADGE / USER BADGE + Switch Role + Alerts + User Menu */}
      <div className="flex items-center space-x-3">
        
        {/* VIOLET ADMIN BADGE OR OPERATOR BADGE */}
        {isAdmin ? (
          <div 
            className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-violet-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-sm shadow-violet-500/20"
            title="Active session authenticated with root administrator privileges"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-violet-200" />
            <span>Admin</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200">
            <span>User / Operator</span>
          </div>
        )}

        {/* Switch Persona Helper (Direct Toggle for Viva & Testing) */}
        <button
          onClick={onSwitchRole}
          className="hidden sm:flex text-xs font-bold text-slate-500 hover:text-slate-950 hover:bg-slate-100 px-2.5 py-1 rounded-xl transition-colors border border-slate-200"
          title="Toggle current demonstration persona between Admin and User"
        >
          Switch Role
        </button>

        {/* Alert Bell */}
        <button
          onClick={onNavigateAlerts}
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition-colors"
          title="View Bottleneck Alerts"
        >
          <Bell className="w-4 h-4" />
          {alertsCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          )}
        </button>

        {/* Top Bar User Menu: My Profile, Theme, Logout */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center space-x-2 p-1 pl-2 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all select-none"
          >
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shadow-xs">
              {currentUser?.username?.slice(0, 2).toUpperCase() || 'OP'}
            </div>
            <span className="text-xs font-bold text-slate-800 hidden md:inline truncate max-w-[120px]">
              {currentUser?.displayName || 'User'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 animate-fadeIn font-sans">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-black text-slate-900 truncate">
                  {currentUser?.displayName || 'Operator User'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {currentUser?.email || 'user@twinflow.ai'}
                </p>
                <div className="mt-1">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    isAdmin ? 'bg-violet-50 text-violet-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {isAdmin ? 'System Administrator' : 'Operator (User)'}
                  </span>
                </div>
              </div>

              {/* Menu Item 1: My Profile */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  if (onOpenProfile) onOpenProfile();
                }}
                className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-2.5 transition-colors"
              >
                <User className="w-4 h-4 text-slate-500" />
                <span>My Profile</span>
              </button>

              {/* Menu Item 2: Theme Toggle */}
              <button
                onClick={handleToggleTheme}
                className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  {isDarkMode ? <Moon className="w-4 h-4 text-slate-500" /> : <Sun className="w-4 h-4 text-amber-500" />}
                  <span>Theme</span>
                </div>
                <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-[10px] font-mono text-slate-600 font-bold">
                  {isDarkMode ? 'Dark' : 'Light'}
                </span>
              </button>

              <div className="border-t border-slate-100 my-1" />

              {/* Menu Item 3: Logout */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  if (onLogout) onLogout();
                }}
                className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center space-x-2.5 transition-colors"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

      </div>

    </header>
  );
}
