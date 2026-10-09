import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Pause, 
  Play, 
  RefreshCw, 
  Download, 
  Search, 
  Filter, 
  ArrowUpDown, 
  MoreVertical, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Bot, 
  Cpu, 
  Edit3, 
  PowerOff, 
  Activity, 
  History,
  TrendingUp,
  MapPin,
  ChevronRight,
  Sparkles,
  Sliders
} from 'lucide-react';

export default function UserLiveMonitoringView({ isAdmin = false, currentUser }) {
  // Live State
  const [isPaused, setIsPaused] = useState(false);
  const [lastUpdatedSec, setLastUpdatedSec] = useState(2);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [flashUpdate, setFlashUpdate] = useState(false);

  // Active Tab: 'aisles' | 'agvs' | 'conveyors' | 'stations'
  const [activeTab, setActiveTab] = useState('aisles');

  // Summary Chip Filter: 'all' | 'normal' | 'moderate' | 'high' | 'offline'
  const [statusChipFilter, setStatusChipFilter] = useState('all');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  // Side Drawer state
  const [drawerItem, setDrawerItem] = useState(null);

  // Row Action Modals
  const [editItem, setEditItem] = useState(null);
  const [confirmOfflineItem, setConfirmOfflineItem] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Live Timer Effect
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setLastUpdatedSec((prev) => (prev >= 60 ? 1 : prev + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Periodic simulated live update
  useEffect(() => {
    if (isPaused) return;
    const updateInterval = setInterval(() => {
      setFlashUpdate(true);
      setLastUpdatedSec(0);
      setTimeout(() => setFlashUpdate(false), 900);
    }, 12000);
    return () => clearInterval(updateInterval);
  }, [isPaused]);

  // Manual Refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setFlashUpdate(true);
    setLastUpdatedSec(0);
    setTimeout(() => {
      setIsRefreshing(false);
      setFlashUpdate(false);
    }, 600);
  };

  // Mock Datasets
  // 1. Aisles Dataset
  const [aisles, setAisles] = useState([
    { id: 'A-01', name: 'Aisle A-01', zone: 'Zone 1 (Inbound)', status: 'Normal', occupancy: 34, queue: 2, lastUpdated: '3s ago', capacity: 100 },
    { id: 'A-02', name: 'Aisle A-02', zone: 'Zone 1 (Inbound)', status: 'Normal', occupancy: 42, queue: 3, lastUpdated: '2s ago', capacity: 100 },
    { id: 'A-03', name: 'Aisle A-03', zone: 'Zone 2 (Storage)', status: 'Moderate', occupancy: 68, queue: 7, lastUpdated: '5s ago', capacity: 120 },
    { id: 'A-04', name: 'Aisle A-04', zone: 'Zone 2 (Storage)', status: 'Normal', occupancy: 29, queue: 1, lastUpdated: '4s ago', capacity: 120 },
    { id: 'B-01', name: 'Aisle B-01', zone: 'Zone 2 (Storage)', status: 'Moderate', occupancy: 62, queue: 6, lastUpdated: '2s ago', capacity: 150 },
    { id: 'B-02', name: 'Aisle B-02', zone: 'Zone 2 (Storage)', status: 'Normal', occupancy: 45, queue: 4, lastUpdated: '7s ago', capacity: 150 },
    { id: 'B-03', name: 'Aisle B-03', zone: 'Zone 2 (Storage)', status: 'Moderate', occupancy: 71, queue: 8, lastUpdated: '1s ago', capacity: 150 },
    { id: 'B-04', name: 'Aisle B-04', zone: 'Zone 2 (Storage)', status: 'High', occupancy: 88, queue: 14, lastUpdated: '2s ago', capacity: 150 },
    { id: 'C-01', name: 'Aisle C-01', zone: 'Zone 3 (Sortation)', status: 'Normal', occupancy: 38, queue: 2, lastUpdated: '8s ago', capacity: 120 },
    { id: 'C-02', name: 'Aisle C-02', zone: 'Zone 3 (Sortation)', status: 'High', occupancy: 84, queue: 12, lastUpdated: '3s ago', capacity: 120 },
    { id: 'C-03', name: 'Aisle C-03', zone: 'Zone 3 (Sortation)', status: 'High', occupancy: 91, queue: 16, lastUpdated: '2s ago', capacity: 120 },
    { id: 'D-01', name: 'Aisle D-01', zone: 'Zone 4 (Dispatch)', status: 'Normal', occupancy: 31, queue: 1, lastUpdated: '6s ago', capacity: 100 },
    { id: 'D-02', name: 'Aisle D-02', zone: 'Zone 4 (Dispatch)', status: 'Normal', occupancy: 49, queue: 4, lastUpdated: '4s ago', capacity: 100 },
    { id: 'D-03', name: 'Aisle D-03', zone: 'Zone 4 (Dispatch)', status: 'Normal', occupancy: 24, queue: 0, lastUpdated: '9s ago', capacity: 100 },
    { id: 'D-04', name: 'Aisle D-04', zone: 'Zone 4 (Dispatch)', status: 'Normal', occupancy: 39, queue: 3, lastUpdated: '3s ago', capacity: 100 },
    { id: 'E-01', name: 'Aisle E-01 (Buffer)', zone: 'Zone 1 (Inbound)', status: 'Moderate', occupancy: 65, queue: 6, lastUpdated: '2s ago', capacity: 80 },
    { id: 'E-02', name: 'Aisle E-02 (Buffer)', zone: 'Zone 1 (Inbound)', status: 'Normal', occupancy: 18, queue: 0, lastUpdated: '11s ago', capacity: 80 },
    { id: 'E-03', name: 'Aisle E-03 (Buffer)', zone: 'Zone 1 (Inbound)', status: 'Normal', occupancy: 22, queue: 1, lastUpdated: '14s ago', capacity: 80 },
    { id: 'E-04', name: 'Aisle E-04 (Buffer)', zone: 'Zone 1 (Inbound)', status: 'Normal', occupancy: 19, queue: 0, lastUpdated: '12s ago', capacity: 80 },
    { id: 'X-01', name: 'Aisle X-01 (Maint)', zone: 'Zone 2 (Storage)', status: 'Offline', occupancy: 0, queue: 0, lastUpdated: '18m ago', capacity: 100 },
  ]);

  // 2. AGVs Dataset
  const [agvs, setAgvs] = useState([
    { id: 'AGV-01', status: 'Moving', battery: 94, speed: '1.6 m/s', task: 'Pallet Delivery to Dock 1', location: 'Aisle A-01', zone: 'Zone 1 (Inbound)' },
    { id: 'AGV-02', status: 'Moving', battery: 78, speed: '1.4 m/s', task: 'Pick Batch Dispatch', location: 'Aisle B-01', zone: 'Zone 2 (Storage)' },
    { id: 'AGV-03', status: 'Moving', battery: 62, speed: '1.8 m/s', task: 'Avoid Chokepoint J-04 (Bypass)', location: 'Corridor C', zone: 'Zone 3 (Sortation)' },
    { id: 'AGV-04', status: 'Error', battery: 11, speed: '0.0 m/s', task: 'Low Battery Stop / Emergency', location: 'Aisle B-04', zone: 'Zone 2 (Storage)' },
    { id: 'AGV-05', status: 'Charging', battery: 100, speed: '0.0 m/s', task: 'Standby Fleet Reserve', location: 'Charging Bay #1', zone: 'Zone 1 (Inbound)' },
    { id: 'AGV-06', status: 'Moving', battery: 85, speed: '1.5 m/s', task: 'Pallet Ingestion Dock 2', location: 'Aisle E-01', zone: 'Zone 1 (Inbound)' },
    { id: 'AGV-07', status: 'Idle', battery: 91, speed: '0.0 m/s', task: 'Awaiting Wave Release', location: 'Buffer Bay 2', zone: 'Zone 2 (Storage)' },
    { id: 'AGV-08', status: 'Moving', battery: 67, speed: '1.4 m/s', task: 'Sorting Transfer', location: 'Conveyor C2', zone: 'Zone 3 (Sortation)' },
  ]);

  // 3. Conveyors Dataset
  const [conveyors, setConveyors] = useState([
    { id: 'CV-01', status: 'Normal', load: 42, speed: '1.2 m/s', throughput: '1,240 units/hr', zone: 'Zone 1 (Inbound)' },
    { id: 'CV-02', status: 'Moderate', load: 74, speed: '1.1 m/s', throughput: '1,890 units/hr', zone: 'Zone 2 (Storage)' },
    { id: 'CV-03', status: 'High', load: 89, speed: '0.8 m/s', throughput: '2,450 units/hr', zone: 'Zone 3 (Sortation)' },
    { id: 'CV-04', status: 'Normal', load: 35, speed: '1.4 m/s', throughput: '980 units/hr', zone: 'Zone 4 (Dispatch)' },
    { id: 'CV-05', status: 'Offline', load: 0, speed: '0.0 m/s', throughput: '0 units/hr', zone: 'Zone 2 (Storage)' },
  ]);

  // 4. Stations Dataset
  const [stations, setStations] = useState([
    { id: 'ST-01', name: 'Inbound Receiving 1', status: 'Normal', queue: 4, avgTime: '42s / pallet', operator: 'Ramesh Kumar', zone: 'Zone 1 (Inbound)' },
    { id: 'ST-02', name: 'Pick Station Alpha', status: 'High', queue: 14, avgTime: '78s / pallet', operator: 'Priya Sharma', zone: 'Zone 2 (Storage)' },
    { id: 'ST-03', name: 'Sortation Chokepoint J-04', status: 'High', queue: 18, avgTime: '95s / pallet', operator: 'Autonomous System', zone: 'Zone 3 (Sortation)' },
    { id: 'ST-04', name: 'Packing Bay 1', status: 'Moderate', queue: 8, avgTime: '55s / pallet', operator: 'Karthik Raja', zone: 'Zone 4 (Dispatch)' },
    { id: 'ST-05', name: 'Outbound Dispatch 2', status: 'Normal', queue: 2, avgTime: '30s / pallet', operator: 'Suresh V', zone: 'Zone 4 (Dispatch)' },
  ]);

  // Summary Counts (Based on Aisles)
  const summaryCounts = {
    normal: aisles.filter((a) => a.status === 'Normal').length,
    moderate: aisles.filter((a) => a.status === 'Moderate').length,
    high: aisles.filter((a) => a.status === 'High').length,
    offline: aisles.filter((a) => a.status === 'Offline').length,
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    let headers = '';
    let rows = [];

    if (activeTab === 'aisles') {
      headers = 'ID,Name,Zone,Status,Occupancy_Percent,Queue,Last_Updated\n';
      rows = aisles.map((a) => `${a.id},${a.name},"${a.zone}",${a.status},${a.occupancy}%,${a.queue},${a.lastUpdated}`).join('\n');
    } else if (activeTab === 'agvs') {
      headers = 'ID,Status,Battery_Percent,Speed,Task,Location,Zone\n';
      rows = agvs.map((a) => `${a.id},${a.status},${a.battery}%,${a.speed},"${a.task}","${a.location}","${a.zone}"`).join('\n');
    } else if (activeTab === 'conveyors') {
      headers = 'ID,Status,Load_Percent,Speed,Throughput,Zone\n';
      rows = conveyors.map((c) => `${c.id},${c.status},${c.load}%,${c.speed},"${c.throughput}","${c.zone}"`).join('\n');
    } else {
      headers = 'ID,Name,Status,Queue,Avg_Time,Operator,Zone\n';
      rows = stations.map((s) => `${s.id},"${s.name}",${s.status},${s.queue},"${s.avgTime}","${s.operator}","${s.zone}"`).join('\n');
    }

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `TwinFlow_${activeTab}_live_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Confirm Mark Offline
  const handleConfirmOffline = () => {
    if (!confirmOfflineItem) return;
    if (activeTab === 'aisles') {
      setAisles((prev) =>
        prev.map((a) =>
          a.id === confirmOfflineItem.id
            ? { ...a, status: a.status === 'Offline' ? 'Normal' : 'Offline' }
            : a
        )
      );
    }
    setConfirmOfflineItem(null);
  };

  // Save Edit Item
  const handleSaveEdit = (updated) => {
    if (activeTab === 'aisles') {
      setAisles((prev) =>
        prev.map((a) => (a.id === updated.id ? { ...a, ...updated } : a))
      );
    }
    setEditItem(null);
  };

  // Filtered dataset
  const getFilteredData = () => {
    let dataset = [];
    if (activeTab === 'aisles') dataset = aisles;
    else if (activeTab === 'agvs') dataset = agvs;
    else if (activeTab === 'conveyors') dataset = conveyors;
    else dataset = stations;

    return dataset.filter((item) => {
      // Status chip filter
      if (statusChipFilter !== 'all') {
        const itemStatus = (item.status || '').toLowerCase();
        if (statusChipFilter === 'normal' && itemStatus !== 'normal' && itemStatus !== 'moving') return false;
        if (statusChipFilter === 'moderate' && itemStatus !== 'moderate' && itemStatus !== 'idle') return false;
        if (statusChipFilter === 'high' && itemStatus !== 'high' && itemStatus !== 'error') return false;
        if (statusChipFilter === 'offline' && itemStatus !== 'offline' && itemStatus !== 'charging') return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const str = JSON.stringify(item).toLowerCase();
        if (!str.includes(q)) return false;
      }

      // Zone Filter
      if (zoneFilter !== 'all') {
        if (!item.zone || !item.zone.includes(zoneFilter)) return false;
      }

      return true;
    });
  };

  const currentList = getFilteredData();

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      
      {/* ================= PAUSED STATE AMBER BANNER ================= */}
      {isPaused && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-xs font-bold">
              Updates paused. Real-time telemetry ingestion is temporarily frozen.
            </span>
          </div>
          <button
            onClick={() => setIsPaused(false)}
            className="text-xs font-bold text-amber-800 hover:text-amber-950 underline cursor-pointer"
          >
            Resume Live Sync
          </button>
        </div>
      )}

      {/* ================= HEADER ================= */}
      <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Live Monitoring
            </h1>
            {/* Live Indicator */}
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
              <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-amber-500' : 'bg-mint-500 animate-pulse'}`} />
              <span className="font-mono text-[11px]">{isPaused ? 'Paused' : 'Live Sync'}</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time physical asset telemetry, corridor occupancy, AMR flows & station queues
          </p>
        </div>

        {/* Action Buttons: Pause Updates, Refresh, Export CSV */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Pause / Resume Button */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 shadow-2xs ${
              isPaused
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-amber-600" /> : <Pause className="w-3.5 h-3.5 text-slate-500" />}
            <span>{isPaused ? 'Resume Updates' : 'Pause Updates'}</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all flex items-center space-x-1.5 shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {/* Export CSV Button (Admin Only) */}
          {isAdmin ? (
            <button
              onClick={handleExportCSV}
              className="mint-gradient-btn px-5 py-2 rounded-xl text-xs font-bold text-slate-950 shadow-sm shadow-mint-500/20 flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5 text-slate-950" />
              <span>Export CSV</span>
            </button>
          ) : (
            <div className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
              Read-Only Telemetry
            </div>
          )}
        </div>
      </div>

      {/* ================= SUMMARY CHIPS ROW ================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl bg-white border border-slate-100 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 mr-2">Filter by Status:</span>
          
          {/* All Chip */}
          <button
            onClick={() => setStatusChipFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
              statusChipFilter === 'all'
                ? 'bg-slate-950 text-white border-slate-950 shadow-2xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            All {aisles.length}
          </button>

          {/* Normal 12 */}
          <button
            onClick={() => setStatusChipFilter('normal')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center space-x-1.5 ${
              statusChipFilter === 'normal'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Normal {summaryCounts.normal}</span>
          </button>

          {/* Moderate 4 */}
          <button
            onClick={() => setStatusChipFilter('moderate')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center space-x-1.5 ${
              statusChipFilter === 'moderate'
                ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Moderate {summaryCounts.moderate}</span>
          </button>

          {/* High 3 */}
          <button
            onClick={() => setStatusChipFilter('high')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center space-x-1.5 ${
              statusChipFilter === 'high'
                ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>High {summaryCounts.high}</span>
          </button>

          {/* Offline 1 */}
          <button
            onClick={() => setStatusChipFilter('offline')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center space-x-1.5 ${
              statusChipFilter === 'offline'
                ? 'bg-slate-700 text-white border-slate-700 shadow-2xs'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span>Offline {summaryCounts.offline}</span>
          </button>
        </div>

        {/* Live Timestamp ticker */}
        <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Last updated {lastUpdatedSec}s ago</span>
        </div>
      </div>

      {/* ================= TABS + TOOLBAR ================= */}
      <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden">
        
        {/* Tabs Bar: Aisles | AGVs | Conveyors | Stations */}
        <div className="px-6 pt-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex space-x-1">
            {[
              { id: 'aisles', label: 'Aisles', count: aisles.length },
              { id: 'agvs', label: 'AGVs', count: agvs.length },
              { id: 'conveyors', label: 'Conveyors', count: conveyors.length },
              { id: 'stations', label: 'Stations', count: stations.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setStatusChipFilter('all');
                }}
                className={`pb-3.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center space-x-1.5 ${
                  activeTab === tab.id
                    ? 'border-mint-500 text-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeTab === tab.id ? 'bg-mint-50 text-mint-800' : 'bg-slate-100 text-slate-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Click row for side-drawer telemetry
          </span>
        </div>

        {/* Toolbar: Search, Status Filter, Zone Filter, Sort */}
        <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab}...`}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-mint-500 text-xs"
            />
          </div>

          {/* Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Zone Filter */}
            <div className="flex items-center space-x-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl">
              <span className="text-slate-400">Zone:</span>
              <select
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value)}
                className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer"
              >
                <option value="all">All Zones</option>
                <option value="Zone 1">Zone 1 (Inbound)</option>
                <option value="Zone 2">Zone 2 (Storage)</option>
                <option value="Zone 3">Zone 3 (Sortation)</option>
                <option value="Zone 4">Zone 4 (Dispatch)</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer"
              >
                <option value="default">Sort: Default</option>
                <option value="status">Status Priority</option>
                <option value="activity">Highest Load / Queue</option>
              </select>
            </div>
          </div>
        </div>

        {/* ================= DATA TABLES ================= */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            
            {/* Table Head based on Tab */}
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                {activeTab === 'aisles' && (
                  <>
                    <th className="py-3 px-6">Name</th>
                    <th className="py-3 px-4">Zone</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Occupancy %</th>
                    <th className="py-3 px-4">Queue</th>
                    <th className="py-3 px-4">Last Updated</th>
                    {isAdmin && <th className="py-3 px-4 text-right">Actions</th>}
                  </>
                )}
                {activeTab === 'agvs' && (
                  <>
                    <th className="py-3 px-6">AGV ID</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Battery %</th>
                    <th className="py-3 px-4">Speed</th>
                    <th className="py-3 px-4">Current Task</th>
                    <th className="py-3 px-4">Location</th>
                    {isAdmin && <th className="py-3 px-4 text-right">Actions</th>}
                  </>
                )}
                {activeTab === 'conveyors' && (
                  <>
                    <th className="py-3 px-6">Conveyor ID</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Load %</th>
                    <th className="py-3 px-4">Speed</th>
                    <th className="py-3 px-4">Throughput</th>
                    <th className="py-3 px-4">Zone</th>
                    {isAdmin && <th className="py-3 px-4 text-right">Actions</th>}
                  </>
                )}
                {activeTab === 'stations' && (
                  <>
                    <th className="py-3 px-6">Station Name</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Queue</th>
                    <th className="py-3 px-4">Avg Processing Time</th>
                    <th className="py-3 px-4">Operator</th>
                    <th className="py-3 px-4">Zone</th>
                    {isAdmin && <th className="py-3 px-4 text-right">Actions</th>}
                  </>
                )}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100">
              {currentList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No matching assets found for current filter.
                  </td>
                </tr>
              ) : (
                currentList.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => setDrawerItem(row)}
                    className={`hover:bg-slate-50/80 transition-colors cursor-pointer group ${
                      flashUpdate ? 'bg-mint-50/30' : ''
                    }`}
                  >
                    {/* TAB: AISLES */}
                    {activeTab === 'aisles' && (
                      <>
                        <td className="py-3.5 px-6 font-bold text-slate-900 group-hover:text-mint-700 flex items-center space-x-2">
                          <Layers className="w-3.5 h-3.5 text-slate-400" />
                          <span>{row.name}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{row.zone}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                            row.status === 'High'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : row.status === 'Moderate'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : row.status === 'Offline'
                              ? 'bg-slate-100 text-slate-600 border-slate-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold w-9">{row.occupancy}%</span>
                            <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  row.occupancy > 75 ? 'bg-rose-500' : row.occupancy > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}
                                style={{ width: `${row.occupancy}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{row.queue} pallets</td>
                        <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">{row.lastUpdated}</td>
                      </>
                    )}

                    {/* TAB: AGVS */}
                    {activeTab === 'agvs' && (
                      <>
                        <td className="py-3.5 px-6 font-bold text-slate-900 flex items-center space-x-2">
                          <Bot className="w-3.5 h-3.5 text-mint-700" />
                          <span>{row.id}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                            row.status === 'Error'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : row.status === 'Idle'
                              ? 'bg-slate-100 text-slate-700 border-slate-200'
                              : row.status === 'Charging'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold">
                          <span className={row.battery < 20 ? 'text-rose-600' : 'text-slate-800'}>
                            {row.battery}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-600">{row.speed}</td>
                        <td className="py-3.5 px-4 text-slate-700 max-w-xs truncate">{row.task}</td>
                        <td className="py-3.5 px-4 text-slate-500">{row.location}</td>
                      </>
                    )}

                    {/* TAB: CONVEYORS */}
                    {activeTab === 'conveyors' && (
                      <>
                        <td className="py-3.5 px-6 font-bold text-slate-900">{row.id}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                            row.status === 'High' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold">{row.load}%</td>
                        <td className="py-3.5 px-4 font-mono text-slate-600">{row.speed}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-800">{row.throughput}</td>
                        <td className="py-3.5 px-4 text-slate-500">{row.zone}</td>
                      </>
                    )}

                    {/* TAB: STATIONS */}
                    {activeTab === 'stations' && (
                      <>
                        <td className="py-3.5 px-6 font-bold text-slate-900">{row.name}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                            row.status === 'High' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold">{row.queue} queued</td>
                        <td className="py-3.5 px-4 font-mono text-slate-600">{row.avgTime}</td>
                        <td className="py-3.5 px-4 text-slate-800 font-medium">{row.operator}</td>
                        <td className="py-3.5 px-4 text-slate-500">{row.zone}</td>
                      </>
                    )}

                    {/* 3-DOT MENU ACTION (Admin Exclusive) */}
                    {isAdmin && (
                      <td className="py-3.5 px-4 text-right relative" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === row.id ? null : row.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {activeMenuId === row.id && (
                          <div className="absolute right-6 top-10 w-44 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 p-1.5 space-y-1 text-left animate-fadeIn">
                            <button
                              onClick={() => {
                                setEditItem(row);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                              <span>Edit item</span>
                            </button>

                            <button
                              onClick={() => {
                                setConfirmOfflineItem(row);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-50 flex items-center space-x-2"
                            >
                              <PowerOff className="w-3.5 h-3.5 text-rose-500" />
                              <span>{row.status === 'Offline' ? 'Mark Online' : 'Mark Offline'}</span>
                            </button>

                            <button
                              onClick={() => {
                                setDrawerItem(row);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                            >
                              <History className="w-3.5 h-3.5 text-slate-500" />
                              <span>View history</span>
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* ================= SIDE DRAWER (On Row Click) ================= */}
      {drawerItem && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-fadeIn">
          <div className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-y-auto">
            
            {/* Drawer Header */}
            <div>
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    Asset Details & History
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <span>{drawerItem.name || drawerItem.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                      drawerItem.status === 'High' || drawerItem.status === 'Error'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {drawerItem.status}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">{drawerItem.zone || 'Zone 2'}</p>
                </div>

                <button
                  onClick={() => setDrawerItem(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-6 space-y-6">
                
                {/* Section 1: Live Mini Chart (Last 30 Min Trend) */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span className="flex items-center space-x-1.5">
                      <TrendingUp className="w-4 h-4 text-mint-600" />
                      <span>Live Mini Chart (Last 30m)</span>
                    </span>
                    <span className="font-mono text-mint-700">92% Flow</span>
                  </div>

                  {/* SVG Mini Spline Curve */}
                  <div className="w-full h-24 my-1">
                    <svg viewBox="0 0 300 80" className="w-full h-full" fill="none">
                      <path
                        d="M 10 60 C 50 55, 90 20, 140 25 C 190 30, 230 15, 290 40"
                        stroke="#10b981"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 10 60 C 50 55, 90 20, 140 25 C 190 30, 230 15, 290 40 L 290 80 L 10 80 Z"
                        fill="#00f5a0"
                        fillOpacity="0.1"
                      />
                      <circle cx="290" cy="40" r="4" fill="#0f172a" stroke="#ffffff" strokeWidth="2" />
                    </svg>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>-30m</span>
                    <span>-15m</span>
                    <span>Now</span>
                  </div>
                </div>

                {/* Section 2: Current Values Telemetry Grid */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Current Telemetry Values
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-400 text-[10px] block">Occupancy / Load</span>
                      <strong className="text-slate-900 text-sm font-mono">
                        {drawerItem.occupancy || drawerItem.load || drawerItem.battery || 82}%
                      </strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-400 text-[10px] block">Queue Length</span>
                      <strong className="text-slate-900 text-sm font-mono">
                        {drawerItem.queue !== undefined ? `${drawerItem.queue} units` : 'Nominal'}
                      </strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-400 text-[10px] block">Speed</span>
                      <strong className="text-slate-900 text-sm font-mono">
                        {drawerItem.speed || '1.4 m/s'}
                      </strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-400 text-[10px] block">Status State</span>
                      <strong className="text-slate-900 text-sm">
                        {drawerItem.status || 'Active'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Section 3: Related Alerts */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Related Incident Alerts
                  </h4>
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
                    <div className="flex items-center space-x-1.5 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Corridor Congestion Convergence</span>
                    </div>
                    <p className="text-[11px] text-amber-800">
                      DSTGT model predicted +8m delay if inflow rate sustains above threshold.
                    </p>
                  </div>
                </div>

                {/* Section 4: Recent Events */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Recent Events & Logs
                  </h4>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
                      <span className="text-slate-700">Telemetry packet received</span>
                      <span className="text-slate-400">2s ago</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
                      <span className="text-slate-700">AMR dispatch pass-through</span>
                      <span className="text-slate-400">45s ago</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
                      <span className="text-slate-700">Calibration check passed</span>
                      <span className="text-slate-400">4m ago</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex space-x-2">
              <button
                onClick={() => setDrawerItem(null)}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                Close Drawer
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= MODAL 1: EDIT ITEM (Drawer / Modal) ================= */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-mint-600" />
                <span>Edit {editItem.name || editItem.id}</span>
              </h3>
              <button onClick={() => setEditItem(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveEdit(editItem);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Asset Name</label>
                <input
                  type="text"
                  value={editItem.name || editItem.id}
                  onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Zone</label>
                <select
                  value={editItem.zone}
                  onChange={(e) => setEditItem({ ...editItem, zone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                >
                  <option value="Zone 1 (Inbound)">Zone 1 (Inbound)</option>
                  <option value="Zone 2 (Storage)">Zone 2 (Storage)</option>
                  <option value="Zone 3 (Sortation)">Zone 3 (Sortation)</option>
                  <option value="Zone 4 (Dispatch)">Zone 4 (Dispatch)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Capacity Limit (Pallets)</label>
                <input
                  type="number"
                  value={editItem.capacity || 100}
                  onChange={(e) => setEditItem({ ...editItem, capacity: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditItem(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl mint-gradient-btn text-slate-950 font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: CONFIRM OFFLINE POPUP ================= */}
      {confirmOfflineItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <PowerOff className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Mark {confirmOfflineItem.name || confirmOfflineItem.id} as offline?
              </h3>
              <p className="text-xs text-slate-500">
                It will be excluded from real-time graph routing and DSTGT neural predictions until re-enabled.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center space-x-3">
              <button
                onClick={() => setConfirmOfflineItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmOffline}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
              >
                Confirm Offline
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
