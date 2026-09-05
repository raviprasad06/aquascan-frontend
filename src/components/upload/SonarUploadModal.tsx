import React, { useState, useRef } from 'react';
import { Upload, X, FileText, CheckCircle2, AlertTriangle, Disc } from 'lucide-react';
import { MicroRadar } from '../radar/MicroRadar';

interface SonarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (filename: string) => void;
}

export const SonarUploadModal: React.FC<SonarUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: string;
  } | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file.name, `${(file.size / (1024 * 1024)).toFixed(1)} MB`);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file.name, `${(file.size / (1024 * 1024)).toFixed(1)} MB`);
    }
  };

  const processFile = (name: string, size: string) => {
    setSelectedFile({ name, size });
    setIsProcessing(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          return 100;
        }
        return prev + 6;
      });
    }, 70);
  };

  const handleSimulateDefault = () => {
    processFile('SONAR_SURVEY_104.TIFF', '48.2 MB');
  };

  const handleConfirm = () => {
    if (selectedFile) {
      onUploadSuccess(selectedFile.name);
      onClose();
    }
  };

  // ASCII progress representation
  const totalBlocks = 20;
  const filled = Math.round((uploadProgress / 100) * totalBlocks);
  const asciiBar = '█'.repeat(filled) + '░'.repeat(totalBlocks - filled);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md font-mono select-none">
      <div className="w-full max-w-xl bg-[#0a0a0a] border border-white p-6 relative shadow-2xl">
        {/* Corner Accents */}
        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white" />
        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white" />
        <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white" />
        <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
          <div className="flex items-center gap-2.5">
            <MicroRadar size={22} />
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-widest">
                SONAR FILE INGESTION
              </div>
              <div className="text-[10px] text-[#666666]">
                SIDE-SCAN RAW ACOUSTIC RECONSTRUCTION
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#222222] text-[#888888] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drop Area */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".tiff,.tif,.png,.jpg,.jpeg,.csv,.json"
          onChange={handleFileInput}
          className="hidden"
        />

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`my-5 border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-white bg-[#1a1a1a]'
              : 'border-[#333333] hover:border-white/70 bg-[#0d0d0d]'
          }`}
        >
          <Upload className="w-8 h-8 text-white mx-auto mb-3 animate-pulse" />
          <div className="text-sm font-bold text-white tracking-widest uppercase mb-1">
            DROP SIDE-SCAN SONAR DATA
          </div>
          <p className="text-[11px] text-[#888888] mb-3">
            Click to browse or drag and drop hydrophone recordings
          </p>
          <div className="text-[10px] text-[#555555] tracking-wider uppercase">
            SUPPORTED: PNG // JPG // TIFF // CSV // JSON
          </div>
        </div>

        {/* Quick Sample File Loader */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#111111] border border-[#222222] text-xs mb-4">
          <span className="text-[#888888] text-[10px]">PRE-LOADED TRANSECT:</span>
          <button
            onClick={handleSimulateDefault}
            className="text-[11px] text-white hover:underline font-bold"
          >
            [ LOAD SONAR_SURVEY_104.TIFF ]
          </button>
        </div>

        {/* Selected File & Simulation Details */}
        {selectedFile && (
          <div className="p-4 border border-[#2b2b2b] bg-[#0f0f0f] space-y-3 mb-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white font-bold">{selectedFile.name}</span>
              <span className="text-[#888888]">FILE SIZE: {selectedFile.size}</span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#aaaaaa]">
              <span>SIGNAL STATUS: <strong className="text-white">READY</strong></span>
              <span>SAMPLING: 455 kHz CHIRP</span>
            </div>

            {/* ASCII Processing Meter */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#888888]">PROCESSING:</span>
                <span className="text-white font-bold">{uploadProgress}%</span>
              </div>
              <div className="text-xs text-white tracking-tighter select-none">
                {asciiBar}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#222222]">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#333333] text-xs text-[#888888] hover:text-white hover:border-white transition-colors"
          >
            CANCEL
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedFile || isProcessing}
            className={`px-5 py-2 text-xs font-bold uppercase transition-all ${
              selectedFile && !isProcessing
                ? 'bg-white text-black hover:bg-[#e0e0e0] cursor-pointer shadow-glow-sm'
                : 'bg-[#181818] text-[#555555] border border-[#262626] cursor-not-allowed'
            }`}
          >
            {isProcessing ? 'DECOMPRESSING...' : 'INITIALIZE DATASET →'}
          </button>
        </div>
      </div>
    </div>
  );
};
