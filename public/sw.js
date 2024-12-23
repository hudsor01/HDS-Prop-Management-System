const CACHE_NAME = "property-management-v1";
const OFFLINE_URL = "/offline.html";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.ico",
  "/offline.html",
  "/static/css/main.css",
  "/static/js/main.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
      fetch(OFFLINE_URL).then((response) =>
        caches.open(CACHE_NAME).then((cache) => cache.put(OFFLINE_URL, response))
      ),
    ])
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match(OFFLINE_URL)
      )
    );
    return;
  }

  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
      .catch(() => {
        if (event.request.mode === "navigate") {
          return caches.match(OFFLINE_URL);
        }
      })
  );
});

self.addEventListener("push", (event) => {
  const options = {
    body: event.data.text(),
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: "1",
    },
    actions: [
      { action: "explore", title: "View Details" },
      { action: "close", title: "Close" },
    ],
  };

  event.waitUntil(
    self.registration.showNotification("Property Management", options)
  );
});

self.addEventListener("sync", (event) => {
  if (event.tag === "sync-payments") {
    event.waitUntil(syncPayments());
  }
});

self.addEventListener("periodicsync", (event) => {
  if (event.tag === "check-updates") {
    event.waitUntil(checkForUpdates());
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      clients.claim(),
    ])
  );
});
