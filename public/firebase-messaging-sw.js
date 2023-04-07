importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

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
firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});