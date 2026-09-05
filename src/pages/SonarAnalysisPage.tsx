import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { SonarCanvas } from '../components/sonar/SonarCanvas';
import { SonarControls } from '../components/sonar/SonarControls';
import { AnalysisTimeline } from '../components/sonar/AnalysisTimeline';
import { DetectionSidebar } from '../components/sonar/DetectionSidebar';
import { SonarUploadModal } from '../components/upload/SonarUploadModal';
import { MOCK_ANOMALIES } from '../data/mockAnomalies';
import { useSonarSimulation } from '../hooks/useSonarSimulation';
import { SonarAnomaly } from '../types/anomaly';
import { TechnicalFrame } from '../components/common/TechnicalFrame';
import { MOCK_DATASETS } from '../data/mockScans';

export const SonarAnalysisPage: React.FC = () => {
  const location = useLocation();
  const [anomalies, setAnomalies] = useState<SonarAnomaly[]>(MOCK_ANOMALIES);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('SURVEY_BENGAL_084');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const workspaceRef = useRef<HTMLDivElement | null>(null);

  const {
    status,
    currentStepIndex,
    progress,
    laserY,
    revealedIds,
    selectedAnomalyId,
    setSelectedAnomalyId,
    startAnalysis,
    pauseAnalysis,
    resetAnalysis,
  } = useSonarSimulation(anomalies);

  // If navigated with a pre-selected anomaly (e.g. from Radar Search Bar or Map)
  useEffect(() => {
    if (location.state && location.state.selectedAnomalyId) {
      setSelectedAnomalyId(location.state.selectedAnomalyId);
      // Ensure the pre-selected anomaly is visible in the overlay
      revealedIds.add(location.state.selectedAnomalyId);
    }
  }, [location.state, setSelectedAnomalyId, revealedIds]);

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

  const handleUploadSuccess = (filename: string) => {
    resetAnalysis();
    startAnalysis();
  };

  const currentDataset = MOCK_DATASETS.find(d => d.id === selectedDatasetId) || MOCK_DATASETS[0];

  return (
    <div
      ref={workspaceRef}
      className={`p-4 sm:p-6 max-w-7xl mx-auto space-y-4 font-mono select-none ${
        isFullscreen ? 'bg-black min-h-screen p-6' : ''
      }`}
    >
      {/* Upload Modal */}
      <SonarUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* Main Analysis Workspace Header (Exact match to Requirement #10) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-[#090909] border border-[#222222]">
        <div>
          <div className="text-sm sm:text-base font-bold text-white tracking-widest uppercase font-sans flex items-center gap-2">
            <span className="w-2 h-2 bg-white rounded-full animate-ping" />
            SIDE-SCAN SONAR ANALYSIS // ACOUSTIC RECONSTRUCTION
          </div>
          <div className="text-[11px] text-[#888888] mt-0.5">
            TRANSECT: {currentDataset.title} // CARRIER: {currentDataset.frequencyKhz} kHz // PINGS: {currentDataset.rawPings}
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#888888]">
          <span>STATUS: <strong className="text-white">{status}</strong></span>
          <span>TARGETS: <strong className="text-white">{revealedIds.size} / {anomalies.length}</strong></span>
        </div>
      </div>

      {/* Workspace Controls (Upload, Start Analysis, Pause, Reset, Fullscreen) */}
      <SonarControls
        status={status}
        onStart={startAnalysis}
        onPause={pauseAnalysis}
        onReset={resetAnalysis}
        onUploadClick={() => setIsUploadModalOpen(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        selectedDatasetId={selectedDatasetId}
        onSelectDataset={setSelectedDatasetId}
      />

      {/* 8-Step Simulated Analysis Timeline (Exact match to Requirement #12) */}
      <AnalysisTimeline
        currentStepIndex={currentStepIndex}
        status={status}
        progress={progress}
        totalAnomaliesDetected={revealedIds.size}
      />

      {/* Center Layout: Sonar Canvas Viewer (Left) & Detection Sidebar (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Sonar Image Canvas (Requirement #10 & #11) */}
        <div className="lg:col-span-8 flex flex-col space-y-2">
          <SonarCanvas
            laserY={laserY}
            isScanning={status === 'PROCESSING'}
            selectedAnomaly={selectedAnomaly}
            anomalies={anomalies}
            revealedAnomalyIds={revealedIds}
            onSelectAnomaly={handleSelectAnomaly}
            datasetType={currentDataset.previewType}
          />

          {/* Bottom swath telemetry ribbon */}
          <div className="p-2 border border-[#222222] bg-[#090909] flex flex-wrap items-center justify-between text-[10px] text-[#777777]">
            <div className="flex items-center gap-4">
              <span>BAND: DUAL CHIRP</span>
              <span>BEAM WIDTH: 0.5° HORIZ</span>
              <span>SAMPLING: 24-BIT</span>
            </div>
            <div className="text-[#aaaaaa]">
              CLICK ANOMALY BOUNDING BOX TO INSPECT IN SIDEBAR
            </div>
          </div>
        </div>

        {/* Detection Sidebar (Exact match to Requirement #13) */}
        <div className="lg:col-span-4">
          <DetectionSidebar
            anomalies={anomalies}
            revealedAnomalyIds={revealedIds}
            selectedAnomaly={selectedAnomaly}
            onSelectAnomaly={handleSelectAnomaly}
          />
        </div>
      </div>
    </div>
  );
};
