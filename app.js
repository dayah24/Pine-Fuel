// JavaScript untuk Hamburger Menu
const menuIcon = document.getElementById('menu-icon');
const navbar = document.getElementById('navbar');

// Toggle navbar saat hamburger di-klik
menuIcon.addEventListener('click', () => {
    navbar.classList.toggle('active');
});

// Tutup navbar saat link di-klik
const navLinks = document.querySelectorAll('.navbar a'); // Perbaiki selector
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('active');
    });
});

// Pilih semua link di dalam navbar
const navbarLinks = document.querySelectorAll('.navbar a');

// Fungsi untuk menambahkan class 'active' pada link yang diklik
function setActiveLink() {
    navbarLinks.forEach(link => {
        // Hapus 'active' dari semua link
        link.classList.remove('active');
    });
    // Tambahkan 'active' pada link yang diklik
    this.classList.add('active');
}

// Tambahkan event listener pada setiap link
navbarLinks.forEach(link => {
    link.addEventListener('click', setActiveLink);
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
            console.log('Service Worker berhasil didaftarkan:', registration);
        })
        .catch((error) => {
            console.error('Pendaftaran Service Worker gagal:', error);
        });
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById('installButton').style.display = 'flex';
});

document.getElementById('installButton').addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        deferredPrompt = null;
        document.getElementById('installButton').style.display = 'none';
    }
});

// IndexedDB //
const dbName = 'contactDB';
const storeName = 'contacts';

// Fungsi untuk membuka database IndexedDB
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                // Buat object store tanpa keyPath, gunakan autoIncrement
                db.createObjectStore(storeName, { autoIncrement: true });
                console.log(`Object store "${storeName}" created`);
            }
        };

        request.onsuccess = (event) => {
            console.log('Database opened successfully');
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            console.error('Database error:', event.target.errorCode);
            reject(new Error(`Database error: ${event.target.errorCode}`));
        };
    });
}

// Fungsi untuk menambahkan kontak ke IndexedDB
async function addContact(contact) {
    const db = await openDatabase(); // Buka database
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const request = store.add(contact);

        request.onsuccess = () => {
            console.log('Contact successfully added:', contact);
            resolve();
        };

        request.onerror = (event) => {
            console.error('Error adding contact:', event.target.error);
            alert(`Database error: ${event.target.error}`);
            reject(new Error(`Error adding contact: ${event.target.errorCode}`));
        };

        tx.oncomplete = () => {
            console.log('Transaction completed successfully');
        };

        tx.onerror = (event) => {
            console.error('Transaction error:', event.target.error);
            alert(`Transaction error: ${event.target.error}`);
            reject(new Error('Transaction error'));
        };
    });
}

// Fungsi untuk mendapatkan semua data dari IndexedDB
async function getAllContacts() {
    const db = await openDatabase(); // Buka database
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = (event) => {
            resolve(event.target.result); // Kembalikan semua data
        };

        request.onerror = (event) => {
            console.error('Error fetching contacts:', event.target.error);
            reject(new Error(`Error fetching contacts: ${event.target.errorCode}`));
        };
    });
}

// Fungsi untuk mengirimkan form
async function submitContactForm(event) {
    event.preventDefault();
    console.log('Submitting form...');

    const form = event.target;
    const contactData = {
        name: form.elements['name'].value.trim(),
        email: form.elements['email'].value.trim(),
        phone: form.elements['no_telepon'].value.trim(),
        product: form.elements['nama_produk'].value.trim(),
        quantity: form.elements['jumlah_produk'].value.trim(),
        address: form.elements['alamat'].value.trim(),
        paymentMethod: form.elements['paymentMethod'].value,
        message: form.elements['message'].value.trim() || ''
    };

    console.log('Contact data:', contactData);

    try {
        await addContact(contactData);
        alert('Pesan berhasil dikirim dan tersimpan di database!');
        form.reset();
    } catch (error) {
        console.error('Error in submitContactForm:', error);
        alert('Terjadi kesalahan saat menyimpan data. Coba lagi.');
    }
}

// Fungsi untuk menguji getAllContacts (Debugging)
async function testGetAllContacts() {
    try {
        const contacts = await getAllContacts();
        console.log('All contacts from IndexedDB:', contacts);
    } catch (error) {
        console.error('Error in testGetAllContacts:', error);
    }
}

// Tambahkan event listener ke form
document.getElementById('contact-me').addEventListener('submit', submitContactForm);

// Debugging tambahan: panggil testGetAllContacts untuk melihat data di console
testGetAllContacts();

// Memeriksa apakah service worker didukung oleh browser
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('https://mufidacv-pwa.vercel.app/sw.js')
      .then(registration => {
        console.log('Service Worker terdaftar:', registration);
      })
      .catch(error => {
        console.error('Pendaftaran Service Worker gagal:', error);
      });
  }
  
  // Meminta izin notifikasi secara otomatis saat halaman dimuat
  if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Izin notifikasi diberikan');
        // Jika izin diberikan, kirim pesan ke service worker untuk menampilkan notifikasi
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'SHOW_NOTIFICATION'
          });
        }
      } else {
        console.log('Izin notifikasi ditolak atau belum dipilih.');
    }
});
} else {
console.log('Browser tidak mendukung Notification API.');
}  
