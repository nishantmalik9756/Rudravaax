
const CACHE_NAME = "rudravaax-v1.0.31";

const PRECACHE_FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./images/logo0.jpeg",
    "./images/logo1.png"
];

// ==================================
// INSTALL
// ==================================

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(PRECACHE_FILES))
            .then(() => self.skipWaiting())
    );
});

// ==================================
// ACTIVATE
// ==================================

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

// ==================================
// FETCH
// ==================================

self.addEventListener("fetch", event => {

    const request = event.request;
    const url = new URL(request.url);

    // Only GET requests
    if (request.method !== "GET") return;

    // Only same-origin requests
    if (url.origin !== self.location.origin) return;

    // Music files ko cache nahi karna
    if (
        url.pathname.includes("/music/") ||
        /\.(mp3|wav|flac|m4a|aac|ogg)$/i.test(url.pathname)
    ) {
        return;
    }

    // ==================================
    // HTML PAGES - NETWORK FIRST
    // ==================================

    if (request.mode === "navigate") {

        event.respondWith(
            fetch(request)
                .then(response => {

                    if (response.ok) {
                        const copy = response.clone();

                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(request, copy);
                        });
                    }

                    return response;
                })
                .catch(async () => {

                    return await caches.match(request) ||
                           await caches.match("./index.html");
                })
        );

        return;
    }

    // ==================================
    // CSS, JS, IMAGES - CACHE FIRST
    // ==================================

    event.respondWith(
        caches.match(request).then(cachedResponse => {

            const networkRequest = fetch(request)
                .then(response => {

                    if (response.ok) {
                        const copy = response.clone();

                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(request, copy);
                        });
                    }

                    return response;
                });

            return cachedResponse || networkRequest;
        })
    );

});
