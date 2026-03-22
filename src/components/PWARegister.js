'use client';
import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

export default function PWARegister() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
      return;
    }

    // Check if user dismissed the banner before
    const dismissed = sessionStorage.getItem('pwa-dismissed');
    if (dismissed) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === 'accepted') {
      setInstalled(true);
    }
    setShowBanner(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem('pwa-dismissed', '1');
  };

  if (!showBanner || installed) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
      background: 'var(--primary-dark, #143d24)', color: 'white',
      padding: '0.75rem 1rem',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem',
      boxShadow: '0 -2px 12px rgba(0,0,0,0.15)',
      fontSize: '0.9rem',
    }}>
      <Download size={18} />
      <span>Nainstalujte si aplikaci Nadace pro rychlý přístup</span>
      <button onClick={handleInstall} style={{
        background: 'var(--accent, #d4a84b)', color: '#1a1a1a', border: 'none',
        padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer',
        fontWeight: 600, fontSize: '0.85rem',
      }}>
        Nainstalovat
      </button>
      <button onClick={handleDismiss} style={{
        background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)',
        cursor: 'pointer', padding: '0.25rem',
      }}>
        <X size={18} />
      </button>
    </div>
  );
}
