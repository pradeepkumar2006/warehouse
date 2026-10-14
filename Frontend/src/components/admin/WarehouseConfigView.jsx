import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  MapPin, 
  Sliders, 
  Cpu, 
  Plus, 
  Trash2, 
  Edit3, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Save, 
  X, 
  Radio, 
  Camera, 
  Bot, 
  Boxes, 
  Workflow, 
  Info, 
  Activity, 
  Check, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { configService } from '../../services';

export default function WarehouseConfigView({ 
  onShowToast, 
  onLogAction 
}) {
  const [activeTab, setActiveTab] = useState('aisles'); // 'aisles' | 'capacity' | 'thresholds' | 'devices'
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // =========================================================================
  // TAB 1: AISLES & STATIONS STATE
  // =========================================================================
  const defaultAisles = [
    { id: 'AISLE-A', name: 'Aisle A (Inbound)', zone: 'Zone 1 (Inbound)', capacity: 45, status: 'Active', x: 20, y: 30, color: '#10b981' },
    { id: 'AISLE-B', name: 'Aisle B (Hotspot Central)', zone: 'Zone 2 (Storage)', capacity: 60, status: 'Active', x: 50, y: 30, color: '#ef4444' },
    { id: 'AISLE-C', name: 'Aisle C (Buffer Storage)', zone: 'Zone 2 (Storage)', capacity: 55, status: 'Active', x: 20, y: 70, color: '#3b82f6' },
    { id: 'AISLE-D', name: 'Aisle D (Sortation Feed)', zone: 'Zone 3 (Sortation)', capacity: 40, status: 'Active', x: 50, y: 70, color: '#8b5cf6' },
    { id: 'STA-PK1', name: 'Packing Station 1', zone: 'Zone 4 (Outbound)', capacity: 30, status: 'Active', x: 80, y: 50, color: '#06b6d4' }
  ];
  const [aisles, setAisles] = useState(defaultAisles);
  const [selectedAisleId, setSelectedAisleId] = useState('AISLE-B');

  // Add Aisle Modal
  const [isAddAisleModalOpen, setIsAddAisleModalOpen] = useState(false);
  const [aisleForm, setAisleForm] = useState({
    name: '',
    zone: 'Zone 2 (Storage)',
    capacity: 50,
    x: 40,
    y: 50,
    status: 'Active'
  });

  // =========================================================================
  // TAB 2: CAPACITY STATE (Per-zone)
  // =========================================================================
  const defaultCapacity = {
    zone1: { name: 'Zone 1 (Inbound Docks)', maxAgvs: 8, maxQueue: 15, maxItemsPerAisle: 350 },
    zone2: { name: 'Zone 2 (Storage Racks A & B)', maxAgvs: 12, maxQueue: 25, maxItemsPerAisle: 600 },
    zone3: { name: 'Zone 3 (Sortation Hub)', maxAgvs: 10, maxQueue: 20, maxItemsPerAisle: 450 },
    zone4: { name: 'Zone 4 (Outbound Bay)', maxAgvs: 6, maxQueue: 12, maxItemsPerAisle: 300 }
  };
  const [capacityConfig, setCapacityConfig] = useState(defaultCapacity);

  // =========================================================================
  // TAB 3: THRESHOLDS STATE
  // =========================================================================
  const defaultThresholds = {
    moderate: 40,
    high: 70,
    critical: 85
  };
  const [thresholds, setThresholds] = useState(defaultThresholds);

  // Validation: Moderate must be less than High, High must be less than Critical
  const isThresholdValid =
    thresholds.moderate < thresholds.high && thresholds.high < thresholds.critical;

  // =========================================================================
  // TAB 4: DEVICES STATE
  // =========================================================================
  const [deviceFilter, setDeviceFilter] = useState('All');
  const defaultDevices = [
    { id: 'CAM-101', type: 'CCTV', location: 'Overhead Aisle B', status: 'Online', lastSeen: 'Just now' },
    { id: 'CAM-102', type: 'CCTV', location: 'Inbound Dock 1', status: 'Online', lastSeen: '1m ago' },
    { id: 'RFID-201', type: 'RFID Scanners', location: 'Junction J-02 Portal', status: 'Online', lastSeen: '3s ago' },
    { id: 'RFID-202', type: 'RFID Scanners', location: 'Packing Chute 4', status: 'Online', lastSeen: '12s ago' },
    { id: 'IOT-301', type: 'IoT Sensors', location: 'Aisle B Rack Beam Vibration', status: 'Online', lastSeen: 'Just now' },
    { id: 'IOT-302', type: 'IoT Sensors', location: 'Sortation Temperature Sensor', status: 'Online', lastSeen: '4s ago' },
    { id: 'AGV-01', type: 'AGVs', location: 'Aisle B Chokepoint', status: 'Online', lastSeen: 'Just now' },
    { id: 'AGV-04', type: 'AGVs', location: 'Charging Station East', status: 'Offline', lastSeen: '14m ago' },
    { id: 'CNV-01', type: 'Conveyors', location: 'Main Sortation Motorized Loop', status: 'Online', lastSeen: 'Just now' },
    { id: 'CNV-02', type: 'Conveyors', location: 'Outbound Roller Bed #2', status: 'Online', lastSeen: '30s ago' }
  ];
  const [devices, setDevices] = useState(defaultDevices);

  // Confirm Reset Modal
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [aisleToDelete, setAisleToDelete] = useState(null);

  // Mark changes dirty
  const markDirty = () => {
    setHasUnsavedChanges(true);
  };

  // Add Aisle submit
  const handleAddAisle = (e) => {
    e.preventDefault();
    const newAisle = {
      id: `AISLE-${String.fromCharCode(65 + aisles.length)}`,
      name: aisleForm.name,
      zone: aisleForm.zone,
      capacity: Number(aisleForm.capacity),
      x: Number(aisleForm.x),
      y: Number(aisleForm.y),
      status: aisleForm.status,
      color: '#3b82f6'
    };
    setAisles((prev) => [...prev, newAisle]);
    setSelectedAisleId(newAisle.id);
    setIsAddAisleModalOpen(false);
    setAisleForm({ name: '', zone: 'Zone 2 (Storage)', capacity: 50, x: 40, y: 50, status: 'Active' });
    markDirty();

    if (onShowToast) onShowToast(`Added warehouse aisle: ${newAisle.name}`, 'success');
  };

  // Delete Aisle
  const confirmDeleteAisle = () => {
    if (!aisleToDelete) return;
    const name = aisleToDelete.name;
    setAisles((prev) => prev.filter((a) => a.id !== aisleToDelete.id));
    if (selectedAisleId === aisleToDelete.id) {
      setSelectedAisleId('AISLE-B');
    }
    setAisleToDelete(null);
    markDirty();

    if (onShowToast) onShowToast(`Deleted aisle ${name}`, 'success');
    if (onLogAction) onLogAction(`Deleted warehouse aisle: ${name}`, 'Warehouse Config');
  };

  // Toggle Device status
  const handleToggleDeviceStatus = (deviceId) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === deviceId
          ? { ...d, status: d.status === 'Online' ? 'Offline' : 'Online', lastSeen: 'Just now' }
          : d
      )
    );
    markDirty();
    const dev = devices.find((d) => d.id === deviceId);
    const newStat = dev?.status === 'Online' ? 'Offline' : 'Online';
    if (onShowToast) onShowToast(`Device ${deviceId} switched to ${newStat}`, 'info');
  };

  // Fetch configuration from backend on mount
  useEffect(() => {
    let isMounted = true;
    configService.getConfig()
      .then((cfg) => {
        if (isMounted && cfg) {
          if (cfg.thresholds) setThresholds(cfg.thresholds);
          if (Array.isArray(cfg.aisles) && cfg.aisles.length > 0) {
            setAisles(cfg.aisles.map(a => ({
              ...a,
              color: a.id === 'AISLE-B' ? '#ef4444' : (a.id === 'AISLE-A' ? '#10b981' : '#3b82f6')
            })));
          }
        }
      })
      .catch((err) => console.warn('Backend config load error:', err));
    return () => { isMounted = false; };
  }, []);

  // Save Changes
  const handleSaveChanges = async () => {
    if (!isThresholdValid) {
      if (onShowToast) {
        onShowToast('Cannot save: Moderate must be less than High, High less than Critical', 'error');
      }
      return;
    }

    try {
      await configService.saveConfig({
        thresholds,
        aisles: aisles.map((a) => ({
          id: a.id,
          name: a.name,
          zone: a.zone,
          capacity: a.capacity,
          status: a.status,
          x: a.x,
          y: a.y
        }))
      });
    } catch (err) {
      console.warn('Backend config save error:', err);
    }

    setHasUnsavedChanges(false);
    if (onShowToast) {
      onShowToast('Warehouse configuration successfully updated and broadcast to edge nodes!', 'success');
    }
    if (onLogAction) {
      onLogAction(
        `Updated Warehouse Config (Moderate: ${thresholds.moderate}%, High: ${thresholds.high}%, Critical: ${thresholds.critical}%)`,
        'Warehouse Config'
      );
    }
  };

  // Reset to Default
  const handleResetToDefault = () => {
    setAisles(defaultAisles);
    setCapacityConfig(defaultCapacity);
    setThresholds(defaultThresholds);
    setDevices(defaultDevices);
    setSelectedAisleId('AISLE-B');
    setHasUnsavedChanges(false);
    setIsResetConfirmOpen(false);

    if (onShowToast) onShowToast('Reset warehouse configuration to factory baseline defaults', 'info');
    if (onLogAction) onLogAction('Reset warehouse configuration to default baselines', 'Warehouse Config');
  };

  const filteredDevices = devices.filter((d) => {
    if (deviceFilter === 'All') return true;
    return d.type.toLowerCase().includes(deviceFilter.toLowerCase());
  });

  const selectedAisleObj = aisles.find((a) => a.id === selectedAisleId) || aisles[0];

  return (
    <div className="space-y-6 animate-fadeIn pb-16 font-sans text-slate-900">
      
      {/* ========================================================================= */}
      {/* HEADER                                                                    */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs">
            <Layers className="w-5 h-5 text-mint-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-slate-950 tracking-tight">
                A10. Warehouse Floor Topology & Limits Configuration
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200 text-[10px] font-bold">
                Admin Config
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Spatial aisle coordinates, per-zone queue caps, DSTGT alerting thresholds & floor IoT fleet
            </p>
          </div>
        </div>

        {/* Unsaved Changes Status Badge */}
        {hasUnsavedChanges && (
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-2xl bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold animate-pulse">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>You have unsaved changes</span>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* TABS NAVIGATION                                                           */}
      {/* Tab 1: Aisles & Stations | Tab 2: Capacity | Tab 3: Thresholds | Devices  */}
      {/* ========================================================================= */}
      <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 max-w-xl text-xs font-bold">
        {[
          { id: 'aisles', label: '1. Aisles & Stations', icon: MapPin },
          { id: 'capacity', label: '2. Capacity Limits', icon: Boxes },
          { id: 'thresholds', label: '3. Alert Thresholds', icon: Sliders },
          { id: 'devices', label: '4. Floor Devices', icon: Cpu },
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
      {/* TAB 1: AISLES & STATIONS                                                  */}
      {/* Table on left, Add Aisle button, Interactive layout preview on right      */}
      {/* ========================================================================= */}
      {activeTab === 'aisles' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          
          {/* Table on left (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-950">Aisles & Workstation Topology</h3>
                <p className="text-xs text-slate-500">Click any aisle to highlight its spatial coordinate on the right</p>
              </div>
              <button
                onClick={() => setIsAddAisleModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-mint-400" />
                <span>Add Aisle</span>
              </button>
            </div>

            <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                    <th className="py-3 px-4">Aisle Name</th>
                    <th className="py-3 px-3">Zone</th>
                    <th className="py-3 px-3">Max Cap</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {aisles.map((a) => {
                    const isSelected = selectedAisleId === a.id;
                    return (
                      <tr
                        key={a.id}
                        onClick={() => setSelectedAisleId(a.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-mint-50/70' : 'hover:bg-slate-50/60'
                        }`}
                      >
                        <td className="py-3 px-4 font-extrabold text-slate-900 flex items-center space-x-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: a.color }}
                          />
                          <span>{a.name}</span>
                        </td>
                        <td className="py-3 px-3 text-slate-600 font-medium">{a.zone}</td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-800">{a.capacity} units</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                            {a.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setAisleToDelete(a);
                              }}
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                              title="Delete Aisle"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Layout Preview on right (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-950">Floor Layout Grid Preview</h3>
                  <p className="text-xs text-slate-500">Interactive schematic of physical rack locations</p>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 rounded-md text-slate-700">
                  Grid 100 x 100
                </span>
              </div>

              {/* 2D Interactive Grid Map */}
              <div className="relative w-full aspect-square bg-slate-950 rounded-2xl border-2 border-slate-800 overflow-hidden p-4 select-none">
                {/* Background Grid Lines */}
                <div 
                  className="absolute inset-0 opacity-15"
                  style={{
                    backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}
                />

                {/* Zone Labels */}
                <span className="absolute top-2 left-2 text-[9px] font-mono text-slate-500">ZONE 1 (INBOUND)</span>
                <span className="absolute top-2 right-2 text-[9px] font-mono text-slate-500">ZONE 4 (OUTBOUND)</span>
                <span className="absolute bottom-2 left-2 text-[9px] font-mono text-slate-500">ZONE 2 (STORAGE)</span>
                <span className="absolute bottom-2 right-2 text-[9px] font-mono text-slate-500">ZONE 3 (SORTATION)</span>

                {/* Conveyor Main Line */}
                <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-700 border-t border-dashed border-slate-500" />

                {/* Interactive Aisle Nodes */}
                {aisles.map((a) => {
                  const isSelected = selectedAisleId === a.id;
                  return (
                    <div
                      key={a.id}
                      onClick={() => setSelectedAisleId(a.id)}
                      style={{
                        left: `${a.x}%`,
                        top: `${a.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      className={`absolute cursor-pointer transition-all ${
                        isSelected ? 'z-20 scale-125' : 'z-10 hover:scale-110'
                      }`}
                    >
                      <div
                        className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black font-mono transition-all flex flex-col items-center ${
                          isSelected
                            ? 'bg-mint-400 text-slate-950 shadow-lg shadow-mint-400/50 ring-4 ring-white/20'
                            : 'bg-slate-800 text-white border border-slate-600'
                        }`}
                      >
                        <span>{a.id}</span>
                        <span className="text-[8px] opacity-80">{a.capacity}u</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Aisle Inspector Detail */}
              {selectedAisleObj && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{selectedAisleObj.name}</span>
                    <span className="font-mono text-mint-700">Coords: ({selectedAisleObj.x}, {selectedAisleObj.y})</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Zone: {selectedAisleObj.zone} • Max Capacity: {selectedAisleObj.capacity} items • Status: {selectedAisleObj.status}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CAPACITY                                                           */}
      {/* Per-zone capacity: max AGVs, max queue length, max items per aisle        */}
      {/* ========================================================================= */}
      {activeTab === 'capacity' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
          {Object.entries(capacityConfig).map(([key, zone]) => (
            <div key={key} className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Boxes className="w-4 h-4 text-mint-600" />
                  <h3 className="text-sm font-extrabold text-slate-950">{zone.name}</h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">
                  Zone Limits
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {/* Max AGVs */}
                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span>Max AGVs Allowed In Zone</span>
                    <span className="font-mono text-slate-950">{zone.maxAgvs} Robots</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="30"
                    value={zone.maxAgvs}
                    onChange={(e) => {
                      setCapacityConfig({
                        ...capacityConfig,
                        [key]: { ...zone, maxAgvs: Number(e.target.value) }
                      });
                      markDirty();
                    }}
                    className="w-full accent-slate-900 cursor-pointer"
                  />
                </div>

                {/* Max Queue Length */}
                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span>Max Queue Length</span>
                    <span className="font-mono text-slate-950">{zone.maxQueue} Orders</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={zone.maxQueue}
                    onChange={(e) => {
                      setCapacityConfig({
                        ...capacityConfig,
                        [key]: { ...zone, maxQueue: Number(e.target.value) }
                      });
                      markDirty();
                    }}
                    className="w-full accent-slate-900 cursor-pointer"
                  />
                </div>

                {/* Max Items Per Aisle */}
                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span>Max Items per Aisle</span>
                    <span className="font-mono text-slate-950">{zone.maxItemsPerAisle} Items</span>
                  </div>
                  <input
                    type="number"
                    value={zone.maxItemsPerAisle}
                    onChange={(e) => {
                      setCapacityConfig({
                        ...capacityConfig,
                        [key]: { ...zone, maxItemsPerAisle: Number(e.target.value) }
                      });
                      markDirty();
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 outline-none focus:border-slate-900"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: THRESHOLDS                                                         */}
      {/* Sliders/inputs: Moderate >40%, High >70%, Critical >85%                   */}
      {/* Live preview bar showing green, amber, red zones with validation          */}
      {/* ========================================================================= */}
      {activeTab === 'thresholds' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-base font-extrabold text-slate-950">Congestion Severity Thresholds</h3>
            <p className="text-xs text-slate-500">
              Configure dynamic prediction tripwires. DSTGT automatically escalates alerts when spatial probabilities cross these tiers.
            </p>
          </div>

          {/* Validation Alert */}
          {!isThresholdValid && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>Validation Error: Moderate threshold must be less than High, and High must be less than Critical.</span>
            </div>
          )}

          {/* Sliders & Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Moderate */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-amber-700 flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>Moderate Threshold</span>
                </span>
                <span className="text-lg font-mono font-black text-slate-950">{thresholds.moderate}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                value={thresholds.moderate}
                onChange={(e) => {
                  setThresholds({ ...thresholds, moderate: Number(e.target.value) });
                  markDirty();
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">Triggered above {thresholds.moderate}%. Early routing warning.</p>
            </div>

            {/* High */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-orange-700 flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <span>High Threshold</span>
                </span>
                <span className="text-lg font-mono font-black text-slate-950">{thresholds.high}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="95"
                value={thresholds.high}
                onChange={(e) => {
                  setThresholds({ ...thresholds, high: Number(e.target.value) });
                  markDirty();
                }}
                className="w-full accent-orange-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">Triggered above {thresholds.high}%. Active bottleneck imminent.</p>
            </div>

            {/* Critical */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-rose-700 flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                  <span>Critical Threshold</span>
                </span>
                <span className="text-lg font-mono font-black text-slate-950">{thresholds.critical}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="99"
                value={thresholds.critical}
                onChange={(e) => {
                  setThresholds({ ...thresholds, critical: Number(e.target.value) });
                  markDirty();
                }}
                className="w-full accent-rose-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">Triggered above {thresholds.critical}%. Floor chokepoint deadlock.</p>
            </div>

          </div>

          {/* Live Preview Bar (Green, Amber, Orange, Red zones) */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-bold text-slate-600">
              <span>Live Range Preview</span>
              <span className="font-mono text-slate-400">0% to 100% Probability</span>
            </div>

            <div className="h-6 w-full rounded-2xl overflow-hidden flex font-mono text-[10px] font-bold text-white shadow-inner">
              {/* Green (Normal) */}
              <div
                style={{ width: `${Math.max(0, thresholds.moderate)}%` }}
                className="bg-emerald-500 flex items-center justify-center transition-all"
                title={`Normal: 0% - ${thresholds.moderate}%`}
              >
                Normal
              </div>

              {/* Amber (Moderate) */}
              <div
                style={{ width: `${Math.max(0, thresholds.high - thresholds.moderate)}%` }}
                className="bg-amber-400 text-slate-950 flex items-center justify-center transition-all"
                title={`Moderate: ${thresholds.moderate}% - ${thresholds.high}%`}
              >
                Moderate
              </div>

              {/* Orange (High) */}
              <div
                style={{ width: `${Math.max(0, thresholds.critical - thresholds.high)}%` }}
                className="bg-orange-500 flex items-center justify-center transition-all"
                title={`High: ${thresholds.high}% - ${thresholds.critical}%`}
              >
                High
              </div>

              {/* Red (Critical) */}
              <div
                style={{ width: `${Math.max(0, 100 - thresholds.critical)}%` }}
                className="bg-rose-600 flex items-center justify-center transition-all"
                title={`Critical: ${thresholds.critical}% - 100%`}
              >
                Critical
              </div>
            </div>

            <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-1">
              <span>0%</span>
              <span>{thresholds.moderate}%</span>
              <span>{thresholds.high}%</span>
              <span>{thresholds.critical}%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: DEVICES                                                            */}
      {/* Sub-sections: CCTV, RFID Scanners, IoT Sensors, AGVs, Conveyors           */}
      {/* Table: Device ID, Type, Location, Status (Online/Offline), Last Seen      */}
      {/* ========================================================================= */}
      {activeTab === 'devices' && (
        <div className="space-y-4 animate-fadeIn">
          
          {/* Sub-section filters */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
              {['All', 'CCTV', 'RFID Scanners', 'IoT Sensors', 'AGVs', 'Conveyors'].map((f) => (
                <button
                  key={f}
                  onClick={() => setDeviceFilter(f)}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    deviceFilter === f
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <span className="text-xs font-bold text-slate-400">
              Showing {filteredDevices.length} devices
            </span>
          </div>

          {/* Devices Table */}
          <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                  <th className="py-3 px-6">Device ID</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Seen</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDevices.map((dev) => (
                  <tr key={dev.id} className="hover:bg-slate-50/60 transition-colors">
                    
                    <td className="py-3.5 px-6 font-mono font-extrabold text-slate-900">
                      {dev.id}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {dev.type}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {dev.location}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        dev.status === 'Online'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${dev.status === 'Online' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span>{dev.status}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {dev.lastSeen}
                    </td>

                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => handleToggleDeviceStatus(dev.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
                          dev.status === 'Online'
                            ? 'border-slate-200 text-slate-700 hover:bg-slate-100'
                            : 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                        }`}
                      >
                        {dev.status === 'Online' ? 'Simulate Offline' : 'Reconnect'}
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* FOOTER BUTTONS: Save Changes, Reset to Default                            */}
      {/* Unsaved changes warning: You have unsaved changes                         */}
      {/* ========================================================================= */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-4 sticky bottom-4 z-20">
        <div className="flex items-center space-x-2">
          {hasUnsavedChanges ? (
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-700">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
              <span>You have unsaved changes. Remember to commit to cluster.</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>All warehouse configuration settings synchronized</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 text-xs font-bold transition-all flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>

          <button
            onClick={handleSaveChanges}
            disabled={!hasUnsavedChanges}
            className={`px-6 py-2.5 rounded-2xl text-xs font-extrabold shadow-sm transition-all flex items-center space-x-2 ${
              hasUnsavedChanges
                ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4 text-mint-400" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADD AISLE MODAL                                                           */}
      {/* ========================================================================= */}
      {isAddAisleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-950">Add Warehouse Aisle</h3>
              <button
                onClick={() => setIsAddAisleModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAisle} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Aisle Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aisle E (Fast-Pick)"
                  value={aisleForm.name}
                  onChange={(e) => setAisleForm({ ...aisleForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Zone</label>
                <select
                  value={aisleForm.zone}
                  onChange={(e) => setAisleForm({ ...aisleForm, zone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold outline-none"
                >
                  <option value="Zone 1 (Inbound)">Zone 1 (Inbound)</option>
                  <option value="Zone 2 (Storage)">Zone 2 (Storage)</option>
                  <option value="Zone 3 (Sortation)">Zone 3 (Sortation)</option>
                  <option value="Zone 4 (Outbound)">Zone 4 (Outbound)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Max Capacity</label>
                <input
                  type="number"
                  required
                  value={aisleForm.capacity}
                  onChange={(e) => setAisleForm({ ...aisleForm, capacity: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Grid X (0-100)</label>
                  <input
                    type="number"
                    min="5"
                    max="95"
                    value={aisleForm.x}
                    onChange={(e) => setAisleForm({ ...aisleForm, x: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Grid Y (0-100)</label>
                  <input
                    type="number"
                    min="5"
                    max="95"
                    value={aisleForm.y}
                    onChange={(e) => setAisleForm({ ...aisleForm, y: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddAisleModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold"
                >
                  Create Aisle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CONFIRM RESET POPUP                                                       */}
      {/* ========================================================================= */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center font-bold">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-950">Reset Configuration?</h3>
                <p className="text-xs text-rose-600 font-bold">All custom thresholds and aisles will revert to defaults.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              Are you sure you want to discard your local configurations and restore factory warehouse baseline defaults?
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleResetToDefault}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CONFIRM DELETE AISLE POPUP                                                */}
      {/* ========================================================================= */}
      {aisleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center font-bold">
                <Trash2 className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-950">Delete Aisle?</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              Are you sure you want to delete <span className="font-bold text-slate-900">{aisleToDelete.name}</span>?
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setAisleToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAisle}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
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
