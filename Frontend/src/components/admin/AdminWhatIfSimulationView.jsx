import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Sparkles, 
  Play, 
  RotateCcw, 
  TrendingDown, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Bot, 
  Layers, 
  Save, 
  Share2, 
  Trash2, 
  ArrowRight, 
  Check, 
  X, 
  Eye, 
  BarChart3, 
  Flame,
  Radio,
  FileCheck
} from 'lucide-react';

export default function AdminWhatIfSimulationView({ 
  onApplySimulationToTwin,
  isAdmin = true,
  currentUser 
}) {
  // Left Controls Panel State
  const [agvCount, setAgvCount] = useState(18); // 10 to 30, current 18
  const [orderVolumeChange, setOrderVolumeChange] = useState(0); // -50% to +100%
  const [closedAisles, setClosedAisles] = useState([]); // ['Aisle A', 'Aisle B', etc.]
  const [shiftTime, setShiftTime] = useState('Peak Shift (Current Load)');
  const [duration, setDuration] = useState('60'); // '30' | '60' | '120'

  // Simulation Running State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simProgress, setSimProgress] = useState(0);
  const [hasRun, setHasRun] = useState(true);

  // Modals
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isApplyConfirmOpen, setIsApplyConfirmOpen] = useState(false);
  const [applySuccessBanner, setApplySuccessBanner] = useState(false);
  const [scenarioNameInput, setScenarioNameInput] = useState('');

  // Saved Scenarios Table Dataset
  const [savedScenarios, setSavedScenarios] = useState([
    {
      id: 1,
      name: 'Dynamic Peak Bypass (22 AGVs)',
      createdBy: 'Sarah Lin (Admin)',
      date: 'Oct 7, 2026',
      summary: '-40% Congestion, -4.3m Delay',
      reductionPct: 40,
      sharedWithUsers: true,
      config: { agvCount: 22, orderVolumeChange: 15, closedAisles: [], shiftTime: 'Peak Shift (Current Load)', duration: '60' },
    },
    {
      id: 2,
      name: 'Aisle B Maintenance Divert',
      createdBy: 'Sam Haddad (Lead)',
      date: 'Oct 6, 2026',
      summary: '-28% Congestion, -2.8m Delay',
      reductionPct: 28,
      sharedWithUsers: true,
      config: { agvCount: 16, orderVolumeChange: -10, closedAisles: ['Aisle B'], shiftTime: 'Morning (06:00 - 14:00)', duration: '120' },
    },
    {
      id: 3,
      name: 'Night Shift Fleet Optimization',
      createdBy: 'Sarah Lin (Admin)',
      date: 'Oct 5, 2026',
      summary: '-52% Congestion, -4.8m Delay',
      reductionPct: 52,
      sharedWithUsers: false,
      config: { agvCount: 14, orderVolumeChange: -30, closedAisles: [], shiftTime: 'Night (22:00 - 06:00)', duration: '30' },
    },
  ]);

  // Dynamic Before vs After calculation based on controls
  const computeMetrics = () => {
    // Baseline Current Values
    const baseline = {
      congestion: 87,
      queue: 22,
      delay: 6.4,
    };

    // Calculate effect of controls:
    // Adding AGVs helps up to a point, but if too high with order volume, can increase congestion
    // Closing aisles increases congestion
    let congestionDelta = 0;
    
    // AGV count factor: optimal is around 22-24
    if (agvCount > 18) {
      congestionDelta -= (agvCount - 18) * 4; // reduction
    } else {
      congestionDelta += (18 - agvCount) * 3; // shortage causes delay
    }

    // Order Volume factor:
    congestionDelta += (orderVolumeChange * 0.4);

    // Closed aisles factor:
    congestionDelta += closedAisles.length * 14;

    // Simulated Congestion
    let simCongestion = Math.round(Math.max(18, Math.min(99, baseline.congestion + congestionDelta)));
    
    // Queue length roughly proportional to congestion
    let simQueue = Math.round(Math.max(4, Math.min(48, (simCongestion / 87) * baseline.queue)));

    // Delay time roughly proportional to congestion
    let simDelay = Number(Math.max(0.8, Math.min(18.5, (simCongestion / 87) * baseline.delay)).toFixed(1));

    const congestionDiff = baseline.congestion - simCongestion;
    const isImproved = congestionDiff > 0;
    const reductionPercent = Math.round((congestionDiff / baseline.congestion) * 100);

    return {
      baseline,
      simulated: {
        congestion: simCongestion,
        queue: simQueue,
        delay: simDelay,
      },
      isImproved,
      reductionPercent: Math.abs(reductionPercent),
      isWorse: congestionDiff < 0,
    };
  };

  const currentMetrics = computeMetrics();

  // Run Simulation Handler with animated progress bar
  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimProgress(0);
    setHasRun(false);

    const steps = [18, 42, 65, 88, 100];
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < steps.length) {
        setSimProgress(steps[idx]);
        idx++;
        if (idx === steps.length) {
          setTimeout(() => {
            setIsSimulating(false);
            setHasRun(true);
            clearInterval(interval);
          }, 500);
        }
      }
    }, 350);
  };

  // Reset Handler
  const handleReset = () => {
    setAgvCount(18);
    setOrderVolumeChange(0);
    setClosedAisles([]);
    setShiftTime('Peak Shift (Current Load)');
    setDuration('60');
  };

  // Closed Aisle Toggle
  const handleToggleAisle = (aisle) => {
    if (closedAisles.includes(aisle)) {
      setClosedAisles(closedAisles.filter((a) => a !== aisle));
    } else {
      setClosedAisles([...closedAisles, aisle]);
    }
  };

  // Save Scenario Handler
  const handleSaveScenario = (e) => {
    e.preventDefault();
    if (!scenarioNameInput.trim()) return;

    const newScenario = {
      id: Date.now(),
      name: scenarioNameInput.trim(),
      createdBy: 'Sarah Lin (Admin)',
      date: 'Today',
      summary: `${currentMetrics.isImproved ? '-' : '+'}${currentMetrics.reductionPercent}% Congestion, ${currentMetrics.simulated.delay}m Delay`,
      reductionPct: currentMetrics.isImproved ? currentMetrics.reductionPercent : -currentMetrics.reductionPercent,
      sharedWithUsers: true,
      config: { agvCount, orderVolumeChange, closedAisles, shiftTime, duration },
    };

    setSavedScenarios([newScenario, ...savedScenarios]);
    setScenarioNameInput('');
    setIsSaveModalOpen(false);
  };

  // Load Scenario Handler
  const handleLoadScenario = (sc) => {
    setAgvCount(sc.config.agvCount);
    setOrderVolumeChange(sc.config.orderVolumeChange);
    setClosedAisles(sc.config.closedAisles);
    setShiftTime(sc.config.shiftTime);
    setDuration(sc.config.duration);
    handleRunSimulation();
  };

  // Delete Scenario Handler
  const handleDeleteScenario = (id) => {
    setSavedScenarios(savedScenarios.filter((sc) => sc.id !== id));
  };

  // Toggle Share Handler
  const handleToggleShare = (id) => {
    setSavedScenarios((prev) =>
      prev.map((sc) => (sc.id === id ? { ...sc, sharedWithUsers: !sc.sharedWithUsers } : sc))
    );
  };

  // Apply Changes to Live Warehouse Handler
  const handleApplyRecommended = () => {
    setIsApplyConfirmOpen(false);
    setApplySuccessBanner(true);
    if (onApplySimulationToTwin) onApplySimulationToTwin();
    setTimeout(() => {
      setApplySuccessBanner(false);
    }, 6000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 font-sans text-slate-900">
      
      {/* ========================================================================= */}
      {/* HEADER: A6 WHAT-IF SIMULATION TITLE                                       */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs">
            <Sliders className="w-5 h-5 text-mint-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-slate-950 tracking-tight">
                A6. What-if Simulation & Reroute Engine
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-950 text-white text-[10px] font-bold">
                Admin Exclusive
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate operational adjustments, evaluate fleet bottlenecks before deployment, and push AI recommendations
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-mono font-bold">
            DSTGT Simulation Core v1.0
          </span>
        </div>
      </div>

      {/* Applied Success Alert Banner */}
      {applySuccessBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <strong className="block font-bold">Recommended Changes Dispatched!</strong>
              <span>
                Operational team received bypass route directive. AGV fleet dispatch routing updated live.
              </span>
            </div>
          </div>
          <button onClick={() => setApplySuccessBanner(false)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}


      {/* ========================================================================= */}
      {/* MAIN 2-COLUMN SPLIT: LEFT CONTROLS PANEL | RIGHT RESULTS PANEL            */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ======================================================================= */}
        {/* LEFT COLUMN: CONTROLS PANEL (SLIDERS, CHECKBOXES, SHIFT TIME)          */}
        {/* ======================================================================= */}
        <div className="lg:col-span-5 rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-extrabold text-slate-950 flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>Simulation Controls</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Parameter Set #1</span>
          </div>

          <div className="space-y-5">
            
            {/* Control 1: AGV Count Slider (10 to 30, current 18) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center space-x-1.5">
                  <Bot className="w-3.5 h-3.5 text-blue-600" />
                  <span>AGV Fleet Count</span>
                </span>
                <span className="font-mono text-slate-950 px-2 py-0.5 rounded-lg bg-blue-50 border border-blue-200 text-xs font-bold">
                  {agvCount} AGVs (Current: 18)
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="30"
                value={agvCount}
                onChange={(e) => setAgvCount(Number(e.target.value))}
                className="w-full accent-slate-950 cursor-pointer h-2 bg-slate-100 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>10 Min</span>
                <span>18 Baseline</span>
                <span>30 Max</span>
              </div>
            </div>

            {/* Control 2: Order Volume Slider (-50% to +100%) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center space-x-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Order Volume Shift</span>
                </span>
                <span className={`font-mono px-2 py-0.5 rounded-lg border text-xs font-bold ${
                  orderVolumeChange > 0
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : orderVolumeChange < 0
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}>
                  {orderVolumeChange > 0 ? `+${orderVolumeChange}%` : `${orderVolumeChange}%`}
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="100"
                step="5"
                value={orderVolumeChange}
                onChange={(e) => setOrderVolumeChange(Number(e.target.value))}
                className="w-full accent-slate-950 cursor-pointer h-2 bg-slate-100 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>-50% Inflow</span>
                <span>0% Current</span>
                <span>+100% Surge</span>
              </div>
            </div>

            {/* Control 3: Closed Aisles Multi-Select Checkboxes */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 block">
                Closed Aisles for Maintenance / Obstruction
              </span>
              <div className="grid grid-cols-2 gap-2">
                {['Aisle A', 'Aisle B', 'Aisle C', 'Aisle D'].map((aisle) => (
                  <label
                    key={aisle}
                    className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-colors select-none ${
                      closedAisles.includes(aisle)
                        ? 'bg-rose-50 border-rose-300 text-rose-900'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={closedAisles.includes(aisle)}
                      onChange={() => handleToggleAisle(aisle)}
                      className="w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                    />
                    <span>{aisle} {closedAisles.includes(aisle) ? '(Closed)' : ''}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Control 4: Shift Time Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">
                Shift Time & Operating Window
              </label>
              <select
                value={shiftTime}
                onChange={(e) => setShiftTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 outline-none cursor-pointer"
              >
                <option value="Morning (06:00 - 14:00)">Morning Shift (06:00 - 14:00)</option>
                <option value="Afternoon (14:00 - 22:00)">Afternoon Shift (14:00 - 22:00)</option>
                <option value="Night (22:00 - 06:00)">Night Shift (22:00 - 06:00)</option>
                <option value="Peak Shift (Current Load)">Peak Shift (Current High Load)</option>
              </select>
            </div>

            {/* Control 5: Duration (30 / 60 / 120 min) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">
                Simulation Projection Duration
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['30', '60', '120'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      duration === d
                        ? 'bg-slate-950 text-white border-slate-950 shadow-2xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {d} min
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Action Buttons: Run Simulation & Reset */}
          <div className="flex items-center space-x-2 pt-4 border-t border-slate-100">
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="flex-1 py-3 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-slate-800 transition-colors flex items-center justify-center space-x-2 shadow-xs cursor-pointer disabled:opacity-75"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Run Simulation</span>
            </button>

            <button
              onClick={handleReset}
              className="px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center space-x-1.5"
              title="Reset parameters to current baseline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>


        {/* ======================================================================= */}
        {/* RIGHT COLUMN: SIMULATION RESULTS                                        */}
        {/* Progress bar, Before vs After cards, comparison chart, heatmaps, banner */}
        {/* ======================================================================= */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* SIMULATION LOADING PROGRESS BAR */}
          {isSimulating && (
            <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-3 shadow-md animate-fadeIn">
              <div className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-mint-400/30 border-t-mint-400 rounded-full animate-spin" />
                  <span className="text-mint-400">Simulating {duration} minutes...</span>
                </div>
                <span className="font-mono text-slate-400">{simProgress}% Complete</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 via-mint-400 to-emerald-400 rounded-full transition-all duration-300"
                  style={{ width: `${simProgress}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Computing spatial collision hazards across {agvCount} AGVs and {closedAisles.length} closed aisles...
              </p>
            </div>
          )}

          {/* SIMULATION SUMMARY IMPACT BANNER */}
          {hasRun && !isSimulating && (
            <div className={`p-4.5 rounded-2xl border flex flex-wrap items-center justify-between gap-3 shadow-xs animate-fadeIn ${
              currentMetrics.isImproved
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}>
              <div className="flex items-start space-x-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 mt-0.5 ${
                  currentMetrics.isImproved ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {currentMetrics.isImproved ? <Sparkles className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-sm font-black">
                    {currentMetrics.isImproved
                      ? `This scenario reduces congestion by ${currentMetrics.reductionPercent}%.`
                      : `Warning: This configuration increases congestion by ${currentMetrics.reductionPercent}%.`}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {currentMetrics.isImproved
                      ? 'Optimal balance of AGV fleet and corridor dispatch paths achieved.'
                      : 'Closing aisles with high order volume created massive upstream bottlenecks.'}
                  </p>
                  {/* Explicit User Spec Note */}
                  <div className="mt-1.5 flex items-center space-x-1.5 text-[11px] font-bold text-slate-700 bg-white/70 px-2.5 py-1 rounded-lg border border-slate-200/60 inline-flex">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>Note: Changes here do not affect the real warehouse. Safe sandbox environment.</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsSaveModalOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 transition-colors flex items-center space-x-1.5 shadow-2xs"
                >
                  <Save className="w-3.5 h-3.5 text-slate-500" />
                  <span>{isAdmin ? 'Save Scenario' : 'Save to My Scenarios'}</span>
                </button>
              </div>
            </div>
          )}

          {/* BEFORE VS AFTER CARDS (3 CARDS) */}
          {/* Congestion 87% to 52%, Queue 22 to 11, Delay 6.4 to 2.1 min */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Card 1: Congestion Probability */}
            <div className="p-4.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
              <span className="text-[11px] text-slate-400 font-bold uppercase block">Congestion Likelihood</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-lg font-bold text-slate-400 line-through font-mono">
                  {currentMetrics.baseline.congestion}%
                </span>
                <span className="text-xs text-slate-400">➔</span>
                <span className={`text-2xl font-black font-mono ${
                  currentMetrics.isImproved ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {currentMetrics.simulated.congestion}%
                </span>
              </div>
              <div className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                currentMetrics.isImproved ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}>
                {currentMetrics.isImproved ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                <span>{currentMetrics.isImproved ? `-${currentMetrics.reductionPercent}% Improvement` : `+${currentMetrics.reductionPercent}% Surge`}</span>
              </div>
            </div>

            {/* Card 2: Queue Length */}
            <div className="p-4.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
              <span className="text-[11px] text-slate-400 font-bold uppercase block">Queue Length</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-lg font-bold text-slate-400 line-through font-mono">
                  {currentMetrics.baseline.queue}
                </span>
                <span className="text-xs text-slate-400">➔</span>
                <span className={`text-2xl font-black font-mono ${
                  currentMetrics.isImproved ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {currentMetrics.simulated.queue}
                </span>
                <span className="text-xs text-slate-500 font-medium">units</span>
              </div>
              <div className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                currentMetrics.isImproved ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}>
                {currentMetrics.isImproved ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                <span>{currentMetrics.baseline.queue - currentMetrics.simulated.queue} pallets</span>
              </div>
            </div>

            {/* Card 3: Traversal Delay */}
            <div className="p-4.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
              <span className="text-[11px] text-slate-400 font-bold uppercase block">Average Delay Time</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-lg font-bold text-slate-400 line-through font-mono">
                  {currentMetrics.baseline.delay}m
                </span>
                <span className="text-xs text-slate-400">➔</span>
                <span className={`text-2xl font-black font-mono ${
                  currentMetrics.isImproved ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {currentMetrics.simulated.delay}m
                </span>
              </div>
              <div className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                currentMetrics.isImproved ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}>
                {currentMetrics.isImproved ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                <span>{(currentMetrics.baseline.delay - currentMetrics.simulated.delay).toFixed(1)}m saved</span>
              </div>
            </div>

          </div>

          {/* COMPARISON BAR CHART + SIDE-BY-SIDE HEATMAP */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-black text-slate-900">
                  Visual Comparison: Current vs Simulated Layout Heatmap
                </h4>
                <p className="text-xs text-slate-500">
                  Evaluating spatial congestion diffusion across warehouse racks
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400">Lead Horizon: +{duration}m</span>
            </div>

            {/* Side-by-Side Heatmaps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Left: Current Floor Heatmap */}
              <div className="p-3.5 rounded-2xl bg-[#0f172a] text-white space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-300">1. Current Live Status</span>
                  <span className="text-rose-400 font-mono">87% Bottleneck</span>
                </div>
                {/* SVG Visual */}
                <div className="h-32 w-full bg-slate-950/70 rounded-xl border border-slate-800 flex items-center justify-center relative overflow-hidden">
                  <svg viewBox="0 0 200 100" className="w-full h-full" fill="none">
                    <circle cx="140" cy="50" r="38" fill="#ef4444" opacity="0.65" />
                    <rect x="20" y="30" width="35" height="40" rx="4" fill="#1e293b" stroke="#64748b" />
                    <rect x="75" y="30" width="35" height="40" rx="4" fill="#1e293b" stroke="#10b981" />
                    <rect x="130" y="30" width="35" height="40" rx="4" fill="#1e293b" stroke="#ef4444" strokeWidth="2" />
                    <text x="37" y="55" fill="#94a3b8" fontSize="8" textAnchor="middle">Docks</text>
                    <text x="92" y="55" fill="#a7f3d0" fontSize="8" textAnchor="middle">Aisle A</text>
                    <text x="147" y="55" fill="#fca5a5" fontSize="8" fontWeight="bold" textAnchor="middle">Aisle B</text>
                  </svg>
                </div>
                <span className="text-[10px] text-rose-400 block text-center font-medium">
                  Severe congestion concentrated in Aisle B
                </span>
              </div>

              {/* Right: Simulated Floor Heatmap */}
              <div className="p-3.5 rounded-2xl bg-[#0f172a] text-white space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-300">2. Simulated Outcome</span>
                  <span className={`font-mono ${currentMetrics.isImproved ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {currentMetrics.simulated.congestion}% Forecast
                  </span>
                </div>
                {/* SVG Visual */}
                <div className="h-32 w-full bg-slate-950/70 rounded-xl border border-slate-800 flex items-center justify-center relative overflow-hidden">
                  <svg viewBox="0 0 200 100" className="w-full h-full" fill="none">
                    <circle 
                      cx="140" 
                      cy="50" 
                      r={currentMetrics.isImproved ? '20' : '45'} 
                      fill={currentMetrics.isImproved ? '#10b981' : '#ef4444'} 
                      opacity={currentMetrics.isImproved ? '0.4' : '0.8'} 
                    />
                    <rect x="20" y="30" width="35" height="40" rx="4" fill="#1e293b" stroke="#64748b" />
                    <rect x="75" y="30" width="35" height="40" rx="4" fill="#1e293b" stroke="#10b981" />
                    <rect 
                      x="130" 
                      y="30" 
                      width="35" 
                      height="40" 
                      rx="4" 
                      fill="#1e293b" 
                      stroke={currentMetrics.isImproved ? '#10b981' : '#ef4444'} 
                      strokeWidth="1.5" 
                    />
                    <text x="37" y="55" fill="#94a3b8" fontSize="8" textAnchor="middle">Docks</text>
                    <text x="92" y="55" fill="#a7f3d0" fontSize="8" textAnchor="middle">Aisle A</text>
                    <text x="147" y="55" fill={currentMetrics.isImproved ? '#a7f3d0' : '#fca5a5'} fontSize="8" fontWeight="bold" textAnchor="middle">
                      {closedAisles.includes('Aisle B') ? 'Closed' : 'Aisle B'}
                    </text>
                  </svg>
                </div>
                <span className={`text-[10px] block text-center font-medium ${
                  currentMetrics.isImproved ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {currentMetrics.isImproved ? 'Congestion dispersed smoothly via bypass' : 'Severe gridlock escalation'}
                </span>
              </div>

            </div>

            {/* Bottom Actions: Save Scenario & Apply Recommended Changes */}
            <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100 gap-3">
              <button
                onClick={() => setIsSaveModalOpen(true)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center space-x-1.5 shadow-2xs"
              >
                <Save className="w-3.5 h-3.5 text-slate-500" />
                <span>{isAdmin ? 'Save Scenario to Library' : 'Save to My Scenarios'}</span>
              </button>

              {isAdmin && (
                <button
                  onClick={() => setIsApplyConfirmOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-slate-800 transition-colors flex items-center space-x-2 shadow-xs cursor-pointer"
                >
                  <FileCheck className="w-4 h-4 text-mint-400" />
                  <span>Apply Recommended Changes</span>
                </button>
              )}
            </div>
          </div>

        </div>

      </div>


      {/* ========================================================================= */}
      {/* SAVED SCENARIOS TABLE (BELOW)                                             */}
      {/* Name, Created By, Date, Result Summary, Share with Users, Delete, Load    */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-950">
              {isAdmin ? 'Saved Simulation Scenarios Library' : 'My Scenarios Library'}
            </h3>
            <p className="text-xs text-slate-500">
              {isAdmin 
                ? 'Historical simulated operational models available for one-click reload or floor sharing'
                : 'Your saved simulation runs. Changes here do not affect the real warehouse.'}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">
            {savedScenarios.length} Scenarios Saved
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Scenario Name</th>
                <th className="py-2.5 px-3">Created By</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Result Summary</th>
                {isAdmin && <th className="py-2.5 px-3">Share with Users</th>}
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {savedScenarios.map((sc) => {
                const isOwn = sc.createdBy.toLowerCase().includes('lead') || 
                              sc.createdBy.toLowerCase().includes('operator') || 
                              sc.createdBy.toLowerCase().includes(currentUser?.username?.toLowerCase() || '');
                const canDelete = isAdmin || isOwn;

                return (
                  <tr key={sc.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <strong className="text-slate-900 font-bold block">{sc.name}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {sc.config.agvCount} AGVs • {sc.config.shiftTime.split(' ')[0]}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{sc.createdBy}</td>
                    <td className="py-3 px-3 text-slate-500 font-mono">{sc.date}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                        sc.reductionPct > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {sc.summary}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="py-3 px-3">
                        <label className="flex items-center space-x-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={sc.sharedWithUsers}
                            onChange={() => handleToggleShare(sc.id)}
                            className="w-4 h-4 rounded border-slate-300 text-slate-950 focus:ring-slate-950 cursor-pointer"
                          />
                          <span className="text-[11px] font-bold text-slate-600">
                            {sc.sharedWithUsers ? 'Shared' : 'Private'}
                          </span>
                        </label>
                      </td>
                    )}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleLoadScenario(sc)}
                          className="px-3 py-1 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-2xs"
                        >
                          Load
                        </button>
                        {canDelete && (
                          <button
                            onClick={() => handleDeleteScenario(sc.id)}
                            className="p-1.5 rounded-xl border border-slate-200 text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Scenario"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>


      {/* ========================================================================= */}
      {/* MODAL 1: SAVE SCENARIO MODAL                                              */}
      {/* ========================================================================= */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 text-slate-900 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Save className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-slate-950">Save Simulation Scenario</h3>
              </div>
              <button onClick={() => setIsSaveModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveScenario} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Scenario Title
                </label>
                <input
                  type="text"
                  value={scenarioNameInput}
                  onChange={(e) => setScenarioNameInput(e.target.value)}
                  placeholder="e.g. Afternoon Shift Bypass Routing"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-slate-950"
                  autoFocus
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-0.5">
                <p>• Fleet: <strong>{agvCount} AGVs</strong> ({orderVolumeChange > 0 ? `+${orderVolumeChange}%` : `${orderVolumeChange}%`} Volume)</p>
                <p>• Shift: <strong>{shiftTime}</strong> ({duration} min)</p>
                <p>• Impact: <strong className="text-emerald-700">{currentMetrics.isImproved ? `-${currentMetrics.reductionPercent}% Congestion` : `+${currentMetrics.reductionPercent}% Congestion`}</strong></p>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSaveModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-slate-800"
                >
                  Save Scenario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* ========================================================================= */}
      {/* MODAL 2: APPLY RECOMMENDED CHANGES CONFIRM POPUP                           */}
      {/* Warning: "This will push these changes as recommendations to the          */}
      {/* operations team."                                                         */}
      {/* ========================================================================= */}
      {isApplyConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 text-slate-900 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-950">Confirm Operational Dispatch</h3>
                <p className="text-xs text-slate-500">Live floor routing change notification</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs leading-relaxed">
              <strong>Notice:</strong> This will push these changes as recommendations to the operations team.
            </div>

            <p className="text-xs text-slate-600">
              Floor lead operators and automated AGV route dispatchers will receive prompt instructions to adjust active transit corridors accordingly.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsApplyConfirmOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyRecommended}
                className="px-5 py-2 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-slate-800 shadow-xs"
              >
                Confirm & Dispatch to Floor
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
