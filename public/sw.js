/* Nunki — Service Worker
 * Cache-first: app shell
 * Network-first: JSON data (fresh when online, cache when offline)
 */

const SHELL_CACHE = 'nunki-shell-v6';
const DATA_CACHE = 'nunki-data-v6';

const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

function getBase() {
  const path = self.location.pathname;
  return path.endsWith('sw.js') ? path.replace(/sw\.js$/, '') || '/' : '/';
}

// Install: cache app shell + assets from index.html (so offline works even on first open)
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(SHELL_CACHE).then((cache) =>
      cache.addAll(SHELL_ASSETS).catch(() => {}).then(() =>
        fetch(new URL('index.html', self.location.origin + getBase()))
          .then((r) => r.text())
          .then((html) => {
            const assets = [];
            const re = /(?:src|href)="(\/assets\/[^"]+)"/g;
            let m;
            while ((m = re.exec(html))) assets.push(m[1]);
            return assets.length ? cache.addAll(assets.map((p) => new URL(p, self.location.origin).href)) : Promise.resolve();
          })
          .catch(() => {})
      )
    ).then(() => self.skipWaiting())
  );
});

// Activate: claim clients
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k.startsWith('nunki-') && k !== SHELL_CACHE && k !== DATA_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first for shell, stale-while-revalidate for /data/
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;

  // App shell: cache-first
  if (url.pathname === '/' || url.pathname === '/index.html' || url.pathname === '/manifest.json') {
    e.respondWith(
      caches.match(e.request).then((cached) => cached || fetch(e.request))
    );
    return;
  }

  // JSON data: network-first (fresh when online, cache when offline)
  if (url.pathname.startsWith('/data/')) {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          if (res.ok) {
            return caches.open(DATA_CACHE).then((cache) => {
              cache.put(e.request, res.clone());
              return res;
            });
          }
          return res;
        })
        .catch(() =>
          caches.open(DATA_CACHE).then((cache) =>
            cache.match(e.request).then((cached) =>
              cached || new Response(JSON.stringify({ error: 'offline' }), {
                status: 503,
                headers: { 'Content-Type': 'application/json' },
              })
            )
          )
        )
    );
    return;
  }

  // Assets (JS, CSS): cache-first
  if (url.pathname.startsWith('/assets/')) {
    e.respondWith(
      caches.match(e.request).then((cached) =>
        cached || fetch(e.request).then((res) => {
          const clone = res.clone();
          caches.open(SHELL_CACHE).then((c) => c.put(e.request, clone));
          return res;
        })
      )
    );
    return;
  }
});
