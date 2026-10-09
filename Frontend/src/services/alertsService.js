/**
 * Bottleneck Alerts Service (A5)
 */
import apiClient from './apiClient';

export const alertsService = {
  async getAlerts() {
    return apiClient.get(
      '/alerts',
      [
        {
          id: 'ALT-901',
          severity: 'Critical',
          title: 'Aisle B congestion expected',
          location: 'Aisle B (Racks B1-B8)',
          eta: 'in 12 min',
          confidence: 89,
          status: 'New',
          assignedTo: 'Sam Haddad',
          createdTime: '10:32 AM',
          expectedDelay: '6.4 min delay',
          affectedZones: ['Zone 2 (Storage)', 'Zone 3 (Sortation)'],
          rootCauses: [
            { feature: 'Aisle B Occupancy', value: '88% (Threshold > 70%)' },
            { feature: 'Queue Length', value: '22 AGVs in queue' },
            { feature: 'Conveyor Load', value: '92% motorized speed' },
          ],
        },
        {
          id: 'ALT-902',
          severity: 'High',
          title: 'Sortation feed rate overload',
          location: 'Junction J-04 (Sortation Hub)',
          eta: 'in 24 min',
          confidence: 76,
          status: 'Acknowledged',
          assignedTo: 'Marcus Vance',
          createdTime: '10:20 AM',
          expectedDelay: '4.1 min delay',
          affectedZones: ['Zone 3 (Sortation)'],
          rootCauses: [
            { feature: 'Order Wave Surge', value: '+35% inflow' },
            { feature: 'Buffer Rack Fill', value: '82%' },
          ],
        },
        {
          id: 'ALT-903',
          severity: 'Medium',
          title: 'Dock 2 inbound queue buildup',
          location: 'Inbound Dock 2',
          eta: 'in 45 min',
          confidence: 68,
          status: 'Resolved',
          assignedTo: 'Sarah Lin',
          createdTime: '09:45 AM',
          expectedDelay: '2.5 min delay',
          affectedZones: ['Zone 1 (Inbound)'],
          rootCauses: [{ feature: 'Pallet Delivery Surge', value: '4 trucks staged' }],
        },
      ],
      200
    );
  },

  async acknowledgeAlert(id) {
    return apiClient.post(`/alerts/${id}/acknowledge`, {}, { success: true, id, status: 'Acknowledged' }, 150);
  },

  async resolveAlert(id) {
    return apiClient.post(`/alerts/${id}/resolve`, {}, { success: true, id, status: 'Resolved' }, 150);
  },

  async deleteAlert(id) {
    return apiClient.delete(`/alerts/${id}`, { success: true, id }, 150);
  },
};

export default alertsService;
