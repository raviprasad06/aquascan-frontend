import React, { useEffect, useState } from 'react';
import { getScanHistory, getScanStats, ScanRecord, ScanStats } from '../utils/scanStorage';
import { Layers, AlertTriangle, ShieldAlert, Gauge, BarChart2 } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const [stats, setStats] = useState<ScanStats>({
    totalScans: 0,
    totalDetections: 0,
    highRiskDetections: 0,
    avgConfidence: 0,
  });

  useEffect(() => {
    const syncData = () => {
      setHistory(getScanHistory());
      setStats(getScanStats());
    };

    syncData();
    window.addEventListener('aquascan-scan-updated', syncData);
    window.addEventListener('storage', syncData);

    return () => {
      window.removeEventListener('aquascan-scan-updated', syncData);
      window.removeEventListener('storage', syncData);
    };
  }, []);

  const hasRealData = stats.totalScans > 0;

  const allDetections = history.flatMap(s => s.detections);
  const classCounts: Record<string, number> = {};
  let highRiskCount = 0;
  let mediumRiskCount = 0;
  let lowRiskCount = 0;

  allDetections.forEach(d => {
    const cls = d.classification || 'Shipwreck';
    classCounts[cls] = (classCounts[cls] || 0) + 1;
    if (d.priority === 'HIGH') highRiskCount++;
    else if (d.priority === 'MEDIUM') mediumRiskCount++;
    else lowRiskCount++;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5 font-sans select-none text-white">
      {/* Analytics Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#090909] border border-[#222222]">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-white" />
            AI Model Analytics &amp; Statistics
          </h1>
          <p className="text-xs text-[#888888] mt-0.5">
            Statistical distribution from recorded scan predictions
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-[#888888]">
          <span>RECORDED SCANS: <strong className="text-white">{stats.totalScans}</strong></span>
          <span>RECORDED TARGETS: <strong className="text-white">{stats.totalDetections}</strong></span>
        </div>
      </div>

      {/* Top 4 Analytics Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 bg-[#090909] border border-[#222222]">
          <div className="flex items-center justify-between text-[#888888] mb-1">
            <span className="text-xs font-medium text-[#aaaaaa]">Total Scans Analyzed</span>
            <Layers className="w-4 h-4 text-white" />
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-white font-mono my-1">
            {stats.totalScans}
          </div>
          <div className="text-xs text-[#666666] pt-1 border-t border-[#1a1a1a]">
            {hasRealData ? 'Persisted scan records' : 'No scans recorded yet'}
          </div>
        </div>

        <div className="p-4 bg-[#090909] border border-[#222222]">
          <div className="flex items-center justify-between text-[#888888] mb-1">
            <span className="text-xs font-medium text-[#aaaaaa]">Total Detections</span>
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-white font-mono my-1">
            {stats.totalDetections}
          </div>
          <div className="text-xs text-[#666666] pt-1 border-t border-[#1a1a1a]">
            {hasRealData ? `${stats.totalDetections} targets identified` : 'No targets detected'}
          </div>
        </div>

        <div className="p-4 bg-[#090909] border border-[#222222]">
          <div className="flex items-center justify-between text-[#888888] mb-1">
            <span className="text-xs font-medium text-[#aaaaaa]">High Risk Targets</span>
            <ShieldAlert className="w-4 h-4 text-white" />
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-white font-mono my-1">
            {stats.highRiskDetections}
          </div>
          <div className="text-xs text-[#666666] pt-1 border-t border-[#1a1a1a]">
            {hasRealData ? 'High priority targets' : 'No high risk targets'}
          </div>
        </div>

        <div className="p-4 bg-[#090909] border border-[#222222]">
          <div className="flex items-center justify-between text-[#888888] mb-1">
            <span className="text-xs font-medium text-[#aaaaaa]">Average Confidence</span>
            <Gauge className="w-4 h-4 text-white" />
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-white font-mono my-1">
            {hasRealData ? `${stats.avgConfidence}%` : 'N/A'}
          </div>
          <div className="text-xs text-[#666666] pt-1 border-t border-[#1a1a1a]">
            YOLO Shipwreck Model
          </div>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Risk Distribution */}
        <div className="lg:col-span-6 p-4 bg-[#090909] border border-[#222222] space-y-3">
          <div className="text-xs font-semibold text-white uppercase tracking-wider border-b border-[#222222] pb-2 flex items-center justify-between">
            <span>Risk Distribution</span>
            <span className="text-xs font-mono text-[#777777]">{allDetections.length} TARGETS</span>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white font-medium">HIGH RISK</span>
                <span className="text-white font-mono">{highRiskCount}</span>
              </div>
              <div className="w-full bg-[#161616] h-2 border border-[#333333]">
                <div
                  className="bg-white h-full transition-all duration-300"
                  style={{
                    width: `${allDetections.length > 0 ? (highRiskCount / allDetections.length) * 100 : 0}%`
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#cccccc]">MEDIUM RISK</span>
                <span className="text-[#cccccc] font-mono">{mediumRiskCount}</span>
              </div>
              <div className="w-full bg-[#161616] h-2 border border-[#333333]">
                <div
                  className="bg-[#888888] h-full transition-all duration-300"
                  style={{
                    width: `${allDetections.length > 0 ? (mediumRiskCount / allDetections.length) * 100 : 0}%`
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#888888]">LOW RISK</span>
                <span className="text-[#888888] font-mono">{lowRiskCount}</span>
              </div>
              <div className="w-full bg-[#161616] h-2 border border-[#333333]">
                <div
                  className="bg-[#444444] h-full transition-all duration-300"
                  style={{
                    width: `${allDetections.length > 0 ? (lowRiskCount / allDetections.length) * 100 : 0}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Classification Breakdown */}
        <div className="lg:col-span-6 p-4 bg-[#090909] border border-[#222222] space-y-3">
          <div className="text-xs font-semibold text-white uppercase tracking-wider border-b border-[#222222] pb-2 flex items-center justify-between">
            <span>Model Classifications</span>
            <span className="text-xs font-mono text-[#777777]">MODEL: SHIPWRECK</span>
          </div>

          <div className="space-y-3 pt-2">
            {Object.keys(classCounts).length > 0 ? (
              Object.entries(classCounts).map(([cls, count]) => (
                <div key={cls} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-white uppercase">{cls}</span>
                    <span className="text-white font-mono">{count} ({((count / allDetections.length) * 100).toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-[#161616] h-2 border border-[#333333]">
                    <div
                      className="bg-white h-full transition-all duration-300"
                      style={{ width: `${(count / allDetections.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-[#777777]">
                No detection classes recorded yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
