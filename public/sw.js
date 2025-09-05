const CACHE_NAME = "spylt-cache-v1";
const STATIC_CACHE = "spylt-cache-v1-static";
const DYNAMIC_CACHE = "spylt-cache-v1-dynamic";

// Assets to cache on install
const STATIC_ASSETS = [
  "/",
  "/fonts/ProximaNova-Regular.otf",
  "/images/logo.png",
  "/images/nav-logo.svg",
  "/images/hero-bg.png",
  "/images/arrow.svg",
  "/images/play.svg",
  "/images/circle-text.svg",
];

// Cache strategies
const CACHE_FIRST = ["/images/", "/videos/", "/fonts/", "/_next/static/"];
const NETWORK_FIRST = ["/api/"];
const STALE_WHILE_REVALIDATE = ["/"];

self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log("Caching static assets...");
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith("http")) {
    return;
  }

  // Cache first strategy for static assets
  if (CACHE_FIRST.some((pattern) => url.pathname.startsWith(pattern))) {
    event.respondWith(
      caches
        .match(request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(request).then((fetchResponse) => {
            // Check if we received a valid response
            if (
              !fetchResponse ||
              fetchResponse.status !== 200 ||
              fetchResponse.type !== "basic"
            ) {
              return fetchResponse;
            }

            const responseClone = fetchResponse.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
            return fetchResponse;
          });
        })
        .catch(() => {
          // Return a fallback for images if cache miss and network fails
          if (url.pathname.includes("/images/")) {
            return new Response(
              '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af">Image unavailable</text></svg>',
              { headers: { "Content-Type": "image/svg+xml" } }
            );
          }
        })
    );
    return;
  }

  // Network first strategy for API calls
  if (NETWORK_FIRST.some((pattern) => url.pathname.startsWith(pattern))) {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(request);
      })
    );
    return;
  }

  // Stale while revalidate for pages
  if (STALE_WHILE_REVALIDATE.some((pattern) => url.pathname === pattern)) {
    event.respondWith(
      caches.match(request).then((response) => {
        const fetchPromise = fetch(request).then((fetchResponse) => {
          // Check if we received a valid response
          if (
            fetchResponse &&
            fetchResponse.status === 200 &&
            fetchResponse.type === "basic"
          ) {
            const responseClone = fetchResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return fetchResponse;
        });
        return response || fetchPromise;
      })
    );
    return;
  }

  // Default: network first, fallback to cache
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});

// Handle background sync for offline functionality
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    console.log("Background sync triggered");
    // Handle background sync tasks here
  }
});

// Handle push notifications (if needed in the future)
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();
    console.log("Push notification received:", data);

    const options = {
      body: data.body,
      icon: "/images/logo.png",
      badge: "/images/logo.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey || 1,
      },
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event.notification);
  event.notification.close();

  event.waitUntil(clients.openWindow("/"));
});

console.log("Service Worker loaded successfully");
