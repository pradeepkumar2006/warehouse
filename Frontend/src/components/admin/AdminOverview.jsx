import React, { useState } from 'react';
import { 
  UserPlus, 
  FileText, 
  Sliders, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  Layers, 
  Sparkles, 
  ArrowUpRight, 
  RotateCcw, 
  ChevronRight, 
  Users, 
  Radio, 
  Cpu, 
  Clock, 
  ExternalLink, 
  Loader2, 
  WifiOff, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import AddUserModal from './AddUserModal';
import GenerateReportModal from './GenerateReportModal';
import EditThresholdsModal from './EditThresholdsModal';

export default function AdminOverview({ 
  onOpenDigitalTwinAisle, 
  onOpenAuditLog, 
  onOpenUserManagement, 
  onNavigateTab 
}) {
  // Modal states
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isThresholdsOpen, setIsThresholdsOpen] = useState(false);

  // Time range for Congestion Trend: '6h' | '24h' | '7d'
  const [trendRange, setTrendRange] = useState('24h');

  // Interactive Edge States Toggle for Demo/Testing
  const [edgeState, setEdgeState] = useState('normal'); 
  // 'normal' | 'degraded_kafka' | 'conn_lost' | 'chart_loading' | 'no_alerts'

  return (
    <div className="space-y-6 animate-fadeIn pb-8 text-slate-900 font-sans">
      
      {/* ================= EDGE STATE BANNERS ================= */}
      {/* Red Banner: Data source down (Kafka disconnected) */}
      {edgeState === 'degraded_kafka' && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex flex-wrap items-center justify-between gap-3 shadow-xs animate-fadeIn">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 font-bold shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-950">
                Kafka pipeline disconnected
              </h4>
              <p className="text-xs text-rose-700">
                Kafka disconnected. Predictions may be delayed. Showing fallback heuristics.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab && onNavigateTab('health')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-2xs"
          >
            View Data Sources
          </button>
        </div>
      )}

      {/* Amber/Slate Banner: Connection lost banner */}
      {edgeState === 'conn_lost' && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center space-x-3">
            <WifiOff className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-xs font-semibold">
              Connection lost. Showing last known data. Reconnecting...
            </p>
          </div>
          <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
        </div>
      )}

      {/* ================= ROW 1: PAGE HEADER ================= */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Admin Overview
            </h1>
            {/* Live Chip */}
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold font-mono shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>● Live</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Warehouse performance and system health
          </p>
        </div>

        {/* Right Header: Date/time + Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date / Time Label */}
          <div className="px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono font-semibold text-slate-600 flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Tue, 06 Oct 2026 | 10:42 AM</span>
          </div>

          {/* Quick Action Button 1: Add User */}
          <button
            onClick={() => setIsAddUserOpen(true)}
            className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors flex items-center space-x-1.5 shadow-2xs"
          >
            <UserPlus className="w-3.5 h-3.5 text-slate-500" />
            <span>Add User</span>
          </button>

          {/* Quick Action Button 2: Generate Report */}
          <button
            onClick={() => setIsReportOpen(true)}
            className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors flex items-center space-x-1.5 shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Generate Report</span>
          </button>

          {/* Quick Action Button 3: Edit Thresholds (Mint Gradient CTA) */}
          <button
            onClick={() => setIsThresholdsOpen(true)}
            className="mint-gradient-btn px-4 py-2.5 rounded-2xl text-xs font-extrabold text-slate-950 shadow-xs flex items-center space-x-1.5"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-950" />
            <span>Edit Thresholds</span>
          </button>
        </div>
      </div>

      {/* ================= ROW 2: KPI CARDS (4 Cards) ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Congestion Risk (Red Border) */}
        <div 
          onClick={() => onOpenDigitalTwinAisle && onOpenDigitalTwinAisle('AISLE-B4')}
          className="p-5 rounded-3xl bg-white border-2 border-rose-200 hover:border-rose-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
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

        {/* KPI 2: Active Alerts (Amber Border) */}
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

        {/* KPI 3: Active AGVs (Blue Border) */}
        <div 
          onClick={() => onNavigateTab && onNavigateTab('fleet')}
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

        {/* KPI 4: Avg Queue Length (Violet Border) */}
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

      {/* ================= ROW 3: SYSTEM HEALTH STRIP (4 Mini Cards with Alternate States) ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Strip 1: Active Users */}
        <div 
          onClick={() => onOpenUserManagement && onOpenUserManagement()}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all cursor-pointer flex items-center space-x-3"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold shrink-0">
            <Users className="w-5 h-5 text-slate-700" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Active Users
            </div>
            <div className="text-base font-extrabold text-slate-900 font-mono">
              6
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              2 admins, 4 users
            </div>
          </div>
        </div>

        {/* Strip 2: Data Sources (4/4 Connected or 3/4 Alternate State) */}
        <div 
          onClick={() => setEdgeState(edgeState === 'degraded_kafka' ? 'normal' : 'degraded_kafka')}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all cursor-pointer flex items-center space-x-3"
          title="Click to toggle alternate degraded Kafka state"
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
            edgeState === 'degraded_kafka' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
          }`}>
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Data Sources
            </div>
            <div className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <span className="font-mono">
                {edgeState === 'degraded_kafka' ? '3/4 Connected' : '4/4 Connected'}
              </span>
              <span className={`w-2 h-2 rounded-full ${
                edgeState === 'degraded_kafka' ? 'bg-amber-500' : 'bg-emerald-500'
              }`} />
            </div>
            <div className="text-[11px] text-slate-500 truncate max-w-[170px]">
              {edgeState === 'degraded_kafka' ? 'Kafka disconnected' : 'MQTT, OPC-UA, Kafka, REST API'}
            </div>
          </div>
        </div>

        {/* Strip 3: Model Status (Running / Stopped / Retraining Alternate State) */}
        <div 
          onClick={() => setEdgeState(edgeState === 'chart_loading' ? 'normal' : 'chart_loading')}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all cursor-pointer flex items-center space-x-3"
          title="Click to toggle Model Retraining state"
        >
          <div className="w-10 h-10 rounded-xl bg-mint-50 text-mint-700 border border-mint-200 flex items-center justify-center font-bold shrink-0">
            <Cpu className="w-5 h-5 text-mint-700" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Model Status
            </div>
            <div className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <span className="text-emerald-700 font-bold">
                {edgeState === 'chart_loading' ? 'Retraining 45%' : 'Running'}
              </span>
              <span className={`w-2 h-2 rounded-full ${edgeState === 'chart_loading' ? 'bg-amber-500 animate-spin' : 'bg-emerald-500'}`} />
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              DSTGT v1.0
            </div>
          </div>
        </div>

        {/* Strip 4: Last Inference */}
        <div 
          onClick={() => setEdgeState(edgeState === 'conn_lost' ? 'normal' : 'conn_lost')}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all cursor-pointer flex items-center space-x-3"
          title="Click to toggle Delayed connection lost state"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold shrink-0">
            <Clock className="w-5 h-5 text-slate-700" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Last Inference
            </div>
            <div className="text-base font-extrabold text-slate-900 font-mono">
              {edgeState === 'conn_lost' ? 'Delayed (45s ago)' : '5s ago'}
            </div>
            <div className="text-[11px] text-slate-500">
              Interval: 5 sec
            </div>
          </div>
        </div>

      </div>

      {/* ================= ROW 4: MAIN INSIGHTS (2 Columns) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT CARD (60% / 7 cols): CONGESTION TREND */}
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
              {/* Legend: Actual | Forecast | Confidence band */}
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

              {/* Threshold Labels: Moderate 40% | High 70% | Critical 85% */}
              <div className="flex items-center space-x-2 text-[10px] font-mono font-bold">
                <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Moderate 40%</span>
                <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">High 70%</span>
                <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">Critical 85%</span>
              </div>
            </div>

            {/* SVG Chart Area */}
            {edgeState === 'chart_loading' ? (
              <div className="w-full h-52 flex flex-col items-center justify-center space-y-2 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 my-2">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                <span className="text-xs font-semibold text-slate-500">Loading trend data...</span>
              </div>
            ) : (
              <div className="w-full h-52 my-2 relative">
                <svg viewBox="0 0 540 180" className="w-full h-full select-none" fill="none">
                  {/* Threshold Horizontal Guidelines */}
                  {/* Critical 85% line */}
                  <line x1="30" y1="27" x2="520" y2="27" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                  <text x="525" y="30" fill="#ef4444" fontSize="8" fontFamily="monospace" fontWeight="bold">85%</text>

                  {/* High 70% line */}
                  <line x1="30" y1="54" x2="520" y2="54" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                  <text x="525" y="57" fill="#f59e0b" fontSize="8" fontFamily="monospace" fontWeight="bold">70%</text>

                  {/* Moderate 40% line */}
                  <line x1="30" y1="108" x2="520" y2="108" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
                  <text x="525" y="111" fill="#3b82f6" fontSize="8" fontFamily="monospace" fontWeight="bold">40%</text>

                  {/* Shaded Confidence Band (next 1h) */}
                  <path
                    d="M 370 70 C 410 40, 460 10, 510 12 L 510 45 C 460 40, 410 85, 370 70 Z"
                    fill="#10b981"
                    fillOpacity="0.15"
                  />

                  {/* Solid Past Line (Last 24h) */}
                  <path
                    d="M 30 140 C 90 130, 140 110, 200 95 C 260 80, 310 115, 370 70"
                    stroke="#0f172a"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Dotted Forecast Line (Next 1h) */}
                  <path
                    d="M 370 70 C 410 40, 460 12, 510 14"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeDasharray="4 3"
                    strokeLinecap="round"
                  />

                  {/* "Now" Vertical Divider */}
                  <line x1="370" y1="20" x2="370" y2="160" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2 2" />
                  <text x="370" y="172" fill="#64748b" fontSize="9" fontWeight="bold" textAnchor="middle">NOW</text>

                  {/* Peak Marker Dot */}
                  <circle cx="495" cy="14" r="4.5" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                  <text x="495" y="8" fill="#ef4444" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">94% Peak</text>

                  {/* Time Axis Labels */}
                  <text x="35" y="172" fill="#94a3b8" fontSize="8" fontFamily="monospace">-24h</text>
                  <text x="140" y="172" fill="#94a3b8" fontSize="8" fontFamily="monospace">-16h</text>
                  <text x="250" y="172" fill="#94a3b8" fontSize="8" fontFamily="monospace">-8h</text>
                  <text x="500" y="172" fill="#10b981" fontSize="8" fontFamily="monospace">+1h Forecast</text>
                </svg>
              </div>
            )}
          </div>

          {/* Footer note: Forecast peak */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-500">
              Forecast peak: <strong className="text-rose-600 font-mono">94% at 11:05 AM</strong>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Model DSTGT • Spatial Confidence 93.8%
            </span>
          </div>
        </div>

        {/* RIGHT CARD (40% / 5 cols): OVERALL RISK GAUGE */}
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
                  {/* Gauge Arc Track */}
                  <path
                    d="M 20 105 A 80 80 0 0 1 180 105"
                    stroke="#e2e8f0"
                    strokeWidth="16"
                    strokeLinecap="round"
                  />
                  {/* Colored Active Arc (87% filled) */}
                  <path
                    d="M 20 105 A 80 80 0 0 1 180 105"
                    stroke="url(#riskGaugeGradient)"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeDasharray="251"
                    strokeDashoffset="33"
                  />
                  <defs>
                    <linearGradient id="riskGaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="50%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Center Gauge Value */}
                <div className="absolute bottom-2 text-center">
                  <div className="text-4xl font-black text-slate-950 font-mono tracking-tight">
                    87%
                  </div>
                  <div className="text-xs font-bold text-rose-600 uppercase tracking-wide">
                    High Risk
                  </div>
                </div>
              </div>

              {/* Scale Labels: Low | Moderate | High */}
              <div className="w-56 flex items-center justify-between text-[11px] font-bold text-slate-400 mt-2 px-3">
                <span className="text-emerald-600">Low</span>
                <span className="text-amber-500">Moderate</span>
                <span className="text-rose-600">High</span>
              </div>

              {/* Sub-lines: Confidence 91% | Updated 5s ago */}
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

          {/* Footer Link: View AI Predictions → */}
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

      {/* ================= ROW 5: LISTS (3 Columns) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* LIST 1: TOP CONGESTED AISLES */}
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

            {/* Table / List */}
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

        {/* LIST 2: RECENT ALERTS */}
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

            {/* List */}
            {edgeState === 'no_alerts' ? (
              <div className="py-12 text-center text-xs text-slate-400 space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="font-semibold text-slate-600">All clear. No active alerts.</p>
              </div>
            ) : (
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
                    className={`p-2 rounded-xl border border-slate-100 flex items-center justify-between text-xs ${alert.bg}`}
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
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>2 Critical • 2 Warning • 1 Info</span>
            <button
              onClick={() => setEdgeState(edgeState === 'no_alerts' ? 'normal' : 'no_alerts')}
              className="text-[10px] text-slate-500 hover:underline"
            >
              Toggle Empty State
            </button>
          </div>
        </div>

        {/* LIST 3: RECENT USER ACTIVITY */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900">
                Recent User Activity
              </h3>
              <button
                onClick={() => onOpenAuditLog && onOpenAuditLog()}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center space-x-0.5"
              >
                <span>View audit log</span>
                <ChevronRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>

            {/* List */}
            <div className="space-y-2.5 my-3">
              {[
                { role: 'O', roleColor: 'bg-emerald-100 text-emerald-800', user: 'operator1', action: 'acknowledged Aisle B alert', time: '2 min ago' },
                { role: 'O', roleColor: 'bg-emerald-100 text-emerald-800', user: 'operator2', action: 'ran simulation', time: '10 min ago' },
                { role: 'A', roleColor: 'bg-blue-100 text-blue-800', user: 'admin', action: 'updated High threshold to 75%', time: '32 min ago' },
                { role: 'O', roleColor: 'bg-emerald-100 text-emerald-800', user: 'operator3', action: 'resolved Conveyor 3 alert', time: '1 hr ago' },
                { role: 'A', roleColor: 'bg-blue-100 text-blue-800', user: 'admin', action: 'added user operator4', time: '2 hr ago' },
              ].map((act, idx) => (
                <div key={idx} className="flex items-start space-x-2.5 text-xs p-1">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 ${act.roleColor}`}>
                    {act.role}
                  </div>
                  <div className="flex-1 truncate">
                    <p className="text-slate-700 truncate">
                      <strong className="text-slate-900 font-semibold">{act.user}</strong> {act.action}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
            Immutable hash-chained audit log
          </div>
        </div>

      </div>

      {/* ================= MODALS ================= */}
      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
      />

      <GenerateReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />

      <EditThresholdsModal
        isOpen={isThresholdsOpen}
        onClose={() => setIsThresholdsOpen(false)}
      />

    </div>
  );
}
