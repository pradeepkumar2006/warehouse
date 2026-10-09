import { useState } from 'react';
import { DEFAULT_AISLES, DEFAULT_ZONE_CAPACITIES, INITIAL_THRESHOLDS } from '../mockData/configMocks';

export function useWarehouseConfig() {
  const [aisles, setAisles] = useState(DEFAULT_AISLES);
  const [capacities, setCapacities] = useState(DEFAULT_ZONE_CAPACITIES);
  const [thresholds, setThresholds] = useState(INITIAL_THRESHOLDS);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const isThresholdValid =
    thresholds.moderate < thresholds.high && thresholds.high < thresholds.critical;

  const markDirty = () => setHasUnsavedChanges(true);

  const resetToDefault = () => {
    setAisles(DEFAULT_AISLES);
    setCapacities(DEFAULT_ZONE_CAPACITIES);
    setThresholds(INITIAL_THRESHOLDS);
    setHasUnsavedChanges(false);
  };

  return {
    aisles,
    setAisles,
    capacities,
    setCapacities,
    thresholds,
    setThresholds,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    isThresholdValid,
    markDirty,
    resetToDefault,
  };
}

export default useWarehouseConfig;
