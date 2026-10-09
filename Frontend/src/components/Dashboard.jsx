import React, { useState } from 'react';
import { 
  Box, 
  RotateCcw, 
  Sparkles 
} from 'lucide-react';
import { MainLayout } from '../shared/layout';
// Admin Modules & Modals from ./admin
import { 
  AdminOverview, 
  AdminLiveMonitoringView, 
  AdminDigitalTwin3D, 
  WarehouseMap, 
  AdminAIPredictionsView, 
  AdminAlertsView, 
  AdminWhatIfSimulationView, 
  AdminAnalyticsView, 
  AdminReportsView, 
  UserManagementView, 
  WarehouseConfigView, 
  SystemSettingsView, 
  FleetView, 
  SystemHealthView,
  AdminControlsModal 
} from './admin';

// User Modules from ./user
import {
  UserDashboard,
  UserLiveMonitoringView,
  UserDigitalTwin3D,
  UserAIPredictionsView,
  UserAlertsView,
  UserWhatIfSimulationView,
  UserAnalyticsView,
  UserReportsView
} from './user';

import { auditService } from '../services';

export default function Dashboard({ currentUser, onLogout, onSwitchRole }) {
  const isAdmin = currentUser?.role === 'admin';

  // Active Sidebar Tab: 'overview' | 'live-monitoring' | 'digital-twin' | 'predictions' | 'alerts' | 'simulation' | 'analytics' | 'reports' | 'users' | 'config' | 'settings' | 'fleet' | 'health'
  const [activeTab, setActiveTab] = useState('overview');
  const [twinViewMode, setTwinViewMode] = useState('3d');

  // State for AI what-if rerouting
  const [simulatedRerouteActive, setSimulatedRerouteActive] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  // Global Edge State: Kafka pipeline degraded
  const [isKafkaDown, setIsKafkaDown] = useState(false);

  // Admin controls modal helper
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminModalInitialTab, setAdminModalInitialTab] = useState('model');

  // =========================================================================
  // GLOBAL TOAST NOTIFICATIONS (TOP-RIGHT)
  // =========================================================================
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // =========================================================================
  // GLOBAL AUDIT LOG
  // =========================================================================
  const [auditLogs, setAuditLogs] = useState([
    { id: 'LOG-101', user: 'admin', action: 'Changed High threshold 70 to 75', module: 'Warehouse Config', time: '10:42', ip: '192.168.1.5' },
    { id: 'LOG-102', user: 'admin', action: 'Acknowledged Alert #ALT-904 in Aisle B', module: 'Bottleneck Alerts', time: '10:15', ip: '192.168.1.5' },
    { id: 'LOG-103', user: 'david.chen', action: 'Generated Weekly Congestion PDF report', module: 'Reports', time: '09:48', ip: '192.168.1.22' },
    { id: 'LOG-104', user: 'admin', action: 'Retrained DSTGT model to v1.02', module: 'Model Engine', time: '09:12', ip: '192.168.1.5' },
    { id: 'LOG-105', user: 'sam.haddad', action: 'Simulated reroute fix for 12 AGVs', module: 'What-If Sim', time: '08:30', ip: '192.168.1.18' },
    { id: 'LOG-106', user: 'admin', action: 'Created new user account: lucas.mayer', module: 'User Management', time: 'Yesterday', ip: '192.168.1.5' },
  ]);

  const handleLogAction = (action, module) => {
    const newLog = {
      id: `LOG-${Date.now()}`,
      user: currentUser?.username || 'admin',
      action,
      module,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ip: '192.168.1.5',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    auditService.logAction(action, module, currentUser?.username || 'admin');
  };

  // Toggle reroute simulation
  const handleToggleReroute = () => {
    setSimulatedRerouteActive(!simulatedRerouteActive);
  };

  // Open specific aisle in 3D Digital Twin from Overview
  const handleOpenDigitalTwinAisle = (nodeKey) => {
    setActiveTab('digital-twin');
    setTwinViewMode('3d');
    if (nodeKey && nodeKey !== 'all') {
      setSelectedNode({ id: nodeKey, name: nodeKey, occupancy: 88, status: 'High', agvsInside: 4, queue: 14 });
    }
  };

  // Handler for sidebar tab selection
  const handleSelectTab = (tabId) => {
    if (tabId === 'admin-console') {
      setActiveTab('settings');
      return;
    }
    setActiveTab(tabId);
  };

  // Tab Title helper
  const getTabTitle = () => {
    switch (activeTab) {
      case 'overview': return isAdmin ? 'Command Center Overview' : 'My Warehouse View';
      case 'live-monitoring': return isAdmin ? 'A2. Live Warehouse Telemetry' : 'Live Warehouse Telemetry';
      case 'digital-twin': return isAdmin ? 'A3. 3D Spatial Digital Twin' : '3D Spatial Digital Twin';
      case 'predictions': return isAdmin ? 'A4. AI Bottleneck Predictions (DSTGT)' : 'AI Bottleneck Predictions';
      case 'alerts': return isAdmin ? 'A5. Real-Time Bottleneck Alerts' : 'Bottleneck Alerts';
      case 'simulation': return isAdmin ? 'A6. What-If Scenario Simulation' : 'What-If Simulation';
      case 'analytics': return isAdmin ? 'A7. Warehouse Analytics & Historical Trends' : 'Warehouse Analytics';
      case 'reports': return isAdmin ? 'A8. Reports & Intelligence Exports' : 'Operational Reports';
      case 'users': return 'A9. User Access & Permission Management';
      case 'config': return 'A10. Warehouse Floor Topology & Limits';
      case 'settings': return 'A11. System Engine & Telemetry Settings';
      case 'fleet': return 'AGV Fleet Operations & Telemetry';
      case 'health': return 'Kafka & Pipeline Health Diagnostics';
      default: return 'TwinFlow Dashboard';
    }
  };

  return (
    <MainLayout
      activeTab={activeTab}
      onSelectTab={handleSelectTab}
      activeTitle={getTabTitle()}
      currentUser={currentUser}
      onLogout={onLogout}
      onSwitchRole={onSwitchRole}
      toasts={toasts}
      onRemoveToast={removeToast}
      alertsCount={5}
      onShowToast={showToast}
    >
      {/* TAB 1: OVERVIEW / USER DASHBOARD (U1) */}
      {activeTab === 'overview' && (
        isAdmin ? (
          <AdminOverview
            onOpenDigitalTwinAisle={handleOpenDigitalTwinAisle}
            onOpenAuditLog={() => setActiveTab('settings')}
            onOpenUserManagement={() => setActiveTab('users')}
            onNavigateTab={handleSelectTab}
          />
        ) : (
          <UserDashboard
            currentUser={currentUser}
            onOpenDigitalTwinAisle={handleOpenDigitalTwinAisle}
            onNavigateTab={handleSelectTab}
            onShowToast={showToast}
          />
        )
      )}

      {/* TAB: LIVE MONITORING (A2 / U2) */}
      {activeTab === 'live-monitoring' && (
        isAdmin ? (
          <AdminLiveMonitoringView 
            isAdmin={true} 
            currentUser={currentUser} 
            onShowToast={showToast} 
          />
        ) : (
          <UserLiveMonitoringView 
            isAdmin={false} 
            currentUser={currentUser} 
            onShowToast={showToast} 
          />
        )
      )}

      {/* TAB 2: 3D DIGITAL TWIN (A3 / U3) */}
      {activeTab === 'digital-twin' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-mint-50 border border-mint-200 text-mint-700 flex items-center justify-center font-bold shadow-xs">
                <Box className="w-5 h-5 text-mint-700" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-extrabold text-slate-900">3D Digital Twin Engine</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-mint-50 text-mint-800 border border-mint-200 text-[10px] font-bold font-mono">
                    Three.js WebGL • 60 FPS
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time spatial twin with multi-tier racks, moving AGVs, ceiling sensors, and dynamic predictive timeline
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <div className="bg-slate-100 p-1 rounded-2xl flex items-center space-x-1 font-bold">
                <button
                  onClick={() => setTwinViewMode('3d')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    twinViewMode === '3d'
                      ? 'bg-slate-950 text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  3D Three.js
                </button>
                <button
                  onClick={() => setTwinViewMode('2d')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    twinViewMode === '2d'
                      ? 'bg-slate-950 text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  2D Schematic
                </button>
              </div>
            </div>
          </div>

          {twinViewMode === '3d' ? (
            isAdmin ? (
              <AdminDigitalTwin3D
                isAdmin={true}
                onSelectNode={setSelectedNode}
                selectedNode={selectedNode}
                onNavigateToPredictions={() => setActiveTab('predictions')}
                onOpenConfig={() => setActiveTab('config')}
              />
            ) : (
              <UserDigitalTwin3D
                isAdmin={false}
                onSelectNode={setSelectedNode}
                selectedNode={selectedNode}
                onNavigateToPredictions={() => setActiveTab('predictions')}
                onOpenConfig={() => setActiveTab('config')}
              />
            )
          ) : (
            <WarehouseMap
              isAdmin={isAdmin}
              onSelectNode={setSelectedNode}
              selectedNode={selectedNode}
              simulatedRerouteActive={simulatedRerouteActive}
              onNavigateToPredictions={() => setActiveTab('predictions')}
              onOpenConfig={() => setActiveTab('config')}
            />
          )}
        </div>
      )}

      {/* TAB 3: A4 / U4 AI PREDICTIONS */}
      {activeTab === 'predictions' && (
        isAdmin ? (
          <AdminAIPredictionsView
            isAdmin={true}
            currentUser={currentUser}
            simulatedRerouteActive={simulatedRerouteActive}
            onToggleReroute={handleToggleReroute}
          />
        ) : (
          <UserAIPredictionsView
            isAdmin={false}
            currentUser={currentUser}
            simulatedRerouteActive={simulatedRerouteActive}
            onToggleReroute={handleToggleReroute}
          />
        )
      )}

      {/* TAB 4: A5 / U5 BOTTLENECK ALERTS */}
      {activeTab === 'alerts' && (
        isAdmin ? (
          <AdminAlertsView 
            isAdmin={true}
            currentUser={currentUser}
            onNavigateToSimulation={() => setActiveTab('simulation')} 
          />
        ) : (
          <UserAlertsView 
            isAdmin={false}
            currentUser={currentUser}
            onNavigateToSimulation={() => setActiveTab('simulation')} 
          />
        )
      )}

      {/* TAB 5: A6 / U6 WHAT-IF SIMULATION */}
      {activeTab === 'simulation' && (
        isAdmin ? (
          <AdminWhatIfSimulationView
            isAdmin={true}
            currentUser={currentUser}
            onApplySimulationToTwin={() => {
              setSimulatedRerouteActive(true);
              showToast('Simulation reroute applied to 3D Digital Twin', 'success');
              handleLogAction('Dispatched What-if simulation parameters to active fleet', 'What-If Sim');
            }}
          />
        ) : (
          <UserWhatIfSimulationView
            isAdmin={false}
            currentUser={currentUser}
            onApplySimulationToTwin={() => {
              setSimulatedRerouteActive(true);
              showToast('Simulation reroute applied to 3D Digital Twin', 'success');
            }}
          />
        )
      )}

      {/* TAB 6: A7 / U7 ANALYTICS */}
      {activeTab === 'analytics' && (
        isAdmin ? (
          <AdminAnalyticsView
            isAdmin={true}
            onShowToast={showToast}
          />
        ) : (
          <UserAnalyticsView
            isAdmin={false}
            onShowToast={showToast}
          />
        )
      )}

      {/* TAB 7: A8 / U8 REPORTS */}
      {activeTab === 'reports' && (
        isAdmin ? (
          <AdminReportsView
            isAdmin={true}
            currentUser={currentUser}
            onShowToast={showToast}
            onLogAction={handleLogAction}
          />
        ) : (
          <UserReportsView
            isAdmin={false}
            currentUser={currentUser}
            onShowToast={showToast}
            onLogAction={handleLogAction}
          />
        )
      )}

      {/* TAB 8: A9 USER MANAGEMENT */}
      {activeTab === 'users' && (
        <UserManagementView
          currentUser={currentUser}
          onShowToast={showToast}
          onLogAction={handleLogAction}
        />
      )}

      {/* TAB 9: A10 WAREHOUSE CONFIG */}
      {activeTab === 'config' && (
        <WarehouseConfigView
          onShowToast={showToast}
          onLogAction={handleLogAction}
        />
      )}

      {/* TAB 10: A11 SYSTEM SETTINGS */}
      {activeTab === 'settings' && (
        <SystemSettingsView
          auditLogs={auditLogs}
          onShowToast={showToast}
          onLogAction={handleLogAction}
        />
      )}

      {/* TAB 11: AGV FLEET TELEMETRY */}
      {activeTab === 'fleet' && <FleetView />}

      {/* TAB 12: SYSTEM HEALTH & PIPELINE */}
      {activeTab === 'health' && (
        <SystemHealthView
          isKafkaDown={isKafkaDown}
          onToggleKafka={() => setIsKafkaDown(!isKafkaDown)}
        />
      )}

      {/* Admin Controls Modal */}
      <AdminControlsModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        initialTab={adminModalInitialTab}
      />
    </MainLayout>
  );
}
