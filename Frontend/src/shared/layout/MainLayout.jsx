import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import ToastContainer from '../components/ToastContainer';
import ProfileModal from '../../components/user/ProfileModal';

export default function MainLayout({
  activeTab,
  onSelectTab,
  activeTitle,
  currentUser,
  onLogout,
  onSwitchRole,
  toasts = [],
  onRemoveToast,
  alertsCount = 5,
  onShowToast,
  children,
}) {
  const isAdmin = currentUser?.role === 'admin';
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#f4f5f9] text-slate-900 font-sans selection:bg-mint-400 selection:text-slate-950 relative">
      
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onRemove={onRemoveToast} />

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        currentUser={currentUser}
        onLogout={onLogout}
        onSwitchRole={onSwitchRole}
        alertsCount={alertsCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f4f5f9] overflow-y-auto max-h-screen">
        
        {/* Persistent Top Header with Violet Admin Badge */}
        <Header
          activeTitle={activeTitle}
          isAdmin={isAdmin}
          currentUser={currentUser}
          onSwitchRole={onSwitchRole}
          onNavigateAlerts={() => onSelectTab('alerts')}
          alertsCount={alertsCount}
          onOpenProfile={() => setIsProfileOpen(true)}
          onLogout={onLogout}
        />

        {/* Page Canvas */}
        <main className={`flex-1 ${activeTab === 'digital-twin' ? 'p-4 sm:p-6 max-w-full' : 'p-6 sm:p-8 lg:p-10 max-w-7xl'} w-full mx-auto`}>
          {children}
        </main>

      </div>

      {/* Profile Modal for both Roles (U9) */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        onShowToast={onShowToast}
      />

    </div>
  );
}
