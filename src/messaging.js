import { db, messaging } from './FirebaseSDK';
import { doc, setDoc } from 'firebase/firestore';
import { getToken, onMessage } from 'firebase/messaging';
import { toast } from 'react-toastify';

const VAPID_KEY = "BMKJvycjE-kKNIovHIzMJ7qjdfnEPZITCQiL32EPKuCPRVIc7IWFTqOzIk52Ex9z9G8fciZHLaIkNvia5ys7f04";
// Requests permissions to show notifications.
async function requestNotificationsPermissions(uid) {
  console.log('Requesting notifications permission...');
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    console.log('Notification permission granted.');
    // Notification permission granted.
    await saveMessagingDeviceToken(uid);
  } else {
    console.log('Unable to get permission to notify.');
  }
}

// Saves the messaging device token to Cloud Firestore.
export async function saveMessagingDeviceToken(uid) {
  console.log('save msg device token');

  try {
    const msg = await messaging();
    const fcmToken = await getToken(msg, { vapidKey: VAPID_KEY });
    if (fcmToken) {
      console.log('Got FCM device token:', fcmToken);
      // Save device token to Firestore
      const tokenRef = doc(db, "fcmTokens", uid);
      await setDoc(tokenRef, {
        fcmToken:fcmToken
      } );
      // This will fire when a message is received while the app is in the foreground.
      // When the app is in the background, firebase-messaging-sw.js will receive the message instead.
      onMessage(msg, (message) => {
        console.log(
          'New foreground notification from Firebase Messaging!',
          message.notification
        );
        throw toast( message.notification.body );
      });
    } else {
      // Need to request permissions to show notifications.
      requestNotificationsPermissions(uid);
    }
  } catch (error) {
    console.error('Unable to get messaging token.', error);
    requestNotificationsPermissions(uid);
  };
}