import React, { useState } from 'react';
import { Download, FileJson, FileText, Filter, Search, ArrowUpDown, ExternalLink } from 'lucide-react';
import { SonarAnomaly } from '../../types/anomaly';
import { exportAnomaliesToCSV, exportAnomaliesToJSON } from '../../utils/exportUtils';
import { formatDimensions } from '../../utils/formatters';
import { MissionReportModal } from './MissionReportModal';
import { useNavigate } from 'react-router-dom';

interface ReportsTableProps {
  anomalies: SonarAnomaly[];
}

export const ReportsTable: React.FC<ReportsTableProps> = ({ anomalies }) => {
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [sortField, setSortField] = useState<keyof SonarAnomaly>('id');
  const [sortAsc, setSortAsc] = useState(true);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleSort = (field: keyof SonarAnomaly) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filtered = anomalies.filter(item => {
    const matchSearch =
      search === '' ||
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.classification.toLowerCase().includes(search.toLowerCase()) ||
      item.latitude.toString().includes(search) ||
      item.longitude.toString().includes(search);

    const matchClass = selectedClass === 'ALL' || item.classification === selectedClass;
    const matchPriority = selectedPriority === 'ALL' || item.priority === selectedPriority;

    return matchSearch && matchClass && matchPriority;
  });

  const sorted = [...filtered].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (valA === undefined || valB === undefined) return 0;
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const uniqueClasses = Array.from(new Set(anomalies.map(a => a.classification)));

  return (
    <div className="bg-[#090909] border border-[#222222] font-mono select-none">
      {/* Top Action Bar */}
      <div className="p-4 border-b border-[#222222] flex flex-wrap items-center justify-between gap-3 bg-[#0d0d0d]">
        <div>
          <div className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            ANOMALY REPORTS & CATALOG
          </div>
          <p className="text-[10px] text-[#666666] mt-0.5">
            ACOUSTICALLY VERIFIED HYDROGRAPHIC ANOMALIES ({sorted.length} RECORDS)
          </p>
        </div>

        {/* Buttons: EXPORT CSV, EXPORT JSON, GENERATE REPORT */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportAnomaliesToCSV(sorted)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141414] border border-[#333333] hover:border-white text-white text-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT CSV</span>
          </button>

          <button
            onClick={() => exportAnomaliesToJSON(sorted)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141414] border border-[#333333] hover:border-white text-white text-xs transition-colors cursor-pointer"
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>EXPORT JSON</span>
          </button>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-black font-bold text-xs uppercase hover:bg-[#e0e0e0] transition-all shadow-glow-sm cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>GENERATE REPORT</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 border-b border-[#1c1c1c] bg-[#080808] flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="flex items-center gap-2 bg-[#121212] border border-[#2b2b2b] px-2.5 py-1.5 flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-[#666666]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="FILTER BY ID, CLASSIFICATION, COORDINATES..."
            className="bg-transparent text-white text-xs font-mono outline-none w-full placeholder-[#555555]"
          />
        </div>

        {/* Classification Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#777777] uppercase">CLASS:</span>
          <select
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            className="bg-[#121212] border border-[#2b2b2b] text-white px-2 py-1 text-xs outline-none focus:border-white"
          >
            <option value="ALL">ALL CLASSES</option>
            {uniqueClasses.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#777777] uppercase">PRIORITY:</span>
          <select
            value={selectedPriority}
            onChange={e => setSelectedPriority(e.target.value)}
            className="bg-[#121212] border border-[#2b2b2b] text-white px-2 py-1 text-xs outline-none focus:border-white"
          >
            <option value="ALL">ALL PRIORITIES</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#111111] border-b border-[#222222] text-[#888888] text-[10px] tracking-wider uppercase">
              <th onClick={() => handleSort('id')} className="p-3 cursor-pointer hover:text-white">
                <div className="flex items-center gap-1">
                  <span>ID</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th onClick={() => handleSort('classification')} className="p-3 cursor-pointer hover:text-white">
                <div className="flex items-center gap-1">
                  <span>CLASSIFICATION</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th onClick={() => handleSort('confidence')} className="p-3 cursor-pointer hover:text-white">
                <div className="flex items-center gap-1">
                  <span>CONFIDENCE</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3">LATITUDE</th>
              <th className="p-3">LONGITUDE</th>
              <th className="p-3">DIMENSIONS</th>
              <th onClick={() => handleSort('priority')} className="p-3 cursor-pointer hover:text-white">
                <div className="flex items-center gap-1">
                  <span>STATUS / PRIORITY</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3">TIMESTAMP</th>
              <th className="p-3 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#171717]">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-[#666666]">
                  NO RECORDS FOUND MATCHING SEARCH CRITERIA
                </td>
              </tr>
            ) : (
              sorted.map(item => (
                <tr
                  key={item.id}
                  className="hover:bg-[#121212] transition-colors group cursor-pointer"
                  onClick={() => navigate('/sonar-analysis', { state: { selectedAnomalyId: item.id } })}
                >
                  <td className="p-3 font-bold text-white group-hover:underline">
                    {item.id}
                  </td>
                  <td className="p-3">
                    <span className="px-1.5 py-0.5 border border-[#333333] bg-[#161616] text-white uppercase text-[11px]">
                      {item.classification}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-white">
                      {item.confidence.toFixed(1)}%
                    </div>
                  </td>
                  <td className="p-3 text-[#aaaaaa]">
                    {item.latitude.toFixed(4)}
                  </td>
                  <td className="p-3 text-[#aaaaaa]">
                    {item.longitude.toFixed(4)}
                  </td>
                  <td className="p-3 text-[#aaaaaa]">
                    {formatDimensions(item.width, item.height)}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 border text-[10px] font-bold ${
                      item.priority === 'HIGH'
                        ? 'border-white bg-[#1c1c1c] text-white'
                        : 'border-[#444444] text-[#888888]'
                    }`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="p-3 text-[#666666] text-[11px]">
                    {item.timestamp.replace('T', ' ').replace('Z', '')}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        navigate('/sonar-analysis', { state: { selectedAnomalyId: item.id } });
                      }}
                      className="text-[10px] px-2 py-1 border border-[#333333] hover:border-white text-[#aaaaaa] hover:text-white inline-flex items-center gap-1"
                    >
                      VIEW <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Dossier */}
      <MissionReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        anomalies={sorted}
      />
    </div>
  );
};
