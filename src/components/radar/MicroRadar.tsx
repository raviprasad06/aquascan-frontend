import React, { useEffect, useRef } from 'react';

interface MicroRadarProps {
  size?: number;
  className?: string;
  speed?: number;
}

export const MicroRadar: React.FC<MicroRadarProps> = ({
  size = 26,
  className = '',
  speed = 0.04
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let angle = 0;
    let animId: number;

    const dots = [
      { r: 0.45, theta: 0.8, alpha: 0.9 },
      { r: 0.65, theta: 2.3, alpha: 0.7 },
      { r: 0.3, theta: 4.5, alpha: 0.85 }
    ];

    const render = () => {
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2;
      const cy = size / 2;
      const radius = size / 2 - 1.5;

      // Outer ring
      ctx.strokeStyle = '#555555';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Inner ring
      ctx.strokeStyle = '#2a2a2a';
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.5, 0, Math.PI * 2);
      ctx.stroke();

      // Crosshairs
      ctx.strokeStyle = '#222222';
      ctx.beginPath();
      ctx.moveTo(cx - radius, cy);
      ctx.lineTo(cx + radius, cy);
      ctx.moveTo(cx, cy - radius);
      ctx.lineTo(cx, cy + radius);
      ctx.stroke();

      // Scanning beam with trailing fade
      const trailAngle = 0.8;
      const steps = 16;
      for (let i = 0; i < steps; i++) {
        const a1 = angle - (i / steps) * trailAngle;
        const a2 = angle - ((i + 1) / steps) * trailAngle;
        const alpha = (1 - i / steps) * 0.4;

        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, a2, a1);
        ctx.closePath();
        ctx.fill();
      }

      // Leading beam line
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
      ctx.stroke();

      // Anomaly dots
      dots.forEach(dot => {
        const dotX = cx + Math.cos(dot.theta) * (radius * dot.r);
        const dotY = cy + Math.sin(dot.theta) * (radius * dot.r);
        
        // Calculate angular distance to beam to create pulse
        const diff = (angle - dot.theta + Math.PI * 4) % (Math.PI * 2);
        const pulse = diff < 0.8 ? (1 - diff / 0.8) : 0.25;

        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, pulse + 0.2)})`;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 1.2, 0, Math.PI * 2);
        ctx.fill();
      });

      angle = (angle + speed) % (Math.PI * 2);
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [size, speed]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={`inline-block select-none ${className}`}
      style={{ width: size, height: size }}
    />
  );
};
