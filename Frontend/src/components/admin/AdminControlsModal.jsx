import React, { useState } from 'react';
import { 
  X, 
  Sliders, 
  Settings, 
  Cpu, 
  Network, 
  ShieldCheck, 
  RefreshCw, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Save, 
  Database,
  SlidersHorizontal
} from 'lucide-react';

export default function AdminControlsModal({ isOpen, onClose, initialTab = 'model' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isRetraining, setIsRetraining] = useState(false);
  const [retrainProgress, setRetrainProgress] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Model parameters state
  const [learningRate, setLearningRate] = useState('0.001');
  const [attentionHeads, setAttentionHeads] = useState(8);
  const [temporalWindow, setTemporalWindow] = useState('12');
  const [spatialLayers, setSpatialLayers] = useState('4');

  // Node statuses state
  const [nodesConfig, setNodesConfig] = useState([
    { id: 'N-IN1', name: 'Inbound Dock 1', status: 'Online', weight: 1.0 },
    { id: 'N-A1', name: 'Aisle Racks A1', status: 'Online', weight: 1.2 },
    { id: 'N-JK4', name: 'Sortation Chokepoint J-04', status: 'Throttled', weight: 0.8 },
    { id: 'N-OUT1', name: 'Packing Station P1', status: 'Online', weight: 1.0 },
  ]);

  if (!isOpen) return null;

  const handleRetrainModel = () => {
    setIsRetraining(true);
    setRetrainProgress(15);
    const interval = setInterval(() => {
      setRetrainProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRetraining(false);
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  const toggleNodeStatus = (nodeId) => {
    setNodesConfig((prev) =>
      prev.map((n) =>
        n.id === nodeId
          ? { ...n, status: n.status === 'Online' ? 'Maintenance' : 'Online' }
          : n
      )
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-slate-900 flex flex-col max-h-[90vh]">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-mint-50 border border-mint-200 text-mint-700 flex items-center justify-center font-bold shadow-sm">
              <ShieldCheck className="w-6 h-6 text-mint-700" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-extrabold text-slate-950">TwinFlow Administration Engine</h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                  Admin Exclusive
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Configure DSTGT graph hyperparameters, spatial topology, and warehouse AGV rules
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 pt-3 border-b border-slate-200 bg-slate-50/40 space-x-2">
          <button
            onClick={() => setActiveTab('model')}
            className={`pb-3 px-3 text-xs font-bold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'model'
                ? 'border-mint-500 text-mint-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4 text-mint-600" />
            <span>DSTGT Model Config</span>
          </button>

          <button
            onClick={() => setActiveTab('topology')}
            className={`pb-3 px-3 text-xs font-bold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'topology'
                ? 'border-mint-500 text-mint-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Network className="w-4 h-4 text-mint-600" />
            <span>Graph Topology</span>
          </button>

          <button
            onClick={() => setActiveTab('fleet')}
            className={`pb-3 px-3 text-xs font-bold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'fleet'
                ? 'border-mint-500 text-mint-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-mint-600" />
            <span>AGV Fleet Dispatch</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 px-3 text-xs font-bold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'users'
                ? 'border-mint-500 text-mint-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4 text-mint-600" />
            <span>User Access Logs</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: DSTGT Model Config */}
          {activeTab === 'model' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Dynamic Spatio-Temporal Graph Transformer (DSTGT)</h4>
                    <p className="text-xs text-slate-500">Hyperparameter tuning for warehouse spatial-temporal attention heads</p>
                  </div>
                  <span className="font-mono text-xs text-mint-800 bg-mint-50 px-2 py-1 rounded-md border border-mint-200 font-semibold">
                    PyTorch • GNN Engine
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Learning Rate (&eta;)
                    </label>
                    <input
                      type="text"
                      value={learningRate}
                      onChange={(e) => setLearningRate(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-mint-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Spatio-Temporal Attention Heads
                    </label>
                    <select
                      value={attentionHeads}
                      onChange={(e) => setAttentionHeads(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-mint-500"
                    >
                      <option value={4}>4 Attention Heads</option>
                      <option value={8}>8 Attention Heads (Recommended)</option>
                      <option value={16}>16 Attention Heads (High Compute)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Temporal Observation Window (Timesteps)
                    </label>
                    <input
                      type="text"
                      value={temporalWindow}
                      onChange={(e) => setTemporalWindow(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-mint-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Graph Convolution Layers
                    </label>
                    <input
                      type="text"
                      value={spatialLayers}
                      onChange={(e) => setSpatialLayers(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-mint-500"
                    />
                  </div>
                </div>
              </div>

              {/* Retrain Action */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-slate-900">Retrain DSTGT on Latest Telemetry</h5>
                  <p className="text-[11px] text-slate-500">Ingest past 24 hours of AGV speed and pick-station congestion data.</p>
                </div>
                <button
                  type="button"
                  onClick={handleRetrainModel}
                  disabled={isRetraining}
                  className="px-4 py-2 rounded-xl text-xs font-bold mint-gradient-btn text-slate-950 flex items-center space-x-1.5 shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRetraining ? 'animate-spin' : ''}`} />
                  <span>{isRetraining ? `Retraining (${retrainProgress}%)` : 'Run Online Retrain'}</span>
                </button>
              </div>

              {saveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>DSTGT Model weights updated successfully! Validation F1-score: 95.2%.</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Topology */}
          {activeTab === 'topology' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Warehouse Graph Nodes & Adjacency Weights</span>
                <span className="text-xs text-mint-700 font-semibold">Total Nodes: 24 active</span>
              </div>

              <div className="space-y-2">
                {nodesConfig.map((node) => (
                  <div
                    key={node.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                      <div>
                        <div className="font-bold text-slate-900">{node.name}</div>
                        <div className="font-mono text-slate-500 text-[10px]">{node.id}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-slate-500">Weight: {node.weight}</span>
                      <button
                        onClick={() => toggleNodeStatus(node.id)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                          node.status === 'Online'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {node.status}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Fleet Dispatch */}
          {activeTab === 'fleet' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h5 className="text-xs font-bold text-slate-900">Autonomous Mobile Robot (AMR / AGV) Safety Controls</h5>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="text-slate-500">Fleet Speed Cap:</span>
                    <div className="text-sm font-bold text-slate-900 mt-1">1.8 m/s (Nominal)</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="text-slate-500">Minimum Inter-Bot Separation:</span>
                    <div className="text-sm font-bold text-slate-900 mt-1">2.5 meters</div>
                  </div>
                </div>

                <div className="pt-2">
                  <button className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-all flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Emergency Stop All AGVs in Sortation Bay</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: User Access */}
          {activeTab === 'users' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-900">Security & Role Audit Trail</div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-500 border-b border-slate-200 pb-1 font-sans font-semibold">
                  <span>Timestamp</span>
                  <span>User</span>
                  <span>Action</span>
                  <span>Role</span>
                </div>
                <div className="flex items-center justify-between text-slate-800">
                  <span className="text-slate-500">19:58:12</span>
                  <span className="text-slate-950 font-bold">admin</span>
                  <span>Dashboard Login</span>
                  <span className="text-emerald-700 font-bold">ADMIN</span>
                </div>
                <div className="flex items-center justify-between text-slate-800">
                  <span className="text-slate-500">19:54:30</span>
                  <span className="text-sky-700 font-bold">operator</span>
                  <span>Session Active</span>
                  <span className="text-sky-700 font-bold">USER</span>
                </div>
                <div className="flex items-center justify-between text-slate-800">
                  <span className="text-slate-500">19:42:05</span>
                  <span className="text-rose-600 font-bold">disabled_user</span>
                  <span className="text-rose-600">Login Blocked (Disabled)</span>
                  <span className="text-slate-500">REVOKED</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            TwinFlow Kernel v1.0 • Node Sync Latency 14ms
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
          >
            Close Admin Console
          </button>
        </div>

      </div>
    </div>
  );
}
