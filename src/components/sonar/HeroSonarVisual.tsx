import React, { useEffect, useRef } from 'react';
import { Cpu, ShieldCheck } from 'lucide-react';

export const HeroSonarVisual: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    let animId: number;
    let scanY = 0;

    // Generate static acoustic texture once
    const bgCanvas = document.createElement('canvas');
    bgCanvas.width = width;
    bgCanvas.height = height;
    const bgCtx = bgCanvas.getContext('2d');
    if (bgCtx) {
      // Base background
      bgCtx.fillStyle = '#050505';
      bgCtx.fillRect(0, 0, width, height);

      // Acoustic seabed backscatter texture
      const nadirLeft = width * 0.485;
      const nadirRight = width * 0.515;

      for (let y = 0; y < height; y += 2) {
        const wave = Math.sin(y * 0.05) * 8 + Math.cos(y * 0.1) * 5;
        
        // Port side gradient
        const pGrad = bgCtx.createLinearGradient(0, y, nadirLeft, y);
        const pVal = 24 + Math.sin(y * 0.08 + wave * 0.2) * 10;
        pGrad.addColorStop(0, `rgb(${Math.max(4, pVal - 8)}, ${Math.max(4, pVal - 8)}, ${Math.max(4, pVal - 8)})`);
        pGrad.addColorStop(0.7, `rgb(${pVal + 12}, ${pVal + 12}, ${pVal + 12})`);
        pGrad.addColorStop(1, 'rgb(6, 6, 6)');
        bgCtx.fillStyle = pGrad;
        bgCtx.fillRect(0, y, nadirLeft, 2);

        // Starboard side gradient
        const sGrad = bgCtx.createLinearGradient(nadirRight, y, width, y);
        const sVal = 22 + Math.cos(y * 0.08 + wave * 0.2) * 10;
        sGrad.addColorStop(0, 'rgb(6, 6, 6)');
        sGrad.addColorStop(0.3, `rgb(${sVal + 12}, ${sVal + 12}, ${sVal + 12})`);
        sGrad.addColorStop(1, `rgb(${Math.max(4, sVal - 8)}, ${Math.max(4, sVal - 8)}, ${Math.max(4, sVal - 8)})`);
        bgCtx.fillStyle = sGrad;
        bgCtx.fillRect(nadirRight, y, width - nadirRight, 2);
      }

      // Speckle noise
      bgCtx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      for (let i = 0; i < 2500; i++) {
        const sx = Math.random() * width;
        const sy = Math.random() * height;
        bgCtx.fillRect(sx, sy, 1, 1);
      }

      // Shipwreck Acoustic Feature (Specular reflection + acoustic shadow)
      const shipX = width * 0.58;
      const shipY = height * 0.38;
      const shipW = 110;
      const shipH = 48;

      // Acoustic Shadow
      bgCtx.fillStyle = 'rgba(0, 0, 0, 0.98)';
      bgCtx.beginPath();
      bgCtx.moveTo(shipX + shipW, shipY);
      bgCtx.lineTo(shipX + shipW + 140, shipY - 8);
      bgCtx.lineTo(shipX + shipW + 140, shipY + shipH + 12);
      bgCtx.lineTo(shipX + shipW, shipY + shipH);
      bgCtx.closePath();
      bgCtx.fill();

      // High relief hull structure specular reflection
      bgCtx.fillStyle = 'rgba(240, 240, 240, 0.9)';
      bgCtx.fillRect(shipX, shipY + 4, shipW * 0.35, shipH - 8);
      for (let rx = shipX; rx < shipX + shipW; rx += 9) {
        bgCtx.fillRect(rx, shipY + 2, 3.5, shipH - 4);
      }

      // Central track line
      bgCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      bgCtx.lineWidth = 1;
      bgCtx.setLineDash([6, 6]);
      bgCtx.beginPath();
      bgCtx.moveTo(width / 2, 0);
      bgCtx.lineTo(width / 2, height);
      bgCtx.stroke();
      bgCtx.setLineDash([]);
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw cached background
      ctx.drawImage(bgCanvas, 0, 0);

      // Scanning AI Line
      scanY = (scanY + 1.2) % height;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(width, scanY);
      ctx.stroke();

      // Scan glow fan
      const fanGrad = ctx.createLinearGradient(0, scanY - 35, 0, scanY);
      fanGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      fanGrad.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
      ctx.fillStyle = fanGrad;
      ctx.fillRect(0, Math.max(0, scanY - 35), width, Math.min(35, scanY));

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="relative w-full max-w-[500px] bg-[#070707] border border-[#262626] font-sans select-none overflow-hidden group">
      {/* Top Header Label Badge */}
      <div className="p-3 border-b border-[#222222] bg-[#0c0c0c] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-xs font-bold text-white tracking-wider uppercase font-mono">
            AI SONAR ANALYSIS
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-[#888888]">
          <span className="px-1.5 py-0.5 border border-[#333333] bg-[#141414] text-white font-bold">
            YOLO SEGMENTATION
          </span>
        </div>
      </div>

      {/* Canvas Display */}
      <div className="relative h-[320px] w-full bg-black">
        <canvas
          ref={canvasRef}
          width={500}
          height={320}
          className="w-full h-full object-cover block"
        />

        {/* Real Bounding Box and Detection Highlight */}
        <div 
          className="absolute border border-white bg-white/10 pointer-events-none transition-all duration-300 shadow-glow-sm"
          style={{
            top: '34%',
            left: '56%',
            width: '28%',
            height: '24%'
          }}
        >
          {/* Corner brackets */}
          <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-white" />
          <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-white" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-white" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-white" />

          {/* Tag */}
          <div className="absolute -top-6 left-0 px-2 py-0.5 bg-black/90 border border-white text-[10px] font-mono text-white font-bold whitespace-nowrap">
            SHIPWRECK DETECTION
          </div>
        </div>

        {/* Subtle Watermark Grid Marker */}
        <div className="absolute bottom-3 left-3 bg-black/80 border border-[#333333] px-2 py-1 text-[10px] font-mono text-[#aaaaaa]">
          SIDE-SCAN SONAR &bull; ACOUSTIC RECONSTRUCTION
        </div>
      </div>

      {/* Footer Info Ribbon */}
      <div className="p-3 border-t border-[#222222] bg-[#0c0c0c] flex items-center justify-between text-xs text-[#888888] font-mono">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-white" />
          <span className="text-white font-medium text-[11px]">TARGET CLASS: SHIPWRECK</span>
        </div>
        <div className="text-[10px] text-[#666666]">
          CUDA ACCELERATED INFERENCE
        </div>
      </div>
    </div>
  );
};
