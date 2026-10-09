import React, { useState } from 'react';
import { 
  Database, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Radio, 
  Activity, 
  Server, 
  Wifi, 
  ShieldCheck 
} from 'lucide-react';

export default function SystemHealthView({ isKafkaDown, onToggleKafka }) {
  const [isRetraining, setIsRetraining] = useState(false);
  const [retrainProgress, setRetrainProgress] = useState(0);

  const handleRetrain = () => {
    setIsRetraining(true);
    setRetrainProgress(10);
    const interval = setInterval(() => {
      setRetrainProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRetraining(false);
          return 100;
        }
        return prev + 20;
      });
    }, 400);
  };

  const sources = [
    { name: 'WMS ERP Ingestion', protocol: 'REST / GraphQL', status: 'Online', latency: '28ms', packets: '1.4M / hr' },
    { name: 'Optical IoT Corridor Sensors', protocol: 'MQTT / Zigbee', status: 'Online', latency: '12ms', packets: '8.2M / hr' },
    { name: 'AMR Fleet Telemetry Bus', protocol: 'ROS2 / WebSockets', status: 'Online', latency: '8ms', packets: '4.6M / hr' },
    { 
      name: 'Apache Kafka Event Stream', 
      protocol: 'Kafka Cluster v3.4', 
      status: isKafkaDown ? 'Disconnected' : 'Online', 
      latency: isKafkaDown ? 'TIMEOUT' : '16ms', 
      packets: isKafkaDown ? '0 / hr' : '12.4M / hr' 
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 className="text-xl font-extrabold text-slate-950">Data Sources & Model Health</h2>
            <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
              isKafkaDown 
                ? 'bg-rose-50 text-rose-700 border-rose-200' 
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              {isKafkaDown ? '3/4 Connected (Degraded)' : '4/4 Connected (Optimal)'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Distributed sensor pipelines, Apache Kafka event streams & DSTGT neural inference status
          </p>
        </div>

        <button
          onClick={onToggleKafka}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 ${
            isKafkaDown
              ? 'mint-gradient-btn text-slate-950'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{isKafkaDown ? 'Reconnect Kafka Cluster' : 'Simulate Kafka Disconnect'}</span>
        </button>
      </div>

      {/* Data Pipeline Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sources.map((src, i) => (
          <div
            key={i}
            className={`p-5 rounded-3xl bg-white border shadow-sm transition-all flex flex-col justify-between space-y-3 ${
              src.status === 'Disconnected' ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200/90'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{src.name}</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    src.status === 'Disconnected' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'
                  }`}
                />
              </div>
              <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{src.protocol}</span>

              <div className="mt-3 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <strong className={src.status === 'Disconnected' ? 'text-rose-600' : 'text-emerald-600'}>
                    {src.status}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Latency:</span>
                  <span className="font-mono text-slate-800">{src.latency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Throughput:</span>
                  <span className="font-mono text-slate-800">{src.packets}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400">
              {src.status === 'Disconnected' ? 'Pipeline halted' : 'Heartbeat nominal (1s sync)'}
            </div>
          </div>
        ))}
      </div>

      {/* DSTGT Neural Model Health Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-mint-600" />
            <h3 className="text-base font-bold text-slate-900">
              DSTGT Spatio-Temporal Graph Transformer (v1.0)
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-mint-50 text-mint-800 border border-mint-200 text-[10px] font-bold">
              PyTorch Active
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
            Dynamic spatio-temporal attention mechanism continuously calculates edge congestion weights across 24 warehouse zones. Mean inference time is 14ms with 94.8% F1 prediction accuracy.
          </p>

          <div className="flex flex-wrap gap-4 pt-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono">
              <span className="text-slate-400 block text-[10px]">Inference Latency</span>
              <strong className="text-slate-900 text-sm">14ms</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono">
              <span className="text-slate-400 block text-[10px]">F1-Score</span>
              <strong className="text-emerald-600 text-sm">94.8%</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono">
              <span className="text-slate-400 block text-[10px]">Attention Heads</span>
              <strong className="text-slate-900 text-sm">8 Heads</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono">
              <span className="text-slate-400 block text-[10px]">Observation Window</span>
              <strong className="text-slate-900 text-sm">12 Timesteps</strong>
            </div>
          </div>
        </div>

        <div className="shrink-0 text-center space-y-2">
          <button
            onClick={handleRetrain}
            disabled={isRetraining}
            className="px-5 py-2.5 rounded-xl font-bold text-xs mint-gradient-btn text-slate-950 shadow-sm flex items-center space-x-2 disabled:opacity-75"
          >
            <RefreshCw className={`w-4 h-4 ${isRetraining ? 'animate-spin' : ''}`} />
            <span>{isRetraining ? `Retraining (${retrainProgress}%)` : 'Run Online Retrain'}</span>
          </button>
          <span className="text-[10px] text-slate-400 block">Trains on past 24h AGV telemetry</span>
        </div>
      </div>
    </div>
  );
}
