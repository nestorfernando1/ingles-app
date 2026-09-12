const VERSION = 'ingles-v1';
const ARCHIVOS = [
    'index.html',
    'manifest.webmanifest',
    'icon-192.png',
    'icon-512.png'
];

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(VERSION).then(function (cache) {
            return cache.addAll(ARCHIVOS);
        }).then(function () {
            return self.skipWaiting();
        })
    );
});

self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (claves) {
            return Promise.all(
                claves.filter(function (c) {
                    return c !== VERSION;
                }).map(function (c) {
                    return caches.delete(c);
                })
            );
        }).then(function () {
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request).then(function (resp) {
            return resp || fetch(e.request);
        })
    );
});