/**
 * Central Audit Trail Service (A11 & Global Admin Rule)
 */
import apiClient from './apiClient';

export const auditService = {
  async getAuditLogs() {
    return apiClient.get(
      '/audit/logs',
      [
        { id: 'LOG-101', user: 'admin', action: 'Changed High threshold 70 to 75', module: 'Warehouse Config', time: '10:42', ip: '192.168.1.5' },
        { id: 'LOG-102', user: 'admin', action: 'Acknowledged Alert #ALT-904 in Aisle B', module: 'Bottleneck Alerts', time: '10:15', ip: '192.168.1.5' },
        { id: 'LOG-103', user: 'david.chen', action: 'Generated Weekly Congestion PDF report', module: 'Reports', time: '09:48', ip: '192.168.1.22' },
        { id: 'LOG-104', user: 'admin', action: 'Retrained DSTGT model to v1.02', module: 'Model Engine', time: '09:12', ip: '192.168.1.5' },
        { id: 'LOG-105', user: 'sam.haddad', action: 'Simulated reroute fix for 12 AGVs', module: 'What-If Sim', time: '08:30', ip: '192.168.1.18' },
      ],
      150
    );
  },

  async logAction(action, module, user = 'admin') {
    return apiClient.post(
      '/audit/logs',
      { action, module, user, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), ip: '192.168.1.5' },
      { success: true },
      50
    );
  },
};

export default auditService;
