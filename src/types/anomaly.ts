export type AnomalyClass = 
  | 'Ghost Net'
  | 'Shipwreck'
  | 'Pipe'
  | 'Cylinder'
  | 'Marine Debris'
  | 'Entangled Debris'
  | 'Unknown Debris'
  | 'Unknown Anomaly';

export type AnomalyPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export type AnomalyStatus = 'VERIFIED' | 'PENDING' | 'ACTION_REQUIRED' | 'CATALOGED';

export interface BoundingBox {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
}

export interface SonarAnomaly {
  id: string; // e.g. "AN-104"
  classification: AnomalyClass;
  confidence: number; // 0-100, e.g. 96.4
  latitude: number;
  longitude: number;
  width: number; // meters
  height: number; // meters
  depth: number; // meters
  timestamp: string;
  priority: AnomalyPriority;
  status: AnomalyStatus;
  boundingBox: BoundingBox;
  acousticSignature: string;
  materialComposition?: string;
  estimatedVolume?: number; // m^3
  surveyLine: string;
}

export interface AnomalyFilter {
  search: string;
  classification: string;
  minConfidence: number;
  priority: string;
}
