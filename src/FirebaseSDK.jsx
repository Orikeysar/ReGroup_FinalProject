// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
import { getMessaging, isSupported } from 'firebase/messaging';
import firebase from 'firebase/compat/app'
import { getFunctions,httpsCallable } from 'firebase/functions';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
// eslint-disable-next-line no-unused-vars
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const messaging = async () => await isSupported() && getMessaging(app);
const functions = getFunctions(app);
export const onButtonClick = httpsCallable(functions, 'onButtonClick');
export const alertGroupAdded = httpsCallable(functions, 'alertGroupAdded');

