import { useState } from 'react';
import { DEFAULT_DATA_SOURCES, INITIAL_AUDIT_LOGS } from '../mockData/settingsMocks';

export function useSettings() {
  const [dataSources, setDataSources] = useState(DEFAULT_DATA_SOURCES);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);

  const addAuditLog = (action, module, user = 'admin') => {
    const newLog = {
      id: `LOG-${Date.now()}`,
      user,
      action,
      module,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ip: '192.168.1.5',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  return {
    dataSources,
    setDataSources,
    auditLogs,
    setAuditLogs,
    addAuditLog,
  };
}

export default useSettings;
