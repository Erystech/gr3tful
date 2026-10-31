const CACHE_NAME = "gr3tful-static-v2-g3";
const OFFLINE_URL = "/offline.html";
const PRECACHE_URLS = [
  OFFLINE_URL,
  "/manifest.webmanifest",
  "/brand/icon-192.png",
  "/brand/icon-512.png",
  "/brand/icon-maskable-512.png",
  "/brand/mark.svg",
  "/brand/logo-on-light.svg",
  "/brand/logo-on-dark.svg",
  "/brand/wordmark-on-light.svg",
  "/brand/wordmark-on-dark.svg",
  "/brand/favicon.svg",
  "/brand/notification-badge.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
      }
      return response;
    }))
  );
});

self.addEventListener("push", (event) => {
  let message = {};
  try { message = event.data?.json() ?? {}; } catch { /* Use generic text. */ }
  const title = message.kind === "streak" ? "Keep your streak going ❤️" : "A moment to be Gr3tful ✨";
  const body = message.kind === "streak"
    ? "Today is almost over. Write your gratitudes to keep your streak."
    : "What are three things you're grateful for today?";
  event.waitUntil(self.registration.showNotification(title, {
    body,
    icon: "/brand/icon-192.png",
    badge: "/brand/notification-badge.png",
    tag: `gr3tful-${message.kind || "reminder"}-${message.date || "today"}`,
    data: { url: "/entry" },
  }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(async (windows) => {
    const existing = windows.find((client) => new URL(client.url).origin === self.location.origin);
    if (existing) {
      await existing.focus();
      return existing.navigate("/entry");
    }
    return self.clients.openWindow("/entry");
  }));
});
