import React from 'react';
import { Link } from 'react-router-dom';
import { StatsGrid } from '../components/dashboard/StatsGrid';
import { AuvTelemetryPanel } from '../components/dashboard/AuvTelemetryPanel';
import { RecentAnomaliesList } from '../components/dashboard/RecentAnomaliesList';
import { LiveWaterfallFeed } from '../components/feed/LiveWaterfallFeed';
import { Play, ArrowRight, MapPin, Layers, Radio, ShieldCheck } from 'lucide-react';
import { MicroRadar } from '../components/radar/MicroRadar';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-5 p-4 sm:p-6 max-w-7xl mx-auto font-mono text-white select-none">
      {/* Dashboard Top Header (Exact match to Requirement #9) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#090909] border border-[#222222]">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <MicroRadar size={22} />
            <h1 className="text-lg sm:text-xl font-bold tracking-widest text-white uppercase font-sans">
              MARINE INTELLIGENCE CENTER
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#888888]">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            <span className="tracking-wider">
              AUTONOMOUS ANALYSIS SYSTEM // READY
            </span>
          </div>
        </div>

        {/* Action button to launch sonar analysis */}
        <div className="flex items-center gap-2">
          <Link
            to="/sonar-analysis"
            className="flex items-center gap-2 px-4 py-2 bg-white text-black font-bold text-xs uppercase hover:bg-[#dddddd] transition-all shadow-glow-sm cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>LAUNCH ANALYSIS WORKSPACE</span>
          </Link>
          <Link
            to="/detection-map"
            className="flex items-center gap-2 px-3.5 py-2 bg-[#121212] border border-[#333333] hover:border-white text-white text-xs uppercase transition-colors"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>SURVEY MAP</span>
          </Link>
        </div>
      </div>

      {/* 5 Animated Stats (Exact match to Requirement #9) */}
      <StatsGrid />

      {/* Live Waterfall Feed & Recent Anomalies */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Real-time Live Sonar Spectrogram Feed */}
        <div className="lg:col-span-8 space-y-3">
          <LiveWaterfallFeed />
        </div>

        {/* Right: Detected Anomalies Feed */}
        <div className="lg:col-span-4">
          <RecentAnomaliesList />
        </div>
      </div>

      {/* AUV Sensor Pod Telemetry Grid */}
      <AuvTelemetryPanel />
    </div>
  );
};
