import React from 'react';
import { useTelemetry } from '../../hooks/useTelemetry';
import { Compass, Wifi, Radio, Battery, Gauge, Activity } from 'lucide-react';
import { formatCoordinates } from '../../utils/formatters';

export const AuvTelemetryPanel: React.FC = () => {
  const { telemetry } = useTelemetry();

  const metrics = [
    { label: 'PING RATE', value: '45 Hz', sub: 'CHIRP 455 kHz' },
    { label: 'DEPTH', value: `${telemetry.depth.toFixed(1)} M`, sub: 'ALT: 12.4 M' },
    { label: 'SWATH RANGE', value: `${telemetry.range} M`, sub: 'PORT/STBD 60M' },
    { label: 'SIGNAL QUALITY', value: `${telemetry.signalQuality}%`, sub: 'SNR: +24.8 dB' },
    { label: 'NOISE LEVEL', value: `${telemetry.noiseLevel} dB`, sub: 'SPECKLE FILTER ON' },
    { label: 'VELOCITY', value: `${telemetry.velocity} KTS`, sub: '1.23 M/S' },
    { label: 'HEADING', value: `${telemetry.heading.toFixed(1)}°`, sub: 'GYRO COMPASS' },
    { label: 'PROCESSING TIME', value: `${telemetry.processingTimeMs.toFixed(1)} MS`, sub: 'INFERENCE LATENCY' },
  ];

  return (
    <div className="bg-[#090909] border border-[#222222] p-4 font-mono select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#222222] mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-white" />
          <span className="text-xs font-bold text-white tracking-widest uppercase">
            AUV SENSOR TELEMETRY // DEMO DATA
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-[#888888]">
          <span className="flex items-center gap-1 px-1.5 py-0.5 border border-[#444444] text-[#777777]">
            SIMULATED
          </span>
          <span>BATTERY: {telemetry.batteryLevel}%</span>
        </div>
      </div>

      {/* Grid of Telemetry */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metrics.map(m => (
          <div key={m.label} className="p-2.5 bg-[#101010] border border-[#1f1f1f]">
            <div className="text-[9px] text-[#777777] uppercase tracking-wider mb-1">
              {m.label}
            </div>
            <div className="text-base sm:text-lg font-bold text-white">
              {m.value}
            </div>
            <div className="text-[9px] text-[#555555] mt-0.5">
              {m.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Position coordinates ribbon */}
      <div className="mt-3 pt-3 border-t border-[#1a1a1a] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#888888]">
        <div>
          GEODETIC POSITION: <strong className="text-white">LOCATION DATA NOT AVAILABLE</strong>
        </div>
        <div className="flex items-center gap-4 text-[10px]">
          <span>WATER TEMP: {telemetry.waterTemp}°C</span>
          <span>SALINITY: {telemetry.salinity} PSU</span>
          <span>SOUND SPEED: {telemetry.soundSpeed} M/S</span>
        </div>
      </div>
    </div>
  );
};
