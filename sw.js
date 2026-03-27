// Service Worker — tuhinmohanta.com
// v4.11.0 · Cache-first for static assets, network-first for HTML

const CACHE = 'tm-v4.11.0';
const STATIC = [
  '/',
  '/index.html',
  '/media.html',
  '/profile.jpg',
  '/profile.webp',
  '/favicon.svg',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/humans.txt',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const {request} = e;
  const url = new URL(request.url);

  // Skip cross-origin requests (fonts, YouTube thumbnails, analytics)
  if (url.origin !== location.origin) return;

  // HTML: network-first (always fresh)
  if (request.destination === 'document') {
    e.respondWith(
      fetch(request)
        .then(res => { caches.open(CACHE).then(c => c.put(request, res.clone())); return res; })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Everything else: cache-first
  e.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(res => {
        if (res.ok) caches.open(CACHE).then(c => c.put(request, res.clone()));
        return res;
      });
    })
  );
});
