/**
 * Warehouse Configuration Service (A10)
 */
import apiClient from './apiClient';
import { DEFAULT_THRESHOLDS } from '../config/appConfig';

export const configService = {
  async getConfig() {
    return apiClient.get(
      '/config',
      {
        thresholds: {
          moderate: DEFAULT_THRESHOLDS.MODERATE,
          high: DEFAULT_THRESHOLDS.HIGH,
          critical: DEFAULT_THRESHOLDS.CRITICAL,
        },
        aisles: [
          { id: 'AISLE-A', name: 'Aisle A (Inbound)', zone: 'Zone 1 (Inbound)', capacity: 45, status: 'Active', x: 20, y: 30 },
          { id: 'AISLE-B', name: 'Aisle B (Hotspot Central)', zone: 'Zone 2 (Storage)', capacity: 60, status: 'Active', x: 50, y: 30 },
          { id: 'AISLE-C', name: 'Aisle C (Buffer Storage)', zone: 'Zone 2 (Storage)', capacity: 55, status: 'Active', x: 20, y: 70 },
          { id: 'AISLE-D', name: 'Aisle D (Sortation Feed)', zone: 'Zone 3 (Sortation)', capacity: 40, status: 'Active', x: 50, y: 70 },
        ],
      },
      150
    );
  },

  async saveConfig(newConfig) {
    return apiClient.put('/config', newConfig, { success: true, timestamp: Date.now() }, 300);
  },
};

export default configService;
