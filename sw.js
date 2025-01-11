const CACHE_NAME = 'portfolio-cache-v1';
const precachedAssets = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/images/image.jpg',
    '/images/background.jpg',
    '/images/image-icon.png',
    '/app.js',
    '/manifest.json',
    '/images/imageabout.jpg',
    '/images/briket-icon.png',
    '/images/ramah-lingkungan-icon.png',
    '/images/pesanan-mudah-icon.png',
    '/images/layanan-icon.png',
    '/images/bricket1pck.jpg',
    '/images/bricket3pck.jpg',
    '/images/bricket5pck.jpg',
    '/images/team1.jpg',
    '/images/team2.jpg',
    '/images/team3.jpg',
    '/images/team4.jpg',
    '/images/team5.jpg',
    '/images/team6.jpg',
];

self.addEventListener('install', (event) => {
    console.log("Service Worker diinstall");
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Service Worker: Precaching App Shell");
            return cache.addAll(precachedAssets);
        }).catch((error) => {
            console.error("Cache addAll failed: ", error);
        })
    );
});

self.addEventListener('activate', (event) => {
    console.log("Service Worker diaktifkan");
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log(Menghapus cache lama: ${cacheName});
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log("Cache lama sudah dibersihkan.");
        }).catch((error) => {
            console.error("Error during cache deletion:", error);
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.method === 'GET') {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((cachedResponse) => {
                    const fetchPromise = fetch(event.request).then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    });
                    return cachedResponse || fetchPromise;
                });
            })
        );
    } else {
        event.respondWith(fetch(event.request));
    }
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        showNotification();
    }
});

function showNotification() {
    const title = 'Hallo!';
    const options = {
        body: 'Selamat Datang di Website PineFuel. See the product and check out now!',
        icon: '/images/image-icon.png',
    };

    self.registration.showNotification(title, options);
}

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('https://pine-fuel.vercel.app/') // URL diperbaiki
    );
});
