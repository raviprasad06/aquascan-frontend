import React, { useEffect, useRef } from 'react';
import { SonarAnomaly } from '../../types/anomaly';

interface SonarCanvasProps {
  laserY: number; // 0 to 100
  isScanning: boolean;
  selectedAnomaly: SonarAnomaly | null;
  anomalies: SonarAnomaly[];
  revealedAnomalyIds: Set<string>;
  onSelectAnomaly: (anomaly: SonarAnomaly) => void;
  customImageUrl?: string | null;
}

export const SonarCanvas: React.FC<SonarCanvasProps> = ({
  laserY,
  isScanning,
  selectedAnomaly,
  anomalies,
  revealedAnomalyIds,
  onSelectAnomaly,
  customImageUrl = null
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const drawGridAndRulers = (context: CanvasRenderingContext2D) => {
      // Center track line
      context.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      context.lineWidth = 1;
      context.setLineDash([4, 4]);
      context.beginPath();
      context.moveTo(width / 2, 0);
      context.lineTo(width / 2, height);
      context.stroke();
      context.setLineDash([]);

      // Top/bottom calibration ticks
      context.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      context.lineWidth = 1;
      for (let rx = 0; rx <= width; rx += width / 10) {
        context.beginPath();
        context.moveTo(rx, 0);
        context.lineTo(rx, 5);
        context.moveTo(rx, height - 5);
        context.lineTo(rx, height);
        context.stroke();
      }
    };

    const renderEmptySonarBackdrop = (context: CanvasRenderingContext2D) => {
      // Fill dark background
      context.fillStyle = '#060606';
      context.fillRect(0, 0, width, height);

      // Subtle acoustic speckle texture
      context.fillStyle = 'rgba(255, 255, 255, 0.08)';
      for (let i = 0; i < 2000; i++) {
        const sx = Math.random() * width;
        const sy = Math.random() * height;
        context.fillRect(sx, sy, 1, 1);
      }

      drawGridAndRulers(context);
    };

    if (customImageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = customImageUrl;
      img.onload = () => {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#060606';
        ctx.fillRect(0, 0, width, height);

        ctx.save();
        ctx.filter = 'grayscale(100%) contrast(120%) brightness(95%)';
        ctx.drawImage(img, 0, 0, width, height);
        ctx.restore();

        drawGridAndRulers(ctx);
      };
      img.onerror = () => {
        renderEmptySonarBackdrop(ctx);
      };
    } else {
      renderEmptySonarBackdrop(ctx);
    }
  }, [anomalies, customImageUrl]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[460px] bg-black overflow-hidden select-none border border-[#222222] group"
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
          <div className="h-[2px] w-full bg-white shadow-[0_0_12px_#ffffff]" />
          {/* Scanning glow fan */}
          <div className="h-10 w-full bg-gradient-to-t from-transparent to-white/10 pointer-events-none -mt-10" />
          {/* Progress label tag following the laser */}
          <div className="absolute right-2 -top-5 text-[10px] font-mono bg-black text-white px-2 py-0.5 border border-white/60">
            SCANNING // {laserY.toFixed(0)}%
          </div>
        </div>
      )}

      {/* Interactive Bounding Boxes Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {anomalies.map(anomaly => {
          const isRevealed = revealedAnomalyIds.has(anomaly.id);
          const isSelected = selectedAnomaly?.id === anomaly.id;

          if (!isRevealed || !anomaly.boundingBox) return null;

          return (
            <div
              key={anomaly.id}
              onClick={e => {
                e.stopPropagation();
                onSelectAnomaly(anomaly);
              }}
              className={`absolute pointer-events-auto cursor-pointer transition-all duration-200 ${
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
              <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-white" />
              <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-white" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-white" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-white" />

              {/* Anomaly Label Tag */}
              <div
                className={`absolute -top-6 left-0 px-1.5 py-0.5 whitespace-nowrap text-[10px] font-mono font-bold tracking-tight flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-white text-black shadow-glow-sm'
                    : 'bg-black/90 text-white border border-white/40'
                }`}
              >
                <span>{anomaly.classification.toUpperCase()}</span>
                <span className="opacity-70">|</span>
                <span>{anomaly.confidence.toFixed(1)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
