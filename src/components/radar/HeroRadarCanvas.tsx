import React, { useEffect, useRef, useState } from 'react';

interface HeroRadarProps {
  size?: number;
  className?: string;
  onDetectAnomaly?: (id: string) => void;
}

interface RadarTarget {
  id: string;
  code: string;
  classification: string;
  r: number; // 0 to 1
  theta: number; // radians
  confidence: number;
  depth: number;
}

export const HeroRadarCanvas: React.FC<HeroRadarProps> = ({
  size = 520,
  className = '',
  onDetectAnomaly
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeAnomaly, setActiveAnomaly] = useState<RadarTarget | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let angle = 0;
    let animId: number;

    const targets: RadarTarget[] = [
      { id: 'AN-104', code: 'AN-104', classification: 'GHOST NET', r: 0.62, theta: 0.95, confidence: 96.4, depth: 42.8 },
      { id: 'AN-105', code: 'AN-105', classification: 'PIPE', r: 0.44, theta: 2.45, confidence: 91.2, depth: 44.1 },
      { id: 'AN-107', code: 'AN-107', classification: 'SHIPWRECK', r: 0.78, theta: 3.85, confidence: 98.2, depth: 56.4 },
      { id: 'AN-108', code: 'AN-108', classification: 'CYLINDER', r: 0.35, theta: 5.12, confidence: 89.6, depth: 39.7 },
      { id: 'AN-106', code: 'AN-106', classification: 'UNKNOWN DEBRIS', r: 0.52, theta: 5.92, confidence: 74.8, depth: 41.9 },
    ];

    let pulseRadius = 0;

    const render = () => {
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2;
      const cy = size / 2;
      const maxR = size / 2 - 28;

      // Dark circular background
      ctx.fillStyle = '#060606';
      ctx.beginPath();
      ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
      ctx.fill();

      // Background subtle grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridStep = 40;
      for (let x = cx - maxR; x <= cx + maxR; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x, cy - maxR);
        ctx.lineTo(x, cy + maxR);
        ctx.stroke();
      }
      for (let y = cy - maxR; y <= cy + maxR; y += gridStep) {
        ctx.beginPath();
        ctx.moveTo(cx - maxR, y);
        ctx.lineTo(cx + maxR, y);
        ctx.stroke();
      }

      // Concentric range rings
      const rings = [0.25, 0.5, 0.75, 1.0];
      const ringDistances = ['30M', '60M', '90M', '120M'];

      rings.forEach((ratio, idx) => {
        const r = maxR * ratio;
        ctx.strokeStyle = ratio === 1.0 ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = ratio === 1.0 ? 1.5 : 1;
        ctx.setLineDash(ratio === 0.5 ? [4, 4] : []);
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Distance text
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = '9px monospace';
        ctx.fillText(ringDistances[idx], cx + 4, cy - r + 11);
      });

      // Crosshairs
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - maxR, cy);
      ctx.lineTo(cx + maxR, cy);
      ctx.moveTo(cx, cy - maxR);
      ctx.lineTo(cx, cy + maxR);
      ctx.stroke();

      // Diagonal ticks & Azimuth labels
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
        const deg = Math.round((a * 180) / Math.PI);
        const degText = `${deg.toString().padStart(3, '0')}°`;
        const lx = cx + Math.cos(a) * (maxR + 14);
        const ly = cy + Math.sin(a) * (maxR + 14);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(degText, lx, ly);

        // Tick mark on rim
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * (maxR - 5), cy + Math.sin(a) * (maxR - 5));
        ctx.lineTo(cx + Math.cos(a) * (maxR + 3), cy + Math.sin(a) * (maxR + 3));
        ctx.stroke();
      }

      // Acoustic Ping Pulse Wave (expands outward)
      pulseRadius = (pulseRadius + 1.2) % maxR;
      const pulseAlpha = Math.max(0, 1 - pulseRadius / maxR) * 0.35;
      ctx.strokeStyle = `rgba(255, 255, 255, ${pulseAlpha})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, pulseRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Rotating Radar Beam with trailing angular sweep wake
      const trailAngle = 1.2;
      const slices = 32;
      for (let i = 0; i < slices; i++) {
        const aStart = angle - (i / slices) * trailAngle;
        const aEnd = angle - ((i + 1) / slices) * trailAngle;
        const alpha = Math.pow(1 - i / slices, 2) * 0.25;

        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, maxR, aEnd, aStart);
        ctx.closePath();
        ctx.fill();
      }

      // Bright leading sweep line
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR);
      ctx.stroke();

      // Draw Anomaly Targets
      let nearestDetection: RadarTarget | null = null;
      let minAngularDiff = 999;

      targets.forEach(t => {
        const tx = cx + Math.cos(t.theta) * (maxR * t.r);
        const ty = cy + Math.sin(t.theta) * (maxR * t.r);

        // Angular difference from beam
        const diff = (angle - t.theta + Math.PI * 4) % (Math.PI * 2);

        if (diff < minAngularDiff) {
          minAngularDiff = diff;
          if (diff < 0.6) {
            nearestDetection = t;
          }
        }

        const isRecentlyScanned = diff < 0.9;
        const brightness = isRecentlyScanned ? Math.max(0.4, 1 - diff / 0.9) : 0.2;

        // Draw anomaly icon (diamond/crosshair)
        ctx.strokeStyle = `rgba(255, 255, 255, ${brightness})`;
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
        ctx.lineWidth = 1;

        // Core dot
        ctx.beginPath();
        ctx.arc(tx, ty, isRecentlyScanned ? 3.5 : 2, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing ring if recently scanned
        if (isRecentlyScanned) {
          const ringExpansion = (diff / 0.9) * 16;
          ctx.strokeStyle = `rgba(255, 255, 255, ${1 - diff / 0.9})`;
          ctx.beginPath();
          ctx.arc(tx, ty, 6 + ringExpansion, 0, Math.PI * 2);
          ctx.stroke();

          // Target tag box
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.strokeRect(tx - 7, ty - 7, 14, 14);

          // Anomaly label
          ctx.fillStyle = '#ffffff';
          ctx.font = '10px monospace';
          ctx.textAlign = 'left';
          ctx.fillText(`[${t.code}] ${t.classification}`, tx + 12, ty - 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.font = '8px monospace';
          ctx.fillText(`CONF: ${t.confidence}% | DEPTH: ${t.depth}M`, tx + 12, ty + 10);
        }
      });

      if (nearestDetection) {
        setActiveAnomaly(nearestDetection);
        onDetectAnomaly?.((nearestDetection as RadarTarget).id);
      }

      // Center Sonar Transducer array indicator
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#666666';
      ctx.strokeRect(cx - 8, cy - 8, 16, 16);

      angle = (angle + 0.02) % (Math.PI * 2);
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [size, onDetectAnomaly]);

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Outer corner marks */}
      <div className="absolute top-2 left-2 text-[10px] text-[#666666] font-mono">
        RDR_SWATH // 360° OMNI
      </div>
      <div className="absolute top-2 right-2 text-[10px] text-[#666666] font-mono">
        MODE: CHIRP_ACOUSTIC
      </div>

      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="max-w-full h-auto drop-shadow-[0_0_25px_rgba(255,255,255,0.08)]"
      />

      {/* Real-time scanning banner below radar */}
      <div className="mt-4 px-4 py-1.5 border border-[#333333] bg-[#0c0c0c] flex items-center gap-3 text-xs">
        <span className="w-2 h-2 bg-white animate-pulse" />
        <span className="text-[#888888]">STATUS:</span>
        <span className="text-white font-bold tracking-wider">
          {activeAnomaly ? `ACOUSTIC LOCK // ${activeAnomaly.code} - ${activeAnomaly.classification}` : 'SCANNING SEABED WATERS'}
        </span>
        <span className="text-[#555555] ml-auto font-mono text-[10px]">
          FREQ: 455 kHz // SWATH: 120m
        </span>
      </div>
    </div>
  );
};
