import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Crosshair, ArrowRight, CornerDownLeft, ShieldAlert } from 'lucide-react';
import { MicroRadar } from '../radar/MicroRadar';
import { MOCK_ANOMALIES } from '../../data/mockAnomalies';
import { SonarAnomaly } from '../../types/anomaly';
import { formatCoordinates, formatDimensions } from '../../utils/formatters';
import { getScanHistory } from '../../utils/scanStorage';

interface RadarSearchBarProps {
  className?: string;
  onSelectAnomaly?: (anomaly: SonarAnomaly) => void;
}

export const RadarSearchBar: React.FC<RadarSearchBarProps> = ({
  className = '',
  onSelectAnomaly
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  // Keyboard shortcut Cmd+K or Ctrl+K to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const quickFilters = [
    'Ghost Net',
    'AN-104',
    '22.5726° N',
    'Shipwreck',
    'High Confidence',
    'Pipe'
  ];

  const realDetections = getScanHistory().flatMap(s => s.detections);
  const sourceAnomalies = realDetections.length > 0 ? realDetections : MOCK_ANOMALIES;

  const filteredAnomalies = sourceAnomalies.filter(item => {
    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();

    if (q === 'high confidence' || q === 'high') {
      return item.confidence >= 90;
    }
    if (q === 'medium confidence' || q === 'medium') {
      return item.confidence >= 70 && item.confidence < 90;
    }

    return (
      (item.id && item.id.toLowerCase().includes(q)) ||
      (item.classification && item.classification.toLowerCase().includes(q)) ||
      (typeof item.latitude === 'number' && item.latitude.toString().includes(q)) ||
      (typeof item.longitude === 'number' && item.longitude.toString().includes(q)) ||
      (item.priority && item.priority.toLowerCase().includes(q)) ||
      (item.status && item.status.toLowerCase().includes(q)) ||
      (item.surveyLine && item.surveyLine.toLowerCase().includes(q))
    );
  });

  const handleSelect = (anomaly: SonarAnomaly) => {
    setIsOpen(false);
    setQuery('');
    if (onSelectAnomaly) {
      onSelectAnomaly(anomaly);
    } else {
      navigate('/sonar-analysis', { state: { selectedAnomalyId: anomaly.id } });
    }
  };

  return (
    <>
      {/* Search Input Trigger with Embedded Rotating Radar */}
      <div
        onClick={() => setIsOpen(true)}
        className={`relative flex items-center bg-[#0a0a0a] border border-[#2a2a2a] hover:border-white/60 transition-colors cursor-pointer px-2.5 py-1.5 group select-none ${className}`}
      >
        {/* The rotating micro radar inside the search field */}
        <div className="flex items-center gap-2 mr-2">
          <MicroRadar size={22} className="opacity-90 group-hover:opacity-100" />
          <span className="text-[10px] text-white font-mono font-bold tracking-widest hidden sm:inline">
            RADAR
          </span>
          <span className="text-[#444444]">|</span>
        </div>

        {/* Input Placeholder Text */}
        <span className="text-xs text-[#888888] font-mono tracking-wider flex-1 truncate">
          SEARCH ANOMALY / COORDINATE / OBJECT ID...
        </span>

        {/* Keyboard Hint */}
        <span className="text-[10px] px-1.5 py-0.5 border border-[#333333] text-[#777777] font-mono ml-2 hidden md:inline">
          ⌘K
        </span>
      </div>

      {/* Command Center Search Overlay Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/85 backdrop-blur-md">
          <div
            className="w-full max-w-3xl bg-[#0a0a0a] border border-[#333333] shadow-2xl relative animate-in fade-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            {/* Corner accents */}
            <div className="absolute -top-[1px] -left-[1px] w-3 h-3 border-t-2 border-l-2 border-white pointer-events-none" />
            <div className="absolute -top-[1px] -right-[1px] w-3 h-3 border-t-2 border-r-2 border-white pointer-events-none" />
            <div className="absolute -bottom-[1px] -left-[1px] w-3 h-3 border-b-2 border-l-2 border-white pointer-events-none" />
            <div className="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-b-2 border-r-2 border-white pointer-events-none" />

            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#222222] bg-[#0e0e0e]">
              <div className="flex items-center gap-3">
                <MicroRadar size={24} />
                <div>
                  <h3 className="text-xs font-bold tracking-widest text-white uppercase">
                    SEARCH SYSTEM // ACOUSTIC DATABASE QUERY
                  </h3>
                  <p className="text-[10px] text-[#666666]">
                    INDEXED: 1,284 SCANS // 347 DETECTIONS // RTK WGS84
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-[#222222] text-[#888888] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Active Input Line */}
            <div className="p-4 border-b border-[#222222] flex items-center gap-3 bg-[#080808]">
              <span className="text-white font-mono text-sm">&gt;</span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Type query: Ghost Net, AN-104, 22.5726, Shipwreck, High Confidence..."
                className="flex-1 bg-transparent text-white font-mono text-sm outline-none placeholder-[#555555]"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="text-xs text-[#777777] hover:text-white px-1.5 py-0.5"
                >
                  CLEAR
                </button>
              )}
            </div>

            {/* Quick search tags */}
            <div className="px-4 py-2 border-b border-[#1a1a1a] bg-[#0c0c0c] flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[10px] text-[#666666] tracking-wider uppercase mr-1">
                PRESETS:
              </span>
              {quickFilters.map(filter => (
                <button
                  key={filter}
                  onClick={() => setQuery(filter)}
                  className={`text-[10px] px-2 py-0.5 border font-mono transition-colors ${
                    query.toLowerCase() === filter.toLowerCase()
                      ? 'bg-white text-black border-white'
                      : 'border-[#333333] text-[#aaaaaa] hover:border-white/50 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Live Search Results */}
            <div className="max-h-[380px] overflow-y-auto divide-y divide-[#1a1a1a]">
              {filteredAnomalies.length === 0 ? (
                <div className="p-8 text-center text-[#666666] font-mono text-xs">
                  NO ACOUSTIC ANOMALIES MATCHING "{query.toUpperCase()}"
                </div>
              ) : (
                filteredAnomalies.map(item => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className="p-3.5 hover:bg-[#141414] transition-colors cursor-pointer flex items-center justify-between group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white font-mono group-hover:underline">
                          {item.id}
                        </span>
                        <span className="text-xs px-1.5 py-0.2 bg-[#222222] text-white border border-[#444444]">
                          {item.classification}
                        </span>
                        <span className="text-[10px] text-[#888888] font-mono">
                          {formatDimensions(item.width, item.height)}
                        </span>
                        <span className="text-[10px] px-1 border border-white/20 text-[#cccccc]">
                          {item.priority} PRIORITY
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-[11px] text-[#777777] font-mono">
                        <span className="flex items-center gap-1">
                          <Crosshair className="w-3 h-3 text-[#aaaaaa]" />
                          {formatCoordinates(item.latitude, item.longitude)}
                        </span>
                        <span>DEPTH: {typeof item.depth === 'number' ? `${item.depth}M` : 'N/A'}</span>
                        <span>TRANSECT: {item.surveyLine || 'SCAN'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs font-bold text-white font-mono">
                          {item.confidence.toFixed(1)}%
                        </div>
                        <div className="text-[9px] text-[#666666]">CONFIDENCE</div>
                      </div>
                      <div className="p-1.5 border border-[#333333] group-hover:border-white text-[#777777] group-hover:text-white">
                        <CornerDownLeft className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-2 bg-[#080808] border-t border-[#222222] flex items-center justify-between text-[10px] text-[#666666] font-mono">
              <div>
                SHOWING {filteredAnomalies.length} OF {MOCK_ANOMALIES.length} ANOMALIES
              </div>
              <div className="flex items-center gap-3">
                <span>[ESC] CLOSE</span>
                <span>[CLICK] INSPECT TARGET</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
