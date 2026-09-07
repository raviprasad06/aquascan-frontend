import React, { useEffect, useRef } from 'react';
import { useTelemetry } from '../../hooks/useTelemetry';
import { Radio, Eye, Activity, ShieldCheck, Wifi } from 'lucide-react';

export const LiveWaterfallFeed: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { telemetry } = useTelemetry();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    let animId: number;

    // Buffer to hold acoustic ping rows for waterfall scrolling
    const rows = 180;
    const pingBuffer: Uint8Array[] = [];

    for (let r = 0; r < rows; r++) {
      const row = new Uint8Array(width);
      for (let c = 0; c < width; c++) {
        // Nadir dead zone in center
        const centerDist = Math.abs(c - width / 2);
        if (centerDist < 20) {
          row[c] = Math.random() < 0.05 ? 15 : 4;
        } else {
          // Seabed acoustic backscatter
          const ripple = Math.sin(c * 0.08 + r * 0.1) * 20;
          const noise = Math.random() * 35;
          const intensity = Math.min(255, Math.max(10, 30 + ripple + noise));
          row[c] = intensity;
        }
      }
      pingBuffer.push(row);
    }

    let scanLineY = 0;

    const render = () => {
      // 1. Shift buffer down (simulate forward motion of AUV)
      const newRow = new Uint8Array(width);
      for (let c = 0; c < width; c++) {
        const centerDist = Math.abs(c - width / 2);
        if (centerDist < 20) {
          newRow[c] = Math.random() < 0.05 ? 15 : 4;
        } else {
          const ripple = Math.sin(c * 0.08 + Date.now() * 0.005) * 25;
          const noise = Math.random() * 40;
          // occasional synthetic anomaly blip
          const isAnomaly = c > 180 && c < 210 && Math.random() < 0.15;
          const intensity = isAnomaly ? 230 : Math.min(255, Math.max(10, 35 + ripple + noise));
          newRow[c] = intensity;
        }
      }
      pingBuffer.pop();
      pingBuffer.unshift(newRow);

      // 2. Render waterfall buffer to canvas
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);

      const rowHeight = height / rows;
      for (let r = 0; r < rows; r++) {
        const rowData = pingBuffer[r];
        const y = r * rowHeight;

        for (let c = 0; c < width; c += 2) {
          const val = rowData[c];
          ctx.fillStyle = `rgb(${val}, ${val}, ${val})`;
          ctx.fillRect(c, y, 2, rowHeight + 0.5);
        }
      }

      // 3. Central Nadir blind-zone indicator
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();
      ctx.setLineDash([]);

      // 4. Sweeping acoustic laser line
      scanLineY = (scanLineY + 2) % height;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, scanLineY);
      ctx.lineTo(width, scanLineY);
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="relative w-full bg-[#080808] border border-[#222222] font-mono select-none overflow-hidden">
      {/* Top Header */}
      <div className="p-3 border-b border-[#222222] bg-[#0c0c0c] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-white rounded-full animate-ping" />
          <span className="text-xs font-bold text-white tracking-widest uppercase">
            LIVE ACOUSTIC WATERFALL FEED // PORT & STARBOARD SWATH
          </span>
        </div>
        <div className="flex items-center gap-4 text-[10px] text-[#888888]">
          <span className="text-white font-bold">STATUS: ANALYZING</span>
          <span>455 kHz CHIRP</span>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="relative h-[440px] w-full bg-black">
        <canvas
          ref={canvasRef}
          width={800}
          height={440}
          className="w-full h-full object-cover block"
        />

        {/* Telemetry HUD Overlay (Exact match to Requirement #18) */}
        <aside
          aria-label="Live sonar telemetry"
          className="absolute top-4 left-4 z-10 bg-black/85 border border-[#333333] p-3 space-y-1 text-xs text-[#aaaaaa] backdrop-blur-sm shadow-xl"
        >
          <div className="text-[9px] text-[#666666] tracking-widest border-b border-[#222222] pb-1 uppercase font-bold">
            HYDROPHONE TELEMETRY
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-[#666666]">PING:</span>
            <strong className="text-white font-mono">{telemetry.ping.toString().padStart(6, '0')}</strong>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-[#666666]">FRAME:</span>
            <strong className="text-white font-mono">{telemetry.frame.toString().padStart(6, '0')}</strong>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-[#666666]">FPS:</span>
            <strong className="text-white font-mono">{telemetry.fps}</strong>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-[#666666]">DEPTH:</span>
            <strong className="text-white font-mono">{telemetry.depth.toFixed(1)} M</strong>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-[#666666]">RANGE:</span>
            <strong className="text-white font-mono">{telemetry.range} M</strong>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-[#666666]">SIGNAL:</span>
            <strong className="text-white font-mono">{telemetry.signalQuality}%</strong>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-[#666666]">MODEL:</span>
            <strong className="text-white font-mono">{telemetry.modelVersion}</strong>
          </div>
          <div className="flex justify-between gap-6 pt-1 border-t border-[#222222]">
            <span className="text-[#666666]">STATUS:</span>
            <span className="text-white font-bold tracking-wider">ANALYZING</span>
          </div>
        </aside>

        {/* Range rulers */}
        <div className="absolute top-2 right-4 text-[10px] text-white/50 bg-black/70 px-2 py-0.5 border border-[#333333]">
          STARBOARD 60M
        </div>
        <div className="absolute top-2 left-44 text-[10px] text-white/50 bg-black/70 px-2 py-0.5 border border-[#333333]">
          PORT 60M
        </div>
      </div>

      {/* Footer telemetry ribbon */}
      <div className="p-2.5 border-t border-[#222222] bg-[#0c0c0c] flex flex-wrap items-center justify-between text-[11px] text-[#777777]">
        <div className="flex items-center gap-4">
          <span>WATERFALL SCROLL: 1.2 M/S</span>
          <span>GAIN: +18 dB AUTO</span>
          <span>SPECKLE REJECTION: ACTIVE</span>
        </div>
        <div className="text-white font-bold">
          GPS: LOCATION DATA NOT AVAILABLE
        </div>
      </div>
    </div>
  );
};
