import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle2 } from 'lucide-react';
import { fileToDataURL } from '../../utils/scanStorage';

interface SonarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (file: File | null, filename: string, dataUrl?: string) => void;
}

export const SonarUploadModal: React.FC<SonarUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    file: File | null;
    name: string;
    size: string;
    dataUrl?: string;
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
      processFile(file, file.name, `${(file.size / (1024 * 1024)).toFixed(2)} MB`);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file, file.name, `${(file.size / (1024 * 1024)).toFixed(2)} MB`);
    }
  };

  const processFile = async (file: File | null, name: string, size: string) => {
    let dataUrl: string | undefined = undefined;
    if (file) {
      try {
        dataUrl = await fileToDataURL(file);
      } catch (err) {
        console.error('Failed to convert file to data URL', err);
      }
    }
    setSelectedFile({ file, name, size, dataUrl });
    setIsProcessing(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          return 100;
        }
        return prev + 20;
      });
    }, 40);
  };

  const handleConfirm = () => {
    if (selectedFile) {
      onUploadSuccess(selectedFile.file, selectedFile.name, selectedFile.dataUrl);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm font-sans select-none">
      <div className="w-full max-w-lg bg-[#0a0a0a] border border-[#333333] p-6 relative shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
          <div>
            <h2 className="text-base font-bold text-white">
              Upload Sonar Image
            </h2>
            <p className="text-xs text-[#888888] mt-0.5">
              Select a side-scan sonar image for AI inference
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#222222] text-[#888888] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drop Area */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".tiff,.tif,.png,.jpg,.jpeg"
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
          <Upload className="w-8 h-8 text-white mx-auto mb-3" />
          <div className="text-sm font-semibold text-white mb-1">
            Choose a sonar image file or drag here
          </div>
          <p className="text-xs text-[#888888] mb-2">
            Standard PNG, JPG, or TIFF sonar scans supported
          </p>
          <div className="text-[11px] text-[#555555] font-mono">
            PNG &bull; JPG &bull; TIFF
          </div>
        </div>

        {/* Selected File Details */}
        {selectedFile && (
          <div className="p-3.5 border border-[#2b2b2b] bg-[#0f0f0f] space-y-2.5 mb-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white font-medium truncate max-w-[280px]">{selectedFile.name}</span>
              <span className="text-[#888888] font-mono">{selectedFile.size}</span>
            </div>

            {/* Thumbnail Preview */}
            {selectedFile.dataUrl && (
              <div className="relative h-28 w-full border border-[#333333] bg-black overflow-hidden flex items-center justify-center">
                <img
                  src={selectedFile.dataUrl}
                  alt="Sonar Preview"
                  className="w-full h-full object-contain filter grayscale contrast-125"
                />
              </div>
            )}

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono text-[#888888]">
                <span>STATUS: {uploadProgress >= 100 ? 'READY' : 'LOADING'}</span>
                <span className="text-white font-bold">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-[#1c1c1c] h-1 border border-[#333333]">
                <div
                  className="bg-white h-full transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#222222]">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#333333] text-xs text-[#888888] hover:text-white hover:border-white transition-colors cursor-pointer"
          >
            Cancel
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
            {isProcessing ? 'Loading...' : 'Load into Workspace'}
          </button>
        </div>
      </div>
    </div>
  );
};
