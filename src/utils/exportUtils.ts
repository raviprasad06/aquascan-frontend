import { SonarAnomaly } from '../types/anomaly';

export function exportAnomaliesToCSV(anomalies: SonarAnomaly[], filename = 'SONAR_AI_ANOMALY_REPORT.csv') {
  const headers = [
    'ID',
    'CLASSIFICATION',
    'CONFIDENCE_%',
    'LATITUDE',
    'LONGITUDE',
    'WIDTH_M',
    'HEIGHT_M',
    'DEPTH_M',
    'PRIORITY',
    'STATUS',
    'ESTIMATED_VOLUME_M3',
    'MATERIAL_COMPOSITION',
    'SURVEY_TRANSECT',
    'ACOUSTIC_SIGNATURE',
    'TIMESTAMP'
  ];

  const rows = anomalies.map(a => [
    `"${a.id}"`,
    `"${a.classification}"`,
    a.confidence.toFixed(1),
    a.latitude.toFixed(6),
    a.longitude.toFixed(6),
    a.width.toFixed(2),
    a.height.toFixed(2),
    a.depth.toFixed(1),
    `"${a.priority}"`,
    `"${a.status}"`,
    (a.estimatedVolume || 0).toFixed(2),
    `"${(a.materialComposition || '').replace(/"/g, '""')}"`,
    `"${a.surveyLine}"`,
    `"${(a.acousticSignature || '').replace(/"/g, '""')}"`,
    `"${a.timestamp}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportAnomaliesToJSON(anomalies: SonarAnomaly[], filename = 'SONAR_AI_ANOMALY_CATALOG.json') {
  const data = {
    system: 'SONAR AI // AUTONOMOUS MARINE DEBRIS & ANOMALY DETECTION SYSTEM',
    version: 'SONAR-AI V1.0.4-PROD',
    exportedAt: new Date().toISOString(),
    totalDetections: anomalies.length,
    highConfidenceCount: anomalies.filter(a => a.confidence >= 90).length,
    coordinateFrame: 'WGS84_GEODETIC',
    sensorAcoustics: 'DUAL_FREQUENCY_SIDE_SCAN_455_900KHZ',
    detections: anomalies
  };

  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
