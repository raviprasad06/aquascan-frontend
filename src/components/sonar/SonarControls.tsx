import React from 'react';
import { Play, Pause, RotateCcw, Upload, Maximize2, Minimize2, Eye, Sliders } from 'lucide-react';
import { AnalysisStatus } from '../../types/analysis';
import { MOCK_DATASETS } from '../../data/mockScans';

interface SonarControlsProps {
  status: AnalysisStatus;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onUploadClick: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  selectedDatasetId: string;
  onSelectDataset: (datasetId: string) => void;
}

export const SonarControls: React.FC<SonarControlsProps> = ({
  status,
  onStart,
  onPause,
  onReset,
  onUploadClick,
  isFullscreen,
  onToggleFullscreen,
  selectedDatasetId,
  onSelectDataset,
}) => {
  const isProcessing = status === 'PROCESSING';

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#0a0a0a] border border-[#222222] font-mono text-xs select-none">
      {/* Primary Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Upload Button */}
        <button
          onClick={onUploadClick}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-[#333333] bg-[#111111] hover:bg-[#1f1f1f] text-white hover:border-white transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>UPLOAD SONAR</span>
        </button>

        {/* Start Analysis Button */}
        <button
          onClick={onStart}
          disabled={isProcessing}
          className={`flex items-center gap-1.5 px-4 py-1.5 font-bold tracking-wider uppercase transition-all ${
            isProcessing
              ? 'bg-[#222222] text-[#666666] border border-[#333333] cursor-not-allowed'
              : 'bg-white text-black hover:bg-[#e0e0e0] border border-white shadow-glow-sm cursor-pointer'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{status === 'COMPLETE' ? 'RE-ANALYZE' : 'START ANALYSIS'}</span>
        </button>

        {/* Pause Button */}
        <button
          onClick={onPause}
          disabled={status !== 'PROCESSING' && status !== 'PAUSED'}
          className={`flex items-center gap-1.5 px-3 py-1.5 border transition-colors ${
            status === 'PROCESSING' || status === 'PAUSED'
              ? 'border-[#444444] bg-[#141414] text-white hover:border-white'
              : 'border-[#222222] text-[#444444] cursor-not-allowed'
          }`}
        >
          <Pause className="w-3.5 h-3.5" />
          <span>{status === 'PAUSED' ? 'RESUME' : 'PAUSE'}</span>
        </button>

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-[#333333] bg-[#111111] hover:bg-[#1a1a1a] text-[#aaaaaa] hover:text-white hover:border-white transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RESET</span>
        </button>
      </div>

      {/* Dataset Selector & Fullscreen */}
      <div className="flex items-center gap-3">
        {/* Dataset Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#666666] uppercase hidden sm:inline">DATASET:</span>
          <select
            value={selectedDatasetId}
            onChange={e => onSelectDataset(e.target.value)}
            className="bg-[#111111] border border-[#333333] text-white px-2 py-1 text-xs outline-none focus:border-white cursor-pointer"
          >
            {MOCK_DATASETS.map(d => (
              <option key={d.id} value={d.id} className="bg-black text-white">
                {d.title} ({d.frequencyKhz} kHz)
              </option>
            ))}
          </select>
        </div>

        {/* Fullscreen Toggle */}
        <button
          onClick={onToggleFullscreen}
          className="p-1.5 border border-[#333333] bg-[#111111] hover:bg-[#1f1f1f] text-white hover:border-white transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
