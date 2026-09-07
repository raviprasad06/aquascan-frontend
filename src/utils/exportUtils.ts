import { SonarAnomaly } from '../types/anomaly';

export function exportAnomaliesToCSV(anomalies: SonarAnomaly[], filename = 'AQUASCAN_AI_DETECTION_REPORT.csv') {
  const headers = [
    'ID',
    'CLASSIFICATION',
    'CONFIDENCE_%',
    'PRIORITY_RISK',
    'STATUS',
    'SURVEY_SCAN',
    'DETAILS',
    'TIMESTAMP'
  ];

  const rows = anomalies.map(a => [
    `"${a.id}"`,
    `"${a.classification}"`,
    typeof a.confidence === 'number' ? a.confidence.toFixed(1) : '',
    `"${a.priority}"`,
    `"${a.status}"`,
    `"${a.surveyLine || ''}"`,
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

export function exportAnomaliesToJSON(anomalies: SonarAnomaly[], filename = 'AQUASCAN_AI_DETECTION_REPORT.json') {
  const data = {
    application: 'AquaScan AI Sonar Marine Detection',
    model: 'YOLO Segmentation',
    detectionClass: 'Shipwreck',
    exportedAt: new Date().toISOString(),
    totalDetections: anomalies.length,
    highRiskCount: anomalies.filter(a => a.priority === 'HIGH').length,
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
