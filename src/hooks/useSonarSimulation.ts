import { useState, useEffect, useRef, useCallback } from 'react';
import { AnalysisStep, AnalysisStatus } from '../types/analysis';
import { SonarAnomaly } from '../types/anomaly';

export const ANALYSIS_STEPS: AnalysisStep[] = [
  { step: 1, code: 'STEP 01', label: 'IMAGE LOADED', detail: 'Side-scan sonar image loaded into memory', durationMs: 400 },
  { step: 2, code: 'STEP 02', label: 'AI INFERENCE', detail: 'Executing YOLO segmentation neural network', durationMs: 600 },
  { step: 3, code: 'STEP 03', label: 'OBJECT DETECTION', detail: 'Extracting bounding contours and segmentation masks', durationMs: 500 },
  { step: 4, code: 'STEP 04', label: 'CONFIDENCE CALCULATION', detail: 'Evaluating class probabilities and risk metrics', durationMs: 400 },
  { step: 5, code: 'STEP 05', label: 'RESULT READY', detail: 'Detections cataloged and ready for inspection', durationMs: 300 }
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

  const currentStep = ANALYSIS_STEPS[currentStepIndex] || ANALYSIS_STEPS[0];

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

      const targetLaserY = ((currentStepIdx + 1) / totalSteps) * 100;
      setLaserY(targetLaserY);

      const newlyRevealed = new Set<string>();
      allAnomalies.forEach(a => {
        if (!a.boundingBox || a.boundingBox.y <= targetLaserY) {
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
