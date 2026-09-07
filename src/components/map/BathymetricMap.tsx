import React from 'react';
import { MapPin, AlertCircle, Info } from 'lucide-react';
import { SonarAnomaly } from '../../types/anomaly';

interface BathymetricMapProps {
  anomalies: SonarAnomaly[];
  selectedAnomaly: SonarAnomaly | null;
  onSelectAnomaly: (anomaly: SonarAnomaly) => void;
  isLocationAvailable?: boolean;
}

export const BathymetricMap: React.FC<BathymetricMapProps> = ({
  anomalies,
  isLocationAvailable = false
}) => {
  const anomaliesWithCoords = anomalies.filter(
    a => typeof a.latitude === 'number' && typeof a.longitude === 'number' && !isNaN(a.latitude) && !isNaN(a.longitude)
  );

  const hasCoords = isLocationAvailable && anomaliesWithCoords.length > 0;

  return (
    <div className="relative w-full min-h-[480px] bg-[#080808] border border-[#222222] font-sans select-none flex flex-col items-center justify-center p-6 text-center">
      {!hasCoords ? (
        <div className="max-w-md p-8 border border-[#222222] bg-[#0c0c0c] space-y-4">
          <div className="w-12 h-12 rounded-full border border-[#333333] bg-[#141414] flex items-center justify-center mx-auto text-[#888888]">
            <MapPin className="w-6 h-6 text-[#aaaaaa]" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-base font-bold text-white tracking-tight">
              LOCATION DATA NOT AVAILABLE
            </h2>
            <p className="text-xs text-[#888888] leading-relaxed">
              The uploaded sonar image does not contain GPS/NMEA metadata.
            </p>
          </div>

          <div className="pt-3 border-t border-[#1f1f1f] text-xs text-[#666666] flex items-center justify-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#555555]" />
            <span>Geospatial plotting requires georeferenced metadata</span>
          </div>
        </div>
      ) : (
        <div className="w-full h-full space-y-4">
          <div className="text-sm font-semibold text-white">
            Georeferenced Target Coordinates
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
            {anomaliesWithCoords.map(a => (
              <div key={a.id} className="p-3 bg-[#111111] border border-[#222222] text-left text-xs">
                <div className="font-bold text-white font-mono">{a.id} - {a.classification}</div>
                <div className="text-[#888888] font-mono mt-1">
                  {a.latitude?.toFixed(5)}°, {a.longitude?.toFixed(5)}°
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
