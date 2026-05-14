'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type = 'success',
  isVisible,
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  const config = {
    success: { bg: 'bg-gold/90', border: 'border-gold', icon: '✓', text: 'text-black' },
    error: { bg: 'bg-red-600/90', border: 'border-red-500', icon: '✕', text: 'text-white' },
    info: { bg: 'bg-gold/80', border: 'border-gold', icon: 'ℹ', text: 'text-black' },
  }[type];

  return (
    <div className="fixed top-24 right-4 z-[100] animate-slide-in">
      <div
        className={`${config.bg} ${config.text} backdrop-blur-xl border ${config.border} px-6 py-3.5 rounded-xl shadow-2xl flex items-center space-x-3 min-w-[300px] shadow-black/20`}
      >
        <span className="text-lg font-bold">{config.icon}</span>
        <span className="text-sm font-medium flex-1">{message}</span>
        <button
          onClick={onClose}
          className={`ml-auto ${config.text}/60 hover:${config.text} transition-colors`}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
