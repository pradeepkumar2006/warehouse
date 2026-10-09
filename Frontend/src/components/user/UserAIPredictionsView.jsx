import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Activity, 
  Layers, 
  RotateCcw, 
  RefreshCw, 
  ArrowRight, 
  Sliders, 
  MapPin, 
  Info, 
  X, 
  ShieldCheck, 
  BarChart3, 
  Database, 
  Bot, 
  ChevronRight,
  GitFork,
  Radio
} from 'lucide-react';

export default function UserAIPredictionsView({ 
  isAdmin = false, 
  currentUser,
  simulatedRerouteActive = false,
  onToggleReroute
}) {
  // Horizon switcher: '15m' | '30m' | '45m' | '60m'
  const [horizon, setHorizon] = useState('15m');

  // Explainability Toggle: 'overall' | 'aisle'
  const [explainabilityScope, setExplainabilityScope] = useState('overall');
  const [selectedAisle, setSelectedAisle] = useState('Aisle B'); // 'Aisle A' | 'Aisle B' | 'Aisle C' | 'Packing'

  // Live "Updated 5s ago" ticker
  const [secondsAgo, setSecondsAgo] = useState(5);

  // Retrain Model Modal & State
  const [isRetrainConfirmOpen, setIsRetrainConfirmOpen] = useState(false);
  const [isRetraining, setIsRetraining] = useState(false);
  const [retrainProgress, setRetrainProgress] = useState(0);
  const [retrainComplete, setRetrainComplete] = useState(false);

  // Metrics Modal
  const [isMetricsModalOpen, setIsMetricsModalOpen] = useState(false);

  // Ticker timer for data freshness
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsAgo((prev) => (prev >= 60 ? 1 : prev + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Retraining Simulation Progress
  useEffect(() => {
    let timer;
    if (isRetraining) {
      setRetrainProgress(0);
      setRetrainComplete(false);
      const steps = [12, 28, 45, 68, 85, 100];
      let stepIdx = 0;

      timer = setInterval(() => {
        if (stepIdx < steps.length) {
          setRetrainProgress(steps[stepIdx]);
          stepIdx++;
          if (stepIdx === steps.length) {
            setTimeout(() => {
              setIsRetraining(false);
              setRetrainComplete(true);
            }, 800);
          }
        }
      }, 700);
    }
    return () => clearInterval(timer);
  }, [isRetraining]);

  // Section 1 Prediction Values
  const predictionData = {
    '15m': {
      prob: simulatedRerouteActive ? '24%' : '87%',
      location: 'Aisle B',
      locationDesc: 'High-Density Racks B1–B4 Spine',
      queue: simulatedRerouteActive ? '6 in 15 min' : '22 in 15 min',
      delay: simulatedRerouteActive ? '1.2 min' : '6.4 min',
      riskLevel: simulatedRerouteActive ? 'Low' : 'Critical',
      probTrend: simulatedRerouteActive ? '-18%' : '+12.4%',
      queueTrend: simulatedRerouteActive ? '-8 units' : '+8 units',
      delayTrend: simulatedRerouteActive ? '-2.1m' : '+3.1m',
    },
    '30m': {
      prob: simulatedRerouteActive ? '31%' : '92%',
      location: 'Aisle B & Sortation J-04',
      locationDesc: 'Primary Outbound Merge',
      queue: simulatedRerouteActive ? '9 in 30 min' : '31 in 30 min',
      delay: simulatedRerouteActive ? '1.8 min' : '12.8 min',
      riskLevel: simulatedRerouteActive ? 'Moderate' : 'Critical',
      probTrend: simulatedRerouteActive ? '-22%' : '+18.0%',
      queueTrend: simulatedRerouteActive ? '-12 units' : '+14 units',
      delayTrend: simulatedRerouteActive ? '-4.0m' : '+6.8m',
    },
    '45m': {
      prob: simulatedRerouteActive ? '38%' : '95%',
      location: 'Aisle B & Dock 1',
      locationDesc: 'Inbound Cross-Dock Chokepoint',
      queue: simulatedRerouteActive ? '12 in 45 min' : '38 in 45 min',
      delay: simulatedRerouteActive ? '2.4 min' : '18.4 min',
      riskLevel: simulatedRerouteActive ? 'Moderate' : 'Severe',
      probTrend: simulatedRerouteActive ? '-15%' : '+22.5%',
      queueTrend: simulatedRerouteActive ? '-15 units' : '+19 units',
      delayTrend: simulatedRerouteActive ? '-5.2m' : '+9.4m',
    },
    '60m': {
      prob: simulatedRerouteActive ? '44%' : '98%',
      location: 'Entire Storage Spine',
      locationDesc: 'Systemic Facility Gridlock',
      queue: simulatedRerouteActive ? '15 in 60 min' : '46 in 60 min',
      delay: simulatedRerouteActive ? '3.1 min' : '28.0 min',
      riskLevel: simulatedRerouteActive ? 'Moderate' : 'Cascading Gridlock',
      probTrend: simulatedRerouteActive ? '-10%' : '+31.0%',
      queueTrend: simulatedRerouteActive ? '-18 units' : '+24 units',
      delayTrend: simulatedRerouteActive ? '-7.0m' : '+15.2m',
    },
  };

  const currentPred = predictionData[horizon];

  // Section 3: Feature Weights Dataset
  const featureWeightsByAisle = {
    'overall': [
      { name: 'Aisle B Occupancy', weight: '0.32', pct: 32, desc: '94% physical shelf capacity threshold breached' },
      { name: 'AGV Count', weight: '0.24', pct: 24, desc: '5 autonomous tuggers queued in single-lane transit' },
      { name: 'Queue Length', weight: '0.18', pct: 18, desc: '22 pallets waiting for sortation arm assignment' },
      { name: 'Order Volume', weight: '0.15', pct: 15, desc: 'Surge in high-priority pick tickets from ERP' },
      { name: 'Conveyor Load', weight: '0.11', pct: 11, desc: 'Conveyor belt speed throttled at induction point' },
    ],
    'Aisle B': [
      { name: 'Aisle B Occupancy', weight: '0.42', pct: 42, desc: 'Concentrated storage density in racks B1-B4' },
      { name: 'AGV Traffic Convergence', weight: '0.28', pct: 28, desc: 'Head-on AMR crossing paths at Junction J-04' },
      { name: 'Buffer Overflow', weight: '0.16', pct: 16, desc: 'Sortation staging pallets spilling into aisle' },
      { name: 'Pick Velocity Slower', weight: '0.14', pct: 14, desc: 'Manual pick cart obstruction in aisle corridor' },
    ],
    'Aisle A': [
      { name: 'Nominal Flow Balance', weight: '0.38', pct: 38, desc: 'Optimal pallet distribution across A1-A6' },
      { name: 'AGV Spacing Safe', weight: '0.30', pct: 30, desc: 'Maintained 4.2m LiDAR standoff clearance' },
      { name: 'Buffer Capacity Available', weight: '0.20', pct: 20, desc: '60% buffer space free for replenishment' },
      { name: 'Conveyor Feed Steady', weight: '0.12', pct: 12, desc: '1.2 m/s continuous parcel transfer' },
    ],
    'Packing': [
      { name: 'Sortation Load', weight: '0.35', pct: 35, desc: 'Moderate packing queue awaiting labeling' },
      { name: 'Outbound Tote Buffer', weight: '0.26', pct: 26, desc: 'Tote accumulation at dispatch dock 2' },
      { name: 'Operator Pacing', weight: '0.21', pct: 21, desc: '3 active packers processing 140 units/hr' },
      { name: 'Conveyor Speed', weight: '0.18', pct: 18, desc: 'Belt running at standard throughput rate' },
    ]
  };

  const activeFeatures = explainabilityScope === 'overall' 
    ? featureWeightsByAisle['overall'] 
    : featureWeightsByAisle[selectedAisle] || featureWeightsByAisle['overall'];

  return (
    <div className="space-y-6 animate-fadeIn pb-12 font-sans text-slate-900">
      
      {/* ========================================================================= */}
      {/* HEADER: A4 AI PREDICTIONS TITLE & REAL-TIME CONTROLS                      */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs">
              <Cpu className="w-5 h-5 text-mint-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-extrabold text-slate-950 tracking-tight">
                  A4. AI Predictions & Bottleneck Analytics
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-mint-50 text-mint-800 border border-mint-200 text-[10px] font-mono font-bold">
                  DSTGT Engine
                </span>
                {isAdmin && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                    Admin Privileges
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Dynamic Spatio-Temporal Graph Transformer forecasting warehouse chokepoints & explainable features
              </p>
            </div>
          </div>
        </div>

        {/* Lead Horizon Selector & Reroute Simulation Toggle */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
            <span className="text-[11px] text-slate-400 px-2 font-mono">Horizon:</span>
            {['15m', '30m', '45m', '60m'].map((h) => (
              <button
                key={h}
                onClick={() => setHorizon(h)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  horizon === h
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                +{h}
              </button>
            ))}
          </div>

          {onToggleReroute && (
            <button
              onClick={onToggleReroute}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-xs ${
                simulatedRerouteActive
                  ? 'bg-mint-500 text-slate-950 hover:bg-mint-400'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{simulatedRerouteActive ? 'Reroute Active (-65% Risk)' : 'Simulate Reroute'}</span>
            </button>
          )}
        </div>
      </div>


      {/* ========================================================================= */}
      {/* SECTION 1: PREDICTION CARDS (4)                                           */}
      {/* Congestion Probability 87%, Bottleneck Location Aisle B,                  */}
      {/* Queue Length 22 in 15 min, Delay Time 6.4 min (with Sparkline & Arrows)   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* CARD 1: Congestion Probability */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span className="uppercase tracking-wider text-[11px]">Congestion Probability</span>
            <div className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
              currentPred.probTrend.startsWith('+') ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
            }`}>
              <TrendingUp className="w-3 h-3" />
              <span>{currentPred.probTrend}</span>
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className={`text-3xl font-black font-mono tracking-tight ${
                currentPred.prob.replace('%','') > 70 ? 'text-rose-600' : 'text-emerald-600'
              }`}>
                {currentPred.prob}
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                {currentPred.riskLevel} Bottleneck Likelihood
              </p>
            </div>
          </div>

          {/* Sparkline SVG */}
          <div className="w-full h-10 pt-1">
            <svg viewBox="0 0 160 36" className="w-full h-full" fill="none">
              <path
                d="M 0 28 Q 30 26, 60 20 T 110 14 T 160 4"
                stroke={currentPred.prob.replace('%','') > 70 ? '#ef4444' : '#10b981'}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 0 28 Q 30 26, 60 20 T 110 14 T 160 4 L 160 36 L 0 36 Z"
                fill={currentPred.prob.replace('%','') > 70 ? '#fee2e2' : '#d1fae5'}
                opacity="0.5"
              />
            </svg>
          </div>
        </div>

        {/* CARD 2: Bottleneck Location */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span className="uppercase tracking-wider text-[11px]">Bottleneck Location</span>
            <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold">
              <AlertTriangle className="w-3 h-3" />
              <span>Critical Node</span>
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-black tracking-tight text-slate-950 font-mono">
                {currentPred.location}
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium truncate max-w-[180px]">
                {currentPred.locationDesc}
              </p>
            </div>
          </div>

          {/* Sparkline SVG (Spike) */}
          <div className="w-full h-10 pt-1">
            <svg viewBox="0 0 160 36" className="w-full h-full" fill="none">
              <path
                d="M 0 26 L 40 24 L 75 22 L 100 4 L 125 18 L 160 10"
                stroke="#f97316"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 0 26 L 40 24 L 75 22 L 100 4 L 125 18 L 160 10 L 160 36 L 0 36 Z"
                fill="#ffedd5"
                opacity="0.5"
              />
            </svg>
          </div>
        </div>

        {/* CARD 3: Queue Length */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span className="uppercase tracking-wider text-[11px]">Queue Length</span>
            <div className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
              currentPred.queueTrend.startsWith('+') ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
            }`}>
              <TrendingUp className="w-3 h-3" />
              <span>{currentPred.queueTrend}</span>
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-black font-mono tracking-tight text-slate-950">
                {currentPred.queue}
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                Autonomous Pallet Carriers in Line
              </p>
            </div>
          </div>

          {/* Sparkline SVG (Step Accumulation) */}
          <div className="w-full h-10 pt-1">
            <svg viewBox="0 0 160 36" className="w-full h-full" fill="none">
              <path
                d="M 0 30 L 35 28 L 70 20 L 115 14 L 160 6"
                stroke="#6366f1"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 0 30 L 35 28 L 70 20 L 115 14 L 160 6 L 160 36 L 0 36 Z"
                fill="#e0e7ff"
                opacity="0.5"
              />
            </svg>
          </div>
        </div>

        {/* CARD 4: Delay Time */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span className="uppercase tracking-wider text-[11px]">Delay Time</span>
            <div className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
              currentPred.delayTrend.startsWith('+') ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
            }`}>
              <Clock className="w-3 h-3" />
              <span>{currentPred.delayTrend}</span>
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-black font-mono tracking-tight text-slate-950">
                {currentPred.delay}
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                Traversal Latency Penalty
              </p>
            </div>
          </div>

          {/* Sparkline SVG */}
          <div className="w-full h-10 pt-1">
            <svg viewBox="0 0 160 36" className="w-full h-full" fill="none">
              <path
                d="M 0 30 Q 40 26, 80 18 T 130 10 T 160 4"
                stroke="#0284c7"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 0 30 Q 40 26, 80 18 T 130 10 T 160 4 L 160 36 L 0 36 Z"
                fill="#e0f2fe"
                opacity="0.5"
              />
            </svg>
          </div>
        </div>

      </div>


      {/* ========================================================================= */}
      {/* SECTION 2: CONFIDENCE AND RISK                                            */}
      {/* Gauge + Risk label + Updated 5s ago                                       */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-6">
        
        {/* Gauge & Main Rating */}
        <div className="flex items-center space-x-5">
          {/* Circular SVG Gauge (Matches 87% Spec) */}
          <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.8"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={simulatedRerouteActive ? 'text-emerald-500' : 'text-rose-600'}
                strokeDasharray={`${simulatedRerouteActive ? 28 : 87}, 100`}
                strokeWidth="3.8"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-lg font-black font-mono text-slate-900 leading-none">
                {simulatedRerouteActive ? '28%' : '87%'}
              </span>
              <span className="text-[9px] text-slate-400 font-bold uppercase">Confidence</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs border ${
                simulatedRerouteActive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {simulatedRerouteActive ? 'Low Risk Status' : 'High Risk Status'}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                (Lead Time: +{horizon})
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              {simulatedRerouteActive 
                ? 'Traffic mitigated by automated bypass corridor' 
                : 'Severe Congestion & Buffer Stacking Forecasted'}
            </h3>
            <p className="text-xs text-slate-500">
              Neural graph attention weights identify Aisle B as primary bottleneck chokepoint.
            </p>
          </div>
        </div>

        {/* Updated Freshness Ticker */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-slate-600 font-medium">
              Updated <strong className="text-slate-900 font-mono font-bold">{secondsAgo}s ago</strong>
            </span>
          </div>

          <button
            onClick={() => setSecondsAgo(0)}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-900 transition-colors"
            title="Refresh Inference Now"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

      </div>


      {/* ========================================================================= */}
      {/* SECTION 3: EXPLAINABILITY                                                 */}
      {/* Left: Attention Heatmap on warehouse layout with High/Low legend          */}
      {/* Right: Influential Features bars (Aisle B 0.32, AGV 0.24, Queue 0.18...)  */}
      {/* Toggle: Per aisle / Overall                                               */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs space-y-6">
        
        {/* Header with Per Aisle / Overall Switcher */}
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-7 h-7 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs border border-purple-200">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="text-lg font-black text-slate-950">
                Section 3: Model Explainability (DSTGT Attention Layer)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Attention weights demonstrate why congestion was predicted at specific warehouse nodes
            </p>
          </div>

          {/* Toggle: Per aisle / Overall */}
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded-2xl bg-slate-100 border border-slate-200 flex items-center space-x-1 text-xs font-bold">
              <button
                onClick={() => setExplainabilityScope('overall')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  explainabilityScope === 'overall'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Overall Warehouse
              </button>
              <button
                onClick={() => setExplainabilityScope('aisle')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  explainabilityScope === 'aisle'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Per Aisle Deep-Dive
              </button>
            </div>

            {explainabilityScope === 'aisle' && (
              <select
                value={selectedAisle}
                onChange={(e) => setSelectedAisle(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 outline-none cursor-pointer"
              >
                <option value="Aisle B">Aisle B (Chokepoint)</option>
                <option value="Aisle A">Aisle A (Normal)</option>
                <option value="Packing">Packing & Sortation</option>
              </select>
            )}
          </div>
        </div>

        {/* Left & Right 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Warehouse Attention Heatmap Layout */}
          <div className="lg:col-span-6 rounded-2xl bg-[#0f172a] p-5 text-white space-y-4 shadow-inner relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-bold text-slate-200">
                  Spatial Attention Heatmap Layout
                </span>
              </div>

              {/* Legend: High / Low Attention */}
              <div className="flex items-center space-x-2 text-[10px] font-mono">
                <span className="text-slate-400">Low</span>
                <div className="w-20 h-2 rounded-full bg-gradient-to-r from-blue-500 via-amber-400 to-rose-600" />
                <span className="text-rose-400 font-bold">High Attention</span>
              </div>
            </div>

            {/* SVG Warehouse Layout Floorplan with Heatmap Hotspot */}
            <div className="relative h-64 w-full bg-slate-950/60 rounded-xl border border-slate-800 p-2 flex items-center justify-center">
              <svg viewBox="0 0 460 220" className="w-full h-full select-none" fill="none">
                <defs>
                  {/* Heatmap Gradient */}
                  <radialGradient id="heatAisleB" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.85" />
                    <stop offset="45%" stopColor="#f97316" stopOpacity="0.6" />
                    <stop offset="80%" stopColor="#eab308" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="heatAisleA" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Warehouse Wall Boundary */}
                <rect x="15" y="15" width="430" height="190" rx="10" stroke="#334155" strokeWidth="2" strokeDasharray="3 3" />

                {/* Inbound Dock Area */}
                <g 
                  onClick={() => { setExplainabilityScope('aisle'); setSelectedAisle('Aisle A'); }}
                  className="cursor-pointer group"
                >
                  <rect x="30" y="35" width="80" height="70" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                  <text x="70" y="70" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">INBOUND DOCKS</text>
                  <text x="70" y="85" fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="middle">Bay 1-3</text>
                </g>

                {/* Aisle A Zone (Normal - Green Aura) */}
                <g 
                  onClick={() => { setExplainabilityScope('aisle'); setSelectedAisle('Aisle A'); }}
                  className="cursor-pointer group"
                >
                  <circle cx="180" cy="70" r="45" fill="url(#heatAisleA)" />
                  <rect x="145" y="40" width="70" height="60" rx="8" fill="#1e293b" stroke="#10b981" strokeWidth="1.5" />
                  <text x="180" y="68" fill="#6ee7b7" fontSize="10" fontWeight="bold" textAnchor="middle">AISLE A</text>
                  <text x="180" y="82" fill="#a7f3d0" fontSize="8" fontFamily="monospace" textAnchor="middle">Normal (0.08)</text>
                </g>

                {/* Aisle B Zone (CRITICAL BOTTLENECK - Intense Red Attention Heatmap) */}
                <g 
                  onClick={() => { setExplainabilityScope('aisle'); setSelectedAisle('Aisle B'); }}
                  className="cursor-pointer group"
                >
                  {/* Heatmap Hotspot Ellipse */}
                  <circle cx="310" cy="70" r="58" fill="url(#heatAisleB)">
                    <animate attributeName="r" values="52;62;52" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <rect x="275" y="40" width="70" height="60" rx="8" fill="#1e293b" stroke="#ef4444" strokeWidth="2" />
                  <text x="310" y="66" fill="#fca5a5" fontSize="10" fontWeight="black" textAnchor="middle">AISLE B</text>
                  <text x="310" y="80" fill="#f87171" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                    ATTENTION: 0.42
                  </text>
                  {/* Pulsing Alert Ring */}
                  <circle cx="310" cy="70" r="32" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3">
                    <animate attributeName="r" values="28;38" dur="1.4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="1;0" dur="1.4s" repeatCount="indefinite" />
                  </circle>
                </g>

                {/* Packing & Sortation Station (Moderate) */}
                <g 
                  onClick={() => { setExplainabilityScope('aisle'); setSelectedAisle('Packing'); }}
                  className="cursor-pointer group"
                >
                  <rect x="275" y="135" width="135" height="55" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
                  <text x="342" y="162" fill="#fde047" fontSize="10" fontWeight="bold" textAnchor="middle">PACKING & SORTATION</text>
                  <text x="342" y="176" fill="#fcd34d" fontSize="8" fontFamily="monospace" textAnchor="middle">Attention: 0.22 (Moderate)</text>
                </g>

                {/* AGV Movement Edges */}
                <path d="M 110 70 L 145 70" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M 215 70 L 275 70" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="4 4" />
                <path d="M 310 100 L 310 135" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="4 4" />
                <path d="M 180 100 Q 210 145, 275 160" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />
              </svg>
            </div>

            <p className="text-[11px] text-slate-400">
              💡 Click on any zone in the diagram above to inspect why the attention weights are allocated.
            </p>
          </div>

          {/* RIGHT COLUMN: Influential Features Bars */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">
                  Top Influential Features ({explainabilityScope === 'overall' ? 'Overall Warehouse' : selectedAisle})
                </h4>
                <p className="text-xs text-slate-400">
                  Feature importance extracted from Cross-Attention Fusion layer
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-500 font-bold">
                Σ Weight = 1.00
              </span>
            </div>

            {/* Feature Bars Stack */}
            <div className="space-y-3">
              {activeFeatures.map((item, idx) => (
                <div key={item.name} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span className="flex items-center space-x-1.5">
                      <span className="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center font-mono text-[10px] text-slate-600">
                        {idx + 1}
                      </span>
                      <span>{item.name}</span>
                    </span>
                    <span className="font-mono text-slate-950 font-black text-sm">
                      {item.weight}
                    </span>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="w-full h-2 bg-slate-200/70 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        idx === 0 ? 'bg-rose-500' :
                        idx === 1 ? 'bg-sky-500' :
                        idx === 2 ? 'bg-amber-500' :
                        idx === 3 ? 'bg-purple-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${item.pct * 2.2}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-500">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>


      {/* ========================================================================= */}
      {/* SECTION 4: FORECAST TIMELINE (NEXT 60 MIN WITH CONFIDENCE BAND)           */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-7 h-7 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-200">
                <Clock className="w-4 h-4" />
              </span>
              <h3 className="text-lg font-black text-slate-950">
                Section 4: Forecast Timeline (Next 60 Minutes with Confidence Band)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Trajectory projection of congestion probability over time with 95% Confidence Interval
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs font-semibold text-slate-600">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-0.5 bg-rose-600" />
              <span>Mean Prediction</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-2 rounded bg-rose-100 border border-rose-300" />
              <span>95% Confidence Band</span>
            </div>
          </div>
        </div>

        {/* SVG Area Chart with Confidence Band */}
        <div className="w-full h-56 pt-2">
          <svg viewBox="0 0 680 180" className="w-full h-full" fill="none">
            {/* Grid Lines */}
            {[40, 80, 120, 160].map((gy) => (
              <line key={gy} x1="40" y1={gy} x2="660" y2={gy} stroke="#f1f5f9" strokeWidth="1" />
            ))}

            {/* Confidence Band (Shaded area between upper & lower bounds) */}
            <path
              d="
                M 40 140 
                C 140 130, 240 85, 360 60 
                C 480 35, 570 25, 660 18
                L 660 48
                C 570 58, 480 72, 360 98
                C 240 120, 140 150, 40 160
                Z
              "
              fill={simulatedRerouteActive ? '#d1fae5' : '#fee2e2'}
              opacity="0.65"
            />

            {/* Mean Predicted Line */}
            <path
              d={
                simulatedRerouteActive
                  ? "M 40 150 C 140 142, 240 135, 360 130 C 480 124, 570 120, 660 115"
                  : "M 40 150 C 140 140, 240 102, 360 78 C 480 52, 570 40, 660 30"
              }
              stroke={simulatedRerouteActive ? '#10b981' : '#dc2626'}
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Data Point Dots */}
            {[
              { x: 40, y: 150, label: 'Now', val: '42%' },
              { x: 195, y: simulatedRerouteActive ? 138 : 115, label: '+15m', val: currentPred.prob },
              { x: 350, y: simulatedRerouteActive ? 130 : 80, label: '+30m', val: '92%' },
              { x: 505, y: simulatedRerouteActive ? 122 : 48, label: '+45m', val: '95%' },
              { x: 660, y: simulatedRerouteActive ? 115 : 30, label: '+60m', val: '98%' },
            ].map((pt) => (
              <g key={pt.label}>
                <circle cx={pt.x} cy={pt.y} r="4.5" fill="#ffffff" stroke={simulatedRerouteActive ? '#10b981' : '#dc2626'} strokeWidth="2.5" />
                <text x={pt.x} y="175" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  {pt.label}
                </text>
                <text x={pt.x} y={pt.y - 10} fill="#0f172a" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="black">
                  {pt.val}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>


      {/* ========================================================================= */}
      {/* SECTION 5 (ADMIN ONLY): MODEL INFO CARD                                   */}
      {/* Model: DSTGT v1.0, Last trained date, Training data size,                 */}
      {/* Accuracy 92%, F1 Score, MAE.                                              */}
      {/* Buttons: Retrain Model (confirm popup) & View Model Metrics               */}
      {/* During retrain: progress bar and status Retraining 45%                    */}
      {/* ========================================================================= */}
      {isAdmin && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs">
                <Database className="w-5 h-5 text-mint-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-black text-slate-950">
                    Section 5: DSTGT Model Metadata & Administration
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-950 text-white text-[10px] font-bold">
                    Admin Only
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Model hyperparameters, edge training checkpoints & neural performance metrics
                </p>
              </div>
            </div>

            {/* Actions: Retrain & View Metrics */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMetricsModalOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center space-x-1.5"
              >
                <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
                <span>View Model Metrics</span>
              </button>

              <button
                disabled={isRetraining}
                onClick={() => setIsRetrainConfirmOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center space-x-1.5 shadow-xs disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRetraining ? 'animate-spin' : ''}`} />
                <span>{isRetraining ? 'Retraining...' : 'Retrain Model'}</span>
              </button>
            </div>
          </div>

          {/* Model Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Model Architecture</span>
              <strong className="text-sm font-black text-slate-900 mt-0.5 block">DSTGT v1.0</strong>
              <span className="text-[10px] text-slate-500">GNN + Transformer</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Last Trained Date</span>
              <strong className="text-sm font-black text-slate-900 mt-0.5 block">Oct 6, 2026</strong>
              <span className="text-[10px] text-slate-500 font-mono">23:45 UTC</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Training Data Size</span>
              <strong className="text-sm font-black text-slate-900 mt-0.5 block">4.2M Sequences</strong>
              <span className="text-[10px] text-slate-500">Kafka Edge Logs</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
              <span className="text-[10px] text-emerald-700 font-bold uppercase block">Accuracy</span>
              <strong className="text-sm font-black text-emerald-800 mt-0.5 block font-mono">92.4%</strong>
              <span className="text-[10px] text-emerald-600">Top-1 Match</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-200">
              <span className="text-[10px] text-sky-700 font-bold uppercase block">F1 Score</span>
              <strong className="text-sm font-black text-sky-800 mt-0.5 block font-mono">0.89</strong>
              <span className="text-[10px] text-sky-600">Macro Balanced</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200">
              <span className="text-[10px] text-purple-700 font-bold uppercase block">MAE</span>
              <strong className="text-sm font-black text-purple-800 mt-0.5 block font-mono">1.42 min</strong>
              <span className="text-[10px] text-purple-600">Mean Abs Error</span>
            </div>
          </div>

          {/* DURING RETRAIN STATUS & PROGRESS BAR */}
          {isRetraining && (
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 animate-fadeIn shadow-md">
              <div className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-mint-400/40 border-t-mint-400 rounded-full animate-spin" />
                  <span className="text-mint-400">Retraining {retrainProgress}%</span>
                </div>
                <span className="text-slate-400 font-mono text-[11px]">
                  Batch 142/320 • Graph Attention Weights Epoch 4
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 via-mint-400 to-emerald-400 rounded-full transition-all duration-300"
                  style={{ width: `${retrainProgress}%` }}
                />
              </div>
            </div>
          )}

          {retrainComplete && !isRetraining && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between animate-fadeIn">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Retraining complete! Model weights updated to DSTGT v1.0.2 (Accuracy improved to 93.1%).</span>
              </div>
              <button onClick={() => setRetrainComplete(false)} className="text-emerald-700 hover:text-emerald-900">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      )}


      {/* ========================================================================= */}
      {/* CONFIRMATION POPUP FOR RETRAIN MODEL                                      */}
      {/* Warning: "Retraining may take several minutes. Predictions will use       */}
      {/* the current model until finished."                                        */}
      {/* ========================================================================= */}
      {isRetrainConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 text-slate-900 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-slate-950">Confirm Model Retraining</h3>
              </div>
              <button
                onClick={() => setIsRetrainConfirmOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs leading-relaxed space-y-1">
              <span className="font-bold block">Important Notice:</span>
              <p>
                Retraining may take several minutes. Predictions will use the current model until finished.
              </p>
            </div>

            <div className="text-xs text-slate-500 space-y-1">
              <p>• Data Source: Last 4.2M telemetry sequences from Apache Kafka edge pipeline.</p>
              <p>• Node Topology: 24 storage racks, 4 docking bays, 22 AGV routes.</p>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsRetrainConfirmOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsRetrainConfirmOpen(false);
                  setIsRetraining(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
              >
                Confirm & Start Retraining
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ========================================================================= */}
      {/* VIEW MODEL METRICS MODAL                                                  */}
      {/* Confusion Matrix, Training Loss, Attention Heatmap Weights                */}
      {/* ========================================================================= */}
      {isMetricsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 text-slate-900 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-950">DSTGT Deep Evaluation Metrics</h3>
                  <p className="text-[11px] text-slate-500">Cross-Entropy Loss & Multi-Task Verification</p>
                </div>
              </div>
              <button
                onClick={() => setIsMetricsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Metrics Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block">Test Loss (Cross-Entropy)</span>
                  <span className="text-lg font-black font-mono text-slate-900">0.041</span>
                  <span className="text-[10px] text-emerald-600 block mt-0.5">↓ 0.008 from baseline</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block">ROC-AUC Score</span>
                  <span className="text-lg font-black font-mono text-slate-900">0.962</span>
                  <span className="text-[10px] text-emerald-600 block mt-0.5">High Discriminative Ability</span>
                </div>
              </div>

              {/* Confusion Matrix Table */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-800 block">Bottleneck Confusion Matrix</span>
                <table className="w-full text-center text-[11px]">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-200">
                      <th className="py-1">Actual \ Pred</th>
                      <th className="py-1">Pred Congested</th>
                      <th className="py-1">Pred Normal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="font-bold text-slate-700 py-1.5">Congested</td>
                      <td className="font-mono font-bold text-emerald-600 bg-emerald-50/50">94.2% (TP)</td>
                      <td className="font-mono text-slate-500">5.8% (FN)</td>
                    </tr>
                    <tr>
                      <td className="font-bold text-slate-700 py-1.5">Normal</td>
                      <td className="font-mono text-slate-500">3.8% (FP)</td>
                      <td className="font-mono font-bold text-emerald-600 bg-emerald-50/50">96.2% (TN)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsMetricsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Close Metrics
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
