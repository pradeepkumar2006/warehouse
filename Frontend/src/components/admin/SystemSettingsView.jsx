import React, { useState } from 'react';
import { 
  Settings, 
  Bell, 
  Database, 
  Cpu, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Radio, 
  Loader2, 
  Download, 
  Save, 
  Volume2, 
  VolumeX, 
  Mail, 
  ShieldCheck, 
  Sparkles, 
  RefreshCw,
  Search,
  Check,
  X
} from 'lucide-react';

export default function SystemSettingsView({ 
  auditLogs = [], 
  onShowToast, 
  onLogAction 
}) {
  const [activeTab, setActiveTab] = useState('alerts'); // 'alerts' | 'datasources' | 'model' | 'audit'

  // =========================================================================
  // TAB 1: ALERTS CONFIG STATE
  // =========================================================================
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [emailRecipients, setEmailRecipients] = useState('ops-alerts@twinflow.ai, admin@twinflow.ai');
  const [soundAlertsEnabled, setSoundAlertsEnabled] = useState(true);
  const [alertCooldownMinutes, setAlertCooldownMinutes] = useState(15);
  const [autoResolveMinutes, setAutoResolveMinutes] = useState(60);
  const [notifyAdminRole, setNotifyAdminRole] = useState(true);
  const [notifyUserRole, setNotifyUserRole] = useState(true);

  // =========================================================================
  // TAB 2: DATA SOURCES STATE
  // =========================================================================
  const [dataSources, setDataSources] = useState([
    {
      id: 'mqtt',
      name: 'MQTT Broker (Sensors & IoT)',
      endpoint: 'mqtt://broker.warehouse-internal:1883/topics/telemetry',
      status: 'Connected',
      lastMessageTime: 'Just now',
      latency: '14ms',
      isTesting: false
    },
    {
      id: 'opc-ua',
      name: 'OPC-UA Server (PLC & Conveyors)',
      endpoint: 'opc.tcp://plc-gateway.zone2.local:4840',
      status: 'Connected',
      lastMessageTime: '3s ago',
      latency: '22ms',
      isTesting: false
    },
    {
      id: 'kafka',
      name: 'Apache Kafka Event Stream',
      endpoint: 'kafka-cluster-prod.telemetry.svc:9092',
      status: 'Connected',
      lastMessageTime: '1s ago',
      latency: '8ms',
      isTesting: false
    },
    {
      id: 'rest-api',
      name: 'WMS / ERP REST API Gateway',
      endpoint: 'https://api.warehouse-erp.internal/v2/orders',
      status: 'Connected',
      lastMessageTime: '12s ago',
      latency: '65ms',
      isTesting: false
    }
  ]);

  // =========================================================================
  // TAB 3: MODEL CONFIG STATE
  // =========================================================================
  const [modelName, setModelName] = useState('DSTGT v1.0');
  const [inferenceInterval, setInferenceInterval] = useState(5); // seconds
  const [confidenceThreshold, setConfidenceThreshold] = useState(70); // %
  const [predictionHorizon, setPredictionHorizon] = useState(30); // 15 | 30 | 60 minutes
  const [autoRetrainEnabled, setAutoRetrainEnabled] = useState(true);

  // =========================================================================
  // TAB 4: AUDIT LOG STATE & FILTERS
  // =========================================================================
  const [auditUserFilter, setAuditUserFilter] = useState('All');
  const [auditModuleFilter, setAuditModuleFilter] = useState('All');
  const [auditSearchQuery, setAuditSearchQuery] = useState('');

  // Sample Audit Logs merged with dynamic logs
  const defaultLogs = [
    { id: 'LOG-101', user: 'admin', action: 'Changed High threshold 70 to 75', module: 'Warehouse Config', time: '10:42', ip: '192.168.1.5' },
    { id: 'LOG-102', user: 'admin', action: 'Acknowledged Alert #ALT-904 in Aisle B', module: 'Bottleneck Alerts', time: '10:15', ip: '192.168.1.5' },
    { id: 'LOG-103', user: 'david.chen', action: 'Generated Weekly Congestion PDF report', module: 'Reports', time: '09:48', ip: '192.168.1.22' },
    { id: 'LOG-104', user: 'admin', action: 'Retrained DSTGT model to v1.02', module: 'Model Engine', time: '09:12', ip: '192.168.1.5' },
    { id: 'LOG-105', user: 'sam.haddad', action: 'Simulated reroute fix for 12 AGVs', module: 'What-If Sim', time: '08:30', ip: '192.168.1.18' },
    { id: 'LOG-106', user: 'admin', action: 'Created new user account: lucas.mayer', module: 'User Management', time: 'Yesterday', ip: '192.168.1.5' }
  ];

  const allLogs = [...auditLogs, ...defaultLogs];

  // Test Connection for Data Source
  const handleTestConnection = (sourceId) => {
    setDataSources((prev) =>
      prev.map((s) => (s.id === sourceId ? { ...s, isTesting: true } : s))
    );

    setTimeout(() => {
      setDataSources((prev) =>
        prev.map((s) => (s.id === sourceId ? { ...s, isTesting: false, status: 'Connected', lastMessageTime: 'Just now' } : s))
      );
      const ds = dataSources.find((s) => s.id === sourceId);
      if (onShowToast) {
        onShowToast(`Connection successful for ${ds?.name} (${ds?.latency || '15ms'})`, 'success');
      }
    }, 900);
  };

  // Export Audit Log CSV
  const handleExportCSV = () => {
    const headers = 'User,Action,Module,Time,IP\n';
    const rows = allLogs.map((l) => `"${l.user}","${l.action}","${l.module}","${l.time}","${l.ip}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `twinflow_audit_log_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (onShowToast) {
      onShowToast('Exported audit log entries to CSV', 'success');
    }
  };

  // Save Settings
  const handleSaveSettings = () => {
    if (onShowToast) {
      onShowToast('System settings saved and applied cluster-wide', 'success');
    }
    if (onLogAction) {
      onLogAction(
        `Updated System Settings: Model horizon ${predictionHorizon}m, Confidence ${confidenceThreshold}%, Alerts Cooldown ${alertCooldownMinutes}m`,
        'System Settings'
      );
    }
  };

  // Filtered Audit Logs
  const filteredLogs = allLogs.filter((l) => {
    if (auditUserFilter !== 'All' && l.user !== auditUserFilter) return false;
    if (auditModuleFilter !== 'All' && l.module !== auditModuleFilter) return false;
    if (auditSearchQuery) {
      const q = auditSearchQuery.toLowerCase();
      return l.action.toLowerCase().includes(q) || l.ip.includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-16 font-sans text-slate-900">
      
      {/* ========================================================================= */}
      {/* HEADER                                                                    */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs">
            <Settings className="w-5 h-5 text-mint-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-slate-950 tracking-tight">
                A11. System Engine & Telemetry Settings
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200 text-[10px] font-bold">
                Admin Console
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Alert routing rules, IoT pipeline connections, DSTGT inference horizon & administrator audit trails
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TABS NAVIGATION                                                           */}
      {/* Tab 1: Alerts | Tab 2: Data Sources | Tab 3: Model | Tab 4: Audit Log     */}
      {/* ========================================================================= */}
      <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 max-w-xl text-xs font-bold">
        {[
          { id: 'alerts', label: '1. Alerts', icon: Bell },
          { id: 'datasources', label: '2. Data Sources', icon: Database },
          { id: 'model', label: '3. Model', icon: Cpu },
          { id: 'audit', label: '4. Audit Log', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
                isActive
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ALERTS                                                             */}
      {/* Email notifications (toggle + recipients), Sound alerts (toggle),         */}
      {/* Alert cooldown (minutes), Auto-resolve after (minutes), Notify roles      */}
      {/* ========================================================================= */}
      {activeTab === 'alerts' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-base font-extrabold text-slate-950">Alert Notification Rules</h3>
            <p className="text-xs text-slate-500">Configure dispatch channels, throttle windows and automatic resolution criteria</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Email Notifications */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-mint-600" />
                  <span className="text-xs font-bold text-slate-900">Email Notifications</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotificationsEnabled}
                  onChange={(e) => setEmailNotificationsEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-slate-900 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Recipients (Comma-separated)</label>
                <input
                  type="text"
                  disabled={!emailNotificationsEnabled}
                  value={emailRecipients}
                  onChange={(e) => setEmailRecipients(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-mono font-medium outline-none focus:border-slate-900 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Sound Alerts */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {soundAlertsEnabled ? <Volume2 className="w-4 h-4 text-mint-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                  <span className="text-xs font-bold text-slate-900">Audio Chimes & Floor Sirens</span>
                </div>
                <input
                  type="checkbox"
                  checked={soundAlertsEnabled}
                  onChange={(e) => setSoundAlertsEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-slate-900 cursor-pointer"
                />
              </div>
              <p className="text-xs text-slate-500">
                Plays warning sound in operator console when Critical severity bottlenecks exceed threshold.
              </p>
            </div>

            {/* Alert Cooldown (minutes) */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Alert Cooldown Window</span>
                <span className="font-mono text-xs font-extrabold text-slate-950">{alertCooldownMinutes} minutes</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={alertCooldownMinutes}
                onChange={(e) => setAlertCooldownMinutes(Number(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">
                Suppresses duplicate notifications for the same chokepoint within {alertCooldownMinutes} minutes.
              </p>
            </div>

            {/* Auto-resolve After (minutes) */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Auto-Resolve Inactive Incidents</span>
                <span className="font-mono text-xs font-extrabold text-slate-950">{autoResolveMinutes} minutes</span>
              </div>
              <input
                type="range"
                min="15"
                max="180"
                step="15"
                value={autoResolveMinutes}
                onChange={(e) => setAutoResolveMinutes(Number(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">
                Automatically transitions cleared bottlenecks to Resolved status after {autoResolveMinutes}m.
              </p>
            </div>

          </div>

          {/* Notify Roles Checkboxes */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-900 block">Notify Roles:</span>
            <div className="flex items-center space-x-6 text-xs">
              <label className="flex items-center space-x-2 cursor-pointer font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={notifyAdminRole}
                  onChange={(e) => setNotifyAdminRole(e.target.checked)}
                  className="w-4 h-4 rounded text-slate-900"
                />
                <span>Administrator (Critical & High)</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={notifyUserRole}
                  onChange={(e) => setNotifyUserRole(e.target.checked)}
                  className="w-4 h-4 rounded text-slate-900"
                />
                <span>Standard User / Floor Lead (All Severity Tiers)</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DATA SOURCES                                                       */}
      {/* Cards for MQTT, OPC-UA, Kafka, REST API                                   */}
      {/* Each: status badge, host/endpoint, last message time, Test Connection btn  */}
      {/* ========================================================================= */}
      {activeTab === 'datasources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
          {dataSources.map((ds) => (
            <div key={ds.id} className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
              
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Radio className="w-4 h-4 text-mint-600" />
                  <h3 className="text-sm font-extrabold text-slate-950">{ds.name}</h3>
                </div>
                <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  ds.status === 'Connected'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{ds.status}</span>
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 block">Host / Endpoint URI</span>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-slate-800 text-[11px] break-all">
                    {ds.endpoint}
                  </div>
                </div>

                <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                  <span>Last Message: <strong className="text-slate-800">{ds.lastMessageTime}</strong></span>
                  <span>Latency: <strong className="font-mono text-slate-800">{ds.latency}</strong></span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  disabled={ds.isTesting}
                  onClick={() => handleTestConnection(ds.id)}
                  className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center justify-center space-x-2"
                >
                  {ds.isTesting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-900" />
                      <span>Testing Connection...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-mint-500" />
                      <span>Test Connection</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: MODEL                                                              */}
      {/* Model name DSTGT v1.0, Inference interval (5 sec), Confidence threshold   */}
      {/* Prediction horizon (15/30/60 min), Auto-retrain toggle                    */}
      {/* ========================================================================= */}
      {activeTab === 'model' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-base font-extrabold text-slate-950">DSTGT Spatio-Temporal Model Parameters</h3>
            <p className="text-xs text-slate-500">Neural graph architecture settings governing real-time spatial bottleneck forecasting</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Model Name */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Active Model Engine</label>
              <input
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-xs font-bold text-slate-900 outline-none"
              />
              <p className="text-[11px] text-slate-400">Dynamic Spatio-Temporal Graph Transformer</p>
            </div>

            {/* Inference Interval */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Inference Interval</span>
                <span className="font-mono text-slate-950">{inferenceInterval} seconds</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={inferenceInterval}
                onChange={(e) => setInferenceInterval(Number(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">Graph forward-pass inference cadence across warehouse telemetry.</p>
            </div>

            {/* Confidence Threshold */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Prediction Confidence Threshold</span>
                <span className="font-mono text-slate-950">{confidenceThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">Suppresses predictions whose epistemic uncertainty is below {confidenceThreshold}%.</p>
            </div>

            {/* Prediction Horizon */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Prediction Horizon Window</label>
              <div className="grid grid-cols-3 gap-2">
                {[15, 30, 60].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setPredictionHorizon(h)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      predictionHorizon === h
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {h} min
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400">Lookahead time window projected by temporal attention layers.</p>
            </div>

          </div>

          {/* Auto-retrain toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Automatic Continuous Fine-Tuning</span>
              <span className="text-[11px] text-slate-500">Nightly PyTorch fine-tuning on newly observed sensor patterns at 02:00 AM</span>
            </div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRetrainEnabled}
                onChange={(e) => setAutoRetrainEnabled(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${autoRetrainEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${autoRetrainEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </label>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: AUDIT LOG                                                          */}
      {/* Table: User, Action, Module, Time, IP                                     */}
      {/* Filters: user, action type, date range; Export CSV                        */}
      {/* ========================================================================= */}
      {activeTab === 'audit' && (
        <div className="space-y-4 animate-fadeIn">
          
          {/* Filters Bar & Export CSV */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              
              {/* User filter */}
              <div className="flex items-center space-x-1.5 text-xs font-bold">
                <span className="text-slate-400">User:</span>
                <select
                  value={auditUserFilter}
                  onChange={(e) => setAuditUserFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 outline-none"
                >
                  <option value="All">All Users</option>
                  <option value="admin">admin</option>
                  <option value="david.chen">david.chen</option>
                  <option value="sam.haddad">sam.haddad</option>
                </select>
              </div>

              {/* Module filter */}
              <div className="flex items-center space-x-1.5 text-xs font-bold">
                <span className="text-slate-400">Module:</span>
                <select
                  value={auditModuleFilter}
                  onChange={(e) => setAuditModuleFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 outline-none"
                >
                  <option value="All">All Modules</option>
                  <option value="Warehouse Config">Warehouse Config</option>
                  <option value="System Settings">System Settings</option>
                  <option value="User Management">User Management</option>
                  <option value="Bottleneck Alerts">Bottleneck Alerts</option>
                  <option value="Reports">Reports</option>
                  <option value="What-If Sim">What-If Sim</option>
                </select>
              </div>

              {/* Search text */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter action / IP..."
                  value={auditSearchQuery}
                  onChange={(e) => setAuditSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 outline-none"
                />
              </div>

            </div>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5 text-mint-400" />
              <span>Export CSV</span>
            </button>
          </div>

          {/* Audit Log Table */}
          <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                  <th className="py-3 px-6">User</th>
                  <th className="py-3 px-4">Action Taken</th>
                  <th className="py-3 px-4">Module</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-6 text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log, idx) => (
                  <tr key={log.id || idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-slate-900 font-mono">
                      @{log.user}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {log.action}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {log.module}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {log.time}
                    </td>
                    <td className="py-3.5 px-6 text-right font-mono text-slate-400">
                      {log.ip || '192.168.1.5'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* FOOTER: Save Settings with success toast                                  */}
      {/* ========================================================================= */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-4 sticky bottom-4 z-20">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-500">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>System configuration active across 4 edge broker clusters</span>
        </div>

        <button
          onClick={handleSaveSettings}
          className="px-6 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold shadow-sm transition-all flex items-center space-x-2"
        >
          <Save className="w-4 h-4 text-mint-400" />
          <span>Save Settings</span>
        </button>
      </div>

    </div>
  );
}
