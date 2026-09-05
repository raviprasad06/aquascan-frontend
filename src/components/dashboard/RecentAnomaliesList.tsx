import React from 'react';
import { Link } from 'react-router-dom';
import { Crosshair, ArrowRight, ShieldAlert } from 'lucide-react';
import { MOCK_ANOMALIES } from '../../data/mockAnomalies';
import { formatCoordinates, formatDimensions } from '../../utils/formatters';

export const RecentAnomaliesList: React.FC = () => {
  const recent = MOCK_ANOMALIES.slice(0, 5);

  return (
    <div className="bg-[#090909] border border-[#222222] font-mono select-none">
      {/* Header */}
      <div className="p-3 border-b border-[#222222] bg-[#0f0f0f] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-white" />
          <span className="text-xs font-bold text-white tracking-widest uppercase">
            RECENT DETECTED ANOMALIES
          </span>
        </div>
        <Link
          to="/sonar-analysis"
          className="text-[10px] text-white hover:underline flex items-center gap-1"
        >
          OPEN WORKSPACE <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* List */}
      <div className="divide-y divide-[#181818]">
        {recent.map(item => (
          <Link
            key={item.id}
            to="/sonar-analysis"
            state={{ selectedAnomalyId: item.id }}
            className="p-3 flex items-center justify-between hover:bg-[#121212] transition-colors block group"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs group-hover:underline">
                  {item.id}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 bg-[#1c1c1c] border border-[#333333] text-white">
                  {item.classification}
                </span>
                <span className="text-[10px] text-[#888888]">
                  {formatDimensions(item.width, item.height)}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-[#666666]">
                <span>{formatCoordinates(item.latitude, item.longitude)}</span>
                <span>DEPTH: {item.depth.toFixed(1)}M</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-bold text-white">
                {item.confidence.toFixed(1)}%
              </div>
              <div className="text-[9px] text-[#888888]">
                {item.priority} PRIORITY
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
