import React from 'react';
import { 
  Boxes, 
  Home, 
  Box, 
  TrendingUp, 
  Bell, 
  Bot, 
  Database, 
  Settings, 
  LogOut,
  FileText, 
  Radio, 
  Sliders,
  BarChart3,
  Users,
  Layers
} from 'lucide-react';
import { MENU_ITEMS } from '../../config/appConfig';

// Icon Map
const ICON_MAP = {
  Home,
  Radio,
  Box,
  TrendingUp,
  Bell,
  Sliders,
  BarChart3,
  FileText,
  Users,
  Layers,
  Settings,
  Bot,
  Database,
};

export default function Sidebar({
  activeTab,
  onSelectTab,
  currentUser,
  onLogout,
  onSwitchRole,
  alertsCount = 5,
}) {
  const isAdmin = currentUser?.role === 'admin';

  // Specific User Portal Navigation List vs Admin Navigation List
  const userNavItems = [
    { id: 'overview', label: 'Dashboard', icon: 'Home' },
    { id: 'live-monitoring', label: 'Live Monitoring', icon: 'Radio', badge: 'Live' },
    { id: 'digital-twin', label: '3D Digital Twin', icon: 'Box' },
    { id: 'predictions', label: 'AI Predictions', icon: 'TrendingUp' },
    { id: 'alerts', label: 'Bottleneck Alerts', icon: 'Bell', hasBadgeCount: true },
    { id: 'simulation', label: 'What-if Simulation', icon: 'Sliders' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
    { id: 'reports', label: 'Reports', icon: 'FileText' },
  ];

  const currentNavItems = isAdmin ? MENU_ITEMS.operations : userNavItems;

  return (
    <aside className="w-56 sm:w-64 bg-white border-r border-slate-100 flex flex-col justify-between p-5 select-none shrink-0 h-screen sticky top-0 overflow-y-auto">
      <div className="space-y-6">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 px-2 pt-1">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-mint-500 to-emerald-400 p-0.5 shadow-md shadow-mint-500/20 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Boxes className="w-4 h-4 text-mint-400" />
            </div>
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-slate-900 block leading-tight">
              Twin<span className="text-mint-600">Flow</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400 font-bold block">
              {isAdmin ? 'Digital Twin Admin' : 'User Portal'}
            </span>
          </div>
        </div>

        {/* Section: Main Operations */}
        <div className="space-y-1">
          <div className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            {isAdmin ? 'Operations' : 'Warehouse Portal'}
          </div>
          {currentNavItems.map((item) => {
            const Icon = ICON_MAP[item.icon] || Home;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-slate-100/90 text-slate-950 font-extrabold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.hasBadgeCount && alertsCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                    {alertsCount}
                  </span>
                )}
                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Section: Admin Management (Admin Only - No Administration section for User) */}
        {isAdmin && (
          <div className="space-y-1">
            <div className="px-3 text-[11px] font-bold text-violet-600 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Admin Console</span>
              <span className="w-2 h-2 rounded-full bg-violet-600" />
            </div>
            {MENU_ITEMS.adminConsole.map((item) => {
              const Icon = ICON_MAP[item.icon] || Settings;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-violet-50 text-violet-950 font-extrabold border border-violet-200/80 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-violet-700' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Section: Infrastructure (Admin Only) */}
        {isAdmin && (
          <div className="space-y-1">
            <div className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Infrastructure
            </div>
            {MENU_ITEMS.infrastructure.map((item) => {
              const Icon = ICON_MAP[item.icon] || Bot;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-100/90 text-slate-900 font-extrabold shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Profile */}
      <div className="pt-4 border-t border-slate-100 flex flex-col items-center text-center space-y-1">
        <div 
          className="relative cursor-pointer group" 
          onClick={onSwitchRole} 
          title="Click to switch role (Admin / Operator)"
        >
          <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-md border-2 border-white">
            {currentUser?.username?.slice(0, 2).toUpperCase() || 'AD'}
          </div>
          {isAdmin && (
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-violet-600 text-white text-[9px] font-black border border-white shadow-xs">
              AD
            </span>
          )}
        </div>
        <div className="pt-0.5">
          <h4 className="text-xs font-extrabold text-slate-900 leading-tight">
            {currentUser?.displayName || 'Sarah Lin'}
          </h4>
          <p className="text-[10px] text-slate-400 truncate max-w-[170px]">
            {currentUser?.role === 'admin' ? 'System Administrator' : 'Warehouse Operator'}
          </p>
        </div>
        <button
          onClick={onLogout}
          className="pt-1.5 text-[11px] font-semibold text-slate-400 hover:text-rose-500 flex items-center space-x-1"
        >
          <LogOut className="w-3 h-3" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
