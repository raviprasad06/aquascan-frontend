import { useState, useEffect, useRef, useCallback } from 'react';
import { AnalysisStep, AnalysisStatus, AnalysisStepNumber } from '../types/analysis';
import { SonarAnomaly } from '../types/anomaly';

export const ANALYSIS_STEPS: AnalysisStep[] = [
  { step: 1, code: 'STEP 01', label: 'INITIALIZING SONAR INPUT', detail: 'Connecting to hydrophone array & decoding raw ping data', durationMs: 900 },
  { step: 2, code: 'STEP 02', label: 'CALIBRATING ACOUSTIC SIGNAL', detail: 'Normalizing port & starboard transducer gain channels', durationMs: 1000 },
  { step: 3, code: 'STEP 03', label: 'FILTERING SPECKLE NOISE', detail: 'Applying adaptive spatial median filter to water column reverberation', durationMs: 1100 },
  { step: 4, code: 'STEP 04', label: 'ANALYZING SEAFLOOR TOPOLOGY', detail: 'Extracting bathymetric relief gradients and sand ripple baselines', durationMs: 1200 },
  { step: 5, code: 'STEP 05', label: 'IDENTIFYING ARTIFICIAL SIGNATURES', detail: 'Running high-frequency neural convolutional feature detection', durationMs: 1400 },
  { step: 6, code: 'STEP 06', label: 'CALCULATING CONFIDENCE', detail: 'Evaluating acoustic impedance and shadow projection lengths', durationMs: 1100 },
  { step: 7, code: 'STEP 07', label: 'GEOLOCATION LOCK', detail: 'Correlating sensor position with surface RTK differential GPS', durationMs: 900 },
  { step: 8, code: 'STEP 08', label: 'ANALYSIS COMPLETE', detail: 'All acoustic targets classified and cataloged in mission ledger', durationMs: 600 }
];

export function useSonarSimulation(allAnomalies: SonarAnomaly[]) {
  const [status, setStatus] = useState<AnalysisStatus>('IDLE');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [laserY, setLaserY] = useState<number>(0);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const currentStep = ANALYSIS_STEPS[currentStepIndex];

  const resetAnalysis = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    setStatus('IDLE');
    setCurrentStepIndex(0);
    setProgress(0);
    setLaserY(0);
    setRevealedIds(new Set());
    setSelectedAnomalyId(null);
  }, []);

  const pauseAnalysis = useCallback(() => {
    if (status === 'PROCESSING') {
      setStatus('PAUSED');
      if (timerRef.current) clearTimeout(timerRef.current);
    } else if (status === 'PAUSED') {
      setStatus('PROCESSING');
    }
  }, [status]);

  const startAnalysis = useCallback(() => {
    resetAnalysis();
    setStatus('PROCESSING');
  }, [resetAnalysis]);

  useEffect(() => {
    if (status !== 'PROCESSING') return;

    let currentStepIdx = 0;
    const totalSteps = ANALYSIS_STEPS.length;

    const executeNextStep = () => {
      if (currentStepIdx >= totalSteps) {
        setStatus('COMPLETE');
        setLaserY(100);
        setProgress(100);
        setRevealedIds(new Set(allAnomalies.map(a => a.id)));
        return;
      }

      setCurrentStepIndex(currentStepIdx);
      const stepData = ANALYSIS_STEPS[currentStepIdx];
      const stepProgress = Math.round(((currentStepIdx + 1) / totalSteps) * 100);
      setProgress(stepProgress);

      // Animate laser position and progressive reveal
      const targetLaserY = ((currentStepIdx + 1) / totalSteps) * 100;
      setLaserY(targetLaserY);

      // Reveal anomalies that are above this laser position
      const newlyRevealed = new Set<string>();
      allAnomalies.forEach(a => {
        if (a.boundingBox.y <= targetLaserY) {
          newlyRevealed.add(a.id);
        }
      });
      setRevealedIds(prev => new Set([...Array.from(prev), ...Array.from(newlyRevealed)]));

      timerRef.current = setTimeout(() => {
        currentStepIdx += 1;
        executeNextStep();
      }, stepData.durationMs);
    };

    executeNextStep();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [status, allAnomalies]);

  return {
    status,
    currentStep,
    currentStepIndex,
    progress,
    laserY,
    revealedIds,
    selectedAnomalyId,
    setSelectedAnomalyId,
    startAnalysis,
    pauseAnalysis,
    resetAnalysis,
  };
}
