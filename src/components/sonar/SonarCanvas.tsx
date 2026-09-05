import React, { useEffect, useRef, useState } from 'react';
import { SonarAnomaly } from '../../types/anomaly';

interface SonarCanvasProps {
  laserY: number; // 0 to 100
  isScanning: boolean;
  selectedAnomaly: SonarAnomaly | null;
  anomalies: SonarAnomaly[];
  revealedAnomalyIds: Set<string>;
  onSelectAnomaly: (anomaly: SonarAnomaly) => void;
  datasetType?: string;
}

export const SonarCanvas: React.FC<SonarCanvasProps> = ({
  laserY,
  isScanning,
  selectedAnomaly,
  anomalies,
  revealedAnomalyIds,
  onSelectAnomaly,
  datasetType = 'debris_field'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // 1. Fill base dark acoustic background
    ctx.fillStyle = '#060606';
    ctx.fillRect(0, 0, width, height);

    // 2. Generate procedural seabed acoustic backscatter texture
    // Port Channel (0 to width*0.48), Starboard Channel (width*0.52 to width), Center Nadir (0.48 to 0.52)
    const nadirLeft = width * 0.485;
    const nadirRight = width * 0.515;

    // Draw Port & Starboard Seabed Ripples
    const seed = datasetType.length;
    for (let y = 0; y < height; y += 3) {
      // Periodic sand ripple wave
      const waveOffset = Math.sin(y * 0.04 + seed) * 12 + Math.cos(y * 0.08) * 8;
      
      // Port side
      const portGradient = ctx.createLinearGradient(0, y, nadirLeft, y);
      const portIntensity = 25 + Math.sin(y * 0.1 + waveOffset * 0.2) * 12;
      portGradient.addColorStop(0, `rgb(${Math.max(5, portIntensity - 10)}, ${Math.max(5, portIntensity - 10)}, ${Math.max(5, portIntensity - 10)})`);
      portGradient.addColorStop(0.7, `rgb(${portIntensity + 15}, ${portIntensity + 15}, ${portIntensity + 15})`);
      portGradient.addColorStop(1, 'rgb(8, 8, 8)');
      ctx.fillStyle = portGradient;
      ctx.fillRect(0, y, nadirLeft, 3);

      // Starboard side
      const stbdGradient = ctx.createLinearGradient(nadirRight, y, width, y);
      const stbdIntensity = 24 + Math.cos(y * 0.1 + waveOffset * 0.2) * 12;
      stbdGradient.addColorStop(0, 'rgb(8, 8, 8)');
      stbdGradient.addColorStop(0.3, `rgb(${stbdIntensity + 15}, ${stbdIntensity + 15}, ${stbdIntensity + 15})`);
      stbdGradient.addColorStop(1, `rgb(${Math.max(5, stbdIntensity - 10)}, ${Math.max(5, stbdIntensity - 10)}, ${Math.max(5, stbdIntensity - 10)})`);
      ctx.fillStyle = stbdGradient;
      ctx.fillRect(nadirRight, y, width - nadirRight, 3);
    }

    // 3. Central Nadir Line (Blind zone / water column directly beneath towfish)
    const nadirGrad = ctx.createLinearGradient(nadirLeft - 10, 0, nadirRight + 10, 0);
    nadirGrad.addColorStop(0, 'rgba(10, 10, 10, 0)');
    nadirGrad.addColorStop(0.3, 'rgba(0, 0, 0, 0.95)');
    nadirGrad.addColorStop(0.5, 'rgba(0, 0, 0, 1)');
    nadirGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.95)');
    nadirGrad.addColorStop(1, 'rgba(10, 10, 10, 0)');
    ctx.fillStyle = nadirGrad;
    ctx.fillRect(nadirLeft - 10, 0, nadirRight - nadirLeft + 20, height);

    // Center Altitude Tracking Line (dashed white line down center)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
    ctx.setLineDash([]);

    // 4. Acoustic speckle noise
    const speckleCount = 4000;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    for (let i = 0; i < speckleCount; i++) {
      const sx = Math.random() * width;
      // skip nadir zone mostly
      if (sx > nadirLeft && sx < nadirRight && Math.random() > 0.05) continue;
      const sy = Math.random() * height;
      const sSize = Math.random() * 1.5 + 0.5;
      ctx.fillRect(sx, sy, sSize, sSize);
    }

    // 5. Draw Acoustic Signatures of Anomalies (Specularity + Acoustic Shadows)
    anomalies.forEach(anomaly => {
      const boxX = (anomaly.boundingBox.x / 100) * width;
      const boxY = (anomaly.boundingBox.y / 100) * height;
      const boxW = (anomaly.boundingBox.width / 100) * width;
      const boxH = (anomaly.boundingBox.height / 100) * height;

      // In side-scan sonar, objects cast shadows away from the nadir line
      const isPort = boxX < width / 2;
      const shadowDirection = isPort ? -1 : 1;
      const shadowLength = boxW * 1.6;

      // Acoustic Shadow (pure black zone behind high-relief object)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.96)';
      ctx.beginPath();
      if (isPort) {
        ctx.moveTo(boxX, boxY);
        ctx.lineTo(boxX - shadowLength, boxY - 4);
        ctx.lineTo(boxX - shadowLength, boxY + boxH + 6);
        ctx.lineTo(boxX, boxY + boxH);
      } else {
        ctx.moveTo(boxX + boxW, boxY);
        ctx.lineTo(boxX + boxW + shadowLength, boxY - 4);
        ctx.lineTo(boxX + boxW + shadowLength, boxY + boxH + 6);
        ctx.lineTo(boxX + boxW, boxY + boxH);
      }
      ctx.closePath();
      ctx.fill();

      // Bright Specular Reflection (hard target highlight facing transducer)
      const highlightX = isPort ? boxX + boxW * 0.6 : boxX;
      const highlightW = boxW * 0.5;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      if (anomaly.classification === 'Ghost Net') {
        // Draw mesh-like irregular backscatter
        ctx.fillStyle = 'rgba(220, 220, 220, 0.65)';
        for (let gx = boxX; gx < boxX + boxW; gx += 4) {
          ctx.fillRect(gx, boxY + Math.sin(gx * 0.3) * 6, 2, boxH * 0.7);
        }
      } else if (anomaly.classification === 'Pipe') {
        // Long continuous specular line
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(boxX, boxY + boxH * 0.3, boxW, 3.5);
      } else if (anomaly.classification === 'Shipwreck') {
        // Hull ribs and structural framework
        ctx.fillStyle = 'rgba(240, 240, 240, 0.85)';
        ctx.fillRect(boxX, boxY, boxW * 0.3, boxH);
        for (let rx = boxX; rx < boxX + boxW; rx += 8) {
          ctx.fillRect(rx, boxY, 2.5, boxH);
        }
      } else {
        // General hard scatter
        ctx.fillRect(highlightX, boxY, highlightW, boxH);
      }
    });

    // 6. Draw Horizontal Range Calibration Markers
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '10px monospace';
    ctx.fillText('PORT SWATH [60M]', 12, 20);
    ctx.fillText('NADIR (0M)', width / 2 - 32, 20);
    ctx.fillText('STARBOARD SWATH [60M]', width - 150, 20);

    // Range rulers at top & bottom
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    for (let rx = 0; rx <= width; rx += width / 12) {
      ctx.beginPath();
      ctx.moveTo(rx, 0);
      ctx.lineTo(rx, 6);
      ctx.moveTo(rx, height - 6);
      ctx.lineTo(rx, height);
      ctx.stroke();
    }
  }, [anomalies, datasetType]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos(null);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full min-h-[480px] bg-black overflow-hidden select-none border border-[#222222] cursor-crosshair group"
    >
      {/* Background Sonar Canvas */}
      <canvas
        ref={canvasRef}
        width={1000}
        height={650}
        className="w-full h-full object-cover block"
      />

      {/* Laser Scanning Line during AI analysis */}
      {(isScanning || laserY > 0) && (
        <div
          className="absolute left-0 right-0 pointer-events-none transition-all duration-300 ease-out z-20"
          style={{ top: `${laserY}%` }}
        >
          {/* Laser beam line */}
          <div className="h-[2px] w-full bg-white shadow-[0_0_15px_#ffffff]" />
          {/* Scanning glow fan */}
          <div className="h-12 w-full bg-gradient-to-t from-transparent to-white/10 pointer-events-none -mt-12" />
          {/* Telemetry coordinate tag following the laser */}
          <div className="absolute right-2 -top-5 text-[9px] font-mono bg-black text-white px-2 py-0.5 border border-white/60 tracking-wider">
            AI_SCAN // {laserY.toFixed(1)}% // RESOLUTION: 0.05M
          </div>
        </div>
      )}

      {/* Interactive Bounding Boxes Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {anomalies.map(anomaly => {
          const isRevealed = revealedAnomalyIds.has(anomaly.id);
          const isSelected = selectedAnomaly?.id === anomaly.id;

          if (!isRevealed) return null;

          return (
            <div
              key={anomaly.id}
              onClick={e => {
                e.stopPropagation();
                onSelectAnomaly(anomaly);
              }}
              className={`absolute pointer-events-auto cursor-pointer transition-all duration-300 ${
                isSelected
                  ? 'border-2 border-white bg-white/15 shadow-glow-md'
                  : 'border border-white/70 hover:border-white hover:bg-white/10'
              }`}
              style={{
                left: `${anomaly.boundingBox.x}%`,
                top: `${anomaly.boundingBox.y}%`,
                width: `${anomaly.boundingBox.width}%`,
                height: `${anomaly.boundingBox.height}%`
              }}
            >
              {/* Corner crosshairs */}
              <div className="absolute -top-1.5 -left-1.5 w-2 h-2 border-t border-l border-white" />
              <div className="absolute -top-1.5 -right-1.5 w-2 h-2 border-t border-r border-white" />
              <div className="absolute -bottom-1.5 -left-1.5 w-2 h-2 border-b border-l border-white" />
              <div className="absolute -bottom-1.5 -right-1.5 w-2 h-2 border-b border-r border-white" />

              {/* Anomaly Label Tag */}
              <div
                className={`absolute -top-6 left-0 px-1.5 py-0.5 whitespace-nowrap text-[9px] font-mono font-bold tracking-wider flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-white text-black shadow-glow-sm'
                    : 'bg-black/90 text-white border border-white/40'
                }`}
              >
                <span>{anomaly.classification.toUpperCase()}</span>
                <span className="opacity-70">|</span>
                <span>{anomaly.confidence.toFixed(1)}%</span>
                <span className="opacity-70">|</span>
                <span>{anomaly.id}</span>
              </div>

              {/* Anomaly Dimensions Badge at bottom */}
              <div className="absolute -bottom-4 right-0 text-[8px] font-mono bg-black/80 px-1 text-[#aaaaaa] border border-[#333333]">
                {anomaly.width.toFixed(1)}m × {anomaly.height.toFixed(1)}m
              </div>
            </div>
          );
        })}
      </div>

      {/* Real-time Cursor Reticle HUD */}
      {mousePos && (
        <div
          className="absolute pointer-events-none z-30"
          style={{ left: mousePos.x, top: mousePos.y }}
        >
          {/* Crosshair lines */}
          <div className="w-6 h-[1px] bg-white/60 -ml-3" />
          <div className="h-6 w-[1px] bg-white/60 -mt-3 ml-0" />
          {/* Coordinates readout tag */}
          <div className="absolute top-2 left-2 bg-black/85 border border-[#444444] px-1.5 py-0.5 text-[9px] font-mono text-white whitespace-nowrap">
            Y: {((mousePos.y / (containerRef.current?.clientHeight || 1)) * 120).toFixed(1)}M // 
            X: {(((mousePos.x / (containerRef.current?.clientWidth || 1)) - 0.5) * 120).toFixed(1)}M
          </div>
        </div>
      )}
    </div>
  );
};
