/**
 * Analytics & Historical Performance Service (A7)
 */
import apiClient from './apiClient';

export const analyticsService = {
  async getMetrics(dateRange = '7d', zone = 'All Zones') {
    return apiClient.get(
      `/analytics/metrics?range=${dateRange}&zone=${zone}`,
      {
        predictionAccuracy: 92.4,
        avgLeadTimeMin: 14.0,
        bottlenecksPrevented: 37,
        avgAlertResponseTimeMin: 3.2,
        chartData: {
          congestionTrend: [70, 50, 85, 60, 40, 75, 30],
          predictedVsActual: {
            predicted: [75, 65, 40, 45, 50, 25, 20],
            actual: [80, 68, 45, 42, 55, 30, 25],
          },
        },
      },
      200
    );
  },
};

export default analyticsService;
