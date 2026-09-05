import React from 'react';
import { X, Printer, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { SonarAnomaly } from '../../types/anomaly';
import { exportAnomaliesToCSV } from '../../utils/exportUtils';
import { formatCoordinates, formatDimensions } from '../../utils/formatters';

interface MissionReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  anomalies: SonarAnomaly[];
}

export const MissionReportModal: React.FC<MissionReportModalProps> = ({
  isOpen,
  onClose,
  anomalies
}) => {
  if (!isOpen) return null;

  const highPriority = anomalies.filter(a => a.priority === 'HIGH');
  const ghostNets = anomalies.filter(a => a.classification === 'Ghost Net');
  const avgConfidence = (
    anomalies.reduce((acc, curr) => acc + curr.confidence, 0) / anomalies.length
  ).toFixed(1);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md font-mono select-none overflow-y-auto">
      <div className="w-full max-w-4xl bg-[#0a0a0a] border border-white p-6 sm:p-8 relative shadow-2xl my-8">
        {/* Corner Accents */}
        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white" />
        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white" />
        <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white" />
        <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white" />

        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
          <div>
            <div className="text-[10px] text-[#888888] tracking-widest uppercase">
              AUTONOMOUS MARINE SURVEY DOSSIER // DECLASSIFIED
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wider">
              SONAR AI // COMPREHENSIVE ANOMALY ASSESSMENT REPORT
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#222222] text-[#888888] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metadata grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5 p-3 bg-[#0f0f0f] border border-[#222222] text-xs">
          <div>
            <span className="text-[#666666] text-[9px] block uppercase">MISSION ID</span>
            <strong className="text-white">BAY_BENGAL_EXP-04</strong>
          </div>
          <div>
            <span className="text-[#666666] text-[9px] block uppercase">SURVEY TRANSECT</span>
            <strong className="text-white">TRANSECTS ALPHA-DELTA</strong>
          </div>
          <div>
            <span className="text-[#666666] text-[9px] block uppercase">SENSOR MODEL</span>
            <strong className="text-white">SONAR-AI V1 // 455kHz</strong>
          </div>
          <div>
            <span className="text-[#666666] text-[9px] block uppercase">TIMESTAMP</span>
            <strong className="text-white">{new Date().toISOString().substring(0, 10)} UTC</strong>
          </div>
        </div>

        {/* Executive Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <div className="p-3 bg-[#111111] border border-[#262626]">
            <div className="text-[10px] text-[#777777] uppercase">TOTAL TARGETS CLASSIFIED</div>
            <div className="text-2xl font-bold text-white my-1">{anomalies.length}</div>
            <div className="text-[10px] text-[#888888]">100% ACOUSTIC RECONSTRUCTION</div>
          </div>
          <div className="p-3 bg-[#111111] border border-[#262626]">
            <div className="text-[10px] text-[#777777] uppercase">CRITICAL GHOST NET HAZARDS</div>
            <div className="text-2xl font-bold text-white my-1">{ghostNets.length}</div>
            <div className="text-[10px] text-[#888888]">IMMEDIATE SALVAGE PRIORITY</div>
          </div>
          <div className="p-3 bg-[#111111] border border-[#262626]">
            <div className="text-[10px] text-[#777777] uppercase">MEAN MODEL CONFIDENCE</div>
            <div className="text-2xl font-bold text-white my-1">{avgConfidence}%</div>
            <div className="text-[10px] text-[#888888]">HIGH RELIABILITY BAND</div>
          </div>
        </div>

        {/* Highlighted Critical Findings Table */}
        <div className="border border-[#222222] mb-5 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#141414] border-b border-[#222222] text-[#888888] text-[10px]">
                <th className="p-2.5">ID</th>
                <th className="p-2.5">CLASS</th>
                <th className="p-2.5">CONFIDENCE</th>
                <th className="p-2.5">COORDINATES</th>
                <th className="p-2.5">DIMENSIONS</th>
                <th className="p-2.5">PRIORITY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181818]">
              {anomalies.slice(0, 6).map(a => (
                <tr key={a.id} className="hover:bg-[#111111]">
                  <td className="p-2.5 font-bold text-white">{a.id}</td>
                  <td className="p-2.5 uppercase text-white">{a.classification}</td>
                  <td className="p-2.5 font-bold text-white">{a.confidence.toFixed(1)}%</td>
                  <td className="p-2.5 text-[#888888]">{formatCoordinates(a.latitude, a.longitude)}</td>
                  <td className="p-2.5 text-[#888888]">{formatDimensions(a.width, a.height)}</td>
                  <td className="p-2.5">
                    <span className="px-1.5 py-0.5 border border-white/40 text-[10px] text-white font-bold">
                      {a.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#222222]">
          <div className="text-[10px] text-[#666666]">
            DIGITALLY SIGNED // HYDROGRAPHIC AUV SYSTEM ID: SH-084
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => exportAnomaliesToCSV(anomalies)}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-[#333333] text-xs text-white hover:border-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>EXPORT DATA (.CSV)</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-white text-black font-bold text-xs uppercase hover:bg-[#dddddd] transition-all shadow-glow-sm cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PRINT / SAVE PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
