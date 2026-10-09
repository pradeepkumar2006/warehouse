import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer({ toasts = [], onRemove }) {
  if (!toasts.length) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-center space-x-3 text-xs font-bold transition-all animate-slideIn ${
              isError
                ? 'bg-rose-50 text-rose-950 border-rose-200 shadow-rose-500/10'
                : isInfo
                ? 'bg-blue-50 text-blue-950 border-blue-200 shadow-blue-500/10'
                : 'bg-white text-slate-950 border-slate-200 shadow-slate-900/10'
            }`}
          >
            <div className="shrink-0">
              {isError ? (
                <AlertCircle className="w-4 h-4 text-rose-600" />
              ) : isInfo ? (
                <Info className="w-4 h-4 text-blue-600" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              )}
            </div>
            <div className="flex-1 font-medium leading-tight">
              {toast.message}
            </div>
            {onRemove && (
              <button
                onClick={() => onRemove(toast.id)}
                className="text-slate-400 hover:text-slate-700 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
