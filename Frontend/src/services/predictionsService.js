/**
 * AI Predictions & Explainability Service (DSTGT v1.0)
 */
import apiClient from './apiClient';

export const predictionsService = {
  async getLivePrediction() {
    return apiClient.get(
      '/predictions/live',
      {
        congestionProbability: 87,
        bottleneckLocation: 'Aisle B (Hotspot Central)',
        queueLength: 22,
        queueHorizonMin: 15,
        delayTime: 6.4,
        confidence: 91,
        riskLabel: 'High Risk',
        updatedSecondsAgo: 5,
        influentialFeatures: [
          { name: 'Aisle B Occupancy', weight: 0.32, color: 'bg-rose-500' },
          { name: 'AGV Count', weight: 0.24, color: 'bg-amber-500' },
          { name: 'Queue Length', weight: 0.18, color: 'bg-blue-500' },
          { name: 'Order Volume', weight: 0.15, color: 'bg-emerald-500' },
          { name: 'Conveyor Load', weight: 0.11, color: 'bg-purple-500' },
        ],
        modelInfo: {
          name: 'DSTGT v1.0',
          lastTrainedDate: '2026-10-02',
          trainingDataSize: '4.8M graph states',
          accuracy: 92.4,
          f1Score: 0.89,
          mae: '1.42 min',
        },
      },
      200
    );
  },

  async retrainModel() {
    return apiClient.post(
      '/predictions/retrain',
      {},
      {
        success: true,
        jobId: `JOB-${Date.now()}`,
        status: 'Started',
        etaSeconds: 180,
      },
      400
    );
  },
};

export default predictionsService;
