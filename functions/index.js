const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

const database = admin.firestore();
exports.scheduledFunction = functions.pubsub
    .schedule("0 0 * * *")
    .onRun((context) => {
      database.doc("users/MZweJTkSdsf3HaSaSeMR70lOTzX2").update({points: 100});
      return null;
    });
