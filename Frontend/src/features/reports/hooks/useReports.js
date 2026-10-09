import { useState, useEffect } from 'react';
import { reportsService } from '../../../services';
import { DEFAULT_REPORTS } from '../mockData/reportsMocks';

export function useReports() {
  const [reports, setReports] = useState(DEFAULT_REPORTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    reportsService.getReports()
      .then((data) => {
        if (mounted && data) setReports(data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const deleteReport = async (id) => {
    await reportsService.deleteReport(id);
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  const addReport = (newReport) => {
    setReports((prev) => [newReport, ...prev]);
  };

  return { reports, loading, deleteReport, addReport, setReports };
}

export default useReports;
