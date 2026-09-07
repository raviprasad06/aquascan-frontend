import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight, FileText } from 'lucide-react';
import { getScanHistory, ScanRecord } from '../../utils/scanStorage';

export const RecentAnomaliesList: React.FC = () => {
  const [history, setHistory] = useState<ScanRecord[]>([]);

  useEffect(() => {
    const syncHistory = () => {
      setHistory(getScanHistory());
    };
    syncHistory();
    window.addEventListener('aquascan-scan-updated', syncHistory);
    window.addEventListener('storage', syncHistory);

    return () => {
      window.removeEventListener('aquascan-scan-updated', syncHistory);
      window.removeEventListener('storage', syncHistory);
    };
  }, []);

  const recentScans = history.slice(0, 5);

  return (
    <div className="bg-[#090909] border border-[#222222] font-sans select-none flex flex-col h-full">
      {/* Header */}
      <div className="p-3.5 border-b border-[#222222] bg-[#0c0c0c] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-white" />
          <h2 className="text-sm font-semibold text-white">
            Recent Scans & Predictions
          </h2>
        </div>
        <Link
          to="/reports"
          className="text-xs text-[#aaaaaa] hover:text-white flex items-center gap-1 font-medium transition-colors"
        >
          View All <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* List / Empty state */}
      <div className="divide-y divide-[#181818] flex-1 overflow-y-auto min-h-[260px]">
        {recentScans.length === 0 ? (
          <div className="p-8 text-center text-[#777777] flex flex-col items-center justify-center space-y-2 h-full">
            <FileText className="w-8 h-8 text-[#444444]" />
            <div className="text-sm font-semibold text-[#cccccc]">
              No Scans Recorded Yet
            </div>
            <p className="text-xs text-[#777777] max-w-xs leading-relaxed">
              Upload a side-scan sonar image in the Analysis Workspace to execute FastAPI YOLO predictions.
            </p>
          </div>
        ) : (
          recentScans.map(scan => (
            <Link
              key={scan.id}
              to="/reports"
              className="p-3.5 flex items-center justify-between hover:bg-[#121212] transition-colors block group"
            >
              <div className="flex items-center gap-3">
                {scan.originalImage || scan.annotatedImage ? (
                  <img
                    src={scan.annotatedImage || scan.originalImage}
                    alt={scan.filename}
                    className="w-10 h-10 object-cover border border-[#333333] filter grayscale contrast-125 shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 bg-[#151515] border border-[#333333] flex items-center justify-center text-[10px] text-[#888888] font-mono shrink-0">
                    IMG
                  </div>
                )}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white text-sm group-hover:underline max-w-[160px] truncate">
                      {scan.filename}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-[#1c1c1c] border border-[#333333] text-white font-mono">
                      {scan.detectionCount} {scan.detectionCount === 1 ? 'TARGET' : 'TARGETS'}
                    </span>
                  </div>
                  <div className="text-xs text-[#777777] font-mono">
                    {scan.timestamp.replace('T', ' ').slice(0, 16)}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-bold text-white font-mono">
                  {scan.highestConfidence.toFixed(1)}%
                </div>
                <div className="text-[10px] text-[#888888] uppercase font-mono font-semibold">
                  {scan.overallRisk} RISK
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};
