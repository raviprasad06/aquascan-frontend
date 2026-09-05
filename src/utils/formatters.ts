export function formatCoordinates(lat: number, lon: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lon).toFixed(4)}° ${lonDir}`;
}

export function formatDimensions(width: number, height: number): string {
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
