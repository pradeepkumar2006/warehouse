import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Activity, ArrowRight, ShieldCheck, Box, Network } from 'lucide-react';

export default function DigitalTwinIllustration() {
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulsePhase((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-lg mx-auto select-none">
      {/* Background soft glowing ambient orbs */}
      <div className="absolute -top-10 -left-10 w-64 h-64 bg-mint-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Illustration Glass Container */}
      <div className="relative rounded-2xl bg-gradient-to-b from-slate-900/80 via-slate-900/50 to-slate-950/90 border border-slate-700/50 p-6 shadow-2xl backdrop-blur-xl">
        {/* Top Header bar inside illustration */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-mint-400/80" />
            <span className="text-xs font-mono text-slate-400 pl-2">DSTGT_SPATIO_GRAPH_V1.0</span>
          </div>
          <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-mint-500/10 border border-mint-500/30 text-[11px] font-medium text-mint-400">
            <span className="w-1.5 h-1.5 rounded-full bg-mint-400 animate-pulse" />
            <span>Digital Twin Live</span>
          </div>
        </div>

        {/* 2.5D Warehouse Isometric Floor Graphic */}
        <div className="relative my-4 h-60 w-full overflow-hidden rounded-xl bg-slate-950/70 border border-slate-800/80 p-2 flex items-center justify-center">
          {/* Subtle Grid Lines */}
          <div className="absolute inset-0 bg-grid-pattern opacity-40" />

          {/* SVG Isometric Warehouse & Spatio-Temporal Graph */}
          <svg viewBox="0 0 420 220" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="mintGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f5a0" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="heatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.85" />
              </linearGradient>
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Warehouse Isometric Zones / Racks */}
            {/* Zone A: Inbound Docks */}
            <g transform="translate(40, 110)">
              <polygon points="0,20 60,0 120,20 60,40" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              <polygon points="0,20 60,40 60,55 0,35" fill="#0f172a" stroke="#334155" strokeWidth="1" />
              <polygon points="120,20 60,40 60,55 120,35" fill="#1e293b" stroke="#334155" strokeWidth="1" />
              <text x="60" y="24" fill="#94a3b8" fontSize="9" fontWeight="600" textAnchor="middle">INBOUND DOCKS</text>
            </g>

            {/* Zone B1: Aisle A (Normal - Green) */}
            <g transform="translate(130, 35)">
              <polygon points="0,20 40,0 80,20 40,40" fill="#1e293b" stroke="#10b981" strokeWidth="1.5" />
              <rect x="15" y="10" width="16" height="12" rx="2" fill="#047857" opacity="0.8" />
              <rect x="35" y="5" width="16" height="12" rx="2" fill="#059669" opacity="0.9" />
              <text x="40" y="32" fill="#6ee7b7" fontSize="7.5" fontWeight="700" textAnchor="middle">AISLE A : NORMAL</text>
            </g>

            {/* Zone B2: Aisle B (High Congestion - Red Hotspot) */}
            <g transform="translate(205, 55)">
              <polygon points="0,22 45,0 90,22 45,44" fill="#1e293b" stroke="#ef4444" strokeWidth="2" filter="url(#neonGlow)" />
              {/* Attention Heatmap Floor Glow */}
              <ellipse cx="45" cy="22" rx="35" ry="16" fill="url(#heatGrad)" opacity="0.55">
                <animate attributeName="opacity" values="0.4;0.7;0.4" dur="1.8s" repeatCount="indefinite" />
              </ellipse>
              <rect x="20" y="8" width="18" height="14" rx="2" fill="#dc2626" />
              <rect x="42" y="3" width="18" height="14" rx="2" fill="#b91c1c" />
              <text x="45" y="35" fill="#fca5a5" fontSize="7.5" fontWeight="800" textAnchor="middle">AISLE B : HIGH</text>
            </g>

            {/* Zone C: Sortation & Packing Bay (Moderate - Amber) */}
            <g transform="translate(285, 115)">
              <polygon points="0,18 45,0 90,18 45,36" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
              <polygon points="0,18 45,36 45,48 0,30" fill="#0f172a" stroke="#d97706" strokeWidth="1" />
              <polygon points="90,18 45,36 45,48 90,30" fill="#1e293b" stroke="#d97706" strokeWidth="1" />
              <text x="45" y="22" fill="#fcd34d" fontSize="7.5" fontWeight="700" textAnchor="middle">PACKING : MODERATE</text>
            </g>

            {/* Graph Neural Edges (DSTGT Spatio-temporal connectivity) */}
            {/* Edge 1: Inbound -> Aisle Racks */}
            <path d="M 100 130 C 130 110, 160 90, 185 75" stroke="#00f5a0" strokeWidth="2" strokeDasharray="4 4" opacity="0.8">
              <animate attributeName="stroke-dashoffset" values="16;0" dur="1.2s" repeatCount="indefinite" />
            </path>
            {/* Edge 2: Aisle Racks -> Sortation Bay */}
            <path d="M 255 75 C 280 85, 300 100, 320 125" stroke="#00f5a0" strokeWidth="2" strokeDasharray="4 4" opacity="0.8">
              <animate attributeName="stroke-dashoffset" values="16;0" dur="1.2s" repeatCount="indefinite" />
            </path>
            {/* Edge 3: Cross Conveyor Link */}
            <path d="M 160 145 C 210 160, 260 155, 300 135" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2 3" opacity="0.6" />

            {/* Graph Node V1 (Inbound Node) */}
            <g transform="translate(100, 130)">
              <circle r="9" fill="#0f172a" stroke="#00f5a0" strokeWidth="2" />
              <circle r="4" fill="#00f5a0" />
            </g>

            {/* Graph Node V2 (Aisle Center Node) */}
            <g transform="translate(220, 70)">
              <circle r="11" fill="#0f172a" stroke="#00f5a0" strokeWidth="2" filter="url(#neonGlow)" />
              <circle r="5" fill="#00f5a0">
                <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
              </circle>
            </g>

            {/* Graph Node V3 (Sortation Bottleneck Forecast Node) */}
            <g transform="translate(320, 125)">
              <circle r="12" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.5" />
              <circle r="5" fill="#f59e0b">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" />
              </circle>
              {/* Alert indicator */}
              <circle r="18" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" opacity="0.6">
                <animate attributeName="r" values="14;22" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0" dur="1.5s" repeatCount="indefinite" />
              </circle>
            </g>

            {/* Simulated Moving AGVs (Automated Guided Vehicles) */}
            {/* AGV 1 */}
            <g>
              <animateMotion
                path="M 100 130 C 130 110, 160 90, 185 75"
                dur="3.5s"
                repeatCount="indefinite"
              />
              <rect x="-8" y="-5" width="16" height="10" rx="3" fill="#00f5a0" stroke="#064e3b" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="2" fill="#080d1a" />
            </g>

            {/* AGV 2 */}
            <g>
              <animateMotion
                path="M 185 75 C 230 90, 275 110, 320 125"
                dur="4s"
                repeatCount="indefinite"
              />
              <rect x="-8" y="-5" width="16" height="10" rx="3" fill="#38bdf8" stroke="#0369a1" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="2" fill="#080d1a" />
            </g>

            {/* Floating Live Prediction Tooltip Pill (Spec Match) */}
            <g transform="translate(210, 15)">
              <rect width="185" height="26" rx="6" fill="#0f172a" stroke="#ef4444" strokeWidth="1.2" />
              <circle cx="12" cy="13" r="3.5" fill="#ef4444">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="1s" repeatCount="indefinite" />
              </circle>
              <text x="22" y="17" fill="#fca5a5" fontSize="8.5" fontWeight="700">DSTGT: Aisle B Chokepoint (87% Risk)</text>
            </g>
          </svg>
        </div>

        {/* Real-time Metric Indicators inside Panel */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <div className="flex items-center justify-center space-x-1 text-mint-400 mb-0.5">
              <Activity className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">Graph Flow</span>
            </div>
            <div className="text-sm font-bold text-white tracking-wide">98.6%</div>
            <div className="text-[10px] text-slate-400">Throughput</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <div className="flex items-center justify-center space-x-1 text-sky-400 mb-0.5">
              <Cpu className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">DSTGT AI</span>
            </div>
            <div className="text-sm font-bold text-white tracking-wide">14ms</div>
            <div className="text-[10px] text-slate-400">Inference Latency</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <div className="flex items-center justify-center space-x-1 text-emerald-400 mb-0.5">
              <Zap className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">Active AGVs</span>
            </div>
            <div className="text-sm font-bold text-white tracking-wide">24 / 24</div>
            <div className="text-[10px] text-slate-400">Nominal Routing</div>
          </div>
        </div>

        {/* Dynamic Spatio-Temporal Status Bar */}
        <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-slate-300">
            <Network className="w-4 h-4 text-mint-400" />
            <span className="font-mono text-[11px] text-slate-300">Attention Horizon:</span>
            <span className="text-mint-400 font-semibold font-mono">+15m to +60m</span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">
            0 Bottlenecks Critical
          </span>
        </div>
      </div>
    </div>
  );
}
