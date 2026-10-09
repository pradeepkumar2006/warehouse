import React, { useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Search, 
  Sliders, 
  Sparkles, 
  Trash2, 
  Check, 
  X, 
  Filter, 
  User, 
  ArrowRight, 
  ShieldAlert, 
  ExternalLink, 
  CheckSquare, 
  Square, 
  ChevronRight,
  Settings,
  Flame,
  Info
} from 'lucide-react';

export default function AdminAlertsView({ 
  onNavigateToSimulation,
  isAdmin = true,
  currentUser 
}) {
  // Severity Filter: 'All' | 'Critical' | 'High' | 'Medium' | 'Low'
  const [severityFilter, setSeverityFilter] = useState('All');

  // Status Filter: 'New' | 'Acknowledged' | 'Resolved'
  const [statusFilter, setStatusFilter] = useState('New');

  // Search & Date Range
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('Today');

  // Alert Rules Modal
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [alertRules, setAlertRules] = useState([
    { id: 1, type: 'Congestion Probability', threshold: '> 75%', severity: 'Critical', notify: ['Admin', 'Floor Lead'], enabled: true },
    { id: 2, type: 'Queue Length', threshold: '> 18 units', severity: 'High', notify: ['Floor Lead', 'Dispatcher'], enabled: true },
    { id: 3, type: 'Expected Delay', threshold: '> 5.0 min', severity: 'High', notify: ['Dispatcher'], enabled: true },
    { id: 4, type: 'AGV Low Battery', threshold: '< 15%', severity: 'Critical', notify: ['Maintenance'], enabled: true },
    { id: 5, type: 'Optical Sensor Drift', threshold: '> 200ms', severity: 'Medium', notify: ['Maintenance'], enabled: false },
  ]);

  // Delete Confirm Modal
  const [deleteCandidate, setDeleteCandidate] = useState(null); // alert id or 'bulk'

  // Selected Alerts (for Bulk Actions)
  const [selectedAlertIds, setSelectedAlertIds] = useState([]);

  // Active Alert in Right Detail Panel
  const [activeAlertId, setActiveAlertId] = useState(1);

  // Alerts Dataset
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      title: 'Aisle B congestion expected',
      location: 'Aisle B (Racks B1–B4)',
      eta: 'in 12 min',
      confidence: 87,
      severity: 'Critical',
      status: 'New',
      createdTime: '10:14 AM (Today)',
      assignedTo: 'Sam Haddad',
      assignedRole: 'Floor Lead',
      assignedAvatar: 'SH',
      features: [
        { name: 'Aisle B Occupancy', val: '0.32' },
        { name: 'AGV Traffic Convergence', val: '0.28' },
        { name: 'Buffer Overflow', val: '0.16' },
      ],
      prediction: {
        probability: '87%',
        delay: '+6.4 min',
        zones: 'Storage Zone B, Sortation J-04',
      },
      recommendedActions: [
        { id: 'a1', text: 'Reroute incoming AGVs via Bypass Corridor C', checked: false },
        { id: 'a2', text: 'Throttling Inbound induction conveyor by 20%', checked: false },
        { id: 'a3', text: 'Dispatch secondary AMR tugger to clear Sortation J-04 buffer', checked: false },
        { id: 'a4', text: 'Alert floor lead operator on radio channel 2', checked: true },
      ],
      timeline: {
        created: '10:14 AM by DSTGT Neural Engine',
        acknowledgedBy: null,
        resolvedBy: null,
      }
    },
    {
      id: 2,
      title: 'Junction J-04 AGV Stacking Alert',
      location: 'Sortation Buffer J-04',
      eta: 'in 8 min',
      confidence: 91,
      severity: 'Critical',
      status: 'New',
      createdTime: '10:18 AM (Today)',
      assignedTo: 'Marcus Vance',
      assignedRole: 'Lead Dispatcher',
      assignedAvatar: 'MV',
      features: [
        { name: 'Queue Accumulation', val: '0.36' },
        { name: 'Induction Speed', val: '0.24' },
        { name: 'Dock 1 Staging', val: '0.18' },
      ],
      prediction: {
        probability: '91%',
        delay: '+8.2 min',
        zones: 'Sortation Hub, Loading Dock 1',
      },
      recommendedActions: [
        { id: 'a21', text: 'Activate dynamic split to secondary sortation belt', checked: false },
        { id: 'a22', text: 'Hold inbound trucks at holding bay for 6 minutes', checked: false },
      ],
      timeline: {
        created: '10:18 AM by DSTGT Neural Engine',
        acknowledgedBy: null,
        resolvedBy: null,
      }
    },
    {
      id: 3,
      title: 'Pallet Queue Exceeding Buffer Cap',
      location: 'Receiving Dock 2',
      eta: 'in 24 min',
      confidence: 76,
      severity: 'High',
      status: 'Acknowledged',
      createdTime: '09:55 AM (Today)',
      assignedTo: 'Sarah Lin',
      assignedRole: 'System Admin',
      assignedAvatar: 'SL',
      features: [
        { name: 'Dock 2 Pallet Arrival', val: '0.30' },
        { name: 'AGV Pick Latency', val: '0.22' },
        { name: 'Staging Capacity', val: '0.18' },
      ],
      prediction: {
        probability: '76%',
        delay: '+4.1 min',
        zones: 'Receiving Dock 2',
      },
      recommendedActions: [
        { id: 'a31', text: 'Reassign AGV-05 from charging to buffer clearance', checked: true },
        { id: 'a32', text: 'Adjust barcode scanner belt feed rate', checked: false },
      ],
      timeline: {
        created: '09:55 AM by DSTGT Neural Engine',
        acknowledgedBy: 'Sarah Lin at 10:02 AM',
        resolvedBy: null,
      }
    },
    {
      id: 4,
      title: 'Conveyor C1 Optical Telemetry Jitter',
      location: 'Conveyor Trunk Line 1',
      eta: 'in 45 min',
      confidence: 68,
      severity: 'Medium',
      status: 'Acknowledged',
      createdTime: '09:30 AM (Today)',
      assignedTo: 'Ramesh Kumar',
      assignedRole: 'Technician',
      assignedAvatar: 'RK',
      features: [
        { name: 'Packet Drop Rate', val: '0.40' },
        { name: 'Sensor Drift', val: '0.25' },
      ],
      prediction: {
        probability: '68%',
        delay: '+1.5 min',
        zones: 'Transit Spine C1',
      },
      recommendedActions: [
        { id: 'a41', text: 'Clean infrared sensor optics at Node C1-B', checked: true },
      ],
      timeline: {
        created: '09:30 AM by Sensor Guard',
        acknowledgedBy: 'Ramesh Kumar at 09:35 AM',
        resolvedBy: null,
      }
    },
    {
      id: 5,
      title: 'Dock 3 Unload Standoff Complete',
      location: 'Loading Bay 3',
      eta: 'Resolved',
      confidence: 94,
      severity: 'Low',
      status: 'Resolved',
      createdTime: '08:45 AM (Today)',
      assignedTo: 'Sam Haddad',
      assignedRole: 'Floor Lead',
      assignedAvatar: 'SH',
      features: [
        { name: 'Trailer Emptied', val: '0.50' },
      ],
      prediction: {
        probability: '12%',
        delay: '0.0 min',
        zones: 'Dock 3',
      },
      recommendedActions: [
        { id: 'a51', text: 'Release trailer seal for departure', checked: true },
      ],
      timeline: {
        created: '08:45 AM by Dock Manager',
        acknowledgedBy: 'Sam Haddad at 08:50 AM',
        resolvedBy: 'Sam Haddad at 09:15 AM',
      }
    }
  ]);

  // Filter Alerts
  const filteredAlerts = alerts.filter((a) => {
    // Status filter
    if (a.status !== statusFilter) return false;
    // Severity filter
    if (severityFilter !== 'All' && a.severity !== severityFilter) return false;
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = a.title.toLowerCase().includes(q) || a.location.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const activeAlert = alerts.find((a) => a.id === activeAlertId) || filteredAlerts[0] || alerts[0];

  // Handlers for active alert
  const handleAcknowledge = (id) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'Acknowledged',
              timeline: { ...a.timeline, acknowledgedBy: 'You (Admin) at Just Now' },
            }
          : a
      )
    );
  };

  const handleResolve = (id) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'Resolved',
              timeline: {
                ...a.timeline,
                acknowledgedBy: a.timeline.acknowledgedBy || 'You (Admin) at Just Now',
                resolvedBy: 'You (Admin) at Just Now',
              },
            }
          : a
      )
    );
  };

  const handleAssignUser = (id, user, role, avatar) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, assignedTo: user, assignedRole: role, assignedAvatar: avatar } : a
      )
    );
  };

  const handleToggleActionCheck = (alertId, actionId) => {
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id !== alertId) return a;
        return {
          ...a,
          recommendedActions: a.recommendedActions.map((act) =>
            act.id === actionId ? { ...act, checked: !act.checked } : act
          ),
        };
      })
    );
  };

  // Bulk actions handlers
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedAlertIds(filteredAlerts.map((a) => a.id));
    } else {
      setSelectedAlertIds([]);
    }
  };

  const handleToggleSelectOne = (id) => {
    if (selectedAlertIds.includes(id)) {
      setSelectedAlertIds(selectedAlertIds.filter((item) => item !== id));
    } else {
      setSelectedAlertIds([...selectedAlertIds, id]);
    }
  };

  const handleBulkAcknowledge = () => {
    setAlerts((prev) =>
      prev.map((a) =>
        selectedAlertIds.includes(a.id)
          ? { ...a, status: 'Acknowledged', timeline: { ...a.timeline, acknowledgedBy: 'Bulk Admin at Just Now' } }
          : a
      )
    );
    setSelectedAlertIds([]);
  };

  const handleBulkResolve = () => {
    setAlerts((prev) =>
      prev.map((a) =>
        selectedAlertIds.includes(a.id)
          ? {
              ...a,
              status: 'Resolved',
              timeline: {
                ...a.timeline,
                acknowledgedBy: a.timeline.acknowledgedBy || 'Bulk Admin',
                resolvedBy: 'Bulk Admin at Just Now',
              },
            }
          : a
      )
    );
    setSelectedAlertIds([]);
  };

  const confirmDelete = () => {
    if (deleteCandidate === 'bulk') {
      setAlerts((prev) => prev.filter((a) => !selectedAlertIds.includes(a.id)));
      setSelectedAlertIds([]);
    } else if (deleteCandidate) {
      setAlerts((prev) => prev.filter((a) => a.id !== deleteCandidate));
      if (activeAlertId === deleteCandidate) {
        const remaining = alerts.filter((a) => a.id !== deleteCandidate);
        if (remaining.length > 0) setActiveAlertId(remaining[0].id);
      }
    }
    setDeleteCandidate(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 font-sans text-slate-900">
      
      {/* ========================================================================= */}
      {/* TOOLBAR: SEVERITY CHIPS, STATUS TABS, SEARCH, DATE RANGE & RULES LINK     */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        
        {/* Top Row: Title, Search, Date Range & Edit Alert Rules link */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-950 tracking-tight">
                A5. Bottleneck Alerts & Triage Station
              </h2>
              <p className="text-xs text-slate-500">
                AI anomaly notifications, severity classifications & operational action checklists
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search alerts or aisles..."
                className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-950 w-52 sm:w-64"
              />
            </div>

            {/* Date Range Dropdown */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value="Today">Today</option>
              <option value="Last 24h">Last 24h</option>
              <option value="Last 7d">Last 7d</option>
              <option value="All Time">All Time</option>
            </select>

            {/* Edit Alert Rules Link (Admin Only) */}
            {isAdmin && (
              <button
                onClick={() => setIsRulesModalOpen(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-slate-600" />
                <span>Edit Alert Rules</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Row: Status Tabs + Severity Filter Chips */}
        <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100 gap-4">
          
          {/* Status Tabs: New | Acknowledged | Resolved */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
            {['New', 'Acknowledged', 'Resolved'].map((st) => {
              const count = alerts.filter((a) => a.status === st).length;
              return (
                <button
                  key={st}
                  onClick={() => {
                    setStatusFilter(st);
                    setSelectedAlertIds([]);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
                    statusFilter === st
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <span>{st}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    statusFilter === st ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Severity Chips: All | Critical | High | Medium | Low */}
          <div className="flex items-center space-x-1.5 text-xs font-semibold">
            <span className="text-[11px] text-slate-400 mr-1 font-mono">Severity:</span>
            {[
              { id: 'All', color: 'bg-slate-800 text-white' },
              { id: 'Critical', color: 'bg-rose-50 text-rose-700 border-rose-200' },
              { id: 'High', color: 'bg-amber-50 text-amber-700 border-amber-200' },
              { id: 'Medium', color: 'bg-sky-50 text-sky-700 border-sky-200' },
              { id: 'Low', color: 'bg-slate-100 text-slate-700 border-slate-200' },
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => setSeverityFilter(chip.id)}
                className={`px-2.5 py-1 rounded-xl border text-[11px] font-bold transition-all ${
                  severityFilter === chip.id
                    ? 'bg-slate-950 text-white border-slate-950 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {chip.id}
              </button>
            ))}
          </div>

        </div>

      </div>


      {/* ========================================================================= */}
      {/* BULK ACTIONS FLOATING STRIP (WHEN MULTIPLE ALERTS SELECTED)               */}
      {/* ========================================================================= */}
      {selectedAlertIds.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex items-center justify-between px-6 shadow-lg animate-fadeIn text-xs">
          <div className="flex items-center space-x-3">
            <span className="font-bold text-mint-400 font-mono text-sm">
              {selectedAlertIds.length} alert{selectedAlertIds.length > 1 ? 's' : ''} selected
            </span>
            <span className="text-slate-400 hidden sm:inline">• Choose bulk action below</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleBulkAcknowledge}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 font-bold transition-colors"
            >
              Acknowledge Selected
            </button>
            <button
              onClick={handleBulkResolve}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 font-bold transition-colors"
            >
              Resolve Selected
            </button>
            <button
              onClick={() => setDeleteCandidate('bulk')}
              className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 font-bold transition-colors flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
            <button
              onClick={() => setSelectedAlertIds([])}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}


      {/* ========================================================================= */}
      {/* MAIN 2-COLUMN SPLIT: LEFT ALERT LIST | RIGHT DETAIL PANEL                 */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ======================================================================= */}
        {/* LEFT COLUMN: ALERT LIST CARDS                                           */}
        {/* Severity stripe, title, location, ETA, confidence %, avatar, status     */}
        {/* ======================================================================= */}
        <div className="lg:col-span-5 space-y-3">
          
          {/* List Header with Select All Checkbox (Admin Only) */}
          <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-500">
            {isAdmin ? (
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={
                    filteredAlerts.length > 0 &&
                    selectedAlertIds.length === filteredAlerts.length
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-slate-950 focus:ring-slate-950 cursor-pointer"
                />
                <span>Select All in View ({filteredAlerts.length})</span>
              </label>
            ) : (
              <span className="font-bold text-slate-800">Alerts Queue ({filteredAlerts.length})</span>
            )}
            <span className="font-mono text-[10px] text-slate-400">Status: {statusFilter}</span>
          </div>

          {filteredAlerts.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <h4 className="text-sm font-bold text-slate-800">No {statusFilter} Alerts Found</h4>
              <p className="text-xs text-slate-400">
                All corridors and robotic routes are functioning normally in this filter.
              </p>
            </div>
          ) : (
            filteredAlerts.map((item) => {
              const isSelected = selectedAlertIds.includes(item.id);
              const isActive = activeAlert?.id === item.id;

              // Color stripe based on severity
              const stripeColor =
                item.severity === 'Critical'
                  ? 'border-l-rose-500 bg-rose-50/10'
                  : item.severity === 'High'
                  ? 'border-l-amber-500 bg-amber-50/10'
                  : item.severity === 'Medium'
                  ? 'border-l-sky-500 bg-sky-50/10'
                  : 'border-l-slate-400 bg-slate-50/10';

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveAlertId(item.id)}
                  className={`p-4 rounded-2xl bg-white border border-l-4 transition-all cursor-pointer relative shadow-xs hover:shadow-md ${stripeColor} ${
                    isActive ? 'ring-2 ring-slate-900 border-slate-900' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Checkbox (Admin Only) + Title + Location */}
                    <div className="flex items-start space-x-3">
                      {isAdmin && (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleToggleSelectOne(item.id);
                          }}
                          className="w-4 h-4 rounded border-slate-300 text-slate-950 focus:ring-slate-950 mt-1 cursor-pointer"
                        />
                      )}
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-black text-slate-900 tracking-tight leading-snug">
                            {item.title}
                          </h4>
                        </div>
                        <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{item.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                      item.status === 'New'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : item.status === 'Acknowledged'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  {/* Bottom Row: ETA, Confidence %, Assigned Avatar */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center space-x-3 text-[11px] font-semibold text-slate-600">
                      <span className="flex items-center space-x-1 font-mono text-rose-600">
                        <Clock className="w-3 h-3" />
                        <span>ETA {item.eta}</span>
                      </span>
                      <span className="font-mono text-slate-500">
                        {item.confidence}% confidence
                      </span>
                    </div>

                    {/* Assigned Avatar Circle */}
                    <div className="flex items-center space-x-1.5" title={`Assigned to: ${item.assignedTo} (${item.assignedRole})`}>
                      <div className="w-6 h-6 rounded-full bg-slate-950 text-white flex items-center justify-center text-[10px] font-black shadow-2xs">
                        {item.assignedAvatar}
                      </div>
                      <span className="text-[11px] font-medium text-slate-600 hidden sm:inline">
                        {item.assignedTo.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}

        </div>


        {/* ======================================================================= */}
        {/* RIGHT COLUMN: DETAIL PANEL                                              */}
        {/* Title, Severity, Created Time, Top Features, Prediction Details,        */}
        {/* Recommended Checklist, Timeline, Assign To, Action Buttons             */}
        {/* ======================================================================= */}
        <div className="lg:col-span-7">
          {activeAlert ? (
            <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs space-y-6">
              
              {/* Header: Title + Severity + Created Time */}
              <div className="flex flex-wrap items-start justify-between pb-4 border-b border-slate-100 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      activeAlert.severity === 'Critical'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : activeAlert.severity === 'High'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-sky-50 text-sky-700 border-sky-200'
                    }`}>
                      {activeAlert.severity} Severity
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Created {activeAlert.createdTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-950 tracking-tight">
                    {activeAlert.title}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{activeAlert.location}</span>
                  </p>
                </div>

                {/* Status Badge */}
                <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                  activeAlert.status === 'New'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : activeAlert.status === 'Acknowledged'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  Status: {activeAlert.status}
                </span>
              </div>

              {/* Prediction Details Strip (Probability, Delay, Affected Zones) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Congestion Probability</span>
                  <strong className="text-lg font-black font-mono text-rose-600 block mt-0.5">
                    {activeAlert.prediction.probability}
                  </strong>
                  <span className="text-[10px] text-slate-500 font-mono">Confidence: {activeAlert.confidence}%</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Expected Delay</span>
                  <strong className="text-lg font-black font-mono text-amber-600 block mt-0.5">
                    {activeAlert.prediction.delay}
                  </strong>
                  <span className="text-[10px] text-slate-500">Latency penalty</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Affected Zones</span>
                  <strong className="text-xs font-bold text-slate-800 block mt-1 truncate">
                    {activeAlert.prediction.zones}
                  </strong>
                  <span className="text-[10px] text-slate-500">Cross-Dock corridor</span>
                </div>
              </div>

              {/* Reason: Top Contributing Features */}
              <div className="space-y-2">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                  <Flame className="w-4 h-4 text-rose-500" />
                  <span>Reason: Top Contributing Features (DSTGT Explainability)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {activeAlert.features.map((f) => (
                    <div key={f.name} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <span className="text-slate-500 text-[11px] block">{f.name}</span>
                      <strong className="text-slate-900 font-mono font-bold text-sm block mt-0.5">
                        Weight: {f.val}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Actions Checklist */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Recommended Actions (Operational Checklist)</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {activeAlert.recommendedActions.filter((a) => a.checked).length} of {activeAlert.recommendedActions.length} Completed
                  </span>
                </div>

                <div className="space-y-2">
                  {activeAlert.recommendedActions.map((act) => (
                    <label
                      key={act.id}
                      className="flex items-start space-x-2.5 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={act.checked}
                        onChange={() => handleToggleActionCheck(activeAlert.id, act.id)}
                        className="w-4 h-4 rounded border-slate-300 text-slate-950 focus:ring-slate-950 mt-0.5 cursor-pointer"
                      />
                      <span className={`text-xs ${act.checked ? 'line-through text-slate-400 font-medium' : 'text-slate-800 font-semibold'}`}>
                        {act.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Timeline & Assignee Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                {/* Timeline */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">
                    Incident Timeline
                  </span>
                  <div className="space-y-1 text-[11px] text-slate-600">
                    <p>• Created: <strong className="text-slate-800">{activeAlert.timeline.created}</strong></p>
                    <p>• Acknowledged: <strong className="text-slate-800">{activeAlert.timeline.acknowledgedBy || 'Pending'}</strong></p>
                    <p>• Resolved: <strong className="text-slate-800">{activeAlert.timeline.resolvedBy || 'Pending'}</strong></p>
                  </div>
                </div>

                {/* Assignee Section: Editable for Admin, Read-Only for User */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">
                    Assigned Operator
                  </span>
                  {isAdmin ? (
                    <div className="flex items-center space-x-2">
                      <select
                        value={activeAlert.assignedTo}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === 'Sam Haddad') handleAssignUser(activeAlert.id, val, 'Floor Lead', 'SH');
                          else if (val === 'Marcus Vance') handleAssignUser(activeAlert.id, val, 'Lead Dispatcher', 'MV');
                          else if (val === 'Sarah Lin') handleAssignUser(activeAlert.id, val, 'System Admin', 'SL');
                          else if (val === 'Ramesh Kumar') handleAssignUser(activeAlert.id, val, 'Technician', 'RK');
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 outline-none cursor-pointer"
                      >
                        <option value="Sam Haddad">Sam Haddad (Floor Lead)</option>
                        <option value="Marcus Vance">Marcus Vance (Lead Dispatcher)</option>
                        <option value="Sarah Lin">Sarah Lin (System Admin)</option>
                        <option value="Ramesh Kumar">Ramesh Kumar (Technician)</option>
                      </select>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2.5 py-1.5 px-3 rounded-xl bg-white border border-slate-200">
                      <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                        {activeAlert.assignedAvatar}
                      </div>
                      <div>
                        <strong className="text-xs text-slate-900 font-bold block leading-tight">{activeAlert.assignedTo}</strong>
                        <span className="text-[10px] text-slate-500 font-mono">{activeAlert.assignedRole}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons: Acknowledge, Mark Resolved, Simulate Fix, Delete Alert (Admin Only) */}
              <div className="flex flex-wrap items-center justify-between pt-4 border-t border-slate-100 gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  {activeAlert.status !== 'Acknowledged' && activeAlert.status !== 'Resolved' && (
                    <button
                      onClick={() => handleAcknowledge(activeAlert.id)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors flex items-center space-x-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Acknowledge</span>
                    </button>
                  )}

                  {activeAlert.status !== 'Resolved' && (
                    <button
                      onClick={() => handleResolve(activeAlert.id)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                  )}

                  {/* Simulate Fix (Navigates to What-If Simulation) */}
                  <button
                    onClick={() => {
                      if (onNavigateToSimulation) onNavigateToSimulation();
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center space-x-1.5 shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-mint-400" />
                    <span>Simulate Fix (A6)</span>
                  </button>
                </div>

                {/* Delete Alert Button (Admin Only) */}
                {isAdmin && (
                  <button
                    onClick={() => setDeleteCandidate(activeAlert.id)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors flex items-center space-x-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Alert</span>
                  </button>
                )}
              </div>

            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-2">
              <Info className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm text-slate-600 font-semibold">Select an alert from the left list to inspect details.</p>
            </div>
          )}
        </div>

      </div>


      {/* ========================================================================= */}
      {/* MODAL 1: EDIT ALERT RULES MODAL                                           */}
      {/* Alert type, Threshold, Severity, Notify roles, Enabled toggle            */}
      {/* ========================================================================= */}
      {isRulesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 text-slate-900 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-800 font-bold">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-950">Edit Bottleneck Alert Rules</h3>
                  <p className="text-xs text-slate-500">Configure trigger thresholds, severity classifications & role dispatches</p>
                </div>
              </div>
              <button
                onClick={() => setIsRulesModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Rules Table */}
            <div className="space-y-3">
              {alertRules.map((rule) => (
                <div key={rule.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 text-sm block">{rule.type}</span>
                    <div className="flex items-center space-x-2 text-slate-500">
                      <span>Threshold: <strong className="text-slate-800 font-mono">{rule.threshold}</strong></span>
                      <span>•</span>
                      <span>Severity: <strong className="text-slate-800">{rule.severity}</strong></span>
                    </div>
                    <div className="flex items-center space-x-1 pt-1">
                      <span className="text-[10px] text-slate-400">Notify:</span>
                      {rule.notify.map((n) => (
                        <span key={n} className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 text-[10px] font-semibold">
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <label className="flex items-center space-x-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rule.enabled}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setAlertRules((prev) =>
                            prev.map((r) => (r.id === rule.id ? { ...r, enabled: checked } : r))
                          );
                        }}
                        className="w-4 h-4 rounded border-slate-300 text-slate-950 focus:ring-slate-950 cursor-pointer"
                      />
                      <span className="font-bold text-slate-700 text-xs">
                        {rule.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-xs text-slate-500">Rules are automatically synchronized with Kafka stream</span>
              <button
                onClick={() => setIsRulesModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Save & Close Rules
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ========================================================================= */}
      {/* MODAL 2: CONFIRM DELETE ALERT POPUP                                       */}
      {/* ========================================================================= */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 text-slate-900 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center font-bold">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-950">Confirm Alert Deletion</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {deleteCandidate === 'bulk'
                ? `Are you sure you want to permanently delete all ${selectedAlertIds.length} selected alerts?`
                : 'Are you sure you want to permanently delete this bottleneck alert from the system?'}
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
