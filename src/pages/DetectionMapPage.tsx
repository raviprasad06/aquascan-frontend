import React, { useState, useEffect } from 'react';
import { BathymetricMap } from '../components/map/BathymetricMap';
import { SonarAnomaly } from '../types/anomaly';
import { getScanHistory, ScanRecord } from '../utils/scanStorage';
import { MapPin } from 'lucide-react';

export const DetectionMapPage: React.FC = () => {
  const [history, setHistory] = useState<ScanRecord[]>([]);

  useEffect(() => {
    const syncData = () => {
      setHistory(getScanHistory());
    };
    syncData();
    window.addEventListener('aquascan-scan-updated', syncData);
    window.addEventListener('storage', syncData);

    return () => {
      window.removeEventListener('aquascan-scan-updated', syncData);
      window.removeEventListener('storage', syncData);
    };
  }, []);

  const realDetections = history.flatMap(s => s.detections);
  const realDetectionsWithCoords = realDetections.filter(
    d => typeof d.latitude === 'number' && typeof d.longitude === 'number' && !isNaN(d.latitude) && !isNaN(d.longitude)
  );
  const isLocationAvailable = realDetectionsWithCoords.length > 0;
  const [selectedAnomaly, setSelectedAnomaly] = useState<SonarAnomaly | null>(null);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 font-sans select-none">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#090909] border border-[#222222]">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <MapPin className="w-4 h-4 text-white" />
            Detection Map &amp; Geolocation
          </h1>
          <p className="text-xs text-[#888888] mt-0.5">
            Geospatial target positioning &bull; Metadata inspection
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-[#888888]">
          <span>LOCATION STATUS: <strong className="text-white">{isLocationAvailable ? 'AVAILABLE' : 'LOCATION DATA NOT AVAILABLE'}</strong></span>
        </div>
      </div>

      {/* Main Map / Clean Empty State */}
      <BathymetricMap
        anomalies={realDetections}
        selectedAnomaly={selectedAnomaly}
        onSelectAnomaly={setSelectedAnomaly}
        isLocationAvailable={isLocationAvailable}
      />
    </div>
  );
};

export default DetectionMapPage;
