import React from 'react';

interface TechnicalFrameProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  badge?: string;
  headerRight?: React.ReactNode;
  footerTelemetry?: string;
  glow?: boolean;
}

export const TechnicalFrame: React.FC<TechnicalFrameProps> = ({
  children,
  className = '',
  title,
  badge,
  headerRight,
  footerTelemetry,
  glow = false
}) => {
  return (
    <div
      className={`relative border border-[#262626] bg-[#0a0a0a] ${
        glow ? 'shadow-glow-sm' : ''
      } ${className}`}
    >
      {/* Corner Brackets */}
      <div className="absolute -top-[1px] -left-[1px] w-2.5 h-2.5 border-t-2 border-l-2 border-white pointer-events-none" />
      <div className="absolute -top-[1px] -right-[1px] w-2.5 h-2.5 border-t-2 border-r-2 border-white pointer-events-none" />
      <div className="absolute -bottom-[1px] -left-[1px] w-2.5 h-2.5 border-b-2 border-l-2 border-white pointer-events-none" />
      <div className="absolute -bottom-[1px] -right-[1px] w-2.5 h-2.5 border-b-2 border-r-2 border-white pointer-events-none" />

      {/* Header bar if title provided */}
      {title && (
        <div className="flex items-center justify-between px-3 py-2 border-b border-[#222222] bg-[#0f0f0f] select-none">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 bg-white animate-pulse" />
            <span className="text-xs font-bold tracking-widest text-white uppercase">
              {title}
            </span>
            {badge && (
              <span className="text-[10px] px-1.5 py-0.5 border border-[#444444] text-[#aaaaaa] bg-[#1a1a1a]">
                {badge}
              </span>
            )}
          </div>
          {headerRight && <div className="text-[11px] text-[#888888]">{headerRight}</div>}
        </div>
      )}

      {/* Main Content */}
      <div className="p-3 relative z-10">{children}</div>

      {/* Footer telemetry bar if provided */}
      {footerTelemetry && (
        <div className="px-3 py-1 border-t border-[#1a1a1a] bg-[#080808] flex items-center justify-between text-[10px] text-[#666666] tracking-wider select-none">
          <span>{footerTelemetry}</span>
          <span className="flex items-center gap-1">
            <span className="w-1 h-1 bg-white rounded-full opacity-60" />
            LIVE_FEED
          </span>
        </div>
      )}
    </div>
  );
};
