import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Shield, CheckCircle2, Cpu } from 'lucide-react';
import { MicroRadar } from '../radar/MicroRadar';

interface BootSequenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BootSequenceModal: React.FC<BootSequenceModalProps> = ({
  isOpen,
  onClose
}) => {
  const navigate = useNavigate();
  const [bootStep, setBootStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { title: 'CONNECTING TO AUV TRANSDUCER POD', detail: 'Transceiver 455 kHz ping frequency verified.' },
    { title: 'ACOUSTIC REVERBERATION CALIBRATION', detail: 'Port and starboard gain matrices balanced.' },
    { title: 'LOADING NEURAL WEIGHTS [SONAR-AI V1]', detail: 'Tensor runtime initialized with 48.2M parameters.' },
    { title: 'ESTABLISHING RTK DIFFERENTIAL GEOLOCATION', detail: 'Latitude 22.5726° N, Longitude 88.3639° E locked.' },
    { title: 'SONAR ARRAY ONLINE // SYSTEM READY', detail: 'All 7 autonomous marine subroutines operational.' },
  ];

  useEffect(() => {
    if (!isOpen) {
      setBootStep(0);
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const next = prev + 5;
        const currentStep = Math.min(steps.length - 1, Math.floor((next / 100) * steps.length));
        setBootStep(currentStep);
        return next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleComplete = () => {
    onClose();
    navigate('/dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="w-full max-w-xl bg-[#090909] border border-white p-6 relative font-mono shadow-2xl">
        {/* Corner Accents */}
        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white" />
        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white" />
        <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white" />
        <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
          <div className="flex items-center gap-3">
            <MicroRadar size={28} />
            <div>
              <div className="text-xs text-[#888888] tracking-widest uppercase">
                SYSTEM BOOT SEQUENCE
              </div>
              <div className="text-sm font-bold text-white tracking-widest">
                SONAR AI // INITIALIZATION
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-white font-bold">{progress}%</span>
            <div className="text-[9px] text-[#666666]">DIAGNOSTIC</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="my-4 h-2 w-full bg-[#161616] border border-[#333333] overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Execution Log */}
        <div className="space-y-3 py-3">
          {steps.map((step, idx) => {
            const isCompleted = idx < bootStep || progress === 100;
            const isCurrent = idx === bootStep && progress < 100;
            const isPending = idx > bootStep;

            return (
              <div
                key={step.title}
                className={`flex items-start gap-3 text-xs p-2 border transition-all ${
                  isCurrent
                    ? 'border-white bg-[#141414] text-white'
                    : isCompleted
                    ? 'border-[#222222] bg-[#0c0c0c] text-[#cccccc]'
                    : 'border-transparent text-[#444444]'
                }`}
              >
                <div className="mt-0.5">
                  {isCompleted ? (
                    <span className="text-white font-bold">[OK]</span>
                  ) : isCurrent ? (
                    <span className="inline-block w-2 h-2 bg-white animate-ping" />
                  ) : (
                    <span className="text-[#333333]">[..]</span>
                  )}
                </div>
                <div>
                  <div className="font-bold tracking-wider uppercase">
                    {step.title}
                  </div>
                  <div className="text-[10px] text-[#888888] font-sans mt-0.5">
                    {step.detail}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Actions */}
        <div className="pt-4 border-t border-[#222222] flex items-center justify-between">
          <div className="text-[10px] text-[#666666]">
            AUV PROTOCOL 84-B // ALL RIGHTS RESERVED
          </div>
          <button
            onClick={handleComplete}
            disabled={progress < 100}
            className={`px-5 py-2 text-xs font-bold tracking-widest uppercase transition-all ${
              progress === 100
                ? 'bg-white text-black hover:bg-[#dddddd] shadow-glow-sm cursor-pointer'
                : 'bg-[#181818] text-[#555555] cursor-not-allowed border border-[#262626]'
            }`}
          >
            {progress === 100 ? 'ENTER COMMAND CENTER →' : 'BOOTING FIRMWARE...'}
          </button>
        </div>
      </div>
    </div>
  );
};
