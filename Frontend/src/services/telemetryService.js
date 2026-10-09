/**
 * Telemetry & Sensor Stream Service (A2 & Digital Twin)
 */
import apiClient from './apiClient';

export const telemetryService = {
  async getLiveStats() {
    return apiClient.get(
      '/telemetry/live',
      {
        activeAgvs: 18,
        totalAgvs: 22,
        avgQueueLength: 14,
        activeAlertsCount: 5,
        kafkaPipelineStatus: 'Connected',
        fps: 60,
      },
      100
    );
  },
};

export default telemetryService;
