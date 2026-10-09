import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Layers, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Eye, 
  Navigation, 
  Zap, 
  Activity, 
  Maximize2,
  Minimize2,
  RefreshCw,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sliders,
  TrendingUp,
  X,
  Truck,
  Box,
  Radio,
  Edit3,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function WarehouseMap({ 
  onSelectNode, 
  selectedNode, 
  simulatedRerouteActive = false,
  onNavigateToPredictions,
  onOpenConfig,
  isAdmin = true
}) {
  // Layer Toggles
  const [layers, setLayers] = useState({
    racks: true,
    agvs: true,
    heat: true,
    conveyors: true,
    sensors: true,
    labels: true,
  });

  // Time Slider & Playback
  const [timeOffset, setTimeOffset] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Zoom & Pan state
  const [zoomLevel, setZoomLevel] = useState(1);
  const [zoneFocus, setZoneFocus] = useState('all'); // 'all' | 'zone1' | 'zone2' | 'zone3' | 'zone4'

  // Hover and Active Asset Drawer
  const [hoveredItem, setHoveredItem] = useState(null);
  const [activeAsset, setActiveAsset] = useState(selectedNode || {
    id: 'AISLE-B4',
    name: 'High-Density Rack Aisle B4',
    type: 'rack',
    zone: 'Zone 2 (Storage)',
    occupancy: 94,
    queue: 16,
    agvsInside: 5,
    status: 'High',
    predicted: '94% Severe Bottleneck',
    trend: '+18% vs avg'
  });

  // Auto-play time playback
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setTimeOffset((prev) => {
          if (prev === 0) return 15;
          if (prev === 15) return 30;
          if (prev === 30) return 60;
          return 0;
        });
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Sync selectedNode from props
  useEffect(() => {
    if (selectedNode) {
      setActiveAsset(selectedNode);
    }
  }, [selectedNode]);

  // Compute metrics based on timeOffset and simulation
  const getDynamicOccupancy = (baseOccupancy, isCriticalAisle = false) => {
    if (simulatedRerouteActive) {
      return isCriticalAisle ? 32 : Math.min(baseOccupancy, 45);
    }
    if (!isCriticalAisle) return baseOccupancy;
    if (timeOffset === 0) return 76;
    if (timeOffset === 15) return 86;
    if (timeOffset === 30) return 96;
    return 54;
  };

  const b4Occupancy = getDynamicOccupancy(88, true);
  const j4Occupancy = getDynamicOccupancy(82, true);

  // Interactive items definition
  const interactiveNodes = [
    { id: 'DOCK-1', name: 'Inbound Receiving Dock 1', type: 'dock', zone: 'Zone 1 (Inbound)', x: 95, y: 560, occupancy: 32, queue: 2, agvsInside: 1, status: 'Normal' },
    { id: 'DOCK-2', name: 'Inbound Receiving Dock 2', type: 'dock', zone: 'Zone 1 (Inbound)', x: 195, y: 560, occupancy: 44, queue: 3, agvsInside: 2, status: 'Normal' },
    { id: 'STAGING-1', name: 'Inbound Pallet Buffer Alpha', type: 'buffer', zone: 'Zone 1 (Inbound)', x: 145, y: 440, occupancy: 50, queue: 4, agvsInside: 2, status: 'Moderate' },
    { id: 'AISLE-A1', name: 'Aisle Storage Racks A1', type: 'rack', zone: 'Zone 2 (Storage)', x: 340, y: 420, occupancy: 38, queue: 3, agvsInside: 2, status: 'Normal' },
    { id: 'AISLE-A2', name: 'Aisle Storage Racks A2', type: 'rack', zone: 'Zone 2 (Storage)', x: 490, y: 420, occupancy: 46, queue: 4, agvsInside: 1, status: 'Normal' },
    { id: 'AISLE-B1', name: 'Aisle Storage Racks B1', type: 'rack', zone: 'Zone 2 (Storage)', x: 640, y: 420, occupancy: 62, queue: 6, agvsInside: 3, status: 'Moderate' },
    { id: 'AISLE-B4', name: 'High-Density Rack Aisle B4', type: 'rack', zone: 'Zone 2 (Storage)', x: 790, y: 420, occupancy: b4Occupancy, queue: b4Occupancy > 80 ? 16 : 5, agvsInside: 5, status: b4Occupancy > 80 ? 'High' : 'Normal' },
    { id: 'JUNCTION-J4', name: 'Sortation Chokepoint J-04', type: 'chokepoint', zone: 'Zone 3 (Sortation)', x: 600, y: 220, occupancy: j4Occupancy, queue: j4Occupancy > 80 ? 22 : 4, agvsInside: 4, status: j4Occupancy > 80 ? 'High' : 'Normal' },
    { id: 'PACK-P1', name: 'Packaging Workstation P1', type: 'pack', zone: 'Zone 4 (Dispatch)', x: 380, y: 130, occupancy: 42, queue: 3, agvsInside: 2, status: 'Normal' },
    { id: 'PACK-P2', name: 'Packaging Workstation P2', type: 'pack', zone: 'Zone 4 (Dispatch)', x: 500, y: 130, occupancy: 58, queue: 5, agvsInside: 2, status: 'Moderate' },
    { id: 'OUT-D1', name: 'Outbound Dispatch Bay 1', type: 'dispatch', zone: 'Zone 4 (Dispatch)', x: 800, y: 130, occupancy: 50, queue: 4, agvsInside: 3, status: 'Normal' },
    { id: 'OUT-D2', name: 'Outbound Dispatch Bay 2', type: 'dispatch', zone: 'Zone 4 (Dispatch)', x: 920, y: 130, occupancy: 68, queue: 7, agvsInside: 2, status: 'Moderate' },
  ];

  const handleSelect = (item) => {
    setActiveAsset(item);
    if (onSelectNode) onSelectNode(item);
  };

  // Zoom preset bounds
  const getViewBox = () => {
    if (zoneFocus === 'zone1') return '50 360 400 320';
    if (zoneFocus === 'zone2') return '260 280 620 340';
    if (zoneFocus === 'zone3') return '440 100 420 300';
    if (zoneFocus === 'zone4') return '320 60 700 240';
    return '0 0 1050 680';
  };

  return (
    <div className="relative rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden select-none">
      
      {/* ================= TOP BLUEPRINT TOOLBAR ================= */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        
        {/* Left: Title & Quick Zone Focus */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold shadow-xs">
            <Radio className="w-5 h-5 text-blue-700 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-extrabold text-slate-900">
                Architectural 2D Digital Twin Blueprint
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[10px] font-bold">
                Live SVG Telemetry
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Millimeter-precision warehouse layout • Rack bin slots, conveyor routing, AMR transit lanes, and thermal congestion
            </p>
          </div>
        </div>

        {/* Right: Layer Toggles & Zone Focus Tabs */}
        <div className="flex items-center space-x-2 flex-wrap">
          {/* Zone Selector */}
          <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs flex items-center space-x-1 text-xs font-semibold">
            {[
              { id: 'all', label: 'All Zones' },
              { id: 'zone1', label: 'Zone 1 (Inbound)' },
              { id: 'zone2', label: 'Zone 2 (Racks)' },
              { id: 'zone3', label: 'Zone 3 (Sortation)' },
              { id: 'zone4', label: 'Zone 4 (Dispatch)' },
            ].map((z) => (
              <button
                key={z.id}
                onClick={() => setZoneFocus(z.id)}
                className={`px-2.5 py-1.5 rounded-xl transition-all ${
                  zoneFocus === z.id
                    ? 'bg-slate-950 text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {z.label}
              </button>
            ))}
          </div>

          {/* Zoom In/Out */}
          <div className="flex items-center space-x-1 bg-white p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setZoneFocus('all')}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= LAYER TOGGLE STRIP ================= */}
      <div className="px-5 py-2.5 bg-slate-100/60 border-b border-slate-200/80 flex items-center justify-between text-xs overflow-x-auto">
        <div className="flex items-center space-x-3 text-slate-600 font-medium whitespace-nowrap">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Layers:
          </span>

          {[
            { id: 'racks', label: 'Racks & Bins' },
            { id: 'agvs', label: 'AMRs & Forklifts' },
            { id: 'heat', label: 'Congestion Heatmap' },
            { id: 'conveyors', label: 'Conveyor Belts' },
            { id: 'sensors', label: 'RFID Sensors' },
            { id: 'labels', label: 'Aisle Labels' },
          ].map((layer) => (
            <label
              key={layer.id}
              className="flex items-center space-x-1.5 cursor-pointer px-2 py-1 rounded-lg hover:bg-white transition-colors"
            >
              <input
                type="checkbox"
                checked={layers[layer.id]}
                onChange={(e) => setLayers({ ...layers, [layer.id]: e.target.checked })}
                className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
              />
              <span className="text-[11px] font-semibold text-slate-700">{layer.label}</span>
            </label>
          ))}
        </div>

        {/* Real-time Indicator */}
        <div className="hidden md:flex items-center space-x-2 font-mono text-[11px] text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Telemetry Stream: 100 Hz</span>
        </div>
      </div>

      {/* ================= MAIN SVG CANVAS (Full Architectural Blueprint) ================= */}
      <div className="relative w-full h-[620px] sm:h-[680px] bg-[#f8fafc] overflow-hidden">
        
        <svg
          viewBox={getViewBox()}
          className="w-full h-full cursor-crosshair transition-all duration-500 ease-out"
          fill="none"
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="archGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
              <circle cx="0" cy="0" r="1.2" fill="#cbd5e1" />
            </pattern>

            {/* Pulsing Thermal Congestion Gradient (Aisle B4 & Chokepoint J4) */}
            <radialGradient id="heatAisleB4" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.65" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="heatJunctionJ4" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.7" />
              <stop offset="45%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </radialGradient>

            {/* Conveyor Chevron Pattern */}
            <pattern id="conveyorChevron" width="20" height="14" patternUnits="userSpaceOnUse">
              <path d="M 4 2 L 12 7 L 4 12" fill="none" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
            </pattern>
          </defs>

          {/* 1. Blueprint Grid Background */}
          <rect width="1050" height="680" fill="url(#archGrid)" />

          {/* 2. Outer Warehouse Perimeter Wall Structure */}
          <rect x="25" y="25" width="1000" height="630" rx="16" fill="#ffffff" stroke="#94a3b8" strokeWidth="3" />

          {/* Architectural Coordinate Rulers & Ticks */}
          <g opacity="0.6" fontSize="8" fill="#94a3b8" fontFamily="monospace">
            <text x="35" y="40">GRID: WH-01 [105m x 68m]</text>
            <text x="300" y="40">X: 30.0m</text>
            <text x="600" y="40">X: 60.0m</text>
            <text x="900" y="40">X: 90.0m</text>
            <text x="32" y="200">Y: 20m</text>
            <text x="32" y="400">Y: 40m</text>
            <text x="32" y="600">Y: 60m</text>
          </g>

          {/* ================= ZONE BOUNDARY DEMARCATIONS ================= */}
          {/* Zone 1: Inbound Logistics & Receiving Docks */}
          <g>
            <rect x="45" y="380" width="220" height="255" rx="12" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x="60" y="405" fill="#1e40af" fontSize="11" fontWeight="800" letterSpacing="1">ZONE 1: INBOUND RECEIVING DOCKS</text>
          </g>

          {/* Zone 2: High-Density Aisle Storage Racks */}
          <g>
            <rect x="285" y="280" width="600" height="355" rx="12" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x="300" y="305" fill="#1e40af" fontSize="11" fontWeight="800" letterSpacing="1">ZONE 2: HIGH-DENSITY STORAGE & PICK AISLES</text>
          </g>

          {/* Zone 3: Sortation Hub & Chokepoint Junction J-04 */}
          <g>
            <rect x="450" y="160" width="310" height="105" rx="12" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x="465" y="182" fill="#1e40af" fontSize="10" fontWeight="800" letterSpacing="1">ZONE 3: SORTATION JUNCTION J-04</text>
          </g>

          {/* Zone 4: Outbound Packaging & Cross-Dock Dispatch */}
          <g>
            <rect x="285" y="45" width="720" height="105" rx="12" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x="300" y="68" fill="#1e40af" fontSize="11" fontWeight="800" letterSpacing="1">ZONE 4: PACKAGING & OUTBOUND DISPATCH DOCKS</text>
          </g>

          {/* ================= CONVEYOR BELT NETWORKS ================= */}
          {layers.conveyors && (
            <g id="conveyorLayer">
              {/* Main Induction Conveyor Line from Inbound to Sortation */}
              <path
                d="M 145 440 L 145 220 L 450 220"
                stroke="#0284c7"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 145 440 L 145 220 L 450 220"
                stroke="#38bdf8"
                strokeWidth="4"
                strokeDasharray="6 6"
              >
                <animate attributeName="stroke-dashoffset" values="24;0" dur="1s" repeatCount="indefinite" />
              </path>

              {/* Sortation Junction Conveyor Loop */}
              <rect x="520" y="200" width="160" height="40" rx="8" fill="#0f172a" stroke="#0284c7" strokeWidth="2" />
              <text x="600" y="224" fill="#38bdf8" fontSize="9" fontWeight="800" textAnchor="middle" fontFamily="monospace">
                SORTATION CAROUSEL SC-01
              </text>

              {/* Takeaway Conveyor from Sortation to Packaging */}
              <path
                d="M 600 200 L 600 130 L 450 130"
                stroke="#0284c7"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d="M 600 200 L 600 130 L 450 130"
                stroke="#ffffff"
                strokeWidth="3"
                strokeDasharray="5 5"
              >
                <animate attributeName="stroke-dashoffset" values="20;0" dur="0.9s" repeatCount="indefinite" />
              </path>
            </g>
          )}

          {/* ================= AMR / AGV TRANSIT HIGHWAYS ================= */}
          {/* Main Floor Transit Highway Lines */}
          <g id="transitLanes" opacity="0.8">
            <path
              d="M 95 500 L 950 500"
              stroke="#cbd5e1"
              strokeWidth="18"
              strokeLinecap="round"
            />
            {/* Dashed Center Guide Wire */}
            <path
              d="M 95 500 L 950 500"
              stroke="#00f5a0"
              strokeWidth="2.5"
              strokeDasharray="8 6"
            />

            {/* Vertical Aisle Feeder Arteries */}
            {[340, 490, 640, 790].map((ax) => (
              <g key={`feeder-${ax}`}>
                <line x1={ax} y1="320" x2={ax} y2="500" stroke="#cbd5e1" strokeWidth="14" />
                <line x1={ax} y1="320" x2={ax} y2="500" stroke="#00f5a0" strokeWidth="2" strokeDasharray="6 4" />
              </g>
            ))}

            {/* Chokepoint Transit Spur (Aisle B4 to J4) */}
            <path
              d="M 790 320 L 790 220 L 680 220"
              stroke={b4Occupancy > 80 && !simulatedRerouteActive ? '#ef4444' : '#00f5a0'}
              strokeWidth="4"
              strokeDasharray="6 4"
            >
              <animate attributeName="stroke-dashoffset" values="20;0" dur="0.8s" repeatCount="indefinite" />
            </path>

            {/* Dynamic AI Bypass Artery (When Reroute Active) */}
            {simulatedRerouteActive && (
              <path
                d="M 490 320 L 490 130 L 750 130"
                stroke="#0284c7"
                strokeWidth="5"
                strokeDasharray="8 4"
              >
                <animate attributeName="stroke-dashoffset" values="0;24" dur="0.7s" repeatCount="indefinite" />
              </path>
            )}
          </g>

          {/* ================= THERMAL CONGESTION HEATMAP OVERLAY ================= */}
          {layers.heat && (
            <g id="heatmapLayer">
              {/* Critical Congestion Pulse over Aisle B4 */}
              <circle
                cx="790"
                cy="420"
                r={b4Occupancy > 80 ? "85" : "45"}
                fill="url(#heatAisleB4)"
              >
                {b4Occupancy > 80 && (
                  <animate attributeName="r" values="70;95;70" dur="2s" repeatCount="indefinite" />
                )}
              </circle>

              {/* Critical Congestion Pulse over Chokepoint J-04 */}
              <circle
                cx="600"
                cy="220"
                r={j4Occupancy > 80 ? "75" : "40"}
                fill="url(#heatJunctionJ4)"
              >
                {j4Occupancy > 80 && (
                  <animate attributeName="r" values="60;85;60" dur="1.8s" repeatCount="indefinite" />
                )}
              </circle>
            </g>
          )}

          {/* ================= HIGH-DENSITY RACK AISLES & BIN SLOTS ================= */}
          {layers.racks && (
            <g id="racksLayer">
              {[
                { id: 'AISLE-A1', label: 'Aisle A1', x: 310, occupancy: 38 },
                { id: 'AISLE-A2', label: 'Aisle A2', x: 460, occupancy: 46 },
                { id: 'AISLE-B1', label: 'Aisle B1', x: 610, occupancy: 62 },
                { id: 'AISLE-B4', label: 'Aisle B4', x: 760, occupancy: b4Occupancy },
              ].map((aisle) => {
                const isAlert = aisle.occupancy > 80;
                return (
                  <g
                    key={aisle.id}
                    onClick={() => handleSelect(interactiveNodes.find(n => n.id === aisle.id))}
                    onMouseEnter={() => setHoveredItem(aisle)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="cursor-pointer"
                  >
                    {/* Double Rack Bay Outline */}
                    <rect
                      x={aisle.x}
                      y="330"
                      width="60"
                      height="150"
                      rx="6"
                      fill="#ffffff"
                      stroke={isAlert ? '#ef4444' : aisle.occupancy > 60 ? '#f59e0b' : '#334155'}
                      strokeWidth={isAlert ? "3" : "2"}
                    />

                    {/* Pallet Bin Shelves (10 Individual Pallet Slots) */}
                    {[0, 1, 2, 3, 4].map((slotIdx) => {
                      const sy = 338 + slotIdx * 27;
                      const isOccupied = slotIdx < Math.round((aisle.occupancy / 100) * 5);
                      return (
                        <g key={`slot-${slotIdx}`}>
                          {/* Left Slot */}
                          <rect
                            x={aisle.x + 4}
                            y={sy}
                            width="23"
                            height="22"
                            rx="3"
                            fill={isOccupied ? (isAlert ? '#fee2e2' : '#e0f2fe') : '#f8fafc'}
                            stroke={isOccupied ? (isAlert ? '#ef4444' : '#0284c7') : '#cbd5e1'}
                            strokeWidth="1"
                          />
                          {/* Right Slot */}
                          <rect
                            x={aisle.x + 33}
                            y={sy}
                            width="23"
                            height="22"
                            rx="3"
                            fill={isOccupied ? (isAlert ? '#fee2e2' : '#dcfce7') : '#f8fafc'}
                            stroke={isOccupied ? (isAlert ? '#ef4444' : '#10b981') : '#cbd5e1'}
                            strokeWidth="1"
                          />
                        </g>
                      );
                    })}

                    {/* Aisle Identification Tag */}
                    <rect
                      x={aisle.x - 5}
                      y="488"
                      width="70"
                      height="20"
                      rx="6"
                      fill={isAlert ? '#ef4444' : '#0f172a'}
                    />
                    <text
                      x={aisle.x + 30}
                      y="502"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="800"
                      textAnchor="middle"
                    >
                      {aisle.label} ({aisle.occupancy}%)
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* ================= INBOUND LOADING DOCKS & HYDRAULIC LEVELERS ================= */}
          <g id="dockLayer">
            {[
              { id: 'DOCK-1', label: 'Bay 1', x: 75, truckId: 'TRK-2051' },
              { id: 'DOCK-2', label: 'Bay 2', x: 175, truckId: 'Available' },
            ].map((dock) => (
              <g
                key={dock.id}
                onClick={() => handleSelect(interactiveNodes.find(n => n.id === dock.id))}
                className="cursor-pointer"
              >
                {/* Truck Trailer Docked */}
                <rect
                  x={dock.x}
                  y="535"
                  width="45"
                  height="80"
                  rx="6"
                  fill="#ffffff"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                />
                {/* Trailer Roll-up Door */}
                <rect x={dock.x + 5} y="535" width="35" height="10" fill="#2563eb" />
                <text x={dock.x + 22} y="575" fill="#1e40af" fontSize="8" fontWeight="800" textAnchor="middle">
                  {dock.label}
                </text>
                <text x={dock.x + 22} y="590" fill="#64748b" fontSize="7" fontWeight="bold" textAnchor="middle">
                  {dock.truckId}
                </text>
              </g>
            ))}
          </g>

          {/* ================= OUTBOUND DISPATCH DOCKS & PACK STATIONS ================= */}
          <g id="outboundLayer">
            {/* Workstations P1 & P2 */}
            {[
              { id: 'PACK-P1', label: 'Pack Station P1', x: 350 },
              { id: 'PACK-P2', label: 'Pack Station P2', x: 470 },
            ].map((ws) => (
              <g
                key={ws.id}
                onClick={() => handleSelect(interactiveNodes.find(n => n.id === ws.id))}
                className="cursor-pointer"
              >
                <rect x={ws.x} y="95" width="85" height="42" rx="8" fill="#ffffff" stroke="#10b981" strokeWidth="2" />
                <text x={ws.x + 42} y="115" fill="#0f172a" fontSize="9" fontWeight="800" textAnchor="middle">
                  {ws.label}
                </text>
                <text x={ws.x + 42} y="128" fill="#10b981" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                  Nominal Output
                </text>
              </g>
            ))}

            {/* Outbound Shipping Docks D1 & D2 */}
            {[
              { id: 'OUT-D1', label: 'Dock D1', x: 770 },
              { id: 'OUT-D2', label: 'Dock D2', x: 890 },
            ].map((ob) => (
              <g
                key={ob.id}
                onClick={() => handleSelect(interactiveNodes.find(n => n.id === ob.id))}
                className="cursor-pointer"
              >
                <rect x={ob.x} y="85" width="55" height="52" rx="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                <text x={ob.x + 27} y="110" fill="#ffffff" fontSize="9" fontWeight="800" textAnchor="middle">
                  {ob.label}
                </text>
                <text x={ob.x + 27} y="124" fill="#38bdf8" fontSize="7" fontWeight="bold" textAnchor="middle">
                  Ready to Dispatch
                </text>
              </g>
            ))}
          </g>

          {/* ================= ANIMATED 2D AMRs & FORKLIFTS ================= */}
          {layers.agvs && (
            <g id="amrFleet">
              {/* AMR 01: Inbound Docks to Aisle Racks */}
              <g>
                <animateMotion
                  path="M 120 500 L 340 500 L 340 340"
                  dur="8s"
                  repeatCount="indefinite"
                />
                <circle cx="0" cy="0" r="10" fill="#0f172a" stroke="#00f5a0" strokeWidth="2.5" />
                <rect x="-6" y="-6" width="12" height="12" rx="2" fill="#facc15" />
                <circle cx="4" cy="0" r="1.5" fill="#00f5a0" />
              </g>

              {/* AMR 02: Aisle B1 to Chokepoint J-04 */}
              <g>
                <animateMotion
                  path={
                    simulatedRerouteActive
                      ? "M 490 340 L 490 130"
                      : "M 640 340 L 640 500 L 790 500 L 790 220 L 600 220"
                  }
                  dur={simulatedRerouteActive ? "6s" : "9s"}
                  repeatCount="indefinite"
                />
                <circle cx="0" cy="0" r="10" fill="#0f172a" stroke={simulatedRerouteActive ? "#0284c7" : "#ef4444"} strokeWidth="2.5" />
                <rect x="-6" y="-6" width="12" height="12" rx="2" fill="#facc15" />
                <circle cx="4" cy="0" r="1.5" fill="#00f5a0" />
              </g>

              {/* AMR 03: Sortation Loop to Packaging */}
              <g>
                <animateMotion
                  path="M 600 200 L 600 130 L 450 130"
                  dur="7s"
                  repeatCount="indefinite"
                />
                <circle cx="0" cy="0" r="9" fill="#0f172a" stroke="#00f5a0" strokeWidth="2" />
                <rect x="-5" y="-5" width="10" height="10" rx="2" fill="#facc15" />
              </g>
            </g>
          )}

          {/* ================= INTERACTIVE RFID SENSOR NODES ================= */}
          {layers.sensors && (
            <g id="sensorsLayer">
              {[
                { x: 230, y: 500, label: 'RFID-Gate 1' },
                { x: 570, y: 500, label: 'RFID-Gate 2' },
                { x: 600, y: 260, label: 'Vision-AI Cam 4' },
                { x: 790, y: 260, label: 'Vision-AI Cam 8' },
              ].map((s, idx) => (
                <g key={`sensor-${idx}`}>
                  <circle cx={s.x} cy={s.y} r="6" fill="#10b981" />
                  <circle cx={s.x} cy={s.y} r="12" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3">
                    <animate attributeName="r" values="8;16;8" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <text x={s.x} y={s.y - 10} fill="#64748b" fontSize="7" fontWeight="bold" textAnchor="middle">
                    {s.label}
                  </text>
                </g>
              ))}
            </g>
          )}
        </svg>

        {/* ================= BOTTOM BAR CONTROLS ================= */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-full border border-slate-200 shadow-xl flex items-center space-x-4">
          {/* Play/Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 rounded-full bg-slate-950 text-white flex items-center justify-center hover:bg-slate-800 transition-colors shadow-2xs"
            title={isPlaying ? 'Pause Auto-Play' : 'Auto-animate time state'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-mint-400" /> : <Play className="w-3.5 h-3.5 text-mint-400 fill-mint-400 ml-0.5" />}
          </button>

          {/* Time Offset Tabs */}
          <div className="flex items-center space-x-1 text-xs font-bold">
            {[
              { offset: 0, label: 'Now' },
              { offset: 15, label: '+15 min' },
              { offset: 30, label: '+30 min' },
              { offset: 60, label: '+60 min' },
            ].map((t) => (
              <button
                key={t.offset}
                onClick={() => setTimeOffset(t.offset)}
                className={`px-3 py-1.5 rounded-full transition-all ${
                  timeOffset === t.offset
                    ? 'mint-gradient-btn text-slate-950 shadow-2xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="border-l border-slate-200 pl-3 text-xs text-slate-500 font-mono hidden sm:block">
            Forecast: <strong className="text-slate-900">{timeOffset === 0 ? 'Current Real-Time' : `+${timeOffset} min`}</strong>
          </div>
        </div>

        {/* Legend Overlay at bottom left */}
        <div className="absolute bottom-4 left-4 z-20 bg-white/95 border border-slate-200 p-3 rounded-2xl text-[11px] font-semibold space-y-1.5 shadow-md backdrop-blur-md">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block pb-1 border-b border-slate-100">
            Thermal Congestion
          </span>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-700">Nominal (&lt;50%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-700">Moderate (50-75%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-rose-600 font-bold">Critical Bottleneck (&gt;75%)</span>
          </div>
        </div>

        {/* AI Dynamic Bypass Active Badge */}
        {simulatedRerouteActive && (
          <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-2xl bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold flex items-center space-x-2 shadow-sm animate-fadeIn">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-600" />
            <span>AI Dynamic Bypass Active (Rerouting traffic away from B4)</span>
          </div>
        )}
      </div>

      {/* ================= RIGHT INSPECTION DRAWER ================= */}
      {activeAsset && (
        <div className="absolute top-5 right-5 bottom-5 z-30 w-80 sm:w-96 bg-white/98 backdrop-blur-xl rounded-3xl border border-slate-200 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-fadeIn">
          <div>
            {/* Header: Name + Status Badge */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  2D Schematic Node
                </span>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {activeAsset.name || activeAsset.id}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{activeAsset.zone}</p>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                  activeAsset.status === 'High'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : activeAsset.status === 'Moderate'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {activeAsset.status}
                </span>
                <button
                  onClick={() => setActiveAsset(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5 my-4 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] block">Occupancy Rate</span>
                <strong className="text-slate-900 text-base font-mono">{activeAsset.occupancy}%</strong>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] block">Active AMRs</span>
                <strong className="text-slate-900 text-base font-mono">{activeAsset.agvsInside || 3} Units</strong>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] block">Queue Length</span>
                <strong className="text-slate-900 text-base font-mono">{activeAsset.queue || 4} pallets</strong>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] block">Forecast (+30m)</span>
                <strong className={`text-base font-mono ${activeAsset.occupancy > 75 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {activeAsset.occupancy > 75 ? 'Critical (96%)' : 'Nominal'}
                </strong>
              </div>
            </div>

            {/* Mini Forecast Chart */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 mb-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center space-x-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                  <span>Spatio-Temporal Trend Curve</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">94.8% Conf</span>
              </div>
              
              <div className="w-full h-18">
                <svg viewBox="0 0 280 65" className="w-full h-full" fill="none">
                  <path
                    d="M 10 48 C 50 42, 90 22, 140 26 C 190 30, 220 12, 270 16"
                    stroke="#2563eb"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 10 48 C 50 42, 90 22, 140 26 C 190 30, 220 12, 270 16 L 270 65 L 10 65 Z"
                    fill="#3b82f6"
                    fillOpacity="0.14"
                  />
                  <circle cx="270" cy="16" r="3.5" fill="#1e40af" />
                  <text x="10" y="60" fontSize="8" fill="#94a3b8" fontFamily="monospace">Now</text>
                  <text x="90" y="60" fontSize="8" fill="#94a3b8" fontFamily="monospace">+15m</text>
                  <text x="180" y="60" fontSize="8" fill="#94a3b8" fontFamily="monospace">+30m</text>
                  <text x="245" y="60" fontSize="8" fill="#94a3b8" fontFamily="monospace">+60m</text>
                </svg>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => onNavigateToPredictions && onNavigateToPredictions()}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center justify-center space-x-2 shadow-2xs"
            >
              <Activity className="w-3.5 h-3.5 text-mint-400" />
              <span>View Spatio-Temporal Prediction</span>
            </button>

            <button
              onClick={() => {
                setActiveAsset({ ...activeAsset, occupancy: 28, status: 'Normal', queue: 1 });
              }}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold mint-gradient-btn text-slate-950 transition-all flex items-center justify-center space-x-2 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>Run Dynamic Reroute Simulation</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => onOpenConfig && onOpenConfig(activeAsset)}
                className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors flex items-center justify-center space-x-1.5"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                <span>Edit Asset Configuration</span>
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
