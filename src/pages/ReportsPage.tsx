import React from 'react';
import { ReportsTable } from '../components/reports/ReportsTable';
import { MOCK_ANOMALIES } from '../data/mockAnomalies';
import { FileText, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 font-mono select-none">
      <ReportsTable anomalies={MOCK_ANOMALIES} />
    </div>
  );
};
