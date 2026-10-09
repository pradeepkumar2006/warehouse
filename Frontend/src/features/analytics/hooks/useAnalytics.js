import { useState, useEffect } from 'react';
import { analyticsService } from '../../../services';
import { INITIAL_ANALYTICS_KPIS } from '../mockData/analyticsMocks';

export function useAnalytics(dateRange = '7d', zoneFilter = 'All Zones') {
  const [metrics, setMetrics] = useState(INITIAL_ANALYTICS_KPIS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    analyticsService.getMetrics(dateRange, zoneFilter)
      .then((data) => {
        if (mounted && data) {
          setMetrics((prev) => ({ ...prev, ...data }));
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [dateRange, zoneFilter]);

  return { metrics, loading };
}

export default useAnalytics;
