/**
 * Service Worker Registration and Management
 * Handles offline support and background sync
 */

import { FEATURE_FLAGS } from '../config/featureFlags';

interface ServiceWorkerStatus {
  isSupported: boolean;
  isInstalled: boolean;
  isOffline: boolean;
}

/**
 * Register service worker with feature flag control
 */
export const registerServiceWorker = async (): Promise<ServiceWorkerStatus> => {
  const status: ServiceWorkerStatus = {
    isSupported: false,
    isInstalled: false,
    isOffline: !navigator.onLine,
  };

  // Check if service workers are supported and feature is enabled
  if (!FEATURE_FLAGS.OFFLINE_SUPPORT || !('serviceWorker' in navigator)) {
    console.log('Service workers not supported or feature disabled');
    return status;
  }

  status.isSupported = true;

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('ServiceWorker registration successful:', registration.scope);
    status.isInstalled = true;

    // Set up event listeners
    setupServiceWorkerListeners();

    return status;
  } catch (error) {
    console.error('ServiceWorker registration failed:', error);
    return status;
  }
};

/**
 * Set up service worker event listeners
 */
const setupServiceWorkerListeners = () => {
  // Handle updates
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SW_UPDATED') {
      console.log('Service worker updated');
      // Optionally notify user about update
      if (window.confirm('A new version is available. Reload to update?')) {
        window.location.reload();
      }
    }
  });

  // Handle offline/online events
  window.addEventListener('online', () => {
    console.log('Back online');
    syncOfflineData();
  });

  window.addEventListener('offline', () => {
    console.log('Gone offline');
  });
};

/**
 * Sync offline data when back online
 */
const syncOfflineData = async () => {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('sync-form-data');
      console.log('Background sync registered');
    } catch (error) {
      console.error('Background sync failed:', error);
      // Fallback: try to sync directly
      syncDataDirectly();
    }
  }
};

/**
 * Fallback data sync method
 */
const syncDataDirectly = async () => {
  try {
    // Get offline data from localStorage
    const offlineData = localStorage.getItem('offline_form_submissions');
    if (!offlineData) return;

    const submissions = JSON.parse(offlineData);
    if (submissions.length === 0) return;

    console.log(`Attempting to sync ${submissions.length} offline submissions`);

    // Try to sync each submission
    const results = await Promise.allSettled(
      submissions.map(async (submission: any) => {
        const response = await fetch('/api/sync-form-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submission),
        });

        if (!response.ok) {
          throw new Error(`Sync failed: ${response.status}`);
        }

        return submission;
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`Sync complete: ${successful} successful, ${failed} failed`);

    // Remove successfully synced items
    const stillOffline = results
      .map((result, index) => ({ result, index }))
      .filter(({ result }) => result.status === 'rejected')
      .map(({ index }) => submissions[index]);

    if (stillOffline.length > 0) {
      localStorage.setItem('offline_form_submissions', JSON.stringify(stillOffline));
    } else {
      localStorage.removeItem('offline_form_submissions');
    }

    return { successful, failed };
  } catch (error) {
    console.error('Direct sync failed:', error);
    return { successful: 0, failed: 0 };
  }
};

/**
 * Save form data for offline sync
 */
export const saveOfflineFormData = async (formData: any): Promise<boolean> => {
  if (!FEATURE_FLAGS.OFFLINE_SUPPORT) {
    return false;
  }

  try {
    const offlineData = localStorage.getItem('offline_form_submissions');
    const submissions = offlineData ? JSON.parse(offlineData) : [];
    
    submissions.push({
      ...formData,
      timestamp: new Date().toISOString(),
      id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    });

    localStorage.setItem('offline_form_submissions', JSON.stringify(submissions));
    console.log('Form data saved for offline sync');
    return true;
  } catch (error) {
    console.error('Failed to save offline form data:', error);
    return false;
  }
};

/**
 * Check if service worker is ready
 */
export const isServiceWorkerReady = async (): Promise<boolean> => {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    return registration.active !== null;
  } catch (error) {
    console.error('Service worker not ready:', error);
    return false;
  }
};

/**
 * Get current offline status
 */
export const getOfflineStatus = (): ServiceWorkerStatus => {
  return {
    isSupported: 'serviceWorker' in navigator,
    isInstalled: false, // Will be updated after registration
    isOffline: !navigator.onLine,
  };
};

/**
 * Unregister service worker (for cleanup)
 */
export const unregisterServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.unregister();
      console.log('Service worker unregistered');
    } catch (error) {
      console.error('Failed to unregister service worker:', error);
    }
  }
};