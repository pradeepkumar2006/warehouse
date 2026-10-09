/**
 * Authentication & Session Service
 */
import apiClient from './apiClient';

const MOCK_USERS = {
  admin: {
    username: 'admin',
    role: 'admin',
    displayName: 'Sarah Lin',
    email: 'admin@twinflow.ai',
    accessLevel: 'Full Administrative & Topology Access',
  },
  operator: {
    username: 'operator',
    role: 'user',
    displayName: 'Sam Haddad',
    email: 'operator@twinflow.ai',
    accessLevel: 'Real-time Congestion Monitoring',
  },
};

export const authService = {
  async login({ username, password }) {
    return apiClient.post(
      '/auth/login',
      { username, password },
      () => {
        const user = MOCK_USERS[username.toLowerCase()] || {
          username,
          role: 'user',
          displayName: username,
          email: `${username}@twinflow.ai`,
          accessLevel: 'Standard Operations Access',
        };
        apiClient.setToken(`mock-token-${Date.now()}`);
        return { success: true, user, token: 'mock-jwt-token' };
      },
      300
    );
  },

  async logout() {
    apiClient.setToken(null);
    return apiClient.post('/auth/logout', null, { success: true }, 100);
  },

  getMockPersona(role = 'admin') {
    return role === 'admin' ? MOCK_USERS.admin : MOCK_USERS.operator;
  },
};

export default authService;
