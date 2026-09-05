import React, { useEffect, useState } from 'react';
import { Layers, AlertTriangle, ShieldCheck, MapPin, Gauge } from 'lucide-react';

export const StatsGrid: React.FC = () => {
  const [counts, setCounts] = useState({
    totalScans: 0,
    anomalies: 0,
    highConfidence: 0,
    areaAnalyzed: 0,
    avgConfidence: 0,
  });

  useEffect(() => {
    const duration = 1200; // ms
    const steps = 30;
    const intervalTime = duration / steps;
    let step = 0;

    const targets = {
      totalScans: 1284,
      anomalies: 347,
      highConfidence: 281,
      areaAnalyzed: 428,
      avgConfidence: 91.7,
    };

    const timer = setInterval(() => {
      step++;
      const factor = Math.min(1, step / steps);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - factor, 3);

      setCounts({
        totalScans: Math.round(targets.totalScans * ease),
        anomalies: Math.round(targets.anomalies * ease),
        highConfidence: Math.round(targets.highConfidence * ease),
        areaAnalyzed: Math.round(targets.areaAnalyzed * ease),
        avgConfidence: Number((targets.avgConfidence * ease).toFixed(1)),
      });

      if (step >= steps) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      label: 'TOTAL SCANS',
      value: counts.totalScans.toLocaleString(),
      subtext: '+38 SCANS TODAY',
      icon: Layers,
      unit: 'ACOUSTIC SWATHS',
    },
    {
      label: 'ANOMALIES DETECTED',
      value: counts.anomalies.toLocaleString(),
      subtext: '12 UNRESOLVED',
      icon: AlertTriangle,
      unit: 'SEABED TARGETS',
    },
    {
      label: 'HIGH CONFIDENCE',
      value: counts.highConfidence.toLocaleString(),
      subtext: '81.0% OF DETECTIONS',
      icon: ShieldCheck,
      unit: '≥90% VERIFIED',
    },
    {
      label: 'AREA ANALYZED',
      value: `${counts.areaAnalyzed} KM²`,
      subtext: 'SWATH RESOLUTION: 0.05M',
      icon: MapPin,
      unit: 'BATHYAL CONTOUR',
    },
    {
      label: 'AVERAGE CONFIDENCE',
      value: `${counts.avgConfidence}%`,
      subtext: 'MODEL: SONAR-AI V1',
      icon: Gauge,
      unit: 'PRECISION INDEX',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono select-none">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="p-3.5 bg-[#090909] border border-[#222222] relative group hover:border-white/50 transition-colors"
          >
            {/* Corner Bracket */}
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-white" />
            <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-white" />

            <div className="flex items-center justify-between text-[#888888] mb-2">
              <span className="text-[10px] tracking-wider uppercase font-bold">
                {stat.label}
              </span>
              <Icon className="w-3.5 h-3.5 text-white" />
            </div>

            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight my-1">
              {stat.value}
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#666666] pt-2 border-t border-[#1a1a1a]">
              <span>{stat.unit}</span>
              <span className="text-white font-medium">{stat.subtext}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
