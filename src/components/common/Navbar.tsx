import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Radar, Radio, Activity, Navigation as NavIcon, Cpu, Layers } from 'lucide-react';
import { RadarSearchBar } from './RadarSearchBar';

interface NavbarProps {
  gpsLocked?: boolean;
  sonarActive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  gpsLocked = true,
  sonarActive = true
}) => {
  const navItems = [
    { to: '/dashboard', label: 'DASHBOARD' },
    { to: '/sonar-analysis', label: 'SONAR ANALYSIS' },
    { to: '/detection-map', label: 'DETECTION MAP' },
    { to: '/reports', label: 'REPORTS' },
    { to: '/live-feed', label: 'LIVE FEED' },
    { to: '/system', label: 'SYSTEM' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#060606]/95 border-b border-[#222222] backdrop-blur-md select-none">
      {/* Top micro status line */}
      <div className="hidden lg:flex items-center justify-between px-4 py-0.5 border-b border-[#141414] bg-[#020202] text-[9px] text-[#555555] font-mono tracking-widest uppercase">
        <div className="flex items-center gap-4">
          <span>AUTONOMOUS_AUV_LINK: V1.0.4</span>
          <span>// CHIRP_455_900KHZ</span>
          <span>// RTK_CORRECTION: ACTIVE</span>
        </div>
        <div className="flex items-center gap-4">
          <span>SYS_CLK: {new Date().toISOString().substring(11, 19)} UTC</span>
          <span>LAT: 22.5726° N</span>
          <span>LON: 88.3639° E</span>
        </div>
      </div>

      <div className="px-3 sm:px-5 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group flex-shrink-0"
        >
          <div className="w-8 h-8 bg-black border border-white flex items-center justify-center relative overflow-hidden group-hover:bg-white transition-colors duration-200">
            <div className="w-4 h-4 rounded-full border border-white group-hover:border-black flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white group-hover:bg-black rounded-full" />
            </div>
            {/* Minimalist corner line */}
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white group-hover:border-black" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white tracking-widest font-mono">
                SONAR AI
              </span>
              <span className="text-[9px] px-1 py-0.2 border border-[#444444] text-[#888888] font-mono">
                AUTONOMOUS
              </span>
            </div>
            <div className="text-[8px] text-[#666666] tracking-tighter uppercase font-mono hidden sm:block">
              MARINE ANOMALY DETECTION
            </div>
          </div>
        </Link>

        {/* Center: Main Navigation */}
        <nav className="hidden md:flex items-center gap-1 font-mono text-xs">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-3 py-1.5 border transition-colors tracking-wider ${
                  isActive
                    ? 'bg-white text-black border-white font-bold shadow-glow-sm'
                    : 'bg-transparent text-[#999999] border-transparent hover:text-white hover:border-[#333333]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Center-Right: Radar Search Bar */}
        <div className="w-44 sm:w-64 lg:w-72">
          <RadarSearchBar />
        </div>

        {/* Right: Technical Telemetry Status */}
        <div className="hidden xl:flex items-center gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 px-2 py-1 border border-[#222222] bg-[#0c0c0c]">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            <span className="text-[#888888]">SYS:</span>
            <span className="text-white font-semibold">ONLINE</span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-1 border border-[#222222] bg-[#0c0c0c]">
            <span className="w-1.5 h-1.5 bg-white rounded-full" />
            <span className="text-[#888888]">GPS:</span>
            <span className="text-white font-semibold">LOCK</span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-1 border border-[#222222] bg-[#0c0c0c]">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
            <span className="text-[#888888]">SONAR:</span>
            <span className="text-white font-semibold">ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Mobile nav subbar */}
      <div className="md:hidden flex items-center overflow-x-auto px-3 py-1.5 border-t border-[#1a1a1a] bg-[#0a0a0a] gap-1 text-[11px] font-mono no-scrollbar">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `px-2.5 py-1 border whitespace-nowrap ${
                isActive
                  ? 'bg-white text-black border-white font-bold'
                  : 'text-[#888888] border-[#222222]'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </header>
  );
};
