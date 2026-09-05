import React from 'react';
import { useTelemetry } from '../../hooks/useTelemetry';
import { Cpu, ShieldCheck, Database, Radio, Anchor, Server, Activity } from 'lucide-react';

export const SystemDiagnostics: React.FC = () => {
  const { diagnostics, telemetry } = useTelemetry();

  const systems = [
    { name: 'SONAR ARRAY', status: diagnostics.sonarArray, detail: '455/900 kHz Chirp Transducers', icon: Radio },
    { name: 'AI ENGINE', status: diagnostics.aiEngine, detail: 'Inference latency: 14.8ms // Sonar-AI V1', icon: Cpu },
    { name: 'NOISE FILTER', status: diagnostics.noiseFilter, detail: 'Adaptive median speckle suppressor', icon: ShieldCheck },
    { name: 'DETECTION ENGINE', status: diagnostics.detectionEngine, detail: 'Convoluted boundary classification', icon: Activity },
    { name: 'GEOLOCATION', status: diagnostics.geolocation, detail: 'RTK Sub-meter WGS84 Geodetic fix', icon: Anchor },
    { name: 'REPORT ENGINE', status: diagnostics.reportEngine, detail: 'RFC 4180 CSV / JSON schema compiler', icon: Database },
    { name: 'AUV LINK', status: diagnostics.auvLink, detail: 'Acoustic micro-modem telemetry queue', icon: Server },
  ];

  return (
    <div className="bg-[#090909] border border-[#222222] font-mono select-none">
      {/* Header */}
      <div className="p-3 border-b border-[#222222] bg-[#0f0f0f] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-white" />
          <span className="text-xs font-bold text-white tracking-widest uppercase">
            SYSTEM DIAGNOSTICS & SUBSYSTEM HEALTH
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 border border-white/40 text-white font-bold">
          7/7 NOMINAL
        </span>
      </div>

      {/* Diagnostics Grid */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {systems.map(s => {
          const Icon = s.icon;
          return (
            <div
              key={s.name}
              className="p-3 bg-[#111111] border border-[#262626] hover:border-white/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white tracking-wider flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-white" />
                  {s.name}
                </span>
                <span className="flex items-center gap-1.5 text-[10px] px-1.5 py-0.2 border border-white/60 bg-[#1c1c1c] text-white font-bold">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  {s.status}
                </span>
              </div>
              <div className="text-[10px] text-[#888888] font-sans">
                {s.detail}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hardware specs footer */}
      <div className="p-3 border-t border-[#1c1c1c] bg-[#0c0c0c] flex flex-wrap items-center justify-between text-[10px] text-[#666666]">
        <div>
          PROCESSING PLATFORM: EMBEDDED TENSOR CORE 64GB // CHIRP SAMPLER 24-BIT
        </div>
        <div>
          UPTIME: 148h 22m // TEMPERATURE: 38.2°C // VOLTAGE: 28.4V
        </div>
      </div>
    </div>
  );
};
