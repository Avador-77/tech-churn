'use client';

import React, { useEffect, useState } from 'react';
import { Download, Sparkles, X } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.warn('ServiceWorker registration failed: ', err);
        });
      });
    }

    // Capture install prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      showToast('TechChurn installed on your device! 📱', 'success');
    }
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  if (!showBanner || !deferredPrompt) return null;

  return (
    <div className="fixed top-20 right-4 z-40 max-w-sm w-full bg-neutral-900/95 border border-cyan-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-md text-white animate-slide-down">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shrink-0">
            <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-100">Install TechChurn App</h4>
            <p className="text-[11px] text-neutral-400">
              Get home screen access, fast offline reading & instant notifications.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowBanner(false)}
          className="text-neutral-500 hover:text-white p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          onClick={handleInstall}
          className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md flex items-center justify-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          Install Now
        </button>
        <button
          onClick={() => setShowBanner(false)}
          className="px-3 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:bg-neutral-800"
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
}
