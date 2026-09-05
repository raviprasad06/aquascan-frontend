import React, { useState } from 'react';
import { Crosshair, ChevronRight, ShieldAlert, Filter, Layers } from 'lucide-react';
import { SonarAnomaly, AnomalyClass } from '../../types/anomaly';
import { formatCoordinates, formatDimensions } from '../../utils/formatters';
import { ConfidenceBar } from '../common/ConfidenceBar';

interface DetectionSidebarProps {
  anomalies: SonarAnomaly[];
  revealedAnomalyIds: Set<string>;
  selectedAnomaly: SonarAnomaly | null;
  onSelectAnomaly: (anomaly: SonarAnomaly) => void;
  className?: string;
}

export const DetectionSidebar: React.FC<DetectionSidebarProps> = ({
  anomalies,
  revealedAnomalyIds,
  selectedAnomaly,
  onSelectAnomaly,
  className = ''
}) => {
  const [filterClass, setFilterClass] = useState<string>('ALL');

  const visibleAnomalies = anomalies.filter(a => revealedAnomalyIds.has(a.id));
  const filtered = visibleAnomalies.filter(a => {
    if (filterClass === 'ALL') return true;
    return a.classification === filterClass;
  });

  const uniqueClasses = Array.from(new Set(anomalies.map(a => a.classification)));

  return (
    <div className={`flex flex-col bg-[#0a0a0a] border border-[#222222] font-mono select-none ${className}`}>
      {/* Panel Header */}
      <div className="p-3 border-b border-[#222222] bg-[#0f0f0f] flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-white tracking-widest uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            DETECTED ANOMALIES
          </div>
          <div className="text-[10px] text-[#666666] mt-0.5">
            REVEALED: {visibleAnomalies.length} / {anomalies.length} TARGETS
          </div>
        </div>
        <span className="text-xs px-2 py-0.5 border border-white/40 text-white font-bold">
          {visibleAnomalies.length}
        </span>
      </div>

      {/* Filter Chips */}
      <div className="p-2 border-b border-[#1a1a1a] bg-[#0c0c0c] flex items-center gap-1 overflow-x-auto text-[10px] no-scrollbar">
        <button
          onClick={() => setFilterClass('ALL')}
          className={`px-2 py-0.5 border uppercase whitespace-nowrap transition-colors ${
            filterClass === 'ALL'
              ? 'bg-white text-black border-white font-bold'
              : 'border-[#333333] text-[#888888] hover:border-white/50 hover:text-white'
          }`}
        >
          ALL ({visibleAnomalies.length})
        </button>
        {uniqueClasses.map(cls => {
          const count = visibleAnomalies.filter(a => a.classification === cls).length;
          return (
            <button
              key={cls}
              onClick={() => setFilterClass(cls)}
              className={`px-2 py-0.5 border uppercase whitespace-nowrap transition-colors ${
                filterClass === cls
                  ? 'bg-white text-black border-white font-bold'
                  : 'border-[#333333] text-[#888888] hover:border-white/50 hover:text-white'
              }`}
            >
              {cls} ({count})
            </button>
          );
        })}
      </div>

      {/* Scrollable Anomaly Cards List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#181818] max-h-[600px]">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-[#555555] text-xs">
            {visibleAnomalies.length === 0
              ? 'NO ANOMALIES DETECTED YET. CLICK "START ANALYSIS" TO SCAN.'
              : 'NO ANOMALIES MATCHING THE SELECTED FILTER.'}
          </div>
        ) : (
          filtered.map(anomaly => {
            const isSelected = selectedAnomaly?.id === anomaly.id;

            return (
              <div
                key={anomaly.id}
                onClick={() => onSelectAnomaly(anomaly)}
                className={`p-3.5 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#181818] border-l-4 border-white pl-3 text-white shadow-glow-inset'
                    : 'hover:bg-[#121212] text-[#cccccc]'
                }`}
              >
                {/* ID & Classification & Confidence Header */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white tracking-wider">
                        {anomaly.id}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-[#222222] border border-[#444444] text-white">
                        {anomaly.classification.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-white">
                      {anomaly.confidence.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Coordinates & Dimensions */}
                <div className="space-y-1 text-xs text-[#888888] mb-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#aaaaaa]">
                    <Crosshair className="w-3 h-3 text-white" />
                    <span>{formatCoordinates(anomaly.latitude, anomaly.longitude)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span>DIMENSIONS: {formatDimensions(anomaly.width, anomaly.height)}</span>
                    <span>DEPTH: {anomaly.depth.toFixed(1)}M</span>
                  </div>
                </div>

                {/* Priority & Status Tag */}
                <div className="flex items-center justify-between pt-1 border-t border-[#222222] text-[10px]">
                  <span className={`px-1.5 py-0.5 border ${
                    anomaly.priority === 'HIGH'
                      ? 'border-white text-white font-bold bg-[#1e1e1e]'
                      : 'border-[#444444] text-[#888888]'
                  }`}>
                    {anomaly.priority} PRIORITY
                  </span>
                  <span className="text-[#666666] tracking-tighter">
                    {anomaly.surveyLine}
                  </span>
                </div>

                {/* Detailed view if currently selected */}
                {isSelected && (
                  <div className="mt-3 pt-2 border-t border-[#333333] space-y-2 animate-in fade-in">
                    <ConfidenceBar confidence={anomaly.confidence} compact={false} />
                    <div className="text-[10px] text-[#aaaaaa] font-sans bg-[#0d0d0d] p-2 border border-[#222222] leading-relaxed">
                      <strong className="text-white font-mono block mb-0.5">ACOUSTIC SIGNATURE:</strong>
                      {anomaly.acousticSignature}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
