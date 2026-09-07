import React from 'react';
import { AnalysisStatus } from '../../types/analysis';
import { ANALYSIS_STEPS } from '../../hooks/useSonarSimulation';
import { Check } from 'lucide-react';

interface AnalysisTimelineProps {
  currentStepIndex: number;
  status: AnalysisStatus;
  progress: number;
  totalAnomaliesDetected: number;
}

export const AnalysisTimeline: React.FC<AnalysisTimelineProps> = ({
  currentStepIndex,
  status,
  progress,
  totalAnomaliesDetected
}) => {
  return (
    <div className="bg-[#0c0c0c] border border-[#222222] p-3 font-sans text-xs select-none">
      {/* Header with status and progress */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1c1c1c]">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${
            status === 'PROCESSING' ? 'bg-white animate-ping' : 
            status === 'COMPLETE' ? 'bg-white' : 'bg-[#555555]'
          }`} />
          <span className="font-semibold text-white">
            {status === 'IDLE' && 'AI Analysis: Standby'}
            {status === 'PROCESSING' && 'AI Analysis: Executing Inference'}
            {status === 'PAUSED' && 'AI Analysis: Paused'}
            {status === 'COMPLETE' && `Analysis Complete: ${totalAnomaliesDetected} ${totalAnomaliesDetected === 1 ? 'Target' : 'Targets'} Detected`}
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-[#888888]">PROGRESS:</span>
          <span className="text-white font-bold">{progress}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-[#181818] border border-[#2a2a2a] mb-2.5 overflow-hidden">
        <div
          className="h-full bg-white transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 5-Step Pipeline */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {ANALYSIS_STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex || status === 'COMPLETE';
          const isCurrent = idx === currentStepIndex && status === 'PROCESSING';

          return (
            <div
              key={step.code}
              className={`p-2 border transition-all text-xs ${
                isCurrent
                  ? 'border-white bg-[#1a1a1a] text-white shadow-glow-sm'
                  : isDone
                  ? 'border-[#333333] bg-[#101010] text-[#cccccc]'
                  : 'border-[#1a1a1a] bg-[#070707] text-[#555555]'
              }`}
            >
              <div className="flex items-center justify-between mb-1 font-mono text-[10px]">
                <span className="font-bold">{step.code}</span>
                {isDone ? (
                  <Check className="w-3 h-3 text-white" />
                ) : isCurrent ? (
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                ) : null}
              </div>
              <div className="text-[11px] font-medium uppercase tracking-tight line-clamp-1">
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
