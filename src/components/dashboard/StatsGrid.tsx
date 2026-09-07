import React, { useEffect, useState } from 'react';
import { Layers, AlertTriangle, ShieldCheck, Gauge } from 'lucide-react';
import { getScanHistory, getScanStats, ScanStats } from '../../utils/scanStorage';

export const StatsGrid: React.FC = () => {
  const [statsData, setStatsData] = useState<ScanStats>({
    totalScans: 0,
    totalDetections: 0,
    highRiskDetections: 0,
    avgConfidence: 0,
  });

  useEffect(() => {
    const syncData = () => {
      const currentStats = getScanStats();
      setStatsData(currentStats);
    };

    syncData();

    window.addEventListener('aquascan-scan-updated', syncData);
    window.addEventListener('storage', syncData);

    return () => {
      window.removeEventListener('aquascan-scan-updated', syncData);
      window.removeEventListener('storage', syncData);
    };
  }, []);

  const hasRealScans = statsData.totalScans > 0;

  const stats = [
    {
      label: 'Total Scans',
      value: hasRealScans ? statsData.totalScans.toLocaleString() : '0',
      subtext: hasRealScans ? 'Analyzed files recorded' : 'No scans recorded yet',
      icon: Layers,
      unit: 'SCANS',
    },
    {
      label: 'Total Detections',
      value: hasRealScans ? statsData.totalDetections.toLocaleString() : '0',
      subtext: hasRealScans ? `${statsData.totalDetections} targets identified` : 'No targets detected',
      icon: AlertTriangle,
      unit: 'TARGETS',
    },
    {
      label: 'High Risk Detections',
      value: hasRealScans ? statsData.highRiskDetections.toLocaleString() : '0',
      subtext: hasRealScans ? 'High priority targets' : 'No high risk targets',
      icon: ShieldCheck,
      unit: 'CRITICAL',
    },
    {
      label: 'Average Confidence',
      value: hasRealScans ? `${statsData.avgConfidence}%` : 'N/A',
      subtext: hasRealScans ? 'Model: YOLO Shipwreck' : 'Awaiting image analysis',
      icon: Gauge,
      unit: 'CONFIDENCE',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 select-none font-sans">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="p-4 bg-[#090909] border border-[#222222] relative group hover:border-white/40 transition-colors"
          >
            {/* Corner Brackets */}
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-white" />
            <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-white" />

            <div className="flex items-center justify-between text-[#888888] mb-2">
              <span className="text-xs font-medium text-[#aaaaaa]">
                {stat.label}
              </span>
              <Icon className="w-4 h-4 text-white" />
            </div>

            <div className="text-3xl sm:text-4xl font-bold text-white font-mono tracking-tight my-1">
              {stat.value}
            </div>

            <div className="flex items-center justify-between text-xs text-[#666666] pt-2 border-t border-[#1a1a1a]">
              <span className="font-mono text-[10px] text-[#888888]">{stat.unit}</span>
              <span className="text-[#999999]">{stat.subtext}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
