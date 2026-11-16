const CACHE_PREFIX = 'rashidocampo-eggtracker-';
const CACHE = `${CACHE_PREFIX}v1`;
const SCOPE = new URL(self.registration.scope);
const ENTRY = new URL('index.html', SCOPE).href;
const ASSETS = [
  ENTRY,
  './style.css',
  './app.js',
  './logo.jpg',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const obsolete = (await caches.keys()).filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE);
    await Promise.all(obsolete.map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== SCOPE.origin || !url.pathname.startsWith(SCOPE.pathname)) {
    return;
  }

  const isEntry = request.mode === 'navigate' && (url.pathname === SCOPE.pathname || url.pathname === new URL(ENTRY).pathname);
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    return (await cache.match(isEntry ? ENTRY : request)) || fetch(request);
  })());
});
