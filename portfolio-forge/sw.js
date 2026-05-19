/**
 * Service Worker — caches the app so it works offline after the first visit.
 *
 * Strategy:
 *   - Precache the app shell on install.
 *   - Cache-first for same-origin requests, with network fallback.
 *   - Network-first for the JSZip CDN script (with cache fallback for offline).
 */

const CACHE_VERSION = "v1";
const CACHE_NAME = `portfolio-forge-${CACHE_VERSION}`;

const APP_SHELL = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/app.js",
  "./js/detect.js",
  "./js/templates.js",
  "./js/generator.js",
  "./manifest.webmanifest",
  "./assets/icon.svg",
  "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(APP_SHELL).catch(() => {
        // If even one fails (e.g. CDN unreachable on first install), don't block install
      })
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          // Cache successful responses for same-origin + jszip CDN
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => {
          // Offline fallback for navigation requests
          if (req.mode === "navigate") return caches.match("./index.html");
          return new Response("", { status: 504, statusText: "Offline" });
        });
    })
  );
});
