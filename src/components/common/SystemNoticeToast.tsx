import React, { useState, useEffect } from 'react';
import { Terminal, Shield, AlertCircle } from 'lucide-react';
import { SYSTEM_MESSAGES } from '../../data/systemLogs';

export const SystemNoticeToast: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let msgIdx = 0;

    const interval = setInterval(() => {
      const msg = SYSTEM_MESSAGES[msgIdx % SYSTEM_MESSAGES.length];
      setCurrentMessage(msg);
      setVisible(true);

      const hideTimeout = setTimeout(() => {
        setVisible(false);
      }, 4000);

      msgIdx++;

      return () => clearTimeout(hideTimeout);
    }, 9000);

    return () => clearInterval(interval);
  }, []);

  if (!visible || !currentMessage) return null;

  return (
    <aside
      aria-label="System status notification"
      className="fixed bottom-4 right-4 z-40 max-w-md bg-[#0c0c0c] border border-white/60 p-3 shadow-2xl font-mono text-xs animate-in slide-in-from-bottom-5 duration-200"
    >
      <div className="flex items-start gap-2.5">
        <span className="w-2 h-2 bg-white mt-1 animate-ping flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center justify-between text-[9px] text-[#666666] tracking-widest uppercase mb-1">
            <span>AUTONOMOUS SYSTEM NOTICE</span>
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
          <div className="text-white font-bold tracking-wider leading-relaxed">
            &gt; {currentMessage}
          </div>
        </div>
      </div>
    </aside>
  );
};
