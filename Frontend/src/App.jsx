import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

export default function App() {
  // Current user state (null when on login page)
  const [currentUser, setCurrentUser] = useState(null);

  // Handle successful login from LoginPage
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
  };

  // Direct preview of Dashboard mockup (from header button on login page)
  const handleDirectDashboardPreview = (role = 'admin') => {
    if (role === 'admin') {
      setCurrentUser({
        username: 'admin',
        role: 'admin',
        displayName: 'Warehouse System Admin',
        email: 'admin@twinflow.ai',
        accessLevel: 'Full Administrative & Topology Access',
      });
    } else {
      setCurrentUser({
        username: 'operator',
        role: 'user',
        displayName: 'Floor Lead Operator',
        email: 'operator@twinflow.ai',
        accessLevel: 'Real-time Congestion Monitoring',
      });
    }
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Quick switch role between Admin & Operator while on Dashboard
  const handleSwitchRole = () => {
    if (!currentUser) return;
    if (currentUser.role === 'admin') {
      setCurrentUser({
        username: 'operator',
        role: 'user',
        displayName: 'Floor Lead Operator',
        email: 'operator@twinflow.ai',
        accessLevel: 'Real-time Congestion Monitoring',
      });
    } else {
      setCurrentUser({
        username: 'admin',
        role: 'admin',
        displayName: 'Warehouse System Admin',
        email: 'admin@twinflow.ai',
        accessLevel: 'Full Administrative & Topology Access',
      });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {!currentUser ? (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onDirectDashboardPreview={handleDirectDashboardPreview}
        />
      ) : (
        <Dashboard
          currentUser={currentUser}
          onLogout={handleLogout}
          onSwitchRole={handleSwitchRole}
        />
      )}
    </div>
  );
}
