import React from 'react';
import { AlertCircle, AlertTriangle, Trash2, X } from 'lucide-react';
import Button from './Button';

export default function ConfirmModal({
  isOpen,
  title = 'Confirm Action',
  description = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // 'danger' | 'warning' | 'primary'
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  const isDanger = variant === 'danger';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-4">
        
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold ${
            isDanger ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
          }`}>
            {isDanger ? <AlertCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-950">{title}</h3>
            {isDanger && <p className="text-xs text-rose-600 font-bold">This action cannot be undone.</p>}
          </div>
        </div>

        <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center justify-end space-x-2 pt-2">
          <Button variant="secondary" size="sm" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button
            variant={isDanger ? 'danger' : 'primary'}
            size="sm"
            onClick={onConfirm}
            icon={isDanger ? Trash2 : null}
          >
            {confirmText}
          </Button>
        </div>

      </div>
    </div>
  );
}
