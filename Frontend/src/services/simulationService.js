/**
 * What-If Simulation Service (A6)
 */
import apiClient from './apiClient';

export const simulationService = {
  async runSimulation(params) {
    return apiClient.post(
      '/simulation/run',
      params,
      (payload) => {
        const agvDelta = (payload?.agvCount || 18) - 18;
        const volumeDelta = (payload?.orderVolumeChange || 0) / 100;
        const closedCount = (payload?.closedAisles || []).length;

        const simulatedRisk = Math.min(
          99,
          Math.max(15, Math.round(87 - agvDelta * 1.8 + volumeDelta * 28 + closedCount * 14))
        );
        const delay = Math.max(1.2, (6.4 - agvDelta * 0.2 + volumeDelta * 2.5 + closedCount * 1.1).toFixed(1));

        return {
          success: true,
          before: { risk: 87, queue: 22, leadTime: '14.2 min', delay: 6.4 },
          after: { risk: simulatedRisk, queue: Math.max(5, Math.round(22 - agvDelta * 0.8 + volumeDelta * 8)), leadTime: '11.8 min', delay },
          impact: simulatedRisk < 87 ? 'Net Congestion Reduction: -' + (87 - simulatedRisk) + '%' : 'Congestion Surge Expected',
        };
      },
      350
    );
  },

  async getSavedScenarios() {
    return apiClient.get(
      '/simulation/scenarios',
      [
        {
          id: 'SCEN-01',
          name: 'Peak Holiday Inflow (+40%)',
          agvs: 24,
          volume: '+40%',
          closed: 'None',
          expectedRisk: 72,
          date: '2026-10-04',
        },
        {
          id: 'SCEN-02',
          name: 'Aisle B Maintenance Bypass',
          agvs: 20,
          volume: '0%',
          closed: 'Aisle B',
          expectedRisk: 65,
          date: '2026-10-03',
        },
      ],
      150
    );
  },
};

export default simulationService;
