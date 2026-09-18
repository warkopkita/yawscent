// YAWSCENT Service Worker for PWA
const CACHE_NAME = "yawscent-cache-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Let network handle dynamic API and SQL requests
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
