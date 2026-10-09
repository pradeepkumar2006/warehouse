/**
 * A10 Warehouse Config Mock Data
 */
import { DEFAULT_THRESHOLDS } from '../../../config/appConfig';

export const DEFAULT_AISLES = [
  { id: 'AISLE-A', name: 'Aisle A (Inbound)', zone: 'Zone 1 (Inbound)', capacity: 45, status: 'Active', x: 20, y: 30, color: '#10b981' },
  { id: 'AISLE-B', name: 'Aisle B (Hotspot Central)', zone: 'Zone 2 (Storage)', capacity: 60, status: 'Active', x: 50, y: 30, color: '#ef4444' },
  { id: 'AISLE-C', name: 'Aisle C (Buffer Storage)', zone: 'Zone 2 (Storage)', capacity: 55, status: 'Active', x: 20, y: 70, color: '#3b82f6' },
  { id: 'AISLE-D', name: 'Aisle D (Sortation Feed)', zone: 'Zone 3 (Sortation)', capacity: 40, status: 'Active', x: 50, y: 70, color: '#8b5cf6' },
  { id: 'STA-PK1', name: 'Packing Station 1', zone: 'Zone 4 (Outbound)', capacity: 30, status: 'Active', x: 80, y: 50, color: '#06b6d4' },
];

export const DEFAULT_ZONE_CAPACITIES = {
  zone1: { name: 'Zone 1 (Inbound Docks)', maxAgvs: 8, maxQueue: 15, maxItemsPerAisle: 350 },
  zone2: { name: 'Zone 2 (Storage Racks A & B)', maxAgvs: 12, maxQueue: 25, maxItemsPerAisle: 600 },
  zone3: { name: 'Zone 3 (Sortation Hub)', maxAgvs: 10, maxQueue: 20, maxItemsPerAisle: 450 },
  zone4: { name: 'Zone 4 (Outbound Bay)', maxAgvs: 6, maxQueue: 12, maxItemsPerAisle: 300 },
};

export const INITIAL_THRESHOLDS = {
  moderate: DEFAULT_THRESHOLDS.MODERATE,
  high: DEFAULT_THRESHOLDS.HIGH,
  critical: DEFAULT_THRESHOLDS.CRITICAL,
};
