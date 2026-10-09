import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  KeyRound, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Mail,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

export default function ProfileModal({ 
  isOpen, 
  onClose, 
  currentUser, 
  onShowToast 
}) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen) return null;

  const isAdmin = currentUser?.role === 'admin';

  const handleChangePassword = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!currentPassword) {
      setErrorMsg('Please enter your current password.');
      return;
    }
    if (!newPassword) {
      setErrorMsg('Please enter a new password.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirmation do not match.');
      return;
    }

    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      if (onShowToast) {
        onShowToast('Password updated successfully!', 'success');
      }
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-7 text-slate-900 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-xs ${
              isAdmin ? 'bg-violet-600' : 'bg-slate-900'
            }`}>
              <User className="w-5 h-5 text-mint-400" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-950 tracking-tight">
                My Profile & Account Settings
              </h2>
              <p className="text-xs text-slate-500">
                Manage your credentials, permissions, and security parameters
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Identity Details Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white font-black text-xl flex items-center justify-center border-2 border-white shadow-md">
              {currentUser?.username?.slice(0, 2).toUpperCase() || 'OP'}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-extrabold text-slate-950">
                  {currentUser?.displayName || 'Warehouse Lead Operator'}
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  isAdmin 
                    ? 'bg-violet-50 text-violet-700 border-violet-200' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {isAdmin ? 'System Administrator' : 'Operator (User)'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentUser?.email || 'user@twinflow.ai'}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-200/60 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Username</span>
              <strong className="text-slate-900 font-mono text-xs">{currentUser?.username || 'operator'}</strong>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Role (Read-Only)</span>
              <div className="flex items-center space-x-1 mt-0.5">
                <Lock className="w-3 h-3 text-slate-400" />
                <strong className="text-slate-900 font-bold capitalize">{currentUser?.role || 'user'}</strong>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Access Tier</span>
              <span className="text-slate-700 text-[11px] truncate block">
                {isAdmin ? 'Root Administration' : 'Operational Floor View'}
              </span>
            </div>
          </div>
        </div>

        {/* Permissions Overview (Read-Only) */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-800 block">Assigned Permissions & Capabilities</span>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="text-slate-700 font-medium">Real-Time Telemetry & Aisles</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="text-slate-700 font-medium">3D Spatial Twin & Dynamic Simulation</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="text-slate-700 font-medium">Alert Triage & Acknowledging</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="text-slate-700 font-medium">Operational Reports Viewer</span>
            </div>
          </div>
        </div>

        {/* Change Password Section */}
        <form onSubmit={handleChangePassword} className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center space-x-2">
            <KeyRound className="w-4 h-4 text-mint-600" />
            <h3 className="text-sm font-extrabold text-slate-950">Change Password</h3>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-3">
            {/* Current Password */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 outline-none focus:border-slate-900 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter minimum 6 characters"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 outline-none focus:border-slate-900 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 outline-none focus:border-slate-900 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
            >
              {isUpdating ? 'Updating Password...' : 'Update Password'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
