import { useState } from 'react';
import { authService } from '../../../services';

export function useAuth(initialUser = null) {
  const [currentUser, setCurrentUser] = useState(initialUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.login({ username, password });
      setCurrentUser(res.user);
      return res.user;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
  };

  const switchRole = () => {
    if (!currentUser) return;
    const newRole = currentUser.role === 'admin' ? 'user' : 'admin';
    const persona = authService.getMockPersona(newRole);
    setCurrentUser(persona);
  };

  return {
    currentUser,
    setCurrentUser,
    isAdmin: currentUser?.role === 'admin',
    loading,
    error,
    login,
    logout,
    switchRole,
  };
}

export default useAuth;
