import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Activity, 
  Radio, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Check, 
  Bell, 
  ChevronRight,
  ShieldCheck,
  Eye,
  Sliders,
  RefreshCw
} from 'lucide-react';

export default function UserDashboard({ 
  currentUser,
  onOpenDigitalTwinAisle, 
  onNavigateTab,
  onShowToast
}) {
  // Time range for Congestion Trend: '6h' | '24h' | '7d'
  const [trendRange, setTrendRange] = useState('24h');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // User's Pending Actions state
  const [pendingAlerts, setPendingAlerts] = useState([
    {
      id: 'ALT-901',
      title: 'Aisle B congestion expected',
      location: 'Aisle B (Racks B1–B4)',
      eta: 'in 12 min',
      severity: 'Critical',
      reason: '94% physical shelf capacity threshold breached',
      time: '10:14 AM'
    },
    {
      id: 'ALT-904',
      title: 'Junction J-04 AGV Stacking Alert',
      location: 'Sortation Buffer J-04',
      eta: 'in 8 min',
      severity: 'Critical',
      reason: 'Queue accumulation of 18 units at induction',
      time: '10:18 AM'
    }
  ]);

  // Acknowledge a pending alert directly from the card
  const handleAcknowledgeAlert = (id, title) => {
    setPendingAlerts(prev => prev.filter(a => a.id !== id));
    if (onShowToast) {
      onShowToast(`Acknowledged Alert #${id}: ${title}`, 'success');
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      if (onShowToast) {
        onShowToast('Warehouse telemetry refreshed', 'info');
      }
    }, 600);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8 text-slate-900 font-sans">
      
      {/* ================= PAGE HEADER: U1 ================= */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              My Warehouse View
            </h1>
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold font-mono shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Telemetry</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Live status and alerts that need your attention
          </p>
        </div>

        {/* Right Header: Timestamp + Quick Refresh + Alerts Shortcut */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono font-semibold text-slate-600 flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Tue, 06 Oct 2026 | 10:42 AM</span>
          </div>

          <button
            onClick={handleRefresh}
            className="p-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 transition-colors shadow-2xs"
            title="Refresh Live Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-mint-600' : 'text-slate-500'}`} />
          </button>

          <button
            onClick={() => onNavigateTab && onNavigateTab('alerts')}
            className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors flex items-center space-x-1.5 shadow-2xs"
          >
            <Bell className="w-3.5 h-3.5 text-amber-600" />
            <span>Active Alerts ({pendingAlerts.length} Pending)</span>
          </button>
        </div>
      </div>

      {/* ================= ROW 2: KPI CARDS (4 Cards) ================= */}
      {/* Congestion Risk 87%, Active Alerts 5, Active AGVs 18 / 22, Avg Queue Length 14 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Congestion Risk 87% */}
        <div 
          onClick={() => onOpenDigitalTwinAisle && onOpenDigitalTwinAisle('Aisle B')}
          className="p-5 rounded-3xl bg-white border-2 border-rose-200 hover:border-rose-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Congestion Risk</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl sm:text-4xl font-black text-rose-600 tracking-tight font-mono">
              87%
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <span className="font-semibold text-rose-600 flex items-center">
              ▲ 6% vs last hour
            </span>
            <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md text-[10px]">
              High Risk
            </span>
          </div>
        </div>

        {/* KPI 2: Active Alerts 5 */}
        <div 
          onClick={() => onNavigateTab && onNavigateTab('alerts')}
          className="p-5 rounded-3xl bg-white border-2 border-amber-200 hover:border-amber-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Active Alerts</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl sm:text-4xl font-black text-amber-600 tracking-tight font-mono">
              5
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <span className="font-semibold text-amber-600 flex items-center">
              ▲ 2 vs last hour
            </span>
            <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md text-[10px]">
              2 critical
            </span>
          </div>
        </div>

        {/* KPI 3: Active AGVs 18 / 22 */}
        <div 
          onClick={() => onNavigateTab && onNavigateTab('live-monitoring')}
          className="p-5 rounded-3xl bg-white border-2 border-blue-200 hover:border-blue-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Active AGVs</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl sm:text-4xl font-black text-blue-600 tracking-tight font-mono">
              18 / 22
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <span className="font-semibold text-slate-500 flex items-center">
              ▼ 1 vs last hour
            </span>
            <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md text-[10px]">
              4 idle
            </span>
          </div>
        </div>

        {/* KPI 4: Avg Queue Length 14 */}
        <div 
          onClick={() => onNavigateTab && onNavigateTab('digital-twin')}
          className="p-5 rounded-3xl bg-white border-2 border-purple-200 hover:border-purple-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Avg Queue Length</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl sm:text-4xl font-black text-purple-600 tracking-tight font-mono">
              14
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <span className="font-semibold text-purple-600 flex items-center">
              ▲ 3 vs last hour
            </span>
            <span className="font-medium text-slate-500 text-[10px]">
              items waiting
            </span>
          </div>
        </div>

      </div>

      {/* ================= ROW 3: MAIN INSIGHTS (Congestion Trend & Risk Gauge) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT CARD (7 cols): CONGESTION TREND */}
        <div className="lg:col-span-7 rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header + Range Toggle */}
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <h3 className="text-lg font-extrabold text-slate-950">
                  Congestion Trend
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Last 24h with next 1h forecast
                </p>
              </div>

              {/* Range Toggle: 6h | 24h | 7d */}
              <div className="bg-slate-100 p-1 rounded-2xl flex items-center space-x-1 text-xs font-bold text-slate-600">
                {['6h', '24h', '7d'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setTrendRange(r)}
                    className={`px-3 py-1.5 rounded-xl transition-all ${
                      trendRange === r
                        ? 'bg-slate-950 text-white shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Legend & Threshold Labels */}
            <div className="flex flex-wrap items-center justify-between my-3 text-xs gap-2">
              <div className="flex items-center space-x-3 text-[11px] font-semibold text-slate-600">
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-1 bg-slate-900 rounded-full" />
                  <span>Actual</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-0.5 border-t-2 border-dotted border-emerald-500" />
                  <span>Forecast</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-2 bg-emerald-100/60 rounded-xs border border-emerald-200" />
                  <span>Confidence band</span>
                </span>
              </div>

              <div className="flex items-center space-x-2 text-[10px] font-mono font-bold">
                <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Moderate 40%</span>
                <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">High 70%</span>
                <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">Critical 85%</span>
              </div>
            </div>

            {/* SVG Chart Area */}
            <div className="w-full h-52 my-2 relative">
              <svg viewBox="0 0 540 180" className="w-full h-full select-none" fill="none">
                {/* Guidelines */}
                <line x1="30" y1="27" x2="520" y2="27" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                <text x="525" y="30" fill="#ef4444" fontSize="8" fontFamily="monospace" fontWeight="bold">85%</text>

                <line x1="30" y1="54" x2="520" y2="54" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                <text x="525" y="57" fill="#f59e0b" fontSize="8" fontFamily="monospace" fontWeight="bold">70%</text>

                <line x1="30" y1="108" x2="520" y2="108" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
                <text x="525" y="111" fill="#3b82f6" fontSize="8" fontFamily="monospace" fontWeight="bold">40%</text>

                {/* Shaded Confidence Band */}
                <path
                  d="M 370 70 C 410 40, 460 10, 510 12 L 510 45 C 460 40, 410 85, 370 70 Z"
                  fill="#10b981"
                  fillOpacity="0.15"
                />

                {/* Solid Past Line */}
                <path
                  d="M 30 140 C 90 130, 140 110, 200 95 C 260 80, 310 115, 370 70"
                  stroke="#0f172a"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Dotted Forecast Line */}
                <path
                  d="M 370 70 C 410 40, 460 12, 510 14"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray="4 3"
                  strokeLinecap="round"
                />

                {/* Now Divider */}
                <line x1="370" y1="20" x2="370" y2="160" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2 2" />
                <text x="370" y="172" fill="#64748b" fontSize="9" fontWeight="bold" textAnchor="middle">NOW</text>

                {/* Peak Marker Dot */}
                <circle cx="495" cy="14" r="4.5" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                <text x="495" y="8" fill="#ef4444" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">94% Peak</text>

                {/* Time Axis */}
                <text x="35" y="172" fill="#94a3b8" fontSize="8" fontFamily="monospace">-24h</text>
                <text x="140" y="172" fill="#94a3b8" fontSize="8" fontFamily="monospace">-16h</text>
                <text x="250" y="172" fill="#94a3b8" fontSize="8" fontFamily="monospace">-8h</text>
                <text x="500" y="172" fill="#10b981" fontSize="8" fontFamily="monospace">+1h Forecast</text>
              </svg>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-500">
              Forecast peak: <strong className="text-rose-600 font-mono">94% at 11:05 AM</strong>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Model DSTGT • Spatial Confidence 93.8%
            </span>
          </div>
        </div>

        {/* RIGHT CARD (5 cols): OVERALL RISK GAUGE */}
        <div className="lg:col-span-5 rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-extrabold text-slate-950">
                Overall Risk
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                High Risk
              </span>
            </div>

            {/* Radial Gauge Meter */}
            <div className="my-5 flex flex-col items-center justify-center relative">
              <div className="w-56 h-32 relative flex items-center justify-center">
                <svg viewBox="0 0 200 120" className="w-full h-full" fill="none">
                  <path
                    d="M 20 105 A 80 80 0 0 1 180 105"
                    stroke="#e2e8f0"
                    strokeWidth="16"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 20 105 A 80 80 0 0 1 180 105"
                    stroke="url(#riskGaugeGradientUser)"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeDasharray="251"
                    strokeDashoffset="33"
                  />
                  <defs>
                    <linearGradient id="riskGaugeGradientUser" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="50%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute bottom-2 text-center">
                  <div className="text-4xl font-black text-slate-950 font-mono tracking-tight">
                    87%
                  </div>
                  <div className="text-xs font-bold text-rose-600 uppercase tracking-wide">
                    High Risk
                  </div>
                </div>
              </div>

              <div className="w-56 flex items-center justify-between text-[11px] font-bold text-slate-400 mt-2 px-3">
                <span className="text-emerald-600">Low</span>
                <span className="text-amber-500">Moderate</span>
                <span className="text-rose-600">High</span>
              </div>

              <div className="mt-4 flex items-center space-x-3 text-xs text-slate-500 font-medium">
                <span className="flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-mint-500" />
                  <span>Confidence: <strong className="text-slate-800">91%</strong></span>
                </span>
                <span>•</span>
                <span>Updated: <strong className="text-slate-800">5s ago</strong></span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigateTab && onNavigateTab('predictions')}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center justify-center space-x-1.5"
            >
              <span>View AI Predictions</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
            </button>
          </div>
        </div>

      </div>

      {/* ================= ROW 4: LISTS & EXTRA USER CARD (3 Columns) ================= */}
      {/* Cards: Top congested aisles, Recent alerts, My Pending Actions (User Specific) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* CARD 1: TOP CONGESTED AISLES */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900">
                Top Congested Aisles
              </h3>
              <button
                onClick={() => onNavigateTab && onNavigateTab('digital-twin')}
                className="text-xs font-bold text-mint-700 hover:underline flex items-center space-x-0.5"
              >
                <span>Open 3D Twin</span>
                <ArrowRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>

            <div className="space-y-3 my-4">
              {[
                { name: 'Aisle B', val: 92, color: 'bg-rose-500', text: 'text-rose-600' },
                { name: 'Aisle D', val: 78, color: 'bg-rose-400', text: 'text-rose-600' },
                { name: 'Packing Zone', val: 66, color: 'bg-amber-400', text: 'text-amber-600' },
                { name: 'Aisle A', val: 34, color: 'bg-emerald-500', text: 'text-emerald-600' },
                { name: 'Dock 2', val: 22, color: 'bg-emerald-500', text: 'text-emerald-600' },
              ].map((aisle) => (
                <div 
                  key={aisle.name}
                  onClick={() => onOpenDigitalTwinAisle && onOpenDigitalTwinAisle(aisle.name)}
                  className="space-y-1.5 cursor-pointer p-1.5 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{aisle.name}</span>
                    <span className={`font-mono font-bold ${aisle.text}`}>{aisle.val}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${aisle.color}`} 
                      style={{ width: `${aisle.val}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
            Click any aisle to inspect live 3D twin coordinate
          </div>
        </div>

        {/* CARD 2: RECENT ALERTS */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900">
                Recent Alerts
              </h3>
              <button
                onClick={() => onNavigateTab && onNavigateTab('alerts')}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center space-x-0.5"
              >
                <span>View all</span>
                <ChevronRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>

            <div className="space-y-2.5 my-3">
              {[
                { dot: '🔴', text: 'Aisle B congestion expected', time: 'in 12 min', bg: 'bg-rose-50/50' },
                { dot: '🔴', text: 'Aisle D queue building up', time: '5 min ago', bg: 'bg-rose-50/50' },
                { dot: '🟠', text: 'AGV-07 low battery', time: '9 min ago', bg: 'bg-amber-50/40' },
                { dot: '🟠', text: 'Conveyor 3 slowdown detected', time: '18 min ago', bg: 'bg-amber-50/40' },
                { dot: '🟡', text: 'Packing Zone nearing capacity', time: '25 min ago', bg: 'bg-yellow-50/40' },
              ].map((alert, idx) => (
                <div
                  key={idx}
                  onClick={() => onNavigateTab && onNavigateTab('alerts')}
                  className={`p-2 rounded-xl border border-slate-100 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50 ${alert.bg}`}
                >
                  <div className="flex items-center space-x-2 truncate pr-2">
                    <span className="text-xs">{alert.dot}</span>
                    <span className="font-medium text-slate-800 truncate">{alert.text}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {alert.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>2 Critical • 2 Warning • 1 Info</span>
            <button
              onClick={() => onNavigateTab && onNavigateTab('alerts')}
              className="text-[10px] font-bold text-mint-700 hover:underline"
            >
              Triage Station →
            </button>
          </div>
        </div>

        {/* CARD 3: EXTRA USER CARD: MY PENDING ACTIONS */}
        {/* "Extra user card: My Pending Actions: 2 alerts waiting for acknowledgement" */}
        <div className="p-5 rounded-3xl bg-white border-2 border-amber-300 shadow-xs flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/40 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between pb-3 border-b border-amber-100">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Bell className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-sm font-black text-slate-900">
                  My Pending Actions
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold font-mono">
                {pendingAlerts.length} Waiting
              </span>
            </div>

            {pendingAlerts.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">All Caught Up!</h4>
                <p className="text-[11px] text-slate-500 max-w-[200px] mx-auto">
                  No alerts are currently waiting for your acknowledgement.
                </p>
              </div>
            ) : (
              <div className="space-y-3 my-3">
                <p className="text-[11px] text-slate-500 font-medium">
                  {pendingAlerts.length} alert{pendingAlerts.length > 1 ? 's' : ''} assigned to your floor queue waiting for acknowledgement:
                </p>

                {pendingAlerts.map((actionAlert) => (
                  <div
                    key={actionAlert.id}
                    className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-500" />
                          <strong className="text-slate-900 font-bold">{actionAlert.title}</strong>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{actionAlert.location} • ETA {actionAlert.eta}</p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">{actionAlert.time}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-amber-200/40">
                      <span className="text-[10px] text-slate-500 truncate max-w-[140px]">
                        {actionAlert.reason}
                      </span>
                      <button
                        onClick={() => handleAcknowledgeAlert(actionAlert.id, actionAlert.title)}
                        className="px-2.5 py-1 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-[10px] font-bold transition-all shadow-2xs flex items-center space-x-1"
                      >
                        <Check className="w-3 h-3 text-mint-400" />
                        <span>Acknowledge</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] text-slate-400">
              Assigned to: <strong className="text-slate-700">{currentUser?.displayName || 'Floor Operator'}</strong>
            </span>
            <button
              onClick={() => onNavigateTab && onNavigateTab('alerts')}
              className="text-xs font-bold text-mint-700 hover:underline flex items-center"
            >
              <span>Go to Alerts</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
