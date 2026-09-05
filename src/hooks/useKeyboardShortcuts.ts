import { useEffect } from 'react';

interface ShortcutHandlers {
  onOpenSearch?: () => void;
  onClose?: () => void;
}

export function useKeyboardShortcuts({ onOpenSearch, onClose }: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenSearch?.();
      }

      // Escape
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch, onClose]);
}
