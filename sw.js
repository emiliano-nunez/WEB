const CACHE_NAME = 'reflex-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/404.html',
  '/manifest.json',
  '/src/styles/style.css',
  '/src/styles/style.min.css',
  '/src/js/supabase.js',
  '/src/js/cart.js',
  '/src/js/main.js',
  '/src/js/app.js',
  '/src/js/supabase.min.js',
  '/src/js/cart.min.js',
  '/src/js/main.min.js',
  '/src/js/app.min.js',
  '/src/img/LOGO.ico',
  '/src/img/icon-192.png',
  '/src/img/icon-512.png',
  '/src/img/fondo promo.png',
  '/src/img/FONDO.png',
  '/src/img/FONDO LOGO.jpeg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.origin !== location.origin) return;

  if (url.pathname.startsWith('/src/img/productos/')) {
    event.respondWith(
      caches.match(request).then(cached => cached || fetch(request))
    );
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        return response;
      }).catch(() => caches.match('/'))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request))
  );
});
