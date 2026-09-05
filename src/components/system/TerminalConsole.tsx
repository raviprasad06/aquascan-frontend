import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Shield, RefreshCw } from 'lucide-react';
import { INITIAL_LOGS, SYSTEM_MESSAGES } from '../../data/systemLogs';
import { SystemLogMessage } from '../../types/telemetry';

export const TerminalConsole: React.FC = () => {
  const [logs, setLogs] = useState<SystemLogMessage[]>(INITIAL_LOGS);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let count = 9;
    const interval = setInterval(() => {
      const randomMsg = SYSTEM_MESSAGES[Math.floor(Math.random() * SYSTEM_MESSAGES.length)];
      const newLog: SystemLogMessage = {
        id: `log-${count++}`,
        timestamp: new Date().toLocaleTimeString(),
        type: randomMsg.includes('ANOMALY') ? 'ANOMALY' : randomMsg.includes('PING') ? 'SIGNAL' : 'INFO',
        message: randomMsg
      };

      setLogs(prev => [...prev.slice(-30), newLog]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-[#080808] border border-[#222222] font-mono select-none">
      {/* Console Header */}
      <div className="p-3 border-b border-[#222222] bg-[#0c0c0c] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-white" />
          <span className="text-xs font-bold text-white tracking-widest uppercase">
            AUTONOMOUS TELEMETRY & EVENT LOG STREAM
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-[#666666]">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          <span>STREAMING BUFFER</span>
        </div>
      </div>

      {/* Terminal Lines */}
      <div className="p-4 max-h-[320px] overflow-y-auto space-y-1.5 text-xs text-[#cccccc]">
        {logs.map(log => (
          <div key={log.id} className="flex items-start gap-3 hover:bg-[#111111] p-1 transition-colors">
            <span className="text-[#666666] text-[10px] whitespace-nowrap">
              [{log.timestamp}]
            </span>
            <span className={`text-[10px] px-1 py-0.2 border whitespace-nowrap font-bold ${
              log.type === 'ANOMALY'
                ? 'border-white text-white bg-[#1a1a1a]'
                : log.type === 'SIGNAL'
                ? 'border-[#555555] text-white'
                : 'border-[#333333] text-[#888888]'
            }`}>
              {log.type}
            </span>
            <span className="text-white font-medium flex-1">
              &gt; {log.message}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Terminal Input prompt line */}
      <div className="p-2 border-t border-[#1c1c1c] bg-[#060606] flex items-center gap-2 text-xs text-[#666666]">
        <span className="text-white">&gt;</span>
        <span className="text-[#888888]">AUV_CONSOLE_READY // AWAITING REALTIME TELEMETRY PINGS...</span>
        <span className="w-2 h-4 bg-white animate-pulse ml-auto" />
      </div>
    </div>
  );
};
