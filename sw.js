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

// Install event
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installed');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Service Worker: Caching Files');
            return cache.addAll(urlsToCache);
        })
    );
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');
    // Cleanup old caches
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker: Clearing Old Cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Fetch event
self.addEventListener('fetch', (event) => {
    console.log('Service Worker: Fetching');
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseClone);
                });
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});

self.addEventListener('install', event => {
    console.log('Service Worker diinstall');
    self.skipWaiting();
  });
  
  self.addEventListener('activate', event => {
    console.log('Service Worker diaktifkan');
  });
  
  // Mendengarkan pesan dari app.js untuk menampilkan notifikasi
  self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
      showNotification();
    }
  });
  
  // Fungsi untuk menampilkan notifikasi
  function showNotification() {
    const title = 'Hallo!';
    const options = {
      body: 'Selamat Datang di Website PineFuel. See the product and check out now!',
      icon: '/path/to/image-icon.png'
    };
  
    // Menampilkan notifikasi
    self.registration.showNotification(title, options);
  }
  
  // Menangani klik pada notifikasi
  self.addEventListener('notificationclick', event => {
    event.notification.close(); // Menutup notifikasi saat diklik
    event.waitUntil(
      clients.openWindow('https://mufidra.github.io/Portofolio-PWA/') // URL yang akan dibuka saat notifikasi diklik
    );
  });
  
  
