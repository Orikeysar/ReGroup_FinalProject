// const functions = require('firebase-functions');

// exports.makeUppercase = functions.database.ref('/top10/{top10}')
//     .onWrite((change, context) => {
//       // Only edit data when it is first created.
//       if (change.before.exists()) {
//         return null;
//       }
//       // Exit when the data is deleted.
//       if (!change.after.exists()) {
//         return null;
//       }
//       // Grab the current value of what was written to the Realtime Database.
//       const original = change.after.val();
//       console.log('Uppercasing', context.params.pushId, original);
//       const uppercase = original.toUpperCase();
//       // You must return a Promise when performing asynchronous tasks inside a Functions such as
//       // writing to the Firebase Realtime Database.
//       // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
//       return change.after.ref.parent.child('uppercase').set(uppercase);
//     });