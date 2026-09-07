import React from 'react';
import { Link } from 'react-router-dom';
import { Radio, ArrowRight, Upload } from 'lucide-react';

export const LiveFeedPage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5 font-sans select-none">
      {/* Header */}
      <div className="p-4 bg-[#090909] border border-[#222222] flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Radio className="w-4 h-4 text-white" />
            Live Sonar Stream
          </h1>
          <p className="text-xs text-[#888888] mt-0.5">
            Real-time transducer connection status
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-[#888888]">
          <span>STATUS: <strong className="text-[#888888]">DISCONNECTED</strong></span>
        </div>
      </div>

      {/* Clean Not Connected State */}
      <div className="p-16 border border-[#222222] bg-[#090909] text-center flex flex-col items-center justify-center space-y-4 min-h-[400px]">
        <div className="w-16 h-16 rounded-full border border-[#333333] bg-[#111111] flex items-center justify-center text-[#777777]">
          <Radio className="w-8 h-8 text-[#555555]" />
        </div>

        <div className="space-y-1.5 max-w-md">
          <h2 className="text-base font-bold text-white uppercase tracking-wider">
            Live Feed Not Connected
          </h2>
          <p className="text-xs text-[#888888] leading-relaxed">
            No active hardware hydrophone transducer or live video stream is currently connected to this station.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/sonar-analysis?upload=true"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black font-semibold text-xs uppercase hover:bg-[#e0e0e0] transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Sonar Scan File</span>
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#333333] hover:border-white text-white font-semibold text-xs uppercase transition-colors"
          >
            <span>Back to Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LiveFeedPage;
