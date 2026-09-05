import React from 'react';
import { LiveWaterfallFeed } from '../components/feed/LiveWaterfallFeed';
import { AuvTelemetryPanel } from '../components/dashboard/AuvTelemetryPanel';
import { TerminalConsole } from '../components/system/TerminalConsole';
import { Radio, Waves, Activity } from 'lucide-react';

export const LiveFeedPage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5 font-mono select-none">
      {/* Header */}
      <div className="p-3.5 bg-[#090909] border border-[#222222] flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm sm:text-base font-bold text-white tracking-widest uppercase font-sans flex items-center gap-2">
            <span className="w-2 h-2 bg-white rounded-full animate-ping" />
            LIVE TRANSDUCER WATERFALL STREAM // HYDROPHONE FEED
          </div>
          <div className="text-[11px] text-[#888888] mt-0.5">
            CHIRP 455 kHz CARRIER // SAMPLING RATE: 45 Hz // REAL-TIME SPECKLE SUPPRESSION
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-[#888888]">
          <span>BITRATE: <strong className="text-white">12.4 Mbps</strong></span>
          <span>LATENCY: <strong className="text-white">14.8 ms</strong></span>
        </div>
      </div>

      {/* Main Waterfall Component */}
      <LiveWaterfallFeed />

      {/* Sensor Pod Telemetry Grid */}
      <AuvTelemetryPanel />

      {/* Machine System Messages Console */}
      <TerminalConsole />
    </div>
  );
};
