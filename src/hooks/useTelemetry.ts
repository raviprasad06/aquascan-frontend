import { useState, useEffect } from 'react';
import { SystemTelemetry, DiagnosticsState } from '../types/telemetry';

export function useTelemetry() {
  const [telemetry, setTelemetry] = useState<SystemTelemetry>({
    ping: 4821,
    frame: 1284,
    fps: 28,
    depth: 42.8,
    range: 120,
    signalQuality: 94,
    noiseLevel: -38.4,
    gpsLock: true,
    latitude: 22.5726,
    longitude: 88.3639,
    heading: 84.2,
    velocity: 2.4,
    processingTimeMs: 14.8,
    modelVersion: 'SONAR-AI V1',
    waterTemp: 14.2,
    salinity: 34.8,
    soundSpeed: 1502.4,
    batteryLevel: 88
  });

  const [diagnostics, setDiagnostics] = useState<DiagnosticsState>({
    sonarArray: 'ONLINE',
    aiEngine: 'ONLINE',
    noiseFilter: 'ACTIVE',
    detectionEngine: 'ACTIVE',
    geolocation: 'LOCKED',
    reportEngine: 'READY',
    auvLink: 'STANDBY'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => {
        const pingInc = 1;
        const frameInc = 1;
        // Minor realistic acoustic telemetry jitter
        const depthJitter = Number((Math.sin(Date.now() / 2500) * 0.3 + 42.8).toFixed(1));
        const fpsJitter = 28 + Math.floor(Math.random() * 3);
        const signalJitter = Math.min(99, Math.max(89, 94 + (Math.floor(Math.random() * 5) - 2)));
        const noiseJitter = Number((-38.4 + (Math.random() * 0.8 - 0.4)).toFixed(1));
        const timeJitter = Number((14.5 + Math.random() * 1.8).toFixed(1));
        const headingJitter = Number((84.2 + Math.sin(Date.now() / 5000) * 0.8).toFixed(1));
        const latJitter = Number((22.5726 + (Math.sin(Date.now() / 10000) * 0.0002)).toFixed(4));
        const lonJitter = Number((88.3639 + (Math.cos(Date.now() / 10000) * 0.0002)).toFixed(4));

        return {
          ...prev,
          ping: prev.ping + pingInc,
          frame: prev.frame + frameInc,
          fps: fpsJitter,
          depth: depthJitter,
          signalQuality: signalJitter,
          noiseLevel: noiseJitter,
          processingTimeMs: timeJitter,
          heading: headingJitter,
          latitude: latJitter,
          longitude: lonJitter,
        };
      });
    }, 450);

    return () => clearInterval(interval);
  }, []);

  return { telemetry, diagnostics, setDiagnostics };
}
