// Hamburger Menu
const menuIcon = document.getElementById('menu-icon');
const navbar = document.getElementById('navbar');

if (menuIcon && navbar) {
    menuIcon.addEventListener('click', () => {
        navbar.classList.toggle('active');
    });

    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
        });
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(registration => {
            console.log('Service Worker terdaftar:', registration);
        })
        .catch(error => {
            console.error('Pendaftaran Service Worker gagal:', error);
        });
}

// Install Prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installButton = document.getElementById('installButton');
    if (installButton) installButton.style.display = 'flex';
});

const installButton = document.getElementById('installButton');
if (installButton) {
    installButton.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User choice: ${outcome}`);
            deferredPrompt = null;
            installButton.style.display = 'none';
        }
    });
}

// IndexedDB
const dbName = 'contactDB';
const storeName = 'contacts';

async function openDatabase() {
    const request = indexedDB.open(dbName, 1);
    return new Promise((resolve, reject) => {
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { autoIncrement: true });
            }
        };
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

async function addContact(contact) {
    const db = await openDatabase();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    store.add(contact);
    return tx.complete;
}

// Form Submission
const contactForm = document.getElementById('contact-me');
if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const contact = {
            name: event.target.name.value,
            email: event.target.email.value,
        };
        try {
            await addContact(contact);
            alert('Pesan berhasil disimpan!');
            contactForm.reset();
        } catch (error) {
            console.error(error);
        }
    });
}
