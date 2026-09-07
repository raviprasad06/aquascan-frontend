import { SonarAnomaly, AnomalyPriority, AnomalyStatus } from '../types/anomaly';
import { ApiDetection, ApiPredictResponse } from '../services/api';

export interface ScanRecord {
  id: string;
  filename: string;
  timestamp: string;
  detectionCount: number;
  detections: SonarAnomaly[];
  highestConfidence: number;
  overallRisk: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
  originalImage?: string; // Optional for in-memory display, NOT stored in localStorage
  annotatedImage?: string | null;
}

export interface ScanStats {
  totalScans: number;
  totalDetections: number;
  highRiskDetections: number;
  avgConfidence: number;
}

const STORAGE_KEY = 'aquascan_scan_history';

export function getScanHistory(): ScanRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    // Sanitize any legacy data that might contain large base64 images
    return parsed.map((item: any) => {
      const { originalImage, annotatedImage, ...clean } = item;
      return clean as ScanRecord;
    });
  } catch (error) {
    console.error('Error reading scan history from localStorage:', error);
    return [];
  }
}

export function saveScan(scan: ScanRecord): void {
  try {
    // Keep localStorage strictly for lightweight metadata only (NO base64 / large images)
    const cleanScan: ScanRecord = {
      id: scan.id,
      filename: scan.filename,
      timestamp: scan.timestamp,
      detectionCount: scan.detectionCount,
      detections: scan.detections,
      highestConfidence: scan.highestConfidence,
      overallRisk: scan.overallRisk,
    };

    const history = getScanHistory();
    // Newest scans appear first, deduplicated and capped to avoid unbounded growth
    const updated = [cleanScan, ...history.filter(h => h.id !== cleanScan.id)].slice(0, 50);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (quotaErr) {
      console.warn('QuotaExceededError: clearing old storage and retrying with current scan...', quotaErr);
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(STORAGE_KEY, JSON.stringify([cleanScan]));
      } catch (innerErr) {
        console.error('Critical: Failed to save scan metadata to localStorage:', innerErr);
      }
    }

    // Dispatch synchronization event for cross-component and active page update
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('aquascan-scan-updated'));
    }
  } catch (error) {
    console.error('Error saving scan to localStorage:', error);
  }
}

export function getLatestScan(): ScanRecord | null {
  const history = getScanHistory();
  return history.length > 0 ? history[0] : null;
}

export function clearScanHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('aquascan-scan-updated'));
    }
  } catch (error) {
    console.error('Error clearing scan history:', error);
  }
}

export function getScanStats(): ScanStats {
  const history = getScanHistory();
  if (history.length === 0) {
    return {
      totalScans: 0,
      totalDetections: 0,
      highRiskDetections: 0,
      avgConfidence: 0,
    };
  }

  const totalScans = history.length;
  const totalDetections = history.reduce((sum, s) => sum + s.detectionCount, 0);

  let highRiskCount = 0;
  let totalConf = 0;
  let confCount = 0;

  history.forEach(scan => {
    scan.detections.forEach(det => {
      if (det.priority === 'HIGH') {
        highRiskCount++;
      }
      if (typeof det.confidence === 'number' && !isNaN(det.confidence)) {
        totalConf += det.confidence;
        confCount++;
      }
    });
  });

  const avgConfidence = confCount > 0 ? Number((totalConf / confCount).toFixed(1)) : 0;

  return {
    totalScans,
    totalDetections,
    highRiskDetections: highRiskCount,
    avgConfidence,
  };
}

export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export function normalizeApiDetections(
  apiResponse: ApiPredictResponse,
  timestampStr?: string
): { detections: SonarAnomaly[]; highestConfidence: number; overallRisk: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE' } {
  const timestamp = timestampStr || new Date().toISOString();
  
  if (!apiResponse.detections || apiResponse.detections.length === 0) {
    return {
      detections: [],
      highestConfidence: 0,
      overallRisk: 'NONE',
    };
  }

  let maxConf = 0;
  let hasHighRisk = false;
  let hasMediumRisk = false;

  const normalized: SonarAnomaly[] = apiResponse.detections.map((det: ApiDetection, idx: number) => {
    // Confidence normalization (e.g. 0.758 -> 75.8)
    const confVal = det.confidence <= 1 ? Number((det.confidence * 100).toFixed(1)) : Number(det.confidence.toFixed(1));
    if (confVal > maxConf) maxConf = confVal;

    // Risk mapping
    const rawRisk = (det.risk || '').toUpperCase();
    let priority: AnomalyPriority = 'MEDIUM';
    if (rawRisk === 'HIGH') {
      priority = 'HIGH';
      hasHighRisk = true;
    } else if (rawRisk === 'LOW') {
      priority = 'LOW';
    } else {
      hasMediumRisk = true;
    }

    // Class normalization from actual model output
    const rawClass = det.class ? det.class.trim() : 'shipwreck';
    const classification = rawClass.charAt(0).toUpperCase() + rawClass.slice(1);

    // Default bounding boxes for UI overlay placement if coordinates aren't in response
    const defaultBoxes = [
      { x: 30, y: 25, width: 35, height: 30 },
      { x: 55, y: 50, width: 30, height: 25 },
      { x: 15, y: 55, width: 25, height: 25 },
    ];
    const boundingBox = defaultBoxes[idx % defaultBoxes.length];

    return {
      id: `DET-${String(idx + 1).padStart(2, '0')}`,
      classification,
      confidence: confVal,
      timestamp,
      priority,
      status: priority === 'HIGH' ? 'ACTION_REQUIRED' : 'VERIFIED',
      boundingBox,
      acousticSignature: `YOLO AI Detection. Class: ${det.class || 'shipwreck'}, Risk: ${det.risk || 'High'}, Confidence: ${confVal}%`,
      surveyLine: `SCAN-${apiResponse.filename || 'UPLOAD'}`,
      // Latitude, longitude, depth, width, height left undefined as real PNG upload has no GPS metadata
    };
  });

  let overallRisk: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE' = 'LOW';
  if (hasHighRisk) overallRisk = 'HIGH';
  else if (hasMediumRisk) overallRisk = 'MEDIUM';

  return {
    detections: normalized,
    highestConfidence: maxConf,
    overallRisk,
  };
}
