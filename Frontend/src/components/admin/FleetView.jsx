import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Battery, 
  BatteryCharging, 
  Zap, 
  Navigation, 
  AlertTriangle, 
  CheckCircle2, 
  Sliders, 
  PauseCircle, 
  PlayCircle 
} from 'lucide-react';
import { API_CONFIG } from '../../config/appConfig';

export default function FleetView() {
  const [fleetStatus, setFleetStatus] = useState([
    { id: 'AGV-01', model: 'AutoCarry 1200', battery: 94, status: 'Active Haul', currentZone: 'Zone 1 (Inbound)', speed: '1.2 m/s', payload: '380 kg', task: 'Pallet Delivery to Dock 1' },
    { id: 'AGV-02', model: 'AutoCarry 1500', battery: 88, status: 'Queued / Bottleneck', currentZone: 'Zone 2 (Storage)', speed: '0.0 m/s', payload: '520 kg', task: 'Waiting in Aisle B Queue' },
    { id: 'AGV-03', model: 'AutoCarry 1200', battery: 76, status: 'Active Haul', currentZone: 'Zone 3 (Sortation)', speed: '1.2 m/s', payload: '290 kg', task: 'Sortation Loop Transit' }
  ]);
  const [emergencyStop, setEmergencyStop] = useState(false);

  // Connect to real-time WebSocket telemetry for all 22 AGVs
  useEffect(() => {
    let ws;
    try {
      ws = new WebSocket(API_CONFIG.WS_URL);
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.agvs && Array.isArray(data.agvs) && data.agvs.length > 0) {
            setFleetStatus(data.agvs.map((bot) => ({
              id: bot.id,
              model: bot.payloadKg > 350 ? 'AutoCarry 1500' : 'AutoCarry 1200',
              battery: bot.battery,
              status: bot.status === 'Navigating' ? 'Active Haul' : (bot.status === 'Queued' ? 'Queued / Bottleneck' : bot.status),
              currentZone: bot.zone,
              speed: `${bot.velocity} m/s`,
              payload: `${bot.payloadKg} kg`,
              task: bot.status === 'Queued' ? 'Waiting in Aisle B Queue' : `Delivery to ${bot.zone}`
            })));
          }
        } catch (e) {
          console.warn('WS parse error in FleetView:', e);
        }
      };
    } catch (e) {
      console.warn('WS connection error in FleetView:', e);
    }
    return () => {
      if (ws) ws.close();
    };
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 className="text-xl font-extrabold text-slate-950">Autonomous AGV / AMR Fleet</h2>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
              18 / 22 Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time battery telemetry, path dispatch, payload mass & emergency collision avoidance
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setEmergencyStop(!emergencyStop)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm ${
              emergencyStop
                ? 'bg-slate-900 text-white'
                : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{emergencyStop ? 'Resume Fleet Motion' : 'Emergency Stop Bay 3'}</span>
          </button>
        </div>
      </div>

      {/* Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fleetStatus.map((bot) => (
          <div
            key={bot.id}
            className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-mint-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 font-black text-xs flex items-center justify-center">
                    <Bot className="w-4 h-4 text-mint-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{bot.id}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">{bot.model}</span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    bot.status === 'Critical Battery'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : bot.status === 'Dynamic Reroute'
                      ? 'bg-sky-50 text-sky-700 border-sky-200'
                      : bot.status === 'Charging'
                      ? 'bg-slate-100 text-slate-600 border-slate-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {bot.status}
                </span>
              </div>

              {/* Battery Bar */}
              <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center space-x-1 text-slate-600">
                    <Battery className="w-3.5 h-3.5" />
                    <span>Battery Level</span>
                  </span>
                  <span className={`font-mono font-bold ${bot.battery < 20 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {bot.battery}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      bot.battery < 20
                        ? 'bg-rose-500'
                        : bot.battery < 50
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${bot.battery}%` }}
                  />
                </div>
              </div>

              {/* Bot Specs */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block">Current Zone:</span>
                  <strong className="text-slate-800 truncate block mt-0.5">{bot.currentZone}</strong>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block">Payload Mass:</span>
                  <strong className="text-slate-800 truncate block mt-0.5">{bot.payload}</strong>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Task: <strong className="text-slate-700">{bot.task}</strong></span>
              <span className="font-mono text-mint-700 font-bold">{bot.speed}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
