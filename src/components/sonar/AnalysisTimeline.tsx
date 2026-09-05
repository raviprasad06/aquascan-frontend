import React from 'react';
import { AnalysisStep, AnalysisStatus } from '../../types/analysis';
import { ANALYSIS_STEPS } from '../../hooks/useSonarSimulation';
import { Check, Loader2, AlertCircle } from 'lucide-react';

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
    <div className="bg-[#0c0c0c] border border-[#222222] p-3 font-mono text-xs select-none">
      {/* Header with status and progress */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1c1c1c]">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${
            status === 'PROCESSING' ? 'bg-white animate-ping' : 
            status === 'COMPLETE' ? 'bg-white' : 'bg-[#555555]'
          }`} />
          <span className="font-bold text-white uppercase tracking-wider">
            {status === 'IDLE' && 'AI ANALYSIS // STANDBY'}
            {status === 'PROCESSING' && 'AI ANALYSIS // EXECUTING INFERENCE'}
            {status === 'PAUSED' && 'AI ANALYSIS // PAUSED'}
            {status === 'COMPLETE' && `ANALYSIS COMPLETE // ${totalAnomaliesDetected} ANOMALIES DETECTED`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#888888]">PROGRESS:</span>
          <span className="text-white font-bold">{progress}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-[#181818] border border-[#2a2a2a] mb-3 overflow-hidden">
        <div
          className="h-full bg-white transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 8-Step Pipeline */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5">
        {ANALYSIS_STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex || status === 'COMPLETE';
          const isCurrent = idx === currentStepIndex && status === 'PROCESSING';

          return (
            <div
              key={step.code}
              className={`p-1.5 border transition-all text-[10px] ${
                isCurrent
                  ? 'border-white bg-[#1a1a1a] text-white shadow-glow-sm'
                  : isDone
                  ? 'border-[#333333] bg-[#101010] text-[#cccccc]'
                  : 'border-[#1a1a1a] bg-[#070707] text-[#444444]'
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-bold">{step.code}</span>
                {isDone ? (
                  <Check className="w-3 h-3 text-white" />
                ) : isCurrent ? (
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                ) : null}
              </div>
              <div className="font-sans text-[9px] font-semibold tracking-tight uppercase leading-tight line-clamp-1">
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
