import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HeroRadarCanvas } from '../components/radar/HeroRadarCanvas';
import { BootSequenceModal } from '../components/common/BootSequenceModal';
import { ArrowRight, ShieldCheck, Waves, Radar, Cpu, Compass, Activity, Terminal } from 'lucide-react';
import { MicroRadar } from '../components/radar/MicroRadar';

export const LandingPage: React.FC = () => {
  const [isBootOpen, setIsBootOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col relative overflow-hidden">
      {/* Front Page Dramatic Monochrome Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-35 filter contrast-125"
        style={{ backgroundImage: `url('/hero-bg.jpg')` }}
      />
      {/* Dark vignette gradient overlay for readability and technical atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/65 to-black pointer-events-none" />

      {/* Background subtle technical grid */}
      <div className="absolute inset-0 tech-grid pointer-events-none opacity-25" />

      {/* Boot sequence modal */}
      <BootSequenceModal
        isOpen={isBootOpen}
        onClose={() => setIsBootOpen(false)}
      />

      {/* Top telemetry bar */}
      <div className="w-full border-b border-[#222222] bg-[#050505] px-4 py-2 flex flex-wrap items-center justify-between text-[10px] text-[#666666] tracking-widest uppercase z-10">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-white">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
            SYSTEM STATUS // ONLINE
          </span>
          <span>PROTOCOL: SSS-CHIRP-V1</span>
          <span>STATION: PACIFIC_SUBSEA_08</span>
        </div>
        <div className="flex items-center gap-4">
          <span>FREQ: 455/900 KHZ</span>
          <span>AUV LINK: SYNCHRONIZED</span>
          <span>WGS84 RTK: LOCKED</span>
        </div>
      </div>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            {/* System Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111111] border border-[#333333] text-xs text-white">
              <MicroRadar size={16} />
              <span className="tracking-widest uppercase font-bold text-[11px]">
                AUTONOMOUS MARINE INTELLIGENCE
              </span>
            </div>

            {/* Hero Heading (Exact match to Requirement #5) */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white uppercase leading-tight font-sans">
              AI-POWERED MARINE ANOMALY DETECTION
            </h1>

            {/* Subheading (Exact match to Requirement #5) */}
            <p className="text-sm sm:text-base text-[#aaaaaa] leading-relaxed font-sans max-w-xl">
              Autonomous Side-Scan Sonar Intelligence for Detecting Ghost Nets, Marine Debris, Shipwrecks and Underwater Hazards.
            </p>

            {/* Telemetry Micro-grid */}
            <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#222222] text-xs">
              <div className="p-2 bg-[#0c0c0c] border border-[#1f1f1f]">
                <div className="text-[9px] text-[#666666] uppercase">CONFIDENCE</div>
                <div className="text-sm font-bold text-white mt-0.5">96.4% AVG</div>
              </div>
              <div className="p-2 bg-[#0c0c0c] border border-[#1f1f1f]">
                <div className="text-[9px] text-[#666666] uppercase">LATENCY</div>
                <div className="text-sm font-bold text-white mt-0.5">14.8 MS</div>
              </div>
              <div className="p-2 bg-[#0c0c0c] border border-[#1f1f1f]">
                <div className="text-[9px] text-[#666666] uppercase">SWATH</div>
                <div className="text-sm font-bold text-white mt-0.5">120 METER</div>
              </div>
            </div>

            {/* Action Buttons (Exact match to Requirement #5) */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* Main CTA */}
              <button
                onClick={() => setIsBootOpen(true)}
                className="px-6 py-3.5 bg-white text-black hover:bg-[#dddddd] font-bold text-xs uppercase tracking-widest border border-white flex items-center gap-2 shadow-glow-md transition-all cursor-pointer"
              >
                <span>INITIALIZE SONAR</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Secondary CTA */}
              <Link
                to="/dashboard"
                className="px-6 py-3.5 bg-[#111111] hover:bg-[#1a1a1a] text-white font-bold text-xs uppercase tracking-widest border border-[#444444] hover:border-white transition-colors flex items-center gap-2"
              >
                <span>VIEW SYSTEM</span>
              </Link>
            </div>
          </div>

          {/* Right Hero Radar Animation Column (Exact match to Requirement #6) */}
          <div className="lg:col-span-6 flex justify-center items-center relative">
            {/* Corner styling frame */}
            <div className="relative p-2 border border-[#222222] bg-[#080808]/70 backdrop-blur-sm">
              <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-white" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-white" />
              <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-white" />
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-white" />

              <HeroRadarCanvas size={480} />
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-12 pt-8 border-t border-[#222222]">
          <div className="p-4 bg-[#090909] border border-[#222222]">
            <div className="flex items-center gap-2 text-white text-xs font-bold uppercase mb-1">
              <Waves className="w-4 h-4 text-white" />
              ACOUSTIC SPECKLE FILTER
            </div>
            <p className="text-[11px] text-[#888888] font-sans leading-relaxed">
              Suppresses seafloor reverberation and volume backscatter while preserving high-relief artificial edges.
            </p>
          </div>

          <div className="p-4 bg-[#090909] border border-[#222222]">
            <div className="flex items-center gap-2 text-white text-xs font-bold uppercase mb-1">
              <Cpu className="w-4 h-4 text-white" />
              SONAR-AI INFERENCE
            </div>
            <p className="text-[11px] text-[#888888] font-sans leading-relaxed">
              Convolutional object classification isolating ghost nets, subsea conduits, submerged wrecks, and hazardous debris.
            </p>
          </div>

          <div className="p-4 bg-[#090909] border border-[#222222]">
            <div className="flex items-center gap-2 text-white text-xs font-bold uppercase mb-1">
              <Compass className="w-4 h-4 text-white" />
              RTK GEOLOCATION LOCK
            </div>
            <p className="text-[11px] text-[#888888] font-sans leading-relaxed">
              Sub-meter precision geocoding transforms acoustic pixel coordinates directly to global WGS84 GPS fixes.
            </p>
          </div>

          <div className="p-4 bg-[#090909] border border-[#222222]">
            <div className="flex items-center gap-2 text-white text-xs font-bold uppercase mb-1">
              <Activity className="w-4 h-4 text-white" />
              SHADOW RECONSTRUCTION
            </div>
            <p className="text-[11px] text-[#888888] font-sans leading-relaxed">
              Calculates three-dimensional obstacle elevation and volume based on acoustic shadow geometry.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#222222] bg-[#050505] px-4 py-3 text-center text-[10px] text-[#555555] tracking-wider uppercase">
        SONAR AI // AUTONOMOUS MARINE DEBRIS & ANOMALY DETECTION SYSTEM // HACKATHON INNOVATION LAB
      </footer>
    </div>
  );
};
