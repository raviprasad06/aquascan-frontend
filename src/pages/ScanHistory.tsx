import React, { useEffect, useState } from 'react';
import { ReportsTable } from '../components/reports/ReportsTable';
import { getScanHistory, ScanRecord } from '../utils/scanStorage';

export const ScanHistory: React.FC = () => {
  const [scans, setScans] = useState<ScanRecord[]>([]);

  useEffect(() => {
    const syncHistory = () => {
      setScans(getScanHistory());
    };
    syncHistory();
    window.addEventListener('aquascan-scan-updated', syncHistory);
    window.addEventListener('storage', syncHistory);

    return () => {
      window.removeEventListener('aquascan-scan-updated', syncHistory);
      window.removeEventListener('storage', syncHistory);
    };
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 font-mono select-none">
      <ReportsTable scans={scans} />
    </div>
  );
};

export default ScanHistory;
