// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging.js";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Minta izin untuk notifikasi
async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted.");
      // Dapatkan token perangkat
      const token = await getToken(messaging, { vapidKey: 'YOUR_PUBLIC_VAPID_KEY' });
      if (token) {
        console.log("FCM Token:", token);
        // Simpan token ke server
        await saveTokenToServer(token);
      } else {
        console.warn("Failed to get FCM token.");
      }
    } else {
      console.warn("Notification permission not granted.");
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
  }
}

// Simpan token ke server
async function saveTokenToServer(token) {
  try {
    const response = await fetch('/save-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    if (response.ok) {
      console.log("Token saved to server successfully.");
    } else {
      console.error("Failed to save token to server:", response.statusText);
    }
  } catch (error) {
    console.error("Error saving token to server:", error);
  }
}

// Tangani notifikasi saat aplikasi sedang aktif
onMessage(messaging, (payload) => {
  console.log("Message received. ", payload);
  const { title, body } = payload.notification;
  // Tampilkan notifikasi menggunakan Notification API
  new Notification(title, { body });
});

// Panggil fungsi untuk meminta izin
requestNotificationPermission();
