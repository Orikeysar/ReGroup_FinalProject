
import { getMessaging } from "firebase/messaging/sw";
import { onBackgroundMessage } from "firebase/messaging/sw";
import { initializeApp } from "firebase/app";


const firebaseConfig = {
    apiKey: "AIzaSyB_u-ckmdMVbyVfWxSwQLQy7f8OVdSFFqQ",
    authDomain: "regroup-a4654.firebaseapp.com",
    databaseURL: "https://regroup-a4654-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "regroup-a4654",
    storageBucket: "regroup-a4654.appspot.com",
    messagingSenderId: "88302389135",
    appId: "1:88302389135:web:c6f541f2e7db86e2bcedfa",
    measurementId: "G-Z8J1Y1SEMN"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = getMessaging();

onBackgroundMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
