import React from 'react';
import { Crosshair, ShieldCheck } from 'lucide-react';
import { SonarAnomaly } from '../../types/anomaly';
import { ConfidenceBar } from '../common/ConfidenceBar';

interface DetectionSidebarProps {
  anomalies: SonarAnomaly[];
  revealedAnomalyIds: Set<string>;
  selectedAnomaly: SonarAnomaly | null;
  onSelectAnomaly: (anomaly: SonarAnomaly) => void;
  className?: string;
  isRealScan?: boolean;
}

export const DetectionSidebar: React.FC<DetectionSidebarProps> = ({
  anomalies,
  revealedAnomalyIds,
  selectedAnomaly,
  onSelectAnomaly,
  className = '',
  isRealScan = false,
}) => {
  const visibleAnomalies = anomalies.filter(a => revealedAnomalyIds.has(a.id));

  return (
    <div className={`flex flex-col bg-[#0a0a0a] border border-[#222222] font-sans select-none ${className}`}>
      {/* Panel Header */}
      <div className="p-3.5 border-b border-[#222222] bg-[#0f0f0f] flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-white flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            Detected Targets
          </div>
          <div className="text-xs text-[#888888] font-mono mt-0.5">
            {visibleAnomalies.length} {visibleAnomalies.length === 1 ? 'OBJECT FOUND' : 'OBJECTS FOUND'}
          </div>
        </div>
        <span className="text-xs px-2 py-0.5 border border-white/40 text-white font-mono font-bold">
          {visibleAnomalies.length}
        </span>
      </div>

      {/* Scrollable Anomaly Cards List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#181818] max-h-[580px]">
        {visibleAnomalies.length === 0 ? (
          <div className="p-8 text-center text-[#888888] text-xs flex flex-col items-center justify-center space-y-2">
            <div className="w-8 h-8 rounded-full border border-[#333333] flex items-center justify-center text-[#555555]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="font-semibold text-white text-xs uppercase tracking-wider">
              {isRealScan ? 'No Target Detected' : 'No Analysis Active'}
            </div>
            <p className="text-[11px] text-[#666666] leading-relaxed max-w-xs">
              {isRealScan
                ? 'The model evaluated the sonar scan and found no shipwreck targets above the confidence threshold.'
                : 'Upload a side-scan sonar image and click "Start Analysis" to detect targets.'}
            </p>
          </div>
        ) : (
          visibleAnomalies.map(anomaly => {
            const isSelected = selectedAnomaly?.id === anomaly.id;

            return (
              <div
                key={anomaly.id}
                onClick={() => onSelectAnomaly(anomaly)}
                className={`p-4 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#181818] border-l-4 border-white pl-3 text-white'
                    : 'hover:bg-[#121212] text-[#cccccc]'
                }`}
              >
                {/* ID & Classification & Confidence Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white font-mono">
                        {anomaly.id}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-[#222222] border border-[#444444] text-white font-medium">
                        {anomaly.classification}
                      </span>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-sm font-bold text-white">
                      {anomaly.confidence.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Metadata & Risk */}
                <div className="space-y-1.5 text-xs text-[#888888] mb-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#aaaaaa]">
                    <Crosshair className="w-3 h-3 text-[#777777]" />
                    <span className="font-mono">
                      {typeof anomaly.latitude === 'number' && typeof anomaly.longitude === 'number' && !isNaN(anomaly.latitude) && !isNaN(anomaly.longitude)
                        ? `${anomaly.latitude.toFixed(4)}°, ${anomaly.longitude.toFixed(4)}°`
                        : 'LOCATION DATA NOT AVAILABLE'}
                    </span>
                  </div>
                </div>

                {/* Priority & Status Tag */}
                <div className="flex items-center justify-between pt-1.5 border-t border-[#222222] text-xs font-mono">
                  <span className={`px-2 py-0.5 border text-[10px] font-bold uppercase ${
                    anomaly.priority === 'HIGH'
                      ? 'border-white text-white bg-[#1e1e1e]'
                      : 'border-[#444444] text-[#888888]'
                  }`}>
                    {anomaly.priority} RISK
                  </span>
                  <span className="text-[#777777] text-[10px]">
                    MODEL VERIFIED
                  </span>
                </div>

                {/* Detailed view if currently selected */}
                {isSelected && (
                  <div className="mt-3 pt-2.5 border-t border-[#333333] space-y-2 animate-in fade-in">
                    <ConfidenceBar confidence={anomaly.confidence} compact={false} />
                    <div className="text-xs text-[#aaaaaa] bg-[#0d0d0d] p-2.5 border border-[#222222] leading-relaxed">
                      <span className="text-white font-medium block mb-1">Detection Details:</span>
                      {anomaly.acousticSignature || `YOLO AI Detection: ${anomaly.classification}`}
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
