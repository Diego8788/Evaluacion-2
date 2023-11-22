


const cacheName = 'mi-pwa-cache-v1';


const cacheAssets = [
  '/',
  '/index.html',
  '/estilos.css',
  '/main.js',
  '/icon.png',
  'https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap',
  'https://kit.fontawesome.com/2c36e9b7b1.js',
];


self.addEventListener('install', (e) => {
  e.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        return cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
});


self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});


self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(cacheName).then((cache) => {
          cache.put(e.request, clone);
        });
        return response;
      })
      .catch(() => caches.match(e.request).then((response) => response))
  );
});