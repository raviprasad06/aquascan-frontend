export type AnalysisStepNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface AnalysisStep {
  step: AnalysisStepNumber;
  code: string;
  label: string;
  detail: string;
  durationMs: number;
}

export type AnalysisStatus = 'IDLE' | 'INITIALIZING' | 'PROCESSING' | 'PAUSED' | 'COMPLETE';

export interface SonarDataset {
  id: string;
  title: string;
  location: string;
  frequencyKhz: number;
  recordedAt: string;
  filesize: string;
  rawPings: number;
  anomalyCount: number;
  previewType: 'trench' | 'reef' | 'debris_field' | 'pipe_zone';
}
