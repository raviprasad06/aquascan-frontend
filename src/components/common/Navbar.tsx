import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Upload, Cpu } from 'lucide-react';

export const Navbar: React.FC = () => {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/sonar-analysis', label: 'Sonar Analysis' },
    { to: '/detection-map', label: 'Detection Map' },
    { to: '/reports', label: 'Reports' },
    { to: '/system', label: 'System' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#060606]/95 border-b border-[#222222] backdrop-blur-md select-none font-sans">
      {/* Top micro status line */}
      <div className="hidden lg:flex items-center justify-between px-4 py-1 border-b border-[#141414] bg-[#020202] text-[11px] text-[#777777] font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-white font-medium">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            SYSTEM: ONLINE
          </span>
          <span className="text-[#555555]">//</span>
          <span>BACKEND: FASTAPI</span>
          <span className="text-[#555555]">//</span>
          <span>MODEL: YOLO SEGMENTATION</span>
        </div>
        <div className="flex items-center gap-4">
          <span>UTC: {new Date().toISOString().substring(11, 19)}</span>
          <span className="text-[#555555]">//</span>
          <span className="text-[#888888]">GPS: LOCATION DATA NOT AVAILABLE</span>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group flex-shrink-0"
        >
          <div className="w-8 h-8 bg-black border border-white flex items-center justify-center relative overflow-hidden group-hover:bg-white transition-colors duration-200">
            <div className="w-4 h-4 rounded-full border border-white group-hover:border-black flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white group-hover:bg-black rounded-full" />
            </div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white group-hover:border-black" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white tracking-wider font-sans">
                AquaScan AI
              </span>
              <span className="text-[10px] px-1.5 py-0.2 border border-[#444444] text-[#aaaaaa] font-mono">
                v1.0
              </span>
            </div>
            <div className="text-[10px] text-[#777777] uppercase tracking-normal font-sans hidden sm:block">
              Marine Sonar Analysis Platform
            </div>
          </div>
        </Link>

        {/* Center: Main Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-sans font-medium">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-3.5 py-1.5 border transition-colors ${
                  isActive
                    ? 'bg-white text-black border-white font-semibold shadow-glow-sm'
                    : 'bg-transparent text-[#999999] border-transparent hover:text-white hover:border-[#333333]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right: Upload Button & Status */}
        <div className="flex items-center gap-3">
          <Link
            to="/sonar-analysis?upload=true"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#333333] hover:border-white bg-[#0f0f0f] text-white text-xs font-sans font-medium transition-colors flex-shrink-0"
            title="Upload Sonar Data"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="font-semibold">Upload Sonar</span>
          </Link>

          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 border border-[#222222] bg-[#0c0c0c] text-xs font-mono text-[#888888]">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            <span className="text-[#888888]">STATUS:</span>
            <span className="text-white font-semibold">READY</span>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden flex items-center overflow-x-auto px-3 py-1.5 border-t border-[#1a1a1a] bg-[#0a0a0a] gap-1 text-xs font-sans no-scrollbar">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `px-2.5 py-1 border whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-white text-black border-white font-semibold'
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
