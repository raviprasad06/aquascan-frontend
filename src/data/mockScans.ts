import { SonarDataset } from '../types/analysis';

export const MOCK_DATASETS: SonarDataset[] = [
  {
    id: 'SURVEY_BENGAL_084',
    title: 'BAY OF BENGAL TRANSECT 084',
    location: '22.5726° N, 88.3639° E',
    frequencyKhz: 455,
    recordedAt: '2026-09-05 06:45 UTC',
    filesize: '48.2 MB',
    rawPings: 4821,
    anomalyCount: 12,
    previewType: 'debris_field'
  },
  {
    id: 'TRANSECT_GHOST_NET_CLUSTER',
    title: 'COASTAL REEF GHOST NET ZONE',
    location: '22.5789° N, 88.3662° E',
    frequencyKhz: 900,
    recordedAt: '2026-09-05 08:30 UTC',
    filesize: '62.7 MB',
    rawPings: 6140,
    anomalyCount: 8,
    previewType: 'reef'
  },
  {
    id: 'DEEP_TRENCH_WRECKAGE',
    title: 'BATHYAL TRENCH SHIPWRECK CHASM',
    location: '22.5741° N, 88.3678° E',
    frequencyKhz: 120,
    recordedAt: '2026-09-04 22:15 UTC',
    filesize: '114.5 MB',
    rawPings: 12400,
    anomalyCount: 6,
    previewType: 'trench'
  },
  {
    id: 'SUBSEA_PIPELINE_SURVEY',
    title: 'INDUSTRIAL OUTFALL CONDUIT CORRIDOR',
    location: '22.5732° N, 88.3692° E',
    frequencyKhz: 455,
    recordedAt: '2026-09-05 03:10 UTC',
    filesize: '36.8 MB',
    rawPings: 3950,
    anomalyCount: 5,
    previewType: 'pipe_zone'
  }
];
