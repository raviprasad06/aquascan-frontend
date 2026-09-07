import React from 'react';
import { Link } from 'react-router-dom';
import { HeroSonarVisual } from '../components/sonar/HeroSonarVisual';
import { ArrowRight, Cpu, ShieldCheck, Activity, Upload } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-30 filter contrast-125"
        style={{ backgroundImage: `url('/hero-bg.jpg')` }}
      />
      {/* Dark vignette gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black pointer-events-none" />

      {/* Background subtle technical grid */}
      <div className="absolute inset-0 tech-grid pointer-events-none opacity-20" />

      {/* Top Status Bar */}
      <div className="w-full border-b border-[#222222] bg-[#050505] px-4 py-2 flex flex-wrap items-center justify-between text-xs text-[#777777] font-mono z-10">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-white">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            SYSTEM: ONLINE
          </span>
          <span className="text-[#444444]">//</span>
          <span>BACKEND: FASTAPI</span>
          <span className="text-[#444444]">//</span>
          <span>MODEL: YOLO SEGMENTATION</span>
        </div>
        <div className="flex items-center gap-4">
          <span>GPS: LOCATION DATA NOT AVAILABLE</span>
        </div>
      </div>

      {/* Navigation Header */}
      <header className="w-full border-b border-[#222222] bg-[#080808]/90 backdrop-blur-md px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 z-10 font-sans text-xs">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-6 h-6 border border-white flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
          <span className="font-bold text-white uppercase text-sm tracking-wider">AquaScan AI</span>
        </Link>

        <nav className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs font-medium">
          <Link
            to="/dashboard"
            className="px-3 py-1.5 text-[#aaaaaa] hover:text-white border border-transparent hover:border-[#333333] transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/sonar-analysis"
            className="px-3 py-1.5 text-[#aaaaaa] hover:text-white border border-transparent hover:border-[#333333] transition-colors"
          >
            Sonar Analysis
          </Link>
          <Link
            to="/detection-map"
            className="px-3 py-1.5 text-[#aaaaaa] hover:text-white border border-transparent hover:border-[#333333] transition-colors"
          >
            Detection Map
          </Link>
          <Link
            to="/reports"
            className="px-3 py-1.5 text-[#aaaaaa] hover:text-white border border-transparent hover:border-[#333333] transition-colors"
          >
            Reports
          </Link>
          <Link
            to="/system"
            className="px-3 py-1.5 text-[#aaaaaa] hover:text-white border border-transparent hover:border-[#333333] transition-colors"
          >
            System
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16 flex flex-col justify-center relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111111] border border-[#333333] text-xs text-white">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="uppercase font-semibold text-xs tracking-wider">
                Marine Sonar AI Platform
              </span>
            </div>

            {/* Hero Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight font-sans">
              AI-Powered Marine Sonar Anomaly Detection
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base text-[#aaaaaa] leading-relaxed font-sans max-w-xl">
              AI-powered side-scan sonar image analysis for automated detection and segmentation of underwater shipwrecks.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Main CTA */}
              <Link
                to="/sonar-analysis"
                className="px-6 py-3 bg-white text-black hover:bg-[#dddddd] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-glow-md transition-all cursor-pointer"
              >
                <span>Launch Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Direct Upload CTA */}
              <Link
                to="/sonar-analysis?upload=true"
                className="px-5 py-3 bg-[#111111] hover:bg-[#1a1a1a] text-white font-semibold text-xs uppercase tracking-wider border border-[#333333] hover:border-white transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Sonar Image</span>
              </Link>

              {/* Secondary CTA */}
              <Link
                to="/system"
                className="px-5 py-3 bg-[#0a0a0a] hover:bg-[#141414] text-[#aaaaaa] hover:text-white font-medium text-xs uppercase tracking-wider border border-[#222222] hover:border-[#444444] transition-colors flex items-center gap-2"
              >
                <span>System Specs</span>
              </Link>
            </div>
          </div>

          {/* Right Hero Sonar Visual */}
          <div className="lg:col-span-6 flex justify-center items-center relative">
            <div className="relative p-2 border border-[#222222] bg-[#080808]/70 backdrop-blur-sm">
              <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-white" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-white" />
              <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-white" />
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-white" />

              <HeroSonarVisual />
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 pt-8 border-t border-[#222222]">
          <div className="p-4 bg-[#090909] border border-[#222222]">
            <div className="flex items-center gap-2 text-white text-sm font-semibold mb-1">
              <Cpu className="w-4 h-4 text-white" />
              YOLO Neural Segmentation
            </div>
            <p className="text-xs text-[#888888] leading-relaxed">
              Trained deep learning models isolate and segment acoustic shipwreck targets with bounding boxes and confidence scoring.
            </p>
          </div>

          <div className="p-4 bg-[#090909] border border-[#222222]">
            <div className="flex items-center gap-2 text-white text-sm font-semibold mb-1">
              <Activity className="w-4 h-4 text-white" />
              FastAPI Inference Engine
            </div>
            <p className="text-xs text-[#888888] leading-relaxed">
              High-throughput backend processing pipeline supporting automated multi-format image ingestion and instant prediction reports.
            </p>
          </div>

          <div className="p-4 bg-[#090909] border border-[#222222]">
            <div className="flex items-center gap-2 text-white text-sm font-semibold mb-1">
              <ShieldCheck className="w-4 h-4 text-white" />
              Structured Dossiers &amp; Export
            </div>
            <p className="text-xs text-[#888888] leading-relaxed">
              Complete local scan persistence, printable survey dossiers, and RFC 4180 CSV / JSON detection catalog export.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#222222] bg-[#050505] px-4 py-3 text-center text-xs text-[#555555]">
        AquaScan AI &bull; Marine Sonar Anomaly Detection Platform
      </footer>
    </div>
  );
};

export default LandingPage;
