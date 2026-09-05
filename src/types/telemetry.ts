export interface SystemTelemetry {
  ping: number;
  frame: number;
  fps: number;
  depth: number; // meters
  range: number; // meters (e.g. 120 M)
  signalQuality: number; // percentage
  noiseLevel: number; // dB
  gpsLock: boolean;
  latitude: number;
  longitude: number;
  heading: number; // degrees
  velocity: number; // knots
  processingTimeMs: number;
  modelVersion: string;
  waterTemp: number; // Celsius
  salinity: number; // PSU
  soundSpeed: number; // m/s
  batteryLevel: number; // percentage
}

export type SubsystemStatus = 'ONLINE' | 'ACTIVE' | 'LOCKED' | 'READY' | 'STANDBY' | 'CALIBRATING';

export interface DiagnosticsState {
  sonarArray: SubsystemStatus;
  aiEngine: SubsystemStatus;
  noiseFilter: SubsystemStatus;
  detectionEngine: SubsystemStatus;
  geolocation: SubsystemStatus;
  reportEngine: SubsystemStatus;
  auvLink: SubsystemStatus;
}

export interface SystemLogMessage {
  id: string;
  timestamp: string;
  type: 'INFO' | 'ANOMALY' | 'SIGNAL' | 'TELEMETRY' | 'SYSTEM';
  message: string;
}
