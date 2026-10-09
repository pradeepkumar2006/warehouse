import React, { useState } from 'react';
import { X, FileText, Download, CheckCircle2, Calendar, FileSpreadsheet, Loader2 } from 'lucide-react';

export default function GenerateReportModal({ isOpen, onClose }) {
  const [reportType, setReportType] = useState('congestion'); // 'congestion' | 'fleet' | 'audit'
  const [format, setFormat] = useState('pdf');
  const [timeRange, setTimeRange] = useState('24h');
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setDownloadReady(true);
      setTimeout(() => {
        setDownloadReady(false);
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-mint-50 border border-mint-200 text-mint-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Generate Intelligence Report</h3>
              <p className="text-xs text-slate-500">Warehouse Spatio-Temporal Metrics</p>
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
        <div className="p-6 space-y-4">
          {downloadReady ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Report Exported Successfully</h4>
              <p className="text-xs text-slate-500">
                TwinFlow_{reportType}_report_{timeRange}.{format} downloaded to your system.
              </p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Report Scope</label>
                <div className="space-y-2">
                  {[
                    { id: 'congestion', label: 'Congestion & Bottlenecks', desc: 'DSTGT forecast analysis, peak chokepoint telemetry' },
                    { id: 'fleet', label: 'AGV Fleet Utilization', desc: 'Battery depletion rates, travel distances, idle time' },
                    { id: 'audit', label: 'Security & Access Audit', desc: 'Operator actions, route override timestamps' },
                  ].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setReportType(item.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        reportType === item.id
                          ? 'bg-mint-50/60 border-mint-400 shadow-xs'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{item.label}</span>
                        {reportType === item.id && <span className="w-2 h-2 rounded-full bg-mint-500" />}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Time Horizon</label>
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-mint-500"
                  >
                    <option value="6h">Past 6 Hours</option>
                    <option value="24h">Past 24 Hours</option>
                    <option value="7d">Past 7 Days</option>
                    <option value="30d">Past 30 Days</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-mint-500"
                  >
                    <option value="pdf">PDF Document (.pdf)</option>
                    <option value="csv">CSV Raw Data (.csv)</option>
                    <option value="xlsx">Excel Workbook (.xlsx)</option>
                  </select>
                </div>
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
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="px-5 py-2 text-xs font-bold mint-gradient-btn text-slate-950 rounded-xl shadow-sm flex items-center space-x-1.5"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                      <span>Generating Report...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 text-slate-950" />
                      <span>Export Report</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
