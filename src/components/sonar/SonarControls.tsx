import React from 'react';
import { Play, Pause, RotateCcw, Upload, Maximize2, Minimize2 } from 'lucide-react';
import { AnalysisStatus } from '../../types/analysis';

interface SonarControlsProps {
  status: AnalysisStatus;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onUploadClick: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  hasRealFile?: boolean;
}

export const SonarControls: React.FC<SonarControlsProps> = ({
  status,
  onStart,
  onPause,
  onReset,
  onUploadClick,
  isFullscreen,
  onToggleFullscreen,
  hasRealFile = false,
}) => {
  const isProcessing = status === 'PROCESSING';

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#0a0a0a] border border-[#222222] font-sans text-xs select-none">
      {/* Primary Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Upload Button */}
        <button
          onClick={onUploadClick}
          className="flex items-center gap-1.5 px-3.5 py-1.5 border border-[#333333] bg-[#111111] hover:bg-[#1f1f1f] text-white hover:border-white font-medium transition-colors cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Sonar</span>
        </button>

        {/* Start Analysis Button */}
        <button
          onClick={onStart}
          disabled={isProcessing}
          className={`flex items-center gap-1.5 px-4 py-1.5 font-bold uppercase transition-all ${
            isProcessing
              ? 'bg-[#222222] text-[#666666] border border-[#333333] cursor-not-allowed'
              : 'bg-white text-black hover:bg-[#e0e0e0] border border-white shadow-glow-sm cursor-pointer'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{status === 'COMPLETE' ? 'Re-Analyze' : hasRealFile ? 'Analyze Sonar Image' : 'Start Analysis'}</span>
        </button>

        {/* Pause Button */}
        <button
          onClick={onPause}
          disabled={status !== 'PROCESSING' && status !== 'PAUSED'}
          className={`flex items-center gap-1.5 px-3 py-1.5 border font-medium transition-colors ${
            status === 'PROCESSING' || status === 'PAUSED'
              ? 'border-[#444444] bg-[#141414] text-white hover:border-white cursor-pointer'
              : 'border-[#222222] text-[#444444] cursor-not-allowed'
          }`}
        >
          <Pause className="w-3.5 h-3.5" />
          <span>{status === 'PAUSED' ? 'Resume' : 'Pause'}</span>
        </button>

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-[#333333] bg-[#111111] hover:bg-[#1a1a1a] text-[#aaaaaa] hover:text-white hover:border-white font-medium transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Right Tools */}
      <div className="flex items-center gap-3">
        {/* Fullscreen Toggle */}
        <button
          onClick={onToggleFullscreen}
          className="p-1.5 border border-[#333333] bg-[#111111] hover:bg-[#1f1f1f] text-white hover:border-white transition-colors cursor-pointer"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
