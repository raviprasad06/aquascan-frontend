import React from 'react';
import { SystemDiagnostics } from '../components/system/SystemDiagnostics';
import { Cpu, Server, CheckCircle2 } from 'lucide-react';

export const SystemPage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5 font-sans select-none">
      {/* Page Header */}
      <div className="p-4 bg-[#090909] border border-[#222222] flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Cpu className="w-4 h-4 text-white" />
            System Infrastructure &amp; Diagnostics
          </h1>
          <p className="text-xs text-[#888888] mt-0.5">
            AquaScan AI Sonar Platform &bull; FastAPI Backend &bull; YOLO Segmentation
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-[#888888]">
          <span>STATUS: <strong className="text-white">OPERATIONAL</strong></span>
        </div>
      </div>

      {/* Simplified Truthful Diagnostics Grid */}
      <SystemDiagnostics />
    </div>
  );
};

export default SystemPage;
