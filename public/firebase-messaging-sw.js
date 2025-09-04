// Firebase Messaging Service Worker
// Este archivo debe estar en la carpeta public/ para que Firebase lo encuentre

/* eslint-disable no-undef */
// Importar Firebase usando la sintaxis de compatibilidad para service workers
importScripts('https://www.gstatic.com/firebasejs/12.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.1.0/firebase-messaging-compat.js');

// Configuración de Firebase para el proyecto sistemaiotitch
const firebaseConfig = {
  apiKey: 'AIzaSyCkc2oRYXIxEoverE0S7jRReJg5ao02b4U',
  authDomain: 'sistemaiotitch.firebaseapp.com',
  projectId: 'sistemaiotitch',
  storageBucket: 'sistemaiotitch.firebasestorage.app',
  messagingSenderId: '743495962731',
  appId: '1:743495962731:web:83c550245a1cb9053ee12e',
  measurementId: 'G-LG82YQ717F',
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Manejar mensajes push cuando la app está en background
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'Nueva notificación';
  const notificationOptions = {
    body: payload.notification?.body || 'Tienes un nuevo mensaje',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    data: payload.data || {},
  };


  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Manejar clicks en notificaciones
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);

  event.notification.close();

  // Abrir la app cuando se hace click en la notificación
  event.waitUntil(clients.openWindow('/'));
});

// Manejar instalación del service worker
self.addEventListener('install', () => {
  console.log('Service Worker instalado');
  self.skipWaiting();
});

// Manejar activación del service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activado');
  event.waitUntil(clients.claim());
});
/* eslint-enable no-undef */
