import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Image as ImageIcon, Upload, ShieldCheck, ArrowRight } from 'lucide-react';
import { getLatestScan, ScanRecord } from '../../utils/scanStorage';

export const SonarImagePreview: React.FC = () => {
  const [latestScan, setLatestScan] = useState<ScanRecord | null>(null);

  useEffect(() => {
    const syncLatest = () => {
      setLatestScan(getLatestScan());
    };
    syncLatest();
    window.addEventListener('aquascan-scan-updated', syncLatest);
    window.addEventListener('storage', syncLatest);

    return () => {
      window.removeEventListener('aquascan-scan-updated', syncLatest);
      window.removeEventListener('storage', syncLatest);
    };
  }, []);

  return (
    <div className="bg-[#090909] border border-[#222222] font-sans select-none flex flex-col h-full">
      {/* Header */}
      <div className="p-3.5 border-b border-[#222222] bg-[#0c0c0c] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-white" />
          <h2 className="text-sm font-semibold text-white">
            Sonar Image Preview
          </h2>
        </div>
        {latestScan && (
          <div className="flex items-center gap-3 text-xs font-mono text-[#888888]">
            <span>FILE: <strong className="text-white">{latestScan.filename}</strong></span>
            <span className="text-[#444444]">|</span>
            <span>TARGETS: <strong className="text-white">{latestScan.detectionCount}</strong></span>
          </div>
        )}
      </div>

      {/* Main Image View Area */}
      <div className="relative flex-1 min-h-[360px] max-h-[460px] bg-black flex items-center justify-center p-4 overflow-hidden">
        {latestScan && (latestScan.annotatedImage || latestScan.originalImage) ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={latestScan.annotatedImage || latestScan.originalImage}
              alt={latestScan.filename}
              className="max-h-[400px] w-auto max-w-full object-contain filter grayscale contrast-125 border border-[#222222]"
            />
            {/* Real Detection Tag Overlay */}
            {latestScan.detections.length > 0 && (
              <div className="absolute top-3 left-3 bg-black/85 border border-white/40 px-3 py-1.5 text-xs text-white backdrop-blur-sm space-y-0.5">
                <div className="font-semibold text-[11px] text-[#aaaaaa]">LATEST PREDICTION</div>
                <div className="font-bold text-white font-mono">
                  {latestScan.detections[0].classification} ({latestScan.highestConfidence.toFixed(1)}%)
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-8 max-w-md space-y-3 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border border-[#333333] bg-[#111111] flex items-center justify-center text-[#777777]">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-white">No Sonar Image Loaded</h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                Upload a side-scan sonar image in the analysis workspace to inspect high-resolution acoustic data and YOLO object detections.
              </p>
            </div>
            <Link
              to="/sonar-analysis?upload=true"
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-semibold hover:bg-[#e0e0e0] transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Sonar Image</span>
            </Link>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-[#222222] bg-[#0c0c0c] flex flex-wrap items-center justify-between text-xs text-[#777777]">
        <div>
          {latestScan ? (
            <span className="font-mono text-[11px]">
              TIMESTAMP: {latestScan.timestamp.replace('T', ' ').slice(0, 19)} UTC
            </span>
          ) : (
            <span>Ready for image ingestion</span>
          )}
        </div>
        <Link
          to="/sonar-analysis"
          className="text-xs font-medium text-white hover:underline flex items-center gap-1"
        >
          Open Analysis Workspace <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
