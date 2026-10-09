/**
 * A11 System Settings Mock Data
 */
export const DEFAULT_DATA_SOURCES = [
  {
    id: 'mqtt',
    name: 'MQTT Broker (Sensors & IoT)',
    endpoint: 'mqtt://broker.warehouse-internal:1883/topics/telemetry',
    status: 'Connected',
    lastMessageTime: 'Just now',
    latency: '14ms',
  },
  {
    id: 'opc-ua',
    name: 'OPC-UA Server (PLC & Conveyors)',
    endpoint: 'opc.tcp://plc-gateway.zone2.local:4840',
    status: 'Connected',
    lastMessageTime: '3s ago',
    latency: '22ms',
  },
  {
    id: 'kafka',
    name: 'Apache Kafka Event Stream',
    endpoint: 'kafka-cluster-prod.telemetry.svc:9092',
    status: 'Connected',
    lastMessageTime: '1s ago',
    latency: '8ms',
  },
  {
    id: 'rest-api',
    name: 'WMS / ERP REST API Gateway',
    endpoint: 'https://api.warehouse-erp.internal/v2/orders',
    status: 'Connected',
    lastMessageTime: '12s ago',
    latency: '65ms',
  },
];

export const INITIAL_AUDIT_LOGS = [
  { id: 'LOG-101', user: 'admin', action: 'Changed High threshold 70 to 75', module: 'Warehouse Config', time: '10:42', ip: '192.168.1.5' },
  { id: 'LOG-102', user: 'admin', action: 'Acknowledged Alert #ALT-904 in Aisle B', module: 'Bottleneck Alerts', time: '10:15', ip: '192.168.1.5' },
  { id: 'LOG-103', user: 'david.chen', action: 'Generated Weekly Congestion PDF report', module: 'Reports', time: '09:48', ip: '192.168.1.22' },
  { id: 'LOG-104', user: 'admin', action: 'Retrained DSTGT model to v1.02', module: 'Model Engine', time: '09:12', ip: '192.168.1.5' },
  { id: 'LOG-105', user: 'sam.haddad', action: 'Simulated reroute fix for 12 AGVs', module: 'What-If Sim', time: '08:30', ip: '192.168.1.18' },
  { id: 'LOG-106', user: 'admin', action: 'Created new user account: lucas.mayer', module: 'User Management', time: 'Yesterday', ip: '192.168.1.5' },
];
