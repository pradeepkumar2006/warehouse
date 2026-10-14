/**
 * TwinFlow Enterprise Application Configuration
 * Centralized settings for roles, routes, navigation menus, status colors, and thresholds.
 */

// User Access Roles & Permissions
export const ROLES = {
  ADMIN: 'admin',
  OPERATOR: 'user',
};

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: {
    canManageUsers: true,
    canEditWarehouseConfig: true,
    canRetrainModel: true,
    canExportAuditLogs: true,
    canDeleteReports: true,
    canModifyThresholds: true,
    canManageAlertRules: true,
    canApplySimulation: true,
    canAccessAdminConsole: true,
  },
  [ROLES.OPERATOR]: {
    canManageUsers: false,
    canEditWarehouseConfig: false,
    canRetrainModel: false,
    canExportAuditLogs: false,
    canDeleteReports: false,
    canModifyThresholds: false,
    canManageAlertRules: false,
    canApplySimulation: false,
    canAccessAdminConsole: false,
  },
};

// Route & Tab Identifiers
export const ROUTES = {
  OVERVIEW: 'overview',
  LIVE_MONITORING: 'live-monitoring',
  DIGITAL_TWIN: 'digital-twin',
  PREDICTIONS: 'predictions',
  ALERTS: 'alerts',
  SIMULATION: 'simulation',
  ANALYTICS: 'analytics',
  REPORTS: 'reports',
  USERS: 'users',
  CONFIG: 'config',
  SETTINGS: 'settings',
  FLEET: 'fleet',
  HEALTH: 'health',
};

// Main & Sub Navigation Menus
export const MENU_ITEMS = {
  operations: [
    { id: ROUTES.OVERVIEW, label: 'Home', icon: 'Home' },
    { id: ROUTES.LIVE_MONITORING, label: 'Live Monitor', icon: 'Radio', badge: 'Live' },
    { id: ROUTES.DIGITAL_TWIN, label: '3D Twin', icon: 'Box' },
    { id: ROUTES.PREDICTIONS, label: 'Predictions', icon: 'TrendingUp' },
    { id: ROUTES.ALERTS, label: 'Alerts', icon: 'Bell', hasBadgeCount: true },
    { id: ROUTES.SIMULATION, label: 'What-If Sim', icon: 'Sliders' },
    { id: ROUTES.ANALYTICS, label: 'Analytics', icon: 'BarChart3' },
    { id: ROUTES.REPORTS, label: 'Reports', icon: 'FileText' },
  ],
  adminConsole: [
    { id: ROUTES.USERS, label: 'User Mgmt', icon: 'Users', adminOnly: true },
    { id: ROUTES.CONFIG, label: 'Warehouse Config', icon: 'Layers', adminOnly: true },
    { id: ROUTES.SETTINGS, label: 'System Settings', icon: 'Settings', adminOnly: true },
  ],
  infrastructure: [
    { id: ROUTES.FLEET, label: 'AGVs', icon: 'Bot' },
    { id: ROUTES.HEALTH, label: 'Pipeline', icon: 'Database' },
  ],
};

// Status Color Tokens & Badges
export const STATUS_COLORS = {
  severity: {
    critical: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      badge: 'bg-rose-600 text-white',
      dot: 'bg-rose-500',
      hex: '#e11d48',
    },
    high: {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
      badge: 'bg-orange-500 text-white',
      dot: 'bg-orange-500',
      hex: '#f97316',
    },
    moderate: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      badge: 'bg-amber-400 text-slate-950',
      dot: 'bg-amber-400',
      hex: '#f59e0b',
    },
    low: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      badge: 'bg-emerald-500 text-white',
      dot: 'bg-emerald-500',
      hex: '#10b981',
    },
  },
  roles: {
    admin: {
      bg: 'bg-violet-50',
      text: 'text-violet-700',
      border: 'border-violet-200',
      badge: 'bg-violet-600 text-white',
    },
    user: {
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-200',
      badge: 'bg-slate-800 text-white',
    },
  },
  connectivity: {
    connected: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      dot: 'bg-emerald-500',
    },
    disconnected: {
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-200',
      dot: 'bg-rose-500',
    },
  },
};

// Default Baseline Congestion Tripwire Thresholds
export const DEFAULT_THRESHOLDS = {
  MODERATE: 40,
  HIGH: 70,
  CRITICAL: 85,
};

// API & Realtime Config (Enables 1-line switch between mock and real production API)
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/telemetry',
  USE_MOCK: import.meta.env.VITE_USE_MOCK === 'true', // Defaults to false for real live backend data
  TIMEOUT_MS: 10000,
  DSTGT_MODEL_VERSION: 'DSTGT v1.0',
};

export default {
  ROLES,
  ROLE_PERMISSIONS,
  ROUTES,
  MENU_ITEMS,
  STATUS_COLORS,
  DEFAULT_THRESHOLDS,
  API_CONFIG,
};
