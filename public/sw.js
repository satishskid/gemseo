/**
 * Service Worker for Offline Support
 * Implements caching strategies for the GBSEO application
 */

const CACHE_NAME = 'gbseo-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/vite.svg',
  '/offline.html'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service worker installed');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // Offline fallback
        if (event.request.destination === 'document') {
          return caches.match('/offline.html');
        }
        
        // Return offline response for API calls
        if (event.request.url.includes('/api/')) {
          return new Response(
            JSON.stringify({
              error: 'You are offline. Please check your internet connection.',
              offline: true
            }),
            {
              headers: { 'Content-Type': 'application/json' },
              status: 503
            }
          );
        }
        
        return new Response('Offline', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: {
            'Content-Type': 'text/plain',
          },
        });
      })
  );
});

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-form-data') {
    event.waitUntil(syncFormData());
  }
});

// Sync offline form data
async function syncFormData() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match('/offline-form-data');
    
    if (response) {
      const formData = await response.json();
      
      // Attempt to sync with server
      const syncResponse = await fetch('/api/sync-form-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (syncResponse.ok) {
        // Remove from cache after successful sync
        await cache.delete('/offline-form-data');
        console.log('Form data synced successfully');
      }
    }
  } catch (error) {
    console.error('Failed to sync form data:', error);
  }
}

// Message handling for offline notifications
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_OFFLINE_STATUS') {
    event.ports[0].postMessage({
      offline: !navigator.onLine,
      cacheReady: true
    });
  }
});

// Network status change handling
self.addEventListener('online', () => {
  console.log('Back online - attempting to sync data');
  // Trigger background sync
  self.registration.sync.register('sync-form-data');
});

self.addEventListener('offline', () => {
  console.log('Gone offline - caching enabled');
});