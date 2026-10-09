import React, { useState } from 'react';
import { X, Mail, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [emailOrUser, setEmailOrUser] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailOrUser.trim()) return;
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setEmailOrUser('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-mint-50 flex items-center justify-center text-mint-600 border border-mint-200">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Reset Password</h3>
              <p className="text-xs text-slate-500">TwinFlow Warehouse Security</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                Enter your warehouse operator username or registered corporate email. We'll dispatch a secure reset token approved by the system administrator.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Username or Work Email
                </label>
                <input
                  type="text"
                  value={emailOrUser}
                  onChange={(e) => setEmailOrUser(e.target.value)}
                  placeholder="e.g. operator or admin@twinflow.ai"
                  required
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-mint-500 focus:border-transparent transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start space-x-2.5 text-xs text-amber-800">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  For urgent kiosk or autonomous AGV operator recovery, please reach out directly to the shift supervisor at Extension #402.
                </span>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all flex items-center space-x-1.5 shadow-sm"
                >
                  <span>Send Reset Link</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            <div className="py-4 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-mint-100 text-mint-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Reset Instructions Sent</h4>
              <p className="text-sm text-slate-600">
                A verification link has been queued for <strong className="text-slate-800">{emailOrUser}</strong>. Please check your inbox or notify your warehouse IT admin.
              </p>
              <div className="pt-3">
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all"
                >
                  Back to Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
