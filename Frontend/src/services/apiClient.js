/**
 * TwinFlow Unified API Client
 * Centralized HTTP and mock dispatcher.
 * When API_CONFIG.USE_MOCK is true, it simulates latency and returns typed mock data.
 * When API_CONFIG.USE_MOCK is false, it executes real fetch requests against backend.
 */

import { API_CONFIG } from '../config/appConfig';

class ApiClient {
  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.useMock = API_CONFIG.USE_MOCK;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  setUseMock(value) {
    this.useMock = Boolean(value);
  }

  // Simulated latency for smooth UX demonstration
  async simulateLatency(ms = 250) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Central request dispatcher
  async request({ endpoint, method = 'GET', data = null, mockResponse = null, latency = 250 }) {
    if (this.useMock || mockResponse !== null) {
      await this.simulateLatency(latency);
      if (typeof mockResponse === 'function') {
        return mockResponse(data);
      }
      return mockResponse;
    }

    // Real API fetch
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
    };

    const config = {
      method,
      headers,
      ...(data ? { body: JSON.stringify(data) } : {}),
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.message || `Request failed with status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn(`[ApiClient] Error contacting ${url}, falling back to mock if provided:`, error);
      if (mockResponse !== null) {
        return typeof mockResponse === 'function' ? mockResponse(data) : mockResponse;
      }
      throw error;
    }
  }

  get(endpoint, mockResponse, latency) {
    return this.request({ endpoint, method: 'GET', mockResponse, latency });
  }

  post(endpoint, data, mockResponse, latency) {
    return this.request({ endpoint, method: 'POST', data, mockResponse, latency });
  }

  put(endpoint, data, mockResponse, latency) {
    return this.request({ endpoint, method: 'PUT', data, mockResponse, latency });
  }

  patch(endpoint, data, mockResponse, latency) {
    return this.request({ endpoint, method: 'PATCH', data, mockResponse, latency });
  }

  delete(endpoint, mockResponse, latency) {
    return this.request({ endpoint, method: 'DELETE', mockResponse, latency });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
