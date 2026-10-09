/**
 * Reports & Intelligence Export Service (A8)
 */
import apiClient from './apiClient';

export const reportsService = {
  async getReports() {
    return apiClient.get(
      '/reports',
      [
        {
          id: 'REP-001',
          name: 'Q3 Congestion Weekly Audit',
          type: 'Weekly Congestion',
          date: '2026-10-06',
          format: 'PDF',
          createdBy: 'Sarah Lin (Admin)',
          status: 'Ready',
          size: '2.4 MB',
        },
        {
          id: 'REP-002',
          name: 'DSTGT Model Accuracy Benchmark',
          type: 'Model Performance',
          date: '2026-10-05',
          format: 'CSV',
          createdBy: 'Sarah Lin (Admin)',
          status: 'Ready',
          size: '840 KB',
        },
        {
          id: 'REP-003',
          name: 'Shift Bottleneck & Alert Log',
          type: 'Alert History',
          date: '2026-10-04',
          format: 'PDF',
          createdBy: 'Sam Haddad (Lead)',
          status: 'Ready',
          size: '3.1 MB',
        },
      ],
      200
    );
  },

  async generateReport(payload) {
    return apiClient.post('/reports/generate', payload, {
      success: true,
      reportId: `REP-${Date.now()}`,
      status: 'Generating',
    }, 300);
  },

  async deleteReport(id) {
    return apiClient.delete(`/reports/${id}`, { success: true, id }, 150);
  },
};

export default reportsService;
