import React, { useState, useEffect } from 'react';
import { DownloadIcon } from './icons/Icons';

// BeforeInstallPromptEvent is not in standard TS lib, so we define it here.
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const InstallPWAButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      // Check if the app is already installed
      if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
        setIsAppInstalled(true);
        return;
      }
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsAppInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Initial check in case the event was missed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
        setIsAppInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the A2HS prompt');
    } else {
      console.log('User dismissed the A2HS prompt');
    }
    setDeferredPrompt(null);
  };

  if (!deferredPrompt || isAppInstalled) {
    return null;
  }

  return (
    <button
      onClick={handleInstallClick}
      className="flex items-center space-x-2 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
      aria-label="Install DailyTasks Pro on your device"
    >
      <DownloadIcon className="h-5 w-5" />
      <span className="hidden sm:inline">Install App</span>
    </button>
  );
};
