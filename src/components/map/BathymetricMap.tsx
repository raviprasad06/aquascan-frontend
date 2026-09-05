import React, { useEffect, useRef, useState } from 'react';
import { SonarAnomaly } from '../../types/anomaly';
import { formatCoordinates, formatDimensions } from '../../utils/formatters';
import { Crosshair, ZoomIn, ZoomOut, RotateCcw, ShieldAlert, Layers } from 'lucide-react';
import { ConfidenceBar } from '../common/ConfidenceBar';

interface BathymetricMapProps {
  anomalies: SonarAnomaly[];
  selectedAnomaly: SonarAnomaly | null;
  onSelectAnomaly: (anomaly: SonarAnomaly) => void;
}

export const BathymetricMap: React.FC<BathymetricMapProps> = ({
  anomalies,
  selectedAnomaly,
  onSelectAnomaly
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [hoveredAnomaly, setHoveredAnomaly] = useState<SonarAnomaly | null>(null);

  // Lat/Long bounds for mapping coordinates to canvas
  const minLat = 22.5640;
  const maxLat = 22.5810;
  const minLon = 88.3560;
  const maxLon = 88.3730;

  const latToY = (lat: number, h: number) => {
    return h - ((lat - minLat) / (maxLat - minLat)) * (h - 80) - 40;
  };

  const lonToX = (lon: number, w: number) => {
    return ((lon - minLon) / (maxLon - minLon)) * (w - 80) + 40;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    let sweepAngle = 0;
    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      // Deep black background
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, w, h);

      // Coordinate Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
      ctx.lineWidth = 1;
      const gridCountX = 10;
      const gridCountY = 8;

      for (let i = 0; i <= gridCountX; i++) {
        const x = (w / gridCountX) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();

        // Lon label
        const lonVal = minLon + (i / gridCountX) * (maxLon - minLon);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.font = '9px monospace';
        ctx.fillText(`${lonVal.toFixed(4)}°E`, x + 3, h - 8);
      }

      for (let j = 0; j <= gridCountY; j++) {
        const y = (h / gridCountY) * j;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();

        // Lat label
        const latVal = maxLat - (j / gridCountY) * (maxLat - minLat);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.font = '9px monospace';
        ctx.fillText(`${latVal.toFixed(4)}°N`, 6, y - 4);
      }

      // Bathymetric Depth Contours (Stylized isobath contour curves)
      const contours = [
        { depth: '30M', offset: 0.15, segments: [[0.05, 0.1], [0.3, 0.25], [0.6, 0.18], [0.95, 0.35]] },
        { depth: '40M', offset: 0.35, segments: [[0.05, 0.35], [0.35, 0.45], [0.65, 0.38], [0.95, 0.55]] },
        { depth: '50M', offset: 0.60, segments: [[0.05, 0.6], [0.4, 0.68], [0.7, 0.62], [0.95, 0.78]] },
        { depth: '60M', offset: 0.85, segments: [[0.05, 0.82], [0.38, 0.88], [0.72, 0.84], [0.95, 0.95]] }
      ];

      contours.forEach((c, idx) => {
        ctx.strokeStyle = idx % 2 === 0 ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        c.segments.forEach((pt, pidx) => {
          const px = pt[0] * w;
          const py = pt[1] * h;
          if (pidx === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.font = '8px monospace';
        ctx.fillText(`ISOBATH -${c.depth}`, c.segments[1][0] * w + 5, c.segments[1][1] * h - 4);
      });

      // White Coastline (Northern / Western shelf barrier)
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.15);
      ctx.lineTo(w * 0.2, h * 0.12);
      ctx.lineTo(w * 0.45, h * 0.06);
      ctx.lineTo(w * 0.7, h * 0.08);
      ctx.lineTo(w, h * 0.04);
      ctx.stroke();

      // Coastline Hatching
      for (let cx = 0; cx < w; cx += 25) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, 0);
        ctx.lineTo(cx - 10, h * 0.08);
        ctx.stroke();
      }

      // Sonar Survey Transect Lines (AUV S-curve survey corridor)
      const transects = [
        [[w * 0.15, h * 0.3], [w * 0.85, h * 0.3]],
        [[w * 0.85, h * 0.45], [w * 0.15, h * 0.45]],
        [[w * 0.15, h * 0.6], [w * 0.85, h * 0.6]],
        [[w * 0.85, h * 0.75], [w * 0.15, h * 0.75]]
      ];

      transects.forEach((t, tidx) => {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.moveTo(t[0][0], t[0][1]);
        ctx.lineTo(t[1][0], t[1][1]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.font = '9px monospace';
        ctx.fillText(`TRANSECT-${tidx + 1}`, t[0][0] + 10, t[0][1] - 5);
      });

      // Rotating Radar Sector Sweep in center of survey area
      const radarCenterX = w * 0.5;
      const radarCenterY = h * 0.5;
      const radarRadius = Math.min(w, h) * 0.42;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(radarCenterX, radarCenterY, radarRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Sweep Beam
      const sweepSlices = 20;
      for (let s = 0; s < sweepSlices; s++) {
        const a1 = sweepAngle - (s / sweepSlices) * 0.8;
        const a2 = sweepAngle - ((s + 1) / sweepSlices) * 0.8;
        ctx.fillStyle = `rgba(255, 255, 255, ${(1 - s / sweepSlices) * 0.12})`;
        ctx.beginPath();
        ctx.moveTo(radarCenterX, radarCenterY);
        ctx.arc(radarCenterX, radarCenterY, radarRadius, a2, a1);
        ctx.closePath();
        ctx.fill();
      }

      // Draw Anomaly Markers
      anomalies.forEach(a => {
        const ax = lonToX(a.longitude, w);
        const ay = latToY(a.latitude, h);
        const isSelected = selectedAnomaly?.id === a.id;
        const isHovered = hoveredAnomaly?.id === a.id;

        // Outer pulsing target circle
        ctx.strokeStyle = isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.beginPath();
        ctx.arc(ax, ay, isSelected ? 9 : 5, 0, Math.PI * 2);
        ctx.stroke();

        // Core dot
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ax, ay, isSelected ? 3.5 : 2, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing echo wave for high priority
        if (a.priority === 'HIGH' || isSelected) {
          const pulseR = ((Date.now() / 25) % 30);
          const pulseAlpha = Math.max(0, 1 - pulseR / 30) * 0.6;
          ctx.strokeStyle = `rgba(255, 255, 255, ${pulseAlpha})`;
          ctx.beginPath();
          ctx.arc(ax, ay, 5 + pulseR, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Target Tag Label
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px monospace';
        ctx.fillText(`[${a.id}]`, ax + 10, ay - 2);

        if (isSelected || isHovered) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.font = '9px monospace';
          ctx.fillText(`${a.classification.toUpperCase()} (${a.confidence.toFixed(1)}%)`, ax + 10, ay + 10);
        }
      });

      sweepAngle = (sweepAngle + 0.015) % (Math.PI * 2);
      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [anomalies, selectedAnomaly, hoveredAnomaly]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const clickY = ((e.clientY - rect.top) / rect.height) * canvas.height;

    // Find closest anomaly
    let closest: SonarAnomaly | null = null;
    let minDist = 25; // pixel threshold

    anomalies.forEach(a => {
      const ax = lonToX(a.longitude, canvas.width);
      const ay = latToY(a.latitude, canvas.height);
      const dist = Math.hypot(clickX - ax, clickY - ay);
      if (dist < minDist) {
        minDist = dist;
        closest = a;
      }
    });

    if (closest) {
      onSelectAnomaly(closest);
    }
  };

  return (
    <div className="relative w-full h-[640px] bg-black border border-[#222222] font-mono select-none overflow-hidden group">
      {/* Top Header Controls */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-[#090909]/90 border border-[#333333] px-3 py-1.5 backdrop-blur-sm">
        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
        <span className="text-xs font-bold text-white tracking-widest uppercase">
          HYDROGRAPHIC SEABED CARTOGRAPHY
        </span>
        <span className="text-[10px] text-[#666666]">
          // WGS84 // DATUM: LAT-MSL
        </span>
      </div>

      {/* Map Canvas */}
      <canvas
        ref={canvasRef}
        width={1100}
        height={640}
        onClick={handleCanvasClick}
        className="w-full h-full object-cover cursor-crosshair"
      />

      {/* Selected Anomaly Inspector Overlay Card (Requirement #15) */}
      {selectedAnomaly && (
        <aside
          aria-label="Anomaly telemetry details"
          className="absolute bottom-4 right-4 z-20 w-80 bg-[#0c0c0c] border border-white p-4 shadow-2xl font-mono animate-in slide-in-from-bottom-3"
        >
          {/* Corner Accents */}
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-white" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-white" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white" />

          <div className="flex items-center justify-between pb-2 border-b border-[#222222] mb-3">
            <div className="flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-white" />
              <span className="text-xs font-bold text-white tracking-widest uppercase">
                ANOMALY {selectedAnomaly.id}
              </span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 border border-white/50 text-white font-bold">
              {selectedAnomaly.priority}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#888888]">CLASS:</span>
              <strong className="text-white uppercase">{selectedAnomaly.classification}</strong>
            </div>

            <div className="flex justify-between">
              <span className="text-[#888888]">CONFIDENCE:</span>
              <strong className="text-white">{selectedAnomaly.confidence.toFixed(1)}%</strong>
            </div>

            <div className="flex justify-between">
              <span className="text-[#888888]">LATITUDE:</span>
              <span className="text-white">{selectedAnomaly.latitude.toFixed(4)}° N</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#888888]">LONGITUDE:</span>
              <span className="text-white">{selectedAnomaly.longitude.toFixed(4)}° E</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#888888]">DIMENSIONS:</span>
              <span className="text-white">{formatDimensions(selectedAnomaly.width, selectedAnomaly.height)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#888888]">STATUS:</span>
              <span className="text-white font-bold">{selectedAnomaly.status}</span>
            </div>

            <div className="pt-2 border-t border-[#222222]">
              <ConfidenceBar confidence={selectedAnomaly.confidence} compact={true} />
            </div>
          </div>
        </aside>
      )}

      {/* Bottom Telemetry Bar */}
      <div className="absolute bottom-2 left-3 z-10 flex items-center gap-4 text-[10px] text-[#666666] font-mono bg-black/80 px-2.5 py-1 border border-[#222222]">
        <span>SURVEY TRANSECTS: 4 ACTIVE</span>
        <span>MARKERS: {anomalies.length} PLOTTED</span>
        <span>SWATH OVERLAP: 25%</span>
      </div>
    </div>
  );
};
