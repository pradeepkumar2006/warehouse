/**
 * User Access Management Service (A9)
 */
import apiClient from './apiClient';

export const userService = {
  async getUsers() {
    return apiClient.get(
      '/users',
      [
        { id: 'USR-01', name: 'Sarah Lin', username: 'admin', role: 'Admin', status: 'Active', lastLogin: 'Just now', email: 'admin@twinflow.ai' },
        { id: 'USR-02', name: 'David Chen', username: 'david.chen', role: 'Admin', status: 'Active', lastLogin: '2 hours ago', email: 'd.chen@twinflow.ai' },
        { id: 'USR-03', name: 'Sam Haddad', username: 'sam.haddad', role: 'User', status: 'Active', lastLogin: '15 mins ago', email: 'sam.haddad@twinflow.ai' },
        { id: 'USR-04', name: 'Marcus Vance', username: 'marcus.vance', role: 'User', status: 'Active', lastLogin: '1 hour ago', email: 'm.vance@twinflow.ai' },
        { id: 'USR-05', name: 'Elena Rostova', username: 'elena.rostova', role: 'User', status: 'Active', lastLogin: 'Yesterday', email: 'e.rostova@twinflow.ai' },
        { id: 'USR-06', name: 'Ramesh Kumar', username: 'ramesh.kumar', role: 'User', status: 'Active', lastLogin: '3 days ago', email: 'r.kumar@twinflow.ai' },
        { id: 'USR-07', name: 'Lucas Mayer', username: 'lucas.mayer', role: 'User', status: 'Active', lastLogin: '5 days ago', email: 'l.mayer@twinflow.ai' },
        { id: 'USR-08', name: 'Maya Patel', username: 'maya.patel', role: 'User', status: 'Disabled', lastLogin: '2 weeks ago', email: 'm.patel@twinflow.ai' },
      ],
      200
    );
  },

  async createUser(userData) {
    return apiClient.post('/users', userData, { success: true, user: userData }, 250);
  },

  async updateUser(id, updates) {
    return apiClient.put(`/users/${id}`, updates, { success: true, updates }, 200);
  },

  async deleteUser(id) {
    return apiClient.delete(`/users/${id}`, { success: true, id }, 200);
  },
};

export default userService;
