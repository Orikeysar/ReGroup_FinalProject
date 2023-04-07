const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
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

// Define the function that will send message
exports.onButtonClick = functions.https.onCall(async (data, context) => {
  // Get the user ID from the client-side
  const token = data.token;
  const friendRequstUrl = `https://regroup-a4654.web.app/myFriends`; // Add this line to get the friend profile URL from the client-side
  const message = "you have a friend request from another user";
  const payload = {
    token,
    notification: {
      title: "ReGroup",
      body: message,
      click_action: `FLUTTER_NOTIFICATION_CLICK?url=${friendRequstUrl}`, // Modify this line to include the friend profile URL as a query parameter
    },
    webpush: {
      fcm_options: {
        link: friendRequstUrl
      }
  }
};
  console.log(payload);
  admin.messaging().send(payload).then((response) => {
    // Response is a message ID string.
    functions.logger.log("Successfully sent message: ", response);
  }).catch((error) => {
    functions.logger.log("error: ", error);
  });
});

// send message by alert of groups
exports.alertGroupAdded = functions.https.onCall(async (data, context) => {
  // Get the user ID from the client-side
  const token=data.token;
  const title=data.title;
  const message=data.message;
  const payload = {
    token,
    notification: {
      title: title,
      body: message,
    },
  };
  console.log(payload);
  admin.messaging().send(payload).then((response) => {
    // Response is a message ID string.
    functions.logger.log("Successfully sent message: ", response);
  }).catch((error) => {
    functions.logger.log("error: ", error);
  });
});
