// Subir este número cada vez que se publique una versión nueva del juego,
// para que los dispositivos que ya instalaron la app cojan los cambios.
const CACHE_NAME = "tablas-multiplicar-v17";

const ASSETS = [
  "./",
  "./index.html",
  "./imprimir.html",
  "./game-logic.js",
  "./manifest.json",
  "./manifest.en.json",
  "./manifest.de.json",
  "./manifest.zh.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/hoja-tablas-multiplicar-1-10-es.png",
  "./icons/hoja-tablas-multiplicar-1-10-en.png",
  "./icons/hoja-tablas-multiplicar-1-10-de.png",
  "./icons/hoja-tablas-multiplicar-1-10-zh.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        ASSETS.map((url) =>
          fetch(url, { cache: "reload" })
            .then((res) => cache.put(url, res))
            .catch(() => {})
        )
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
