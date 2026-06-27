import { toast } from '../ui/toast.js';

export async function initUpdateNotifier() {
  if (!('serviceWorker' in navigator)) return;
  try {
    const { Workbox } = await import('workbox-window');
    const wb = new Workbox('/sw.js');
    wb.addEventListener('waiting', () => {
      toast.info('Güncelleme hazır', {
        action: 'Yenile',
        duration: 0,
        onAction: () => {
          wb.messageSkipWaiting();
          window.location.reload();
        },
      });
    });
    wb.register();
  } catch {
    // workbox-window not available in dev without SW
  }
}
