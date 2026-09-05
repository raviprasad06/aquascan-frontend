import React from 'react';
import { getConfidenceTier, formatConfidenceBlocks } from '../../utils/formatters';

interface ConfidenceBarProps {
  confidence: number;
  showDetails?: boolean;
  compact?: boolean;
}

export const ConfidenceBar: React.FC<ConfidenceBarProps> = ({
  confidence,
  showDetails = true,
  compact = false
}) => {
  const { label, tier } = getConfidenceTier(confidence);
  const blocks = formatConfidenceBlocks(confidence, compact ? 12 : 20);

  if (compact) {
    return (
      <div className="flex items-center gap-2 font-mono text-[11px]">
        <span className="text-white font-bold">{confidence.toFixed(1)}%</span>
        <span className="tracking-tighter text-[#cccccc] select-none text-[10px]">{blocks}</span>
        <span className="text-[9px] px-1 py-0.2 border border-[#444444] text-[#aaaaaa]">
          {tier}
        </span>
      </div>
    );
  }

  return (
    <div className="font-mono text-xs space-y-1.5 p-2.5 bg-[#0d0d0d] border border-[#222222]">
      <div className="flex items-center justify-between text-[#888888] text-[10px] tracking-wider uppercase">
        <span>MODEL CONFIDENCE</span>
        <span className="text-white font-bold text-sm tracking-normal">
          {confidence.toFixed(1)}%
        </span>
      </div>

      {/* Progress Bar with Segments */}
      <div className="relative w-full h-3 bg-[#111111] border border-[#333333] overflow-hidden">
        <div
          className="h-full bg-white transition-all duration-500 ease-out"
          style={{ width: `${confidence}%` }}
        />
        {/* Subtle grid lines across bar */}
        <div className="absolute inset-0 grid grid-cols-10 pointer-events-none opacity-40">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="border-r border-black h-full" />
          ))}
        </div>
      </div>

      {/* ASCII Blocks Representation */}
      <div className="flex items-center justify-between text-[11px] select-none pt-0.5">
        <span className="tracking-tighter text-white font-mono text-xs">{blocks}</span>
        <span className="text-[10px] px-1.5 py-0.5 border border-white/40 text-white font-semibold tracking-wider">
          {label}
        </span>
      </div>

      {showDetails && (
        <div className="pt-1.5 border-t border-[#1a1a1a] grid grid-cols-3 gap-1 text-[9px] text-[#666666] text-center">
          <div className={tier === 'HIGH' ? 'text-white font-semibold' : ''}>
            90-100% HIGH
          </div>
          <div className={tier === 'MEDIUM' ? 'text-white font-semibold' : ''}>
            70-89% MED
          </div>
          <div className={tier === 'LOW' ? 'text-white font-semibold' : ''}>
            &lt;70% LOW
          </div>
        </div>
      )}
    </div>
  );
};
