import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  Layers, 
  Maximize2, 
  Minimize2, 
  Play, 
  Pause, 
  Sparkles, 
  TrendingUp, 
  X, 
  Activity, 
  Edit3, 
  Box, 
  Network, 
  Cpu 
} from 'lucide-react';

export default function UserDigitalTwin3D({ 
  onSelectNode, 
  selectedNode, 
  onNavigateToPredictions, 
  onOpenConfig,
  isAdmin = false 
}) {
  const containerRef = useRef(null);

  // Loading skeleton state
  const [isLoading, setIsLoading] = useState(true);

  // Layer Toggles matching Spec
  const [layers, setLayers] = useState({
    heatmap: true,
    graph: true,      // Spec Block 4: Warehouse Graph Representation (Nodes & Edges)
    agvs: true,       // Spec Block 1 & 4: AGVs / AMRs & Forklifts
    paths: true,      // Conveyor & Movement Paths
    labels: true,     // 3D Badges (Aisle A, Aisle B, Packing, Docks)
    sensors: true,    // IoT Sensors & CCTV
  });

  // Explainability Layer Modal / Overlay (Spec Block 6)
  const [showExplainability, setShowExplainability] = useState(true);

  // Time Slider & Playback: 0 (Now) | 15 (+15m) | 30 (+30m) | 60 (+60m)
  const [timeOffset, setTimeOffset] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Camera Mode: 'isometric' | 'top' | 'reset'
  const [cameraMode, setCameraMode] = useState('isometric');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Simulation Scenario
  const [simScenario, setSimScenario] = useState('Baseline Peak Shift');

  // Tooltip & Drawer on Hover / Click
  const [hoveredAsset, setHoveredAsset] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [activeAsset, setActiveAsset] = useState({
    id: 'AISLE-B',
    name: 'Aisle B (Storage Racks)',
    type: 'aisle',
    zone: 'Storage Zone B - Primary Bottleneck',
    status: 'High',
    occupancy: 94,
    queue: 18,
    agvsInside: 5,
    speed: '0.4 m/s (Congested)',
    task: 'High Ingestion Volume from Inbound Dock 1',
    riskScore: 87,
    expectedDelay: '+14.2 min'
  });

  // Three.js instances and layer group refs
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // Layer groups for toggle visibility
  const heatmapGroupRef = useRef(null);
  const graphGroupRef = useRef(null);
  const vehiclesGroupRef = useRef(null);
  const pathsGroupRef = useRef(null);
  const pinsGroupRef = useRef(null);
  const sensorsGroupRef = useRef(null);

  // Animated objects refs
  const movingVehiclesRef = useRef([]);
  const movingAgvsRef = useRef([]);
  const movingConveyorBoxesRef = useRef([]);
  const pulseLightsRef = useRef([]);
  const floatingPinsRef = useRef([]);
  const graphPulseNodesRef = useRef([]);

  // Auto-play time interval effect
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

  // Sync Layers state to Three.js Groups
  useEffect(() => {
    if (heatmapGroupRef.current) heatmapGroupRef.current.visible = layers.heatmap;
    if (graphGroupRef.current) graphGroupRef.current.visible = layers.graph;
    if (vehiclesGroupRef.current) vehiclesGroupRef.current.visible = layers.agvs;
    if (pathsGroupRef.current) pathsGroupRef.current.visible = layers.paths;
    if (pinsGroupRef.current) pinsGroupRef.current.visible = layers.labels;
    if (sensorsGroupRef.current) sensorsGroupRef.current.visible = layers.sensors;
  }, [layers]);

  // Sync selectedNode prop if parent changes it
  useEffect(() => {
    if (selectedNode) {
      setActiveAsset(selectedNode);
    }
  }, [selectedNode]);

  // ================= MAIN THREE.JS INITIALIZATION =================
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 740;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf1f5f9); // Clean SaaS background

    // 2. Isometric Camera Setup (45 degree projection)
    const aspect = width / height;
    const camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 1000);
    camera.position.set(54, 48, 54);
    cameraRef.current = camera;

    // 3. Renderer with Soft Shadows
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.1;
    controls.minDistance = 20;
    controls.maxDistance = 140;
    controls.target.set(2, 2, 0);
    controlsRef.current = controls;

    // 5. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.15);
    sunLight.position.set(40, 70, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 160;
    sunLight.shadow.camera.left = -60;
    sunLight.shadow.camera.right = 60;
    sunLight.shadow.camera.top = 60;
    sunLight.shadow.camera.bottom = -60;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const skyLight = new THREE.DirectionalLight(0xbae6fd, 0.45);
    skyLight.position.set(-30, 40, -30);
    scene.add(skyLight);

    const rimLight = new THREE.DirectionalLight(0x00f5a0, 0.35);
    rimLight.position.set(-20, 15, 40);
    scene.add(rimLight);

    // 6. Layer Groups
    const heatmapGroup = new THREE.Group();
    const graphGroup = new THREE.Group();
    const vehiclesGroup = new THREE.Group();
    const pathsGroup = new THREE.Group();
    const pinsGroup = new THREE.Group();
    const sensorsGroup = new THREE.Group();

    heatmapGroupRef.current = heatmapGroup;
    graphGroupRef.current = graphGroup;
    vehiclesGroupRef.current = vehiclesGroup;
    pathsGroupRef.current = pathsGroup;
    pinsGroupRef.current = pinsGroup;
    sensorsGroupRef.current = sensorsGroup;

    scene.add(heatmapGroup);
    scene.add(graphGroup);
    scene.add(vehiclesGroup);
    scene.add(pathsGroup);
    scene.add(pinsGroup);
    scene.add(sensorsGroup);

    pulseLightsRef.current = [];
    movingVehiclesRef.current = [];
    movingAgvsRef.current = [];
    movingConveyorBoxesRef.current = [];
    floatingPinsRef.current = [];
    graphPulseNodesRef.current = [];

    // ================= PROCEDURAL 3D ASSETS BUILDERS =================

    // A. Main Floor / Ground Grid
    const groundGeo = new THREE.PlaneGeometry(110, 80);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.9,
      metalness: 0.05,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // Floor Grid Helper
    const yardGrid = new THREE.GridHelper(110, 55, 0xcfd8dc, 0xe2e8f0);
    yardGrid.position.y = 0.02;
    scene.add(yardGrid);

    // B. Asphalt Transit Road
    const roadGeo = new THREE.PlaneGeometry(110, 14);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.75,
    });
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    roadMesh.rotation.x = -Math.PI / 2;
    roadMesh.position.set(0, 0.04, 25);
    roadMesh.receiveShadow = true;
    scene.add(roadMesh);

    // Road Markings
    for (let rx = -48; rx <= 48; rx += 8) {
      const dashGeo = new THREE.PlaneGeometry(4, 0.4);
      const dashMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const dashMesh = new THREE.Mesh(dashGeo, dashMat);
      dashMesh.rotation.x = -Math.PI / 2;
      dashMesh.position.set(rx, 0.06, 25);
      scene.add(dashMesh);
    }

    // Concrete Dock Stalls
    for (let bay = 0; bay < 3; bay++) {
      const bayX = -12 + bay * 12;
      const stallGeo = new THREE.PlaneGeometry(7.5, 12);
      const stallMat = new THREE.MeshBasicMaterial({ color: 0xfacc15, wireframe: true });
      const stallMesh = new THREE.Mesh(stallGeo, stallMat);
      stallMesh.rotation.x = -Math.PI / 2;
      stallMesh.position.set(bayX, 0.05, 10.5);
      scene.add(stallMesh);
    }

    // C. WAREHOUSE BUILDING (Royal Blue Facility with Open Bays)
    const warehouseGroup = new THREE.Group();
    warehouseGroup.position.set(2, 0, -14);

    const bodyGeo = new THREE.BoxGeometry(46, 11, 20);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      roughness: 0.35,
      metalness: 0.15,
    });
    const warehouseBody = new THREE.Mesh(bodyGeo, bodyMat);
    warehouseBody.position.y = 5.5;
    warehouseBody.castShadow = true;
    warehouseBody.receiveShadow = true;
    warehouseBody.userData = { 
      id: 'WH-MAIN', 
      name: 'TwinFlow Automated Facility WH-01', 
      zone: 'Primary Hub', 
      occupancy: 78, 
      queue: 14, 
      agvsInside: 18, 
      status: 'Normal' 
    };
    warehouseGroup.add(warehouseBody);

    // Roof
    const roofBaseGeo = new THREE.BoxGeometry(47.5, 1.2, 21.5);
    const roofBaseMat = new THREE.MeshStandardMaterial({ color: 0x1e40af, roughness: 0.3 });
    const roofBase = new THREE.Mesh(roofBaseGeo, roofBaseMat);
    roofBase.position.y = 11.6;
    roofBase.castShadow = true;
    warehouseGroup.add(roofBase);

    // Corrugated Roof ribs
    for (let rz = -10; rz <= 10; rz += 1.4) {
      const ribGeo = new THREE.BoxGeometry(47.2, 0.35, 0.5);
      const ribMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.2 });
      const rib = new THREE.Mesh(ribGeo, ribMat);
      rib.position.set(0, 12.35, rz);
      warehouseGroup.add(rib);
    }

    // Open Loading Bays
    for (let b = 0; b < 3; b++) {
      const bx = -14 + b * 13;
      const interiorGeo = new THREE.BoxGeometry(7.0, 6.2, 2.5);
      const interiorMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
      const interior = new THREE.Mesh(interiorGeo, interiorMat);
      interior.position.set(bx, 3.1, 9.1);
      warehouseGroup.add(interior);

      const rampGeo = new THREE.BoxGeometry(6.8, 0.6, 2.8);
      const rampMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 });
      const ramp = new THREE.Mesh(rampGeo, rampMat);
      ramp.position.set(bx, 0.3, 10.3);
      ramp.castShadow = true;
      ramp.userData = { 
        id: `BAY-${b + 1}`, 
        name: `Inbound Loading Bay ${b + 1}`, 
        zone: 'Receiving Dock', 
        occupancy: b === 0 ? 82 : 40, 
        queue: b === 0 ? 4 : 1, 
        agvsInside: 2, 
        status: b === 0 ? 'Normal' : 'Normal' 
      };
      warehouseGroup.add(ramp);
    }

    // Office Annex
    const annexGeo = new THREE.BoxGeometry(10, 8, 14);
    const annexMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.4 });
    const annex = new THREE.Mesh(annexGeo, annexMat);
    annex.position.set(-27, 4, -2);
    annex.castShadow = true;
    warehouseGroup.add(annex);

    scene.add(warehouseGroup);

    // ================= D. STORAGE RACKS: SPEC AISLE A & AISLE B =================
    const createPalletRack = (rx, rz, type = 'normal', aisleName = 'Aisle A', occ = 45, queue = 2) => {
      const rackGroup = new THREE.Group();
      rackGroup.position.set(rx, 0, rz);
      const isCritical = type === 'critical';

      // Steel Uprights
      const postGeo = new THREE.BoxGeometry(0.3, 8.5, 0.3);
      const postMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 });
      [[-2.8, -1.2], [-2.8, 1.2], [2.8, -1.2], [2.8, 1.2]].forEach(([px, pz]) => {
        const post = new THREE.Mesh(postGeo, postMat);
        post.position.set(px, 4.25, pz);
        post.castShadow = true;
        rackGroup.add(post);
      });

      // Orange Cross Beams & Shelves
      const beamMat = new THREE.MeshStandardMaterial({ color: isCritical ? 0xef4444 : 0xf97316, roughness: 0.4 });
      for (let sy = 2.2; sy <= 6.8; sy += 2.3) {
        const beamGeo = new THREE.BoxGeometry(5.8, 0.25, 2.4);
        const beam = new THREE.Mesh(beamGeo, beamMat);
        beam.position.y = sy;
        beam.castShadow = true;
        rackGroup.add(beam);

        // Pallets with Cardboard Boxes
        for (let bx = -1.8; bx <= 1.8; bx += 1.8) {
          const palGeo = new THREE.BoxGeometry(1.5, 0.2, 1.8);
          const palMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.6 });
          const pal = new THREE.Mesh(palGeo, palMat);
          pal.position.set(bx, sy + 0.15, 0);
          pal.castShadow = true;
          rackGroup.add(pal);

          // Cardboard boxes (red for Aisle B high congestion, orange/brown for Aisle A)
          const boxColor = isCritical ? 0xdc2626 : 0xd97706;
          const boxGeo = new THREE.BoxGeometry(1.3, 1.2, 1.5);
          const boxMat = new THREE.MeshStandardMaterial({ color: boxColor, roughness: 0.5 });
          const box = new THREE.Mesh(boxGeo, boxMat);
          box.position.set(bx, sy + 0.85, 0);
          box.castShadow = true;
          box.userData = { 
            id: isCritical ? 'AISLE-B' : 'AISLE-A', 
            name: `${aisleName} Multi-Tier Racks`, 
            zone: isCritical ? 'Storage Zone B - Bottleneck' : 'Storage Zone A', 
            occupancy: occ, 
            queue: queue, 
            agvsInside: isCritical ? 5 : 2, 
            status: isCritical ? 'High' : 'Normal',
            type: 'aisle'
          };
          rackGroup.add(box);
        }
      }

      scene.add(rackGroup);
      return rackGroup;
    };

    // Aisle A (Spec: Normal - Green)
    createPalletRack(-6, -4, 'normal', 'Aisle A', 42, 2);
    createPalletRack(-6, -11, 'normal', 'Aisle A (Rear)', 38, 1);

    // Aisle B (Spec: High Congestion - Red)
    createPalletRack(16, -4, 'critical', 'Aisle B', 94, 18);
    createPalletRack(16, -11, 'critical', 'Aisle B (Rear)', 91, 14);

    // ================= E. SPEC BLOCK 4 & 6: ATTENTION HEATMAP (AISLE B HOTSPOT) =================
    // Radial Attention Heatmap Circle directly on Aisle B Floor
    const createAttentionHeatmap = (hx, hz) => {
      const heatGroup = new THREE.Group();
      heatGroup.position.set(hx, 0.05, hz);

      // Core Red Hotspot Ring
      const coreGeo = new THREE.CircleGeometry(6.5, 32);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0xef4444,
        transparent: true,
        opacity: 0.65,
        side: THREE.DoubleSide
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.rotation.x = -Math.PI / 2;
      heatGroup.add(coreMesh);

      // Outer Orange Heat Gradient
      const outerGeo = new THREE.RingGeometry(6.5, 11, 32);
      const outerMat = new THREE.MeshBasicMaterial({
        color: 0xf97316,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide
      });
      const outerMesh = new THREE.Mesh(outerGeo, outerMat);
      outerMesh.rotation.x = -Math.PI / 2;
      heatGroup.add(outerMesh);

      // Ambient Heat Pulse Light
      const heatLight = new THREE.PointLight(0xff1e56, 3.5, 20);
      heatLight.position.set(0, 2, 0);
      heatGroup.add(heatLight);
      pulseLightsRef.current.push(heatLight);

      heatmapGroup.add(heatGroup);
    };

    createAttentionHeatmap(16, -7); // Centered over Aisle B

    // Subtle Green Heatmap for Aisle A (Normal)
    const aisleAGeo = new THREE.PlaneGeometry(9, 14);
    const aisleAMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide
    });
    const aisleAPlane = new THREE.Mesh(aisleAGeo, aisleAMat);
    aisleAPlane.rotation.x = -Math.PI / 2;
    aisleAPlane.position.set(-6, 0.04, -7);
    heatmapGroup.add(aisleAPlane);

    // ================= F. PACKING STATION (SPEC: MODERATE - AMBER) =================
    const createPackingStation = (px, pz) => {
      const packGroup = new THREE.Group();
      packGroup.position.set(px, 0, pz);

      // Packing Work Table
      const tableGeo = new THREE.BoxGeometry(6, 1.4, 3.2);
      const tableMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 });
      const table = new THREE.Mesh(tableGeo, tableMat);
      table.position.y = 0.7;
      table.castShadow = true;
      packGroup.add(table);

      // Yellow Staging Boxes
      for (let i = 0; i < 3; i++) {
        const boxGeo = new THREE.BoxGeometry(1.2, 0.9, 1.0);
        const boxMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 });
        const box = new THREE.Mesh(boxGeo, boxMat);
        box.position.set(-1.8 + i * 1.8, 1.85, 0);
        box.castShadow = true;
        packGroup.add(box);
      }

      // Amber Heat aura on floor
      const auraGeo = new THREE.PlaneGeometry(8, 5);
      const auraMat = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide
      });
      const aura = new THREE.Mesh(auraGeo, auraMat);
      aura.rotation.x = -Math.PI / 2;
      aura.position.y = 0.04;
      packGroup.add(aura);

      packGroup.userData = {
        id: 'PACKING-01',
        name: 'Packing & Sortation Station',
        zone: 'Packing Zone C',
        occupancy: 72,
        queue: 7,
        agvsInside: 3,
        status: 'Moderate',
        type: 'station'
      };

      scene.add(packGroup);
      return packGroup;
    };

    createPackingStation(16, 9); // Packing Station

    // ================= G. CONVEYOR BELT SYSTEM WITH MOVING BOXES =================
    const createConveyorSystem = () => {
      const conveyorGroup = new THREE.Group();
      
      // Conveyor Structure from Inbound (-8, 1.0, 9) to Packing (13, 1.0, 9)
      const length = 21;
      const beamGeo = new THREE.BoxGeometry(length, 0.4, 1.2);
      const beamMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.6 });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set(2.5, 0.9, 9);
      beam.castShadow = true;
      conveyorGroup.add(beam);

      // Rollers Texture effect (repeated small cylinders)
      const rollerGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.1, 8);
      const rollerMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.7 });
      for (let rx = -7; rx <= 12; rx += 0.8) {
        const roller = new THREE.Mesh(rollerGeo, rollerMat);
        roller.rotation.x = Math.PI / 2;
        roller.position.set(rx, 1.15, 9);
        conveyorGroup.add(roller);
      }

      // Moving Parcel Boxes on Conveyor
      const boxMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });
      for (let b = 0; b < 4; b++) {
        const cBoxGeo = new THREE.BoxGeometry(0.8, 0.6, 0.8);
        const cBox = new THREE.Mesh(cBoxGeo, boxMat);
        cBox.position.set(-6 + b * 5, 1.55, 9);
        cBox.castShadow = true;
        conveyorGroup.add(cBox);
        movingConveyorBoxesRef.current.push({
          mesh: cBox,
          speed: 0.04,
          minX: -7.5,
          maxX: 12.8
        });
      }

      conveyorGroup.userData = {
        id: 'CONV-01',
        name: 'Inbound-to-Packing Sortation Conveyor',
        zone: 'Transit Line',
        occupancy: 64,
        speed: '1.2 m/s',
        queue: 4,
        status: 'Normal',
        type: 'conveyor'
      };

      pathsGroup.add(conveyorGroup);
    };

    createConveyorSystem();

    // ================= H. SPEC BLOCK 4: WAREHOUSE GRAPH TOPOLOGY (NODES & EDGES) =================
    const createWarehouseGraphTopology = () => {
      const graphNodes = [
        { id: 'NODE-INBOUND', label: 'Inbound Dock', x: -14, z: 9, color: 0x0284c7, status: 'Normal' },
        { id: 'NODE-AISLE-A', label: 'Aisle A (Normal)', x: -6, z: -4, color: 0x10b981, status: 'Normal' },
        { id: 'NODE-AISLE-B', label: 'Aisle B (High Congestion)', x: 16, z: -4, color: 0xef4444, status: 'High', isPulsing: true },
        { id: 'NODE-PACKING', label: 'Packing (Moderate)', x: 16, z: 9, color: 0xf59e0b, status: 'Moderate' },
        { id: 'NODE-OUTBOUND', label: 'Outbound Bay', x: 26, z: 9, color: 0x06b6d4, status: 'Normal' },
      ];

      // 1. Render Graph Nodes (3D glowing spheres + base rings)
      graphNodes.forEach((node) => {
        const nGroup = new THREE.Group();
        nGroup.position.set(node.x, 0.4, node.z);

        // Core Node Sphere
        const sphereGeo = new THREE.SphereGeometry(0.65, 16, 16);
        const sphereMat = new THREE.MeshStandardMaterial({
          color: node.color,
          emissive: node.color,
          emissiveIntensity: 0.6,
          metalness: 0.2,
          roughness: 0.3
        });
        const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
        sphereMesh.position.y = 0.5;
        nGroup.add(sphereMesh);

        // Glowing base disc
        const ringGeo = new THREE.RingGeometry(0.8, 1.4, 24);
        const ringMat = new THREE.MeshBasicMaterial({
          color: node.color,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = -Math.PI / 2;
        ringMesh.position.y = 0.05;
        nGroup.add(ringMesh);

        if (node.isPulsing) {
          graphPulseNodesRef.current.push({ ring: ringMesh, light: sphereMesh });
        }

        graphGroup.add(nGroup);
      });

      // 2. Render Graph Edges (Movement Paths)
      const edgeConnections = [
        [[-14, 0.45, 9], [-6, 0.45, -4]],             // Inbound -> Aisle A
        [[-14, 0.45, 9], [16, 0.45, -4]],             // Inbound -> Aisle B (Congestion Source)
        [[-6, 0.45, -4], [16, 0.45, -4]],             // Aisle A -> Aisle B
        [[16, 0.45, -4], [16, 0.45, 9]],              // Aisle B -> Packing (Bottleneck exit)
        [[16, 0.45, 9], [26, 0.45, 9]],               // Packing -> Outbound
        [[-6, 0.45, -4], [4, 0.45, 3], [16, 0.45, 9]] // AI Dynamic Reroute Bypass Path
      ];

      edgeConnections.forEach((pts, idx) => {
        const vPoints = pts.map(p => new THREE.Vector3(p[0], p[1], p[2]));
        const curve = new THREE.CatmullRomCurve3(vPoints);
        const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.12, 8, false);
        const isBypass = idx === edgeConnections.length - 1;
        const tubeMat = new THREE.MeshBasicMaterial({
          color: isBypass ? 0x00f5a0 : 0x38bdf8,
          transparent: true,
          opacity: isBypass ? 0.95 : 0.75
        });
        const edgeLine = new THREE.Mesh(tubeGeo, tubeMat);
        graphGroup.add(edgeLine);
      });
    };

    createWarehouseGraphTopology();

    // ================= I. AGV / AMR ROBOTS (AUTONOMOUS FLEET) =================
    const createAGV = (name, initialX, initialZ, colorHex, task, pathCoords) => {
      const agvGroup = new THREE.Group();
      agvGroup.position.set(initialX, 0, initialZ);

      // Low-profile chassis
      const chassisGeo = new THREE.BoxGeometry(2.0, 0.5, 1.4);
      const chassisMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
      const chassis = new THREE.Mesh(chassisGeo, chassisMat);
      chassis.position.y = 0.35;
      chassis.castShadow = true;
      agvGroup.add(chassis);

      // Neon LED Lidar Ring
      const bandGeo = new THREE.BoxGeometry(2.05, 0.12, 1.45);
      const bandMat = new THREE.MeshBasicMaterial({ color: colorHex });
      const band = new THREE.Mesh(bandGeo, bandMat);
      band.position.y = 0.35;
      agvGroup.add(band);

      // Pallet on AGV top
      const palGeo = new THREE.BoxGeometry(1.5, 0.15, 1.2);
      const palMat = new THREE.MeshStandardMaterial({ color: 0xb45309 });
      const pal = new THREE.Mesh(palGeo, palMat);
      pal.position.y = 0.68;
      agvGroup.add(pal);

      // Cargo box on pallet
      const boxGeo = new THREE.BoxGeometry(1.1, 0.8, 0.9);
      const boxMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.4 });
      const cbox = new THREE.Mesh(boxGeo, boxMat);
      cbox.position.y = 1.15;
      cbox.castShadow = true;
      agvGroup.add(cbox);

      agvGroup.userData = {
        id: name,
        name,
        type: 'agv',
        zone: name.includes('01') ? 'Aisle A' : name.includes('02') ? 'Aisle B Hotspot' : 'Bypass Route',
        status: name.includes('02') ? 'High Congestion Delay' : 'Active Haul',
        speed: name.includes('02') ? '0.4 m/s' : '1.6 m/s',
        battery: 88,
        payload: '380 kg',
        task,
        occupancy: 80
      };

      vehiclesGroup.add(agvGroup);

      movingAgvsRef.current.push({
        group: agvGroup,
        coords: pathCoords,
        t: Math.random(),
        speed: name.includes('02') ? 0.0015 : 0.003
      });

      return agvGroup;
    };

    // AGV 1: Inbound -> Aisle A
    createAGV('AGV-01', -10, 4, 0x10b981, 'Pallet Ingestion to Aisle A', [
      new THREE.Vector3(-14, 0, 9),
      new THREE.Vector3(-10, 0, 2),
      new THREE.Vector3(-6, 0, -4)
    ]);

    // AGV 2: Trapped in Aisle B Bottleneck
    createAGV('AGV-02', 16, -2, 0xef4444, 'Aisle B Chokepoint Queueing', [
      new THREE.Vector3(16, 0, -11),
      new THREE.Vector3(16, 0, -4),
      new THREE.Vector3(16, 0, 2)
    ]);

    // AGV 3: AI Dynamic Reroute Bypass
    createAGV('AGV-03', 4, 3, 0x00f5a0, 'AI Bypass Reroute to Packing', [
      new THREE.Vector3(-6, 0, -4),
      new THREE.Vector3(4, 0, 3),
      new THREE.Vector3(16, 0, 9)
    ]);

    // ================= J. FORKLIFT & DOCKED TRUCK =================
    // Forklift at Inbound Dock
    const createForklift = (fx, fz, rotY = 0) => {
      const flGroup = new THREE.Group();
      flGroup.position.set(fx, 0, fz);
      flGroup.rotation.y = rotY;

      const chassisGeo = new THREE.BoxGeometry(3.2, 1.4, 2.0);
      const chassisMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 });
      const chassis = new THREE.Mesh(chassisGeo, chassisMat);
      chassis.position.y = 0.9;
      chassis.castShadow = true;
      flGroup.add(chassis);

      const mastGeo = new THREE.BoxGeometry(0.15, 3.2, 1.4);
      const mastMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
      const mast = new THREE.Mesh(mastGeo, mastMat);
      mast.position.set(1.65, 2.0, 0);
      flGroup.add(mast);

      flGroup.userData = {
        id: 'FL-01',
        name: 'Forklift AMR FL-01',
        type: 'forklift',
        zone: 'Loading Dock Bay 1',
        status: 'Normal',
        battery: 92,
        speed: '1.8 m/s',
        occupancy: 42,
        queue: 3,
        task: 'Unloading Pallet #PL-902 from Dock 1'
      };

      vehiclesGroup.add(flGroup);
      return flGroup;
    };

    createForklift(-5, 9, 0);

    // Docked Truck at Bay 1
    const createTruck = (tx, tz, rotY = 0, isDocked = true) => {
      const truckGroup = new THREE.Group();
      truckGroup.position.set(tx, 0, tz);
      truckGroup.rotation.y = rotY;

      // Cab
      const cabGeo = new THREE.BoxGeometry(4.2, 3.2, 3.2);
      const cabMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.3 });
      const cab = new THREE.Mesh(cabGeo, cabMat);
      cab.position.set(6.2, 2.2, 0);
      cab.castShadow = true;
      truckGroup.add(cab);

      // Trailer
      const trailerGeo = new THREE.BoxGeometry(12, 4.4, 3.6);
      const trailerMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 });
      const trailer = new THREE.Mesh(trailerGeo, trailerMat);
      trailer.position.set(-1.6, 3.0, 0);
      trailer.castShadow = true;
      truckGroup.add(trailer);

      // TwinFlow Logo Band
      const logoBandGeo = new THREE.BoxGeometry(11.8, 0.9, 3.65);
      const logoBandMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8 });
      const logoBand = new THREE.Mesh(logoBandGeo, logoBandMat);
      logoBand.position.set(-1.6, 3.2, 0);
      truckGroup.add(logoBand);

      truckGroup.userData = {
        id: 'TRK-2051',
        name: 'Truck TRK-2051',
        type: 'truck',
        zone: 'Dock Bay 1',
        status: 'Loading Inbound Pallets',
        battery: 100,
        occupancy: 68,
        queue: 4,
        task: 'Cross-Dock Transfer (ETA 12 min)'
      };

      vehiclesGroup.add(truckGroup);
      return truckGroup;
    };

    createTruck(-14, 13, -Math.PI / 2, true);

    // Moving Transit Truck on Road
    const roadTruck = createTruck(20, 25, 0, false);
    movingVehiclesRef.current.push({ group: roadTruck, speed: 0.12, minX: -45, maxX: 45 });

    // Trees
    const createTree = (tx, tz) => {
      const treeGroup = new THREE.Group();
      treeGroup.position.set(tx, 0, tz);

      const trunkGeo = new THREE.CylinderGeometry(0.3, 0.45, 2.8, 8);
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.8 });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 1.4;
      treeGroup.add(trunk);

      const fGeo1 = new THREE.DodecahedronGeometry(2.0, 1);
      const fMat1 = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.6 });
      const foliage1 = new THREE.Mesh(fGeo1, fMat1);
      foliage1.position.y = 3.6;
      treeGroup.add(foliage1);

      scene.add(treeGroup);
    };

    [
      [36, 12], [38, 2], [35, -12], [32, -22],
      [-12, -26], [6, -26], [22, -26], [-36, -18]
    ].forEach(([tx, tz]) => createTree(tx, tz));

    // ================= K. SPEC 3D FLOATING LOCATION PINS =================
    // Matches Section 4: Aisle A (Normal), Aisle B (High Congestion), Packing (Moderate), Inbound
    const createFloatingPin = (px, py, pz, label, type = 'normal') => {
      const pinGroup = new THREE.Group();
      pinGroup.position.set(px, py, pz);

      const isCritical = type === 'critical';
      const isModerate = type === 'moderate';
      const pinColor = isCritical ? 0xef4444 : isModerate ? 0xf59e0b : 0x10b981;

      // Pin Head (Inverted Cone + Sphere)
      const sphereGeo = new THREE.SphereGeometry(0.7, 16, 16);
      const pinMat = new THREE.MeshStandardMaterial({
        color: pinColor,
        metalness: 0.2,
        roughness: 0.3,
        emissive: pinColor,
        emissiveIntensity: 0.4,
      });
      const pinSphere = new THREE.Mesh(sphereGeo, pinMat);
      pinSphere.position.y = 1.0;
      pinGroup.add(pinSphere);

      const coneGeo = new THREE.ConeGeometry(0.68, 1.2, 16);
      const pinCone = new THREE.Mesh(coneGeo, pinMat);
      pinCone.rotation.x = Math.PI;
      pinCone.position.y = 0.4;
      pinGroup.add(pinCone);

      // Glowing Base Ring
      const ringGeo = new THREE.RingGeometry(0.9, 1.4, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: pinColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = -py + 0.1;
      pinGroup.add(ring);

      // 3D Billboard Sprite Canvas Label
      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 72;
      const ctx = canvas.getContext('2d');
      
      // Background pill
      ctx.fillStyle = isCritical 
        ? 'rgba(220, 38, 38, 0.95)' 
        : isModerate 
        ? 'rgba(217, 119, 6, 0.95)' 
        : 'rgba(5, 150, 105, 0.95)';
      ctx.roundRect(8, 8, 304, 56, 24);
      ctx.fill();

      // Border stroke
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Label Text
      ctx.font = 'bold 22px Inter, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, 160, 36);

      const tex = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.y = 2.4;
      sprite.scale.set(7.5, 1.7, 1);
      pinGroup.add(sprite);

      pinsGroup.add(pinGroup);
      floatingPinsRef.current.push({ group: pinGroup, baseY: py });
      return pinGroup;
    };

    createFloatingPin(-6, 9.5, -4, 'Aisle A : Normal', 'normal');
    createFloatingPin(16, 9.5, -4, 'Aisle B : High Congestion', 'critical');
    createFloatingPin(16, 5.5, 9, 'Packing : Moderate', 'moderate');
    createFloatingPin(-14, 6.0, 9, 'Inbound Docks', 'normal');

    // ================= L. IOT SENSORS & CEILING VISION CONES =================
    const sensorGeo = new THREE.ConeGeometry(0.6, 1.2, 8);
    const sensorMat = new THREE.MeshBasicMaterial({ color: 0x0284c7, wireframe: true });
    for (let sx = -16; sx <= 20; sx += 12) {
      const sensor = new THREE.Mesh(sensorGeo, sensorMat);
      sensor.position.set(sx, 14, 0);
      sensor.rotation.x = Math.PI;
      sensorsGroup.add(sensor);
    }

    // Loading transition
    setTimeout(() => {
      setIsLoading(false);
    }, 450);

    // ================= 12. ANIMATION LOOP (60 FPS) =================
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      controls.update();

      // Animate Moving Transit Road Trucks
      movingVehiclesRef.current.forEach((v) => {
        v.group.position.x += v.speed;
        if (v.group.position.x > v.maxX) {
          v.group.position.x = v.minX;
        }
      });

      // Animate Moving Conveyor Parcel Boxes
      movingConveyorBoxesRef.current.forEach((cb) => {
        cb.mesh.position.x += cb.speed;
        if (cb.mesh.position.x > cb.maxX) {
          cb.mesh.position.x = cb.minX;
        }
      });

      // Animate AGVs along path coordinates
      movingAgvsRef.current.forEach((agv) => {
        agv.t += agv.speed;
        if (agv.t > 1) agv.t = 0;
        
        // Simple linear interpolation across coords
        const pts = agv.coords;
        if (pts.length >= 2) {
          const totalSegments = pts.length - 1;
          const segmentIndex = Math.min(Math.floor(agv.t * totalSegments), totalSegments - 1);
          const subT = (agv.t * totalSegments) - segmentIndex;
          const p1 = pts[segmentIndex];
          const p2 = pts[segmentIndex + 1];

          agv.group.position.lerpVectors(p1, p2, subT);
          agv.group.lookAt(p2.x, agv.group.position.y, p2.z);
        }
      });

      // Animate Floating Pins Hover Oscillation
      floatingPinsRef.current.forEach((pin, idx) => {
        pin.group.position.y = pin.baseY + Math.sin(elapsedTime * 3 + idx) * 0.35;
      });

      // Animate Pulsing Alert Lights
      pulseLightsRef.current.forEach((light) => {
        light.intensity = 2.5 + Math.sin(elapsedTime * 6) * 1.8;
      });

      // Animate Graph Pulse Node rings
      graphPulseNodesRef.current.forEach((pn) => {
        const scaleVal = 1 + Math.sin(elapsedTime * 4) * 0.25;
        pn.ring.scale.set(scaleVal, scaleVal, 1);
      });

      renderer.render(scene, camera);
    };

    animate();

    // Window Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 740;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (renderer && renderer.domElement) {
        renderer.dispose();
      }
    };
  }, []);

  // Raycaster for Hover & Click on 3D Objects
  const handlePointerMove = (e) => {
    if (!containerRef.current || !cameraRef.current || !sceneRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    setTooltipPos({ x: e.clientX - rect.left + 16, y: e.clientY - rect.top - 16 });

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const intersects = raycaster.intersectObjects(sceneRef.current.children, true);
    let hit = null;

    for (let item of intersects) {
      let obj = item.object;
      while (obj) {
        if (obj.userData && obj.userData.id) {
          hit = obj.userData;
          break;
        }
        obj = obj.parent;
      }
      if (hit) break;
    }

    setHoveredAsset(hit);
  };

  const handlePointerClick = (e) => {
    if (!containerRef.current || !cameraRef.current || !sceneRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const intersects = raycaster.intersectObjects(sceneRef.current.children, true);
    for (let item of intersects) {
      let obj = item.object;
      while (obj) {
        if (obj.userData && obj.userData.id) {
          setActiveAsset(obj.userData);
          if (onSelectNode) onSelectNode(obj.userData);
          return;
        }
        obj = obj.parent;
      }
    }
  };

  // Camera Mode Presets
  const handleSetCamera = (mode) => {
    setCameraMode(mode);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    if (mode === 'top') {
      camera.position.set(2, 90, 0.01);
      controls.target.set(2, 0, 0);
    } else if (mode === 'isometric') {
      camera.position.set(54, 48, 54);
      controls.target.set(2, 2, 0);
    } else {
      camera.position.set(54, 48, 54);
      controls.target.set(2, 2, 0);
    }
  };

  // Toggle Fullscreen
  const handleToggleFullscreen = () => {
    const el = containerRef.current?.parentElement;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden bg-[#f1f5f9] select-none shadow-sm border border-slate-200/90 ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none w-screen h-screen' : 'h-[720px] sm:h-[760px] lg:h-[800px]'
    }`}>

      {/* 3D WebGL Viewport */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onClick={handlePointerClick}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center space-y-4 z-40 transition-opacity duration-500">
          <div className="relative">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-200 flex items-center justify-center animate-pulse">
              <Box className="w-8 h-8 text-blue-600 animate-bounce" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 animate-ping" />
          </div>
          <div className="text-center space-y-1">
            <h4 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Loading 3D Digital Twin Architecture...
            </h4>
            <p className="text-xs text-slate-400 font-mono">
              Synchronizing Aisle A, Aisle B, Graph Topology & DSTGT Attention Heatmaps
            </p>
          </div>
          <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 via-mint-400 to-blue-500 rounded-full animate-pulse w-3/4" />
          </div>
        </div>
      )}

      {/* ================= TOP-LEFT FLOATING PANEL: SPEC LAYERS ================= */}
      <div className="absolute top-5 left-5 z-20 bg-white/95 backdrop-blur-md p-4 rounded-3xl border border-slate-200 shadow-md space-y-2.5 w-64">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-bold text-slate-900">Digital Twin Layers</h4>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
            Spec v1.0
          </span>
        </div>

        <div className="space-y-1.5 text-xs font-medium text-slate-700">
          {[
            { id: 'heatmap', label: 'Attention Heatmap (Block 6)', color: 'text-rose-600' },
            { id: 'graph', label: 'Warehouse Graph (Nodes/Edges)', color: 'text-sky-600' },
            { id: 'agvs', label: 'AGVs, AMRs & Forklifts', color: 'text-emerald-600' },
            { id: 'paths', label: 'Conveyor & Transit Flow', color: 'text-amber-600' },
            { id: 'labels', label: '3D Aisle & Dock Badges', color: 'text-slate-700' },
            { id: 'sensors', label: 'IoT Sensors & Vision Cones', color: 'text-slate-700' },
          ].map((layer) => (
            <label
              key={layer.id}
              className="flex items-center justify-between cursor-pointer p-1.5 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <span className={`text-[11px] font-semibold ${layer.color}`}>{layer.label}</span>
              <input
                type="checkbox"
                checked={layers[layer.id]}
                onChange={(e) => setLayers({ ...layers, [layer.id]: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
              />
            </label>
          ))}
        </div>
      </div>

      {/* ================= TOP-RIGHT: VIEW CONTROLS & EXPLAINABILITY TOGGLE ================= */}
      <div className="absolute top-5 right-5 z-20 flex items-center space-x-2">
        {/* Toggle Explainability Card */}
        <button
          onClick={() => setShowExplainability(!showExplainability)}
          className={`px-3 py-2 rounded-2xl border text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all ${
            showExplainability 
              ? 'bg-rose-50 text-rose-700 border-rose-200' 
              : 'bg-white/95 text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
          title="Explainability Layer from Architecture Spec"
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-600" />
          <span>Explainability Spec</span>
        </button>

        {/* Camera Presets */}
        <div className="bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200 shadow-md flex items-center space-x-1 text-xs font-bold text-slate-700">
          {['isometric', 'top', 'reset'].map((mode) => (
            <button
              key={mode}
              onClick={() => handleSetCamera(mode)}
              className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
                cameraMode === mode
                  ? 'bg-slate-950 text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Fullscreen Button */}
        <button
          onClick={handleToggleFullscreen}
          className="w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-colors"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* ================= FLOATING BLOCK 6 EXPLAINABILITY LAYER PANEL ================= */}
      {showExplainability && (
        <div className="absolute top-18 right-5 z-25 w-76 sm:w-84 bg-white/95 backdrop-blur-xl p-4.5 rounded-3xl border border-slate-200/90 shadow-xl space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-950">6. Explainability Layer</h4>
                <p className="text-[10px] text-slate-400">Dynamic Spatio-Temporal Graph Transformer</p>
              </div>
            </div>
            <button
              onClick={() => setShowExplainability(false)}
              className="text-slate-400 hover:text-slate-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Attention Heatmap Hotspot Badge */}
          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="font-semibold text-slate-800">Attention Hotspot:</span>
            </div>
            <span className="font-bold text-rose-600 font-mono">Aisle B (94% Occ)</span>
          </div>

          {/* Influential Locations / Features (Matches Spec Block 6 Bar Chart) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
              <span>Influential Features</span>
              <span className="text-[10px] text-slate-400 font-mono">Weight (Attention)</span>
            </div>
            {[
              { name: 'Aisle B (Occupancy)', val: '0.32', pct: 32, color: 'bg-rose-500' },
              { name: 'AGV Count (Congestion)', val: '0.24', pct: 24, color: 'bg-sky-500' },
              { name: 'Queue Length (Bottleneck)', val: '0.18', pct: 18, color: 'bg-amber-500' },
              { name: 'Order Volume Inflow', val: '0.15', pct: 15, color: 'bg-blue-500' },
              { name: 'Conveyor Load (Speed)', val: '0.11', pct: 11, color: 'bg-emerald-500' },
            ].map((item) => (
              <div key={item.name} className="space-y-0.5">
                <div className="flex items-center justify-between text-[10px] font-medium text-slate-600">
                  <span>{item.name}</span>
                  <span className="font-mono font-bold text-slate-900">{item.val}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct * 2.5}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Prediction Confidence Gauge (Matches Spec Block 6 87% High Risk) */}
          <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200/80 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="relative w-9 h-9 flex items-center justify-center">
                <div className="w-9 h-9 rounded-full border-4 border-rose-200 border-t-rose-600 animate-spin" />
                <span className="absolute text-[10px] font-mono font-black text-rose-700">87%</span>
              </div>
              <div>
                <span className="text-xs font-bold text-rose-950 block">Prediction Confidence</span>
                <span className="text-[10px] text-rose-600 font-semibold">High Bottleneck Risk</span>
              </div>
            </div>
            <button
              onClick={() => onNavigateToPredictions && onNavigateToPredictions()}
              className="px-2.5 py-1 rounded-xl bg-rose-600 text-white text-[10px] font-bold hover:bg-rose-700 transition-colors"
            >
              Details
            </button>
          </div>
        </div>
      )}

      {/* ================= BOTTOM-LEFT: SPEC ARCHITECTURE LEGEND ================= */}
      <div className="absolute bottom-5 left-5 z-20 bg-white/95 backdrop-blur-md p-4 rounded-3xl border border-slate-200 shadow-md space-y-2.5 max-w-xs">
        <div className="flex items-center justify-between text-xs font-bold text-slate-900 pb-1.5 border-b border-slate-100">
          <div className="flex items-center space-x-1.5">
            <Network className="w-3.5 h-3.5 text-blue-600" />
            <span>Graph & Floor Nodes</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">DSTGT Spec</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-700">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Aisle A (Normal)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span>Aisle B (High)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Packing (Moderate)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span>Inbound Docks</span>
          </div>
        </div>

        {/* Dynamic Scenario Switcher */}
        <div className="pt-1 border-t border-slate-100">
          <div className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-700 font-semibold flex items-center justify-between">
            <span className="truncate">{simScenario}</span>
            <button
              onClick={() => setSimScenario(simScenario.includes('AI') ? 'Baseline Peak Shift' : 'AI Dynamic Bypass Active')}
              className="text-blue-600 font-bold hover:underline ml-1"
            >
              Toggle
            </button>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM BAR: TIME SLIDER & PLAYBACK ================= */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur-md px-5 py-3 rounded-full border border-slate-200 shadow-lg flex items-center space-x-4">
        {/* Play / Pause Auto-Animate Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-8 h-8 rounded-full bg-slate-950 text-white flex items-center justify-center hover:bg-slate-800 transition-colors shadow-2xs"
          title={isPlaying ? 'Pause Auto-Play' : 'Auto-animate through time'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 text-mint-400" /> : <Play className="w-3.5 h-3.5 text-mint-400 fill-mint-400 ml-0.5" />}
        </button>

        {/* Time Slider Tabs: Now | +15 | +30 | +60 min */}
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

        {/* State Label */}
        <div className="border-l border-slate-200 pl-3 text-xs text-slate-500 font-mono hidden sm:block">
          Forecast: <strong className="text-slate-900">{timeOffset === 0 ? 'Live Telemetry' : `+${timeOffset}m Forecast Lead`}</strong>
        </div>
      </div>

      {/* ================= HOVER TOOLTIP (Follows cursor) ================= */}
      {hoveredAsset && (
        <div
          className="absolute z-30 pointer-events-none px-3.5 py-2 rounded-2xl bg-slate-950/95 text-white text-xs font-bold shadow-xl border border-slate-800/80 flex items-center space-x-2.5 backdrop-blur-md transition-all duration-75"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
        >
          <div className={`w-2 h-2 rounded-full ${
            hoveredAsset.status === 'High' ? 'bg-rose-500 animate-ping' :
            hoveredAsset.status === 'Moderate' ? 'bg-amber-400' : 'bg-mint-400'
          }`} />
          <span>{hoveredAsset.name || hoveredAsset.id}</span>
          <span className="font-mono text-mint-400 font-semibold border-l border-slate-700 pl-2">
            {hoveredAsset.occupancy || 50}% Occupancy
          </span>
        </div>
      )}

      {/* ================= RIGHT DRAWER ON CLICK (Node Telemetry & What-if) ================= */}
      {activeAsset && (
        <div className="absolute top-5 right-5 bottom-5 z-30 w-80 sm:w-96 bg-white/98 backdrop-blur-xl rounded-3xl border border-slate-200 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-fadeIn">
          <div>
            {/* Header: Name + Status Badge */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  {activeAsset.type ? activeAsset.type.toUpperCase() : 'TELEMETRY'} NODE
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
                  {activeAsset.status || 'Active'}
                </span>
                <button
                  onClick={() => setActiveAsset(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  title="Close Drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Current Mission or Risk Badge */}
            <div className="my-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                activeAsset.status === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {activeAsset.status === 'High' ? 'ALERT' : 'FLOW'}
              </div>
              <div className="text-xs">
                <span className="text-slate-400 text-[10px] block">Operational State / Action</span>
                <strong className="text-slate-800 font-semibold">{activeAsset.task || activeAsset.operator || 'Standard Routing'}</strong>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5 my-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] block">Occupancy Rate</span>
                <strong className="text-slate-900 text-base font-mono">{activeAsset.occupancy || 75}%</strong>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] block">AGVs Active</span>
                <strong className="text-slate-900 text-base font-mono">{activeAsset.agvsInside || 3} AMRs</strong>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] block">Queue Length</span>
                <strong className="text-slate-900 text-base font-mono">{activeAsset.queue || 4} units</strong>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] block">Predicted (+30m)</span>
                <strong className={`text-base font-mono ${activeAsset.occupancy > 75 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {activeAsset.occupancy > 75 ? 'High Risk (87%)' : 'Nominal Flow'}
                </strong>
              </div>
            </div>

            {/* Mini Forecast Chart */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 mb-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center space-x-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                  <span>DSTGT Congestion Forecast</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Risk: 87%</span>
              </div>
              
              <div className="w-full h-18">
                <svg viewBox="0 0 280 65" className="w-full h-full" fill="none">
                  <path
                    d="M 10 48 C 50 42, 90 22, 140 26 C 190 30, 220 12, 270 16"
                    stroke={activeAsset.status === 'High' ? '#dc2626' : '#2563eb'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 10 48 C 50 42, 90 22, 140 26 C 190 30, 220 12, 270 16 L 270 65 L 10 65 Z"
                    fill={activeAsset.status === 'High' ? '#ef4444' : '#3b82f6'}
                    fillOpacity="0.14"
                  />
                  <circle cx="270" cy="16" r="3.5" fill={activeAsset.status === 'High' ? '#dc2626' : '#1e40af'} />
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
                setActiveAsset({ ...activeAsset, occupancy: 32, status: 'Normal', queue: 1 });
                setSimScenario('AI Dynamic Bypass Active');
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
                <span>Configure Node Thresholds</span>
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
