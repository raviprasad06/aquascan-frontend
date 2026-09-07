import React from 'react';
import { X, Printer, Download } from 'lucide-react';
import { SonarAnomaly } from '../../types/anomaly';
import { exportAnomaliesToCSV } from '../../utils/exportUtils';

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
  const avgConfidence = anomalies.length > 0
    ? (anomalies.reduce((acc, curr) => acc + (typeof curr.confidence === 'number' ? curr.confidence : 0), 0) / anomalies.length).toFixed(1)
    : '0.0';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm font-sans select-none overflow-y-auto">
      <div className="w-full max-w-4xl bg-[#0a0a0a] border border-[#333333] p-6 sm:p-8 relative shadow-2xl my-8">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
          <div>
            <div className="text-xs text-[#888888] font-mono uppercase tracking-wider">
              AquaScan AI &bull; Formal Assessment Report
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
              Side-Scan Sonar Detection &amp; Analysis Dossier
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#222222] text-[#888888] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metadata grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5 p-3.5 bg-[#0f0f0f] border border-[#222222] text-xs">
          <div>
            <span className="text-[#666666] text-[10px] block uppercase font-mono">FRAMEWORK</span>
            <strong className="text-white truncate block">FastAPI + YOLOv8</strong>
          </div>
          <div>
            <span className="text-[#666666] text-[10px] block uppercase font-mono">TARGET CLASS</span>
            <strong className="text-white truncate block">Shipwreck</strong>
          </div>
          <div>
            <span className="text-[#666666] text-[10px] block uppercase font-mono">LOCATION METADATA</span>
            <strong className="text-white truncate block">NOT AVAILABLE</strong>
          </div>
          <div>
            <span className="text-[#666666] text-[10px] block uppercase font-mono">GENERATED</span>
            <strong className="text-white font-mono">{new Date().toISOString().substring(0, 10)} UTC</strong>
          </div>
        </div>

        {/* Executive Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <div className="p-3.5 bg-[#111111] border border-[#262626]">
            <div className="text-xs text-[#888888]">Total Objects Detected</div>
            <div className="text-2xl font-bold text-white font-mono my-1">{anomalies.length}</div>
            <div className="text-[11px] text-[#666666]">Acoustic AI Detections</div>
          </div>
          <div className="p-3.5 bg-[#111111] border border-[#262626]">
            <div className="text-xs text-[#888888]">High Risk Targets</div>
            <div className="text-2xl font-bold text-white font-mono my-1">{highPriority.length}</div>
            <div className="text-[11px] text-[#666666]">Action Required</div>
          </div>
          <div className="p-3.5 bg-[#111111] border border-[#262626]">
            <div className="text-xs text-[#888888]">Mean Model Confidence</div>
            <div className="text-2xl font-bold text-white font-mono my-1">{avgConfidence}%</div>
            <div className="text-[11px] text-[#666666]">Detection Metric</div>
          </div>
        </div>

        {/* Findings Table */}
        <div className="border border-[#222222] mb-5 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#141414] border-b border-[#222222] text-[#888888] text-[11px]">
                <th className="p-2.5">ID</th>
                <th className="p-2.5">CLASS</th>
                <th className="p-2.5">CONFIDENCE</th>
                <th className="p-2.5">RISK LEVEL</th>
                <th className="p-2.5">SCAN SOURCE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181818]">
              {anomalies.map(a => (
                <tr key={a.id} className="hover:bg-[#111111]">
                  <td className="p-2.5 font-bold text-white font-mono">{a.id}</td>
                  <td className="p-2.5 uppercase text-white font-medium">{a.classification}</td>
                  <td className="p-2.5 font-bold text-white font-mono">{a.confidence.toFixed(1)}%</td>
                  <td className="p-2.5">
                    <span className={`px-1.5 py-0.5 border text-[10px] font-bold uppercase font-mono ${
                      a.priority === 'HIGH' ? 'border-white text-white bg-[#1e1e1e]' : 'border-[#444444] text-[#888888]'
                    }`}>
                      {a.priority}
                    </span>
                  </td>
                  <td className="p-2.5 text-[#888888] font-mono">{a.surveyLine || 'SCAN'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#222222]">
          <div className="text-xs text-[#666666] font-mono">
            AquaScan AI Sonar System Dossier
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => exportAnomaliesToCSV(anomalies)}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-[#333333] text-xs font-semibold text-white hover:border-white transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-white text-black font-bold text-xs uppercase hover:bg-[#dddddd] transition-all shadow-glow-sm cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
