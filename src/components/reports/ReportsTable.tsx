import React, { useState } from 'react';
import { Download, FileJson, FileText, Search, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { ScanRecord } from '../../utils/scanStorage';
import { exportAnomaliesToCSV, exportAnomaliesToJSON } from '../../utils/exportUtils';
import { MissionReportModal } from './MissionReportModal';
import { useNavigate } from 'react-router-dom';
import { SonarAnomaly } from '../../types/anomaly';

interface ReportsTableProps {
  scans: ScanRecord[];
}

export const ReportsTable: React.FC<ReportsTableProps> = ({ scans }) => {
  const [search, setSearch] = useState('');
  const [selectedScanId, setSelectedScanId] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [showAnnotated, setShowAnnotated] = useState(false);

  const navigate = useNavigate();

  const filteredScans = scans.filter(scan => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      scan.filename.toLowerCase().includes(term) ||
      scan.id.toLowerCase().includes(term) ||
      scan.overallRisk.toLowerCase().includes(term)
    );
  });

  const allDetections: SonarAnomaly[] = scans.flatMap(s => s.detections);
  const selectedScan = scans.find(s => s.id === selectedScanId) || (scans.length > 0 ? scans[0] : null);

  const handleExportCSV = () => {
    if (allDetections.length > 0) {
      exportAnomaliesToCSV(allDetections);
    }
  };

  const handleExportJSON = () => {
    if (allDetections.length > 0) {
      exportAnomaliesToJSON(allDetections);
    }
  };

  return (
    <div className="bg-[#090909] border border-[#222222] font-sans select-none">
      {/* Top Action Bar */}
      <div className="p-4 border-b border-[#222222] flex flex-wrap items-center justify-between gap-3 bg-[#0d0d0d]">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-4 h-4 text-white" />
            Sonar Scan History &amp; Reports
          </h1>
          <p className="text-xs text-[#888888] mt-0.5">
            Verified FastAPI YOLO analysis history ({scans.length} recorded {scans.length === 1 ? 'scan' : 'scans'})
          </p>
        </div>

        {/* Buttons: EXPORT CSV, EXPORT JSON, GENERATE DOSSIER */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            disabled={scans.length === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-medium transition-colors ${
              scans.length > 0
                ? 'bg-[#141414] border-[#333333] hover:border-white text-white cursor-pointer'
                : 'bg-[#101010] border-[#222222] text-[#555555] cursor-not-allowed'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportJSON}
            disabled={scans.length === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-medium transition-colors ${
              scans.length > 0
                ? 'bg-[#141414] border-[#333333] hover:border-white text-white cursor-pointer'
                : 'bg-[#101010] border-[#222222] text-[#555555] cursor-not-allowed'
            }`}
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={() => setIsReportModalOpen(true)}
            disabled={scans.length === 0}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 font-bold text-xs uppercase transition-all ${
              scans.length > 0
                ? 'bg-white text-black hover:bg-[#e0e0e0] shadow-glow-sm cursor-pointer'
                : 'bg-[#222222] text-[#666666] cursor-not-allowed'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Dossier</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 border-b border-[#1c1c1c] bg-[#080808] flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 bg-[#121212] border border-[#2b2b2b] px-2.5 py-1.5 flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-[#666666]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by filename, scan ID, or risk..."
            className="bg-transparent text-white text-xs outline-none w-full placeholder-[#666666]"
          />
        </div>
      </div>

      {/* Main Table or Empty State */}
      {scans.length === 0 ? (
        <div className="p-16 text-center text-[#aaaaaa] flex flex-col items-center justify-center space-y-3">
          <FileText className="w-12 h-12 text-[#444444]" />
          <div className="text-sm font-bold text-white uppercase tracking-wider">
            No Analyzed Scans
          </div>
          <p className="text-xs text-[#777777] max-w-md leading-relaxed">
            No sonar scans have been stored yet. Upload an image in the Sonar Analysis Workspace to process and save real YOLO model predictions.
          </p>
          <button
            onClick={() => navigate('/sonar-analysis?upload=true')}
            className="mt-2 px-4 py-2 bg-white text-black font-bold text-xs uppercase hover:bg-[#dddddd] transition-all shadow-glow-sm cursor-pointer"
          >
            Go to Sonar Analysis &rarr;
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-[#222222]">
          {/* Table List */}
          <div className="lg:col-span-7 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#111111] border-b border-[#222222] text-[#888888] text-[11px] tracking-wide">
                  <th className="p-3">IMAGE</th>
                  <th className="p-3">FILENAME / ID</th>
                  <th className="p-3">TARGETS</th>
                  <th className="p-3">CONFIDENCE</th>
                  <th className="p-3">RISK</th>
                  <th className="p-3">TIMESTAMP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#171717]">
                {filteredScans.map(scan => {
                  const isSelected = selectedScan?.id === scan.id;
                  return (
                    <tr
                      key={scan.id}
                      onClick={() => {
                        setSelectedScanId(scan.id);
                        setShowAnnotated(false);
                      }}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#1a1a1a] text-white' : 'hover:bg-[#121212] text-[#cccccc]'
                      }`}
                    >
                      <td className="p-2.5">
                        {scan.originalImage || scan.annotatedImage ? (
                          <img
                            src={scan.annotatedImage || scan.originalImage}
                            alt={scan.filename}
                            className="w-10 h-10 object-cover border border-[#333333] filter grayscale contrast-125"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-[#141414] border border-[#333333] flex items-center justify-center text-[9px] text-[#666666]">
                            <ImageIcon className="w-4 h-4 text-[#555555]" />
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-white max-w-[150px] truncate">{scan.filename}</div>
                        <div className="text-[10px] text-[#777777] font-mono">{scan.id}</div>
                      </td>
                      <td className="p-3">
                        <span className="px-1.5 py-0.5 border border-[#333333] bg-[#161616] text-white text-[11px] font-mono">
                          {scan.detectionCount}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-white font-mono">
                        {scan.highestConfidence.toFixed(1)}%
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 border text-[10px] font-bold uppercase font-mono ${
                          scan.overallRisk === 'HIGH'
                            ? 'border-white bg-[#1c1c1c] text-white'
                            : 'border-[#444444] text-[#888888]'
                        }`}>
                          {scan.overallRisk}
                        </span>
                      </td>
                      <td className="p-3 text-[#777777] text-[11px] font-mono">
                        {scan.timestamp.replace('T', ' ').slice(0, 16)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Selected Scan Inspection Panel */}
          {selectedScan && (
            <div className="lg:col-span-5 p-4 bg-[#0a0a0a] space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#222222]">
                <div className="text-xs font-semibold text-white uppercase tracking-wider">
                  Scan Dossier Inspector
                </div>
                <button
                  onClick={() => navigate('/sonar-analysis')}
                  className="text-xs px-2.5 py-1 border border-[#333333] hover:border-white text-white font-medium flex items-center gap-1 cursor-pointer"
                >
                  Open in Workspace <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {/* Scan Image Preview */}
              {(selectedScan.originalImage || selectedScan.annotatedImage) ? (
                <div className="relative border border-[#333333] bg-black overflow-hidden h-48 w-full">
                  <img
                    src={(showAnnotated && selectedScan.annotatedImage ? selectedScan.annotatedImage : (selectedScan.originalImage || selectedScan.annotatedImage)) || undefined}
                    alt={selectedScan.filename}
                    className="w-full h-full object-contain filter grayscale contrast-125"
                  />
                  <div className="absolute top-2 left-2 bg-black/80 px-2 py-0.5 text-[10px] text-white border border-[#444444] font-mono">
                    {showAnnotated ? 'ANNOTATED' : 'ORIGINAL'} // {selectedScan.filename}
                  </div>
                  {selectedScan.annotatedImage && (
                    <div className="absolute top-2 right-2 flex gap-1 z-10 font-mono">
                      <button
                        onClick={() => setShowAnnotated(false)}
                        className={`text-[10px] px-2 py-0.5 border cursor-pointer ${!showAnnotated ? 'bg-white text-black border-white font-bold' : 'bg-black/80 text-[#888888] border-[#444444]'}`}
                      >
                        ORIGINAL
                      </button>
                      <button
                        onClick={() => setShowAnnotated(true)}
                        className={`text-[10px] px-2 py-0.5 border cursor-pointer ${showAnnotated ? 'bg-white text-black border-white font-bold' : 'bg-black/80 text-[#888888] border-[#444444]'}`}
                      >
                        ANNOTATED
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative border border-[#222222] bg-[#0c0c0c] p-4 flex flex-col items-center justify-center text-center h-40 w-full space-y-2">
                  <ImageIcon className="w-8 h-8 text-[#444444]" />
                  <div className="text-xs text-white font-medium">
                    {selectedScan.filename}
                  </div>
                  <div className="text-[11px] text-[#666666]">
                    Persisted scan metadata recorded
                  </div>
                </div>
              )}

              {/* Scan Metadata */}
              <div className="grid grid-cols-2 gap-2 text-xs p-3 bg-[#111111] border border-[#222222]">
                <div>
                  <span className="text-[10px] text-[#777777] uppercase block font-mono">FILENAME</span>
                  <strong className="text-white truncate block">{selectedScan.filename}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#777777] uppercase block font-mono">TIMESTAMP</span>
                  <strong className="text-white font-mono">{selectedScan.timestamp.replace('T', ' ').slice(0, 16)}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#777777] uppercase block font-mono">DETECTIONS</span>
                  <strong className="text-white font-mono">{selectedScan.detectionCount} TARGETS</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#777777] uppercase block font-mono">CONFIDENCE</span>
                  <strong className="text-white font-mono">{selectedScan.highestConfidence.toFixed(1)}%</strong>
                </div>
              </div>

              {/* Detections List */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-[#888888] uppercase tracking-wider">
                  Model Detections ({selectedScan.detections.length})
                </div>
                {selectedScan.detections.length === 0 ? (
                  <div className="p-4 bg-[#111111] border border-[#222222] text-center text-[#777777] text-xs font-medium">
                    No targets detected in this scan
                  </div>
                ) : (
                  selectedScan.detections.map((det) => (
                    <div key={det.id} className="p-3 bg-[#121212] border border-[#222222] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{det.classification}</span>
                        <span className="font-bold text-white font-mono">{det.confidence.toFixed(1)}%</span>
                      </div>
                      <div className="text-[11px] text-[#888888] font-mono">
                        RISK: <strong className="text-white uppercase">{det.priority}</strong>
                      </div>
                      {det.acousticSignature && (
                        <div className="text-xs text-[#aaaaaa] bg-[#080808] p-2 border border-[#1e1e1e] mt-1">
                          {det.acousticSignature}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal Dossier */}
      <MissionReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        anomalies={allDetections}
      />
    </div>
  );
};
