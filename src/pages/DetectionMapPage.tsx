import React, { useState } from 'react';
import { BathymetricMap } from '../components/map/BathymetricMap';
import { MOCK_ANOMALIES } from '../data/mockAnomalies';
import { SonarAnomaly } from '../types/anomaly';
import { MapPin, Navigation, Compass, Layers, ShieldCheck } from 'lucide-react';

export const DetectionMapPage: React.FC = () => {
  const [selectedAnomaly, setSelectedAnomaly] = useState<SonarAnomaly | null>(MOCK_ANOMALIES[0]);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 font-mono select-none">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-[#090909] border border-[#222222]">
        <div>
          <div className="text-sm sm:text-base font-bold text-white tracking-widest uppercase font-sans flex items-center gap-2">
            <span className="w-2 h-2 bg-white rounded-full animate-ping" />
            DETECTION MAP // GEOSPATIAL HYDROGRAPHIC PLOT
          </div>
          <div className="text-[11px] text-[#888888] mt-0.5">
            DATUM: WGS84 // PROJECTION: MERCATOR TRANSVERSE // SURVEY GRID: DELTA-PACIFIC
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-[#888888]">
          <span>TARGETS PLOTTED: <strong className="text-white">{MOCK_ANOMALIES.length}</strong></span>
          <span>ACTIVE TRANSECTS: <strong className="text-white">4</strong></span>
        </div>
      </div>

      {/* Main Bathymetric Map Viewer (Requirement #15) */}
      <BathymetricMap
        anomalies={MOCK_ANOMALIES}
        selectedAnomaly={selectedAnomaly}
        onSelectAnomaly={setSelectedAnomaly}
      />

      {/* Map Legend and Instructions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-[#090909] border border-[#222222] text-xs">
          <div className="text-[10px] text-[#666666] uppercase mb-1 font-bold">LEGEND // BATHYMETRY</div>
          <p className="text-[11px] text-[#888888] font-sans leading-relaxed">
            Dashed isobath curves depict seafloor contours in 10-meter increments from -30M to -60M depth.
          </p>
        </div>

        <div className="p-3 bg-[#090909] border border-[#222222] text-xs">
          <div className="text-[10px] text-[#666666] uppercase mb-1 font-bold">LEGEND // TRANSECTS</div>
          <p className="text-[11px] text-[#888888] font-sans leading-relaxed">
            Dashed straight vectors represent pre-programmed AUV autonomous side-scan sonar lawnmower transect corridors.
          </p>
        </div>

        <div className="p-3 bg-[#090909] border border-[#222222] text-xs">
          <div className="text-[10px] text-[#666666] uppercase mb-1 font-bold">INTERACTION</div>
          <p className="text-[11px] text-[#888888] font-sans leading-relaxed">
            Click any target marker on the map to inspect geodetic coordinates, physical dimensions, and acoustic classification.
          </p>
        </div>
      </div>
    </div>
  );
};
