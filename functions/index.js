const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const FCM_TOKEN_COLLECTION = "fcmTokens";
const FCM_TOKEN_KEY = "fcmToken";
// runs every day at 00:00 am and reset the actionsNuumber for users
exports.scheduledFunction = functions.pubsub
    .schedule("0 0 * * *")
    .onRun(async (context) => {
      const usersSnapshot = await admin.firestore().collection("users").get();
      const users = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        userAchievements: doc.data().userAchievements || [],
      }));

      const promises = users.map((user) => {
        const achievements = user.userAchievements.map((achievement) => {
          if (achievement.actionsNumber !== undefined) {
            return {...achievement, actionsNumber: 0};
          } else {
            return achievement;
          }
        });

        return admin.firestore().doc(`users/${user.id}`).update({
          userAchievements: achievements,
        });
      });

      await Promise.all(promises);
      console.log("Actions number reset complete");
    });

    exports.onButtonClick = functions.https.onCall(async (data, context) => {
      try {
        // Get the user ID from the client-side
        const userId = data.userId;
        
        // Get the FCM token for the user
        const documentSnapshot = await admin.firestore().collection(FCM_TOKEN_COLLECTION).doc(userId).get();
        const token = documentSnapshot.get(FCM_TOKEN_KEY);
        
        // Send the notification
        const message = "ITS WORKS!!!";
        const payload = {
          token,
          notification: {
            title: "ReGroup",
            body: message,
          },
        };
        
        const response = await admin.messaging().send(payload);
        functions.logger.log("Successfully sent message: ", response);
        return "Message sent successfully!";
      } catch (error) {
        functions.logger.log("Error sending message: ", error);
        throw new functions.https.HttpsError("internal", "Error sending message");
      }
    });
    
