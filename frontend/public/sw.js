// Service worker de Memoria del Comal (PP-12): consulta sin conexión de lo ya visitado.
// Subir CACHE_VERSION invalida las cachés anteriores al activarse.
const CACHE_VERSION = 'v2';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const PAGES_CACHE = `pages-${CACHE_VERSION}`;
const API_CACHE = `api-${CACHE_VERSION}`;
const OFFLINE_URL = '/offline';
const PRECACHE_URLS = [OFFLINE_URL, '/', '/icons/icon-192.png'];

// Solo se guardan lecturas públicas de recetas y comentarios, nunca datos de la sesión
const CACHEABLE_API = [/\/api\/recipes(\/|\?|$)/, /\/api\/interactions\/recipes\/[^/]+\/comments$/];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(PAGES_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  const current = [STATIC_CACHE, PAGES_CACHE, API_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !current.includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    throw error;
  }
}

function offlineApiResponse() {
  return new Response(
    JSON.stringify({ statusCode: 503, message: 'Sin conexión. Esta receta aún no se ha consultado en este dispositivo.' }),
    { status: 503, headers: { 'Content-Type': 'application/json' } },
  );
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (url.origin === self.location.origin) {
    if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/icons/')) {
      event.respondWith(cacheFirst(request, STATIC_CACHE));
      return;
    }

    // Documentos HTML y cargas RSC de la navegación del App Router
    if (request.mode === 'navigate' || request.headers.get('RSC') === '1') {
      event.respondWith(
        networkFirst(request, PAGES_CACHE).catch(async () => {
          if (request.mode === 'navigate') {
            return (await caches.match(OFFLINE_URL)) || Response.error();
          }
          return Response.error();
        }),
      );
    }
    return;
  }

  if (CACHEABLE_API.some((pattern) => pattern.test(url.pathname + url.search))) {
    event.respondWith(networkFirst(request, API_CACHE).catch(offlineApiResponse));
  }
});
