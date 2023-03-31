const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

// This function runs every day at 00:00 am
exports.scheduledFunction = functions.pubsub
    .schedule("0 0 * * *")
    .onRun(async (context) => {
      try {
        // Get a reference to the Firestore collection 'users'
        const usersCollection = admin.firestore().collection("users");

        // Get all the user documents from the collection
        const usersSnapshot = await usersCollection.get();

        // Loop through each user document and update the 'points' field to zero
        const batch = admin.firestore().batch();
        usersSnapshot.forEach((userDoc) => {
          const userRef = userDoc.ref;
          batch.update(userRef, {points: 0});
        });

        // Commit the batch update to Firestore
        await batch.commit();

        console.log("Points updated successfully");
        return null;
      } catch (error) {
        console.error("Error updating points:", error);
      }
    });
