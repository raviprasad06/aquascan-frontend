import React from 'react';
import { Link } from 'react-router-dom';
import { StatsGrid } from '../components/dashboard/StatsGrid';
import { SonarImagePreview } from '../components/dashboard/SonarImagePreview';
import { RecentAnomaliesList } from '../components/dashboard/RecentAnomaliesList';
import { Play, MapPin, Upload } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto font-sans text-white select-none">
      {/* Dashboard Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-[#090909] border border-[#222222]">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-sans">
              Marine Sonar Intelligence Dashboard
            </h1>
          </div>
          <div className="text-xs text-[#888888]">
            AI-powered side-scan sonar detection system &bull; Shipwreck classification
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/sonar-analysis?upload=true"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#141414] border border-[#333333] hover:border-white text-white text-xs font-semibold uppercase transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Sonar</span>
          </Link>
          <Link
            to="/sonar-analysis"
            className="flex items-center gap-2 px-4 py-2 bg-white text-black font-bold text-xs uppercase hover:bg-[#dddddd] transition-all shadow-glow-sm cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Open Analysis</span>
          </Link>
          <Link
            to="/detection-map"
            className="flex items-center gap-2 px-3.5 py-2 bg-[#121212] border border-[#333333] hover:border-white text-white text-xs font-semibold uppercase transition-colors"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Detection Map</span>
          </Link>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <StatsGrid />

      {/* Sonar Image Preview & Recent Anomalies */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Real Sonar Image Preview */}
        <div className="lg:col-span-8">
          <SonarImagePreview />
        </div>

        {/* Right: Detected Anomalies Feed */}
        <div className="lg:col-span-4">
          <RecentAnomaliesList />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
