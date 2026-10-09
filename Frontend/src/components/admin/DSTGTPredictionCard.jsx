import React, { useState } from 'react';
import { 
  Cpu, 
  TrendingUp, 
  AlertOctagon, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  GitFork, 
  Sliders, 
  RotateCcw
} from 'lucide-react';

export default function DSTGTPredictionCard({ 
  simulatedRerouteActive, 
  onToggleReroute 
}) {
  const [forecastHorizon, setForecastHorizon] = useState('30m'); // '15m' | '30m' | '45m' | '60m'

  // Prediction stats based on horizon and reroute status
  const forecastData = {
    '15m': {
      risk: 'Low',
      riskScore: simulatedRerouteActive ? 18 : 62,
      chokepoint: 'Junction J-04 (Sortation Buffer)',
      expectedDelay: simulatedRerouteActive ? '-0.2m' : '+4.5m',
      flowEfficiency: simulatedRerouteActive ? '98.2%' : '84.0%',
    },
    '30m': {
      risk: simulatedRerouteActive ? 'Low' : 'Critical',
      riskScore: simulatedRerouteActive ? 22 : 88,
      chokepoint: 'Junction J-04 (Sortation Buffer)',
      expectedDelay: simulatedRerouteActive ? '-0.5m' : '+12.8m',
      flowEfficiency: simulatedRerouteActive ? '97.5%' : '67.2%',
    },
    '45m': {
      risk: simulatedRerouteActive ? 'Moderate' : 'Severe',
      riskScore: simulatedRerouteActive ? 34 : 94,
      chokepoint: 'Aisle Racks B1 & Dispatch D1',
      expectedDelay: simulatedRerouteActive ? '+1.2m' : '+18.4m',
      flowEfficiency: simulatedRerouteActive ? '92.0%' : '58.1%',
    },
    '60m': {
      risk: simulatedRerouteActive ? 'Moderate' : 'Cascading Gridlock',
      riskScore: simulatedRerouteActive ? 41 : 98,
      chokepoint: 'Full Inbound-to-Outbound Spine',
      expectedDelay: simulatedRerouteActive ? '+2.0m' : '+28.0m',
      flowEfficiency: simulatedRerouteActive ? '89.4%' : '44.3%',
    },
  };

  const currentForecast = forecastData[forecastHorizon];

  return (
    <div className="rounded-3xl bg-white border border-slate-200/90 p-5 shadow-sm flex flex-col justify-between space-y-4">
      {/* Card Header */}
      <div>
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-mint-50 text-mint-700 border border-mint-200 flex items-center justify-center font-bold">
              <Cpu className="w-4 h-4 text-mint-700" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>DSTGT Spatio-Temporal Prediction</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-mint-50 text-mint-700 border border-mint-200 font-mono font-semibold">
                  v1.0 AI
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Dynamic graph attention model predicting warehouse bottlenecks
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            {['15m', '30m', '45m', '60m'].map((time) => (
              <button
                key={time}
                onClick={() => setForecastHorizon(time)}
                className={`px-2.5 py-1 rounded-lg font-mono font-semibold transition-all ${
                  forecastHorizon === time
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                +{time}
              </button>
            ))}
          </div>
        </div>

        {/* Prediction Status Summary */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-medium">Predicted Congestion Level</span>
              <div className="flex items-center space-x-2">
                <span
                  className={`text-2xl font-black font-mono ${
                    currentForecast.riskScore > 75
                      ? 'text-rose-600'
                      : currentForecast.riskScore > 50
                      ? 'text-amber-600'
                      : 'text-emerald-600'
                  }`}
                >
                  {currentForecast.riskScore}%
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                    currentForecast.riskScore > 75
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : currentForecast.riskScore > 50
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {currentForecast.risk} Risk
                </span>
              </div>
            </div>

            <div className="text-right space-y-1">
              <span className="text-xs text-slate-500 font-medium">Forecast Horizon</span>
              <div className="text-sm font-bold text-slate-900 flex items-center justify-end space-x-1">
                <Clock className="w-3.5 h-3.5 text-mint-600" />
                <span>Next {forecastHorizon}</span>
              </div>
              <span className="text-[11px] text-slate-500">
                Flow Efficiency: <strong className="text-slate-900">{currentForecast.flowEfficiency}</strong>
              </span>
            </div>
          </div>

          {/* Progress Bar Visual */}
          <div className="mt-3.5 w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                currentForecast.riskScore > 75
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                  : currentForecast.riskScore > 50
                  ? 'bg-gradient-to-r from-mint-500 to-amber-500'
                  : 'bg-gradient-to-r from-mint-500 to-emerald-500'
              }`}
              style={{ width: `${currentForecast.riskScore}%` }}
            />
          </div>
        </div>

        {/* Explainable AI Diagnosis Box */}
        <div className="mt-3.5 p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span className="flex items-center space-x-1.5 text-slate-900">
              <Sparkles className="w-3.5 h-3.5 text-mint-600" />
              <span>Explainable AI (XAI) Bottleneck Insights</span>
            </span>
            <span className="text-[11px] font-mono text-slate-500 font-normal">Confidence: 96.4%</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {simulatedRerouteActive ? (
              <span className="text-emerald-800 font-medium">
                ✅ <strong>Optimization Active:</strong> High-density pallet traffic redirected through Aisle Bypass Lane. Chokepoint congestion reduced by <strong>66%</strong>.
              </span>
            ) : (
              <span>
                ⚠️ <strong>Predicted Bottleneck:</strong> 6 AGVs scheduled to intersect at <span className="text-rose-600 font-bold">{currentForecast.chokepoint}</span> simultaneously between T+20m and T+35m due to picking batch completion at Aisle A2.
              </span>
            )}
          </p>

          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/80">
            <span>Primary Chokepoint: <strong className="text-slate-800">{currentForecast.chokepoint}</strong></span>
            <span>Est. Delay: <strong className={currentForecast.expectedDelay.startsWith('+') ? 'text-rose-600' : 'text-emerald-600'}>{currentForecast.expectedDelay}</strong></span>
          </div>
        </div>
      </div>

      {/* AI What-If Simulation Action Box */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-mint-50/60 via-white to-slate-50 border border-mint-200 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GitFork className="w-4 h-4 text-mint-700" />
            <h4 className="text-xs font-bold text-slate-900">AI What-If Simulation & Rerouting</h4>
          </div>
          <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded-full bg-white text-mint-800 border border-mint-200">
            {simulatedRerouteActive ? 'Simulation Applied' : 'Recommendation Ready'}
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          {simulatedRerouteActive
            ? 'Dynamic graph rerouting policy is currently in effect. Bottleneck has cleared.'
            : 'DSTGT recommends rerouting AGV-02 and AGV-03 through Aisle Bypass to eliminate the predicted 12.8m delay.'}
        </p>

        <button
          type="button"
          onClick={onToggleReroute}
          className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
            simulatedRerouteActive
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
              : 'mint-gradient-btn text-slate-950 shadow-md shadow-mint-500/20'
          }`}
        >
          {simulatedRerouteActive ? (
            <>
              <RotateCcw className="w-4 h-4" />
              <span>Reset to Standard Routing (Simulate Bottleneck)</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Deploy Dynamic AI Reroute (Clear Congestion)</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
