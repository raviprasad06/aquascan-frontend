import React from 'react';
import { SystemDiagnostics } from '../components/system/SystemDiagnostics';
import { TerminalConsole } from '../components/system/TerminalConsole';
import { AuvTelemetryPanel } from '../components/dashboard/AuvTelemetryPanel';
import { Cpu, ShieldCheck, Activity, Terminal } from 'lucide-react';

export const SystemPage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5 font-mono select-none">
      {/* Page Header */}
      <div className="p-3.5 bg-[#090909] border border-[#222222] flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm sm:text-base font-bold text-white tracking-widest uppercase font-sans flex items-center gap-2">
            <span className="w-2 h-2 bg-white rounded-full animate-ping" />
            SYSTEM DIAGNOSTICS & TELEMETRY INFRASTRUCTURE
          </div>
          <div className="text-[11px] text-[#888888] mt-0.5">
            FIRMWARE: SONAR-AI-OS V1.0.4-LTS // ARCHITECTURE: EMBEDDED TENSOR // AUV LINK: ENCRYPTED
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#888888]">
          <span>STATUS: <strong className="text-white">7/7 SUBSYSTEMS NOMINAL</strong></span>
        </div>
      </div>

      {/* Subsystems Status Grid */}
      <SystemDiagnostics />

      {/* Live Stream Terminal */}
      <TerminalConsole />

      {/* Telemetry Sensor Ribbon */}
      <AuvTelemetryPanel />
    </div>
  );
};
