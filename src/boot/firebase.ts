// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getMessaging, isSupported as isMessagingSupported } from 'firebase/messaging';
// import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration for sistemaiotitch
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
console.log('Variables de entorno:', {
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
});

const app = initializeApp(firebaseConfig);

// Initialize Firebase Messaging
let messaging: ReturnType<typeof getMessaging> | null = null;
console.log('Inicializando Firebase Messaging...');
void isMessagingSupported().then((yes) => {
  console.log('Messaging soportado:', yes);
  if (yes) {
    messaging = getMessaging(app);
    console.log('Firebase Messaging inicializado');
  } else {
    console.log('Firebase Messaging no soportado en este navegador');
  }
});

// const analytics = getAnalytics(app);

export { messaging };
export default app;
