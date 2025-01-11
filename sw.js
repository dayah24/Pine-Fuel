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

// Install event - Precaching assets
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

// Activate event - Cleanup old caches
self.addEventListener('activate', (event) => {
    console.log("Service Worker diaktifkan");
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log(`Menghapus cache lama: ${cacheName}`);
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

// Fetch event - Cache with Network Fallback
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

// Show Notification Handler
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        const { title, body, icon, url } = event.data;
        showNotification(title, body, icon, url);
    }
});

function showNotification(title = 'Hallo!', body = 'Selamat Datang di Website PineFuel. See the product and check out now!', icon = '/images/image-icon.png', url = 'https://pine-fuel.vercel.app/') {
    const options = {
        body: body,
        icon: icon,
        data: { url }
    };
    self.registration.showNotification(title, options);
}

// Handle Notification Click
self.addEventListener('notificationclick', (event) => {
    const url = event.notification.data.url || '/';
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            for (let client of clientList) {
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});

// Firebase Cloud Messaging Integration (Optional)
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging.js');

// Firebase Config
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background notifications
messaging.onBackgroundMessage((payload) => {
    console.log('[Service Worker] Received background message:', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon,
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});
