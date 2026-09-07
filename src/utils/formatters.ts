export function formatCoordinates(lat?: number | null, lon?: number | null): string {
  if (lat === undefined || lat === null || lon === undefined || lon === null || isNaN(lat) || isNaN(lon)) {
    return 'LOCATION DATA NOT AVAILABLE';
  }
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lon).toFixed(4)}° ${lonDir}`;
}

export function formatDimensions(width?: number | null, height?: number | null): string {
  if (width === undefined || width === null || height === undefined || height === null || isNaN(width) || isNaN(height)) {
    return 'N/A';
  }
  return `${width.toFixed(1)}m × ${height.toFixed(1)}m`;
}

export function formatConfidenceBlocks(confidence: number, totalBlocks = 20): string {
  const filledBlocks = Math.round((confidence / 100) * totalBlocks);
  const emptyBlocks = totalBlocks - filledBlocks;
  return '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);
}

export function getConfidenceTier(confidence: number): {
  label: 'HIGH CONFIDENCE' | 'MEDIUM CONFIDENCE' | 'LOW CONFIDENCE';
  tier: 'HIGH' | 'MEDIUM' | 'LOW';
} {
  if (confidence >= 90) {
    return { label: 'HIGH CONFIDENCE', tier: 'HIGH' };
  }
  if (confidence >= 70) {
    return { label: 'MEDIUM CONFIDENCE', tier: 'MEDIUM' };
  }
  return { label: 'LOW CONFIDENCE', tier: 'LOW' };
}
