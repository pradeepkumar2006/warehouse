import React, { useState } from 'react';
import { X, Sliders, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function EditThresholdsModal({ 
  isOpen, 
  onClose, 
  thresholds, 
  onSaveThresholds 
}) {
  const [moderate, setModerate] = useState(thresholds?.moderate || 50);
  const [high, setHigh] = useState(thresholds?.high || 70);
  const [critical, setCritical] = useState(thresholds?.critical || 85);
  const [queueWarn, setQueueWarn] = useState(thresholds?.queueWarn || 12);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (onSaveThresholds) {
      onSaveThresholds({ moderate, high, critical, queueWarn });
    }
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-mint-50 border border-mint-200 text-mint-700 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Edit Alert Thresholds</h3>
              <p className="text-xs text-slate-500">Configure DSTGT Spatio-Temporal Sensitivity</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Thresholds Updated</h4>
              <p className="text-xs text-slate-500">
                New detection bounds active across all 24 spatio-temporal nodes.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              
              {/* Moderate Threshold */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                    <span>Moderate Congestion</span>
                  </span>
                  <span className="font-mono text-slate-900">{moderate}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="65"
                  value={moderate}
                  onChange={(e) => setModerate(Number(e.target.value))}
                  className="w-full accent-slate-700 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>30%</span>
                  <span>Default 50%</span>
                  <span>65%</span>
                </div>
              </div>

              {/* High Threshold */}
              <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>High Congestion Warning</span>
                  </span>
                  <span className="font-mono text-amber-900">{high}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="80"
                  value={high}
                  onChange={(e) => setHigh(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-amber-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-amber-700/60 font-mono">
                  <span>60%</span>
                  <span>Default 70%</span>
                  <span>80%</span>
                </div>
              </div>

              {/* Critical Threshold */}
              <div className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-rose-900">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span>Critical Bottleneck Alarm</span>
                  </span>
                  <span className="font-mono text-rose-900">{critical}%</span>
                </div>
                <input
                  type="range"
                  min="75"
                  max="95"
                  value={critical}
                  onChange={(e) => setCritical(Number(e.target.value))}
                  className="w-full accent-rose-600 h-1.5 bg-rose-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-rose-700/60 font-mono">
                  <span>75%</span>
                  <span>Default 85%</span>
                  <span>95%</span>
                </div>
              </div>

              {/* Queue Length Warning */}
              <div className="p-3.5 rounded-2xl bg-violet-50/50 border border-violet-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-violet-900">
                  <span>Pallet Queue Cap per Bay</span>
                  <span className="font-mono text-violet-900">{queueWarn} pallets</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="25"
                  value={queueWarn}
                  onChange={(e) => setQueueWarn(Number(e.target.value))}
                  className="w-full accent-violet-600 h-1.5 bg-violet-200 rounded-lg cursor-pointer"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold mint-gradient-btn text-slate-950 rounded-xl shadow-sm"
                >
                  Apply & Recalibrate
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
