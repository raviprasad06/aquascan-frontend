import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { SonarCanvas } from '../components/sonar/SonarCanvas';
import { SonarControls } from '../components/sonar/SonarControls';
import { AnalysisTimeline } from '../components/sonar/AnalysisTimeline';
import { DetectionSidebar } from '../components/sonar/DetectionSidebar';
import { SonarUploadModal } from '../components/upload/SonarUploadModal';
import { useSonarSimulation } from '../hooks/useSonarSimulation';
import { SonarAnomaly } from '../types/anomaly';
import { analyzeSonarImage } from '../services/api';
import { saveScan, normalizeApiDetections, ScanRecord } from '../utils/scanStorage';
import { AlertTriangle, ShieldCheck, Upload } from 'lucide-react';

export const SonarAnalysisPage: React.FC = () => {
  const location = useLocation();
  const [anomalies, setAnomalies] = useState<SonarAnomaly[]>([]);
  const [customImageUrl, setCustomImageUrl] = useState<string | null>(null);
  const [customImageName, setCustomImageName] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isRealScan, setIsRealScan] = useState(false);
  const [isAnalyzingApi, setIsAnalyzingApi] = useState(false);
  const [realScanSummary, setRealScanSummary] = useState<{
    count: number;
    highestConfidence: number;
    overallRisk: string;
  } | null>(null);

  const workspaceRef = useRef<HTMLDivElement | null>(null);

  const {
    status: simStatus,
    currentStepIndex: simStepIndex,
    progress: simProgress,
    laserY,
    revealedIds,
    selectedAnomalyId,
    setSelectedAnomalyId,
    startAnalysis: startSimulation,
    pauseAnalysis,
    resetAnalysis: resetSimulation,
  } = useSonarSimulation(anomalies);

  const status = isAnalyzingApi ? 'PROCESSING' : isRealScan ? 'COMPLETE' : simStatus;
  const currentStepIndex = isAnalyzingApi ? 2 : isRealScan ? 4 : simStepIndex;
  const progress = isAnalyzingApi ? 50 : isRealScan ? 100 : simProgress;
  const activeRevealedIds = isRealScan ? new Set(anomalies.map(a => a.id)) : revealedIds;

  // Auto-open upload modal if navigated with upload flag or pre-selected anomaly
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('upload') === 'true' || location.state?.openUpload) {
      setIsUploadModalOpen(true);
    }
    if (location.state && location.state.selectedAnomalyId) {
      setSelectedAnomalyId(location.state.selectedAnomalyId);
      revealedIds.add(location.state.selectedAnomalyId);
    }
  }, [location, setSelectedAnomalyId, revealedIds]);

  const selectedAnomaly = anomalies.find(a => a.id === selectedAnomalyId) || null;

  const handleSelectAnomaly = (anomaly: SonarAnomaly) => {
    setSelectedAnomalyId(anomaly.id);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      workspaceRef.current?.requestFullscreen().catch(err => {
        console.error(err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(err => console.error(err));
      setIsFullscreen(false);
    }
  };

  const runRealApiAnalysis = async (file: File, filename: string, dataUrl?: string) => {
    setIsAnalyzingApi(true);
    setApiError(null);
    try {
      const response = await analyzeSonarImage(file);
      const timestamp = new Date().toISOString();
      const normalized = normalizeApiDetections(response, timestamp);

      // Create scan record
      const scanRecord: ScanRecord = {
        id: `scan-${Date.now()}`,
        filename: file.name,
        timestamp,
        detectionCount: normalized.detections.length,
        detections: normalized.detections,
        highestConfidence: normalized.highestConfidence,
        overallRisk: normalized.overallRisk,
        originalImage: dataUrl,
        annotatedImage: response.annotated_image ? `data:image/jpeg;base64,${response.annotated_image}` : null,
      };

      // Save to localStorage on success
      saveScan(scanRecord);

      // Update state for real analysis
      setAnomalies(normalized.detections);
      if (normalized.detections.length > 0) {
        setSelectedAnomalyId(normalized.detections[0].id);
      } else {
        setSelectedAnomalyId(null);
      }

      setIsRealScan(true);
      setRealScanSummary({
        count: response.count,
        highestConfidence: normalized.highestConfidence,
        overallRisk: normalized.overallRisk,
      });
    } catch (err: any) {
      setApiError(err.message || 'Unable to connect to AquaScan AI backend. Make sure FastAPI is running on port 8000.');
      setIsRealScan(false);
      setAnomalies([]);
      setSelectedAnomalyId(null);
    } finally {
      setIsAnalyzingApi(false);
    }
  };

  const handleUploadSuccess = (file: File | null, filename: string, dataUrl?: string) => {
    setCustomImageUrl(dataUrl || null);
    setCustomImageName(filename);
    setCurrentFile(file);
    setApiError(null);

    if (file) {
      runRealApiAnalysis(file, filename, dataUrl);
    }
  };

  const handleStartAnalysis = () => {
    if (currentFile && customImageUrl) {
      runRealApiAnalysis(currentFile, customImageName || currentFile.name, customImageUrl);
    } else {
      setIsUploadModalOpen(true);
    }
  };

  const handleReset = () => {
    setApiError(null);
    setIsRealScan(false);
    setRealScanSummary(null);
    setCurrentFile(null);
    setCustomImageUrl(null);
    setCustomImageName(null);
    setAnomalies([]);
    resetSimulation();
  };

  return (
    <div
      ref={workspaceRef}
      className={`p-4 sm:p-6 max-w-7xl mx-auto space-y-4 font-sans select-none ${
        isFullscreen ? 'bg-black min-h-screen p-6' : ''
      }`}
    >
      {/* Upload Modal */}
      <SonarUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* Backend API Connection Error Alert */}
      {apiError && (
        <div className="p-4 bg-[#1a0808] border border-red-500 text-white font-sans text-xs flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
            <div>
              <div className="font-bold text-red-400 uppercase tracking-wider text-xs">
                Backend Connection Error
              </div>
              <div className="text-white mt-0.5">{apiError}</div>
            </div>
          </div>
          <button
            onClick={() => setApiError(null)}
            className="px-3 py-1 border border-red-400 hover:bg-red-950 text-xs text-white uppercase font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Analysis Workspace Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#090909] border border-[#222222]">
        <div>
          <div className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            Side-Scan Sonar Analysis
          </div>
          <div className="text-xs text-[#888888] mt-0.5 flex items-center gap-2">
            <span>
              {customImageName ? `Loaded Image: ${customImageName}` : 'No image loaded &bull; Ready for upload'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-[#888888]">
          <span>STATUS: <strong className="text-white">{status}</strong></span>
          <span>TARGETS: <strong className="text-white">{anomalies.length}</strong></span>
        </div>
      </div>

      {/* Real Scan Summary Bar */}
      {isRealScan && realScanSummary && (
        <div className="p-3 bg-[#0d0d0d] border border-[#333333] flex flex-wrap items-center justify-between text-xs text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-white" />
            <span className="font-semibold text-white">
              YOLO Detection Result
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span>DETECTIONS: <strong className="text-white font-bold">{realScanSummary.count}</strong></span>
            <span>HIGHEST CONFIDENCE: <strong className="text-white font-bold">{realScanSummary.highestConfidence}%</strong></span>
            <span>OVERALL RISK: <strong className="text-white font-bold uppercase">{realScanSummary.overallRisk}</strong></span>
          </div>
        </div>
      )}

      {/* Workspace Controls */}
      <SonarControls
        status={status}
        onStart={handleStartAnalysis}
        onPause={pauseAnalysis}
        onReset={handleReset}
        onUploadClick={() => setIsUploadModalOpen(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        hasRealFile={!!currentFile}
      />

      {/* Analysis Pipeline Timeline */}
      <AnalysisTimeline
        currentStepIndex={currentStepIndex}
        status={status}
        progress={progress}
        totalAnomaliesDetected={anomalies.length}
      />

      {/* Center Layout: Sonar Canvas Viewer & Detection Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Sonar Image Canvas */}
        <div className="lg:col-span-8 flex flex-col space-y-2">
          <SonarCanvas
            laserY={laserY}
            isScanning={status === 'PROCESSING'}
            selectedAnomaly={selectedAnomaly}
            anomalies={anomalies}
            revealedAnomalyIds={activeRevealedIds}
            onSelectAnomaly={handleSelectAnomaly}
            customImageUrl={customImageUrl}
          />

          {/* Bottom info ribbon */}
          <div className="p-2.5 border border-[#222222] bg-[#090909] flex flex-wrap items-center justify-between text-xs text-[#777777]">
            <div>
              {customImageName ? `Active Scan: ${customImageName}` : 'No scan image loaded'}
            </div>
            <div className="text-[#888888]">
              {anomalies.length > 0 ? 'Click a detected target bounding box to view details' : 'Upload an image to start analysis'}
            </div>
          </div>
        </div>

        {/* Detection Sidebar */}
        <div className="lg:col-span-4">
          <DetectionSidebar
            anomalies={anomalies}
            revealedAnomalyIds={activeRevealedIds}
            selectedAnomaly={selectedAnomaly}
            onSelectAnomaly={handleSelectAnomaly}
            isRealScan={isRealScan}
          />
        </div>
      </div>
    </div>
  );
};

export default SonarAnalysisPage;
