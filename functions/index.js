const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const nodemailer = require("nodemailer");
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
  const token = data;
  const payload = {
    "token": token,
    "notification": {
      "title": "You got a friend request",
      "body": "click here to see the request",
    },
    "webpush": {
      "fcm_options": {
        "link": "https://regroup-a4654.web.app/myFriends",
      },
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
// Create a transporter object using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "regroup.info.emails@gmail.com",
    pass: "utujrywqkzbptzet",
  },
});
// Create a function to send email
exports.sendMailOverHTTP = functions.https.onRequest((req, res) => {
  const mailOptions = {
    from: "regroup.info.emails@gmail.com",
    to: "naorori1212@gmail.com",
    subject: "contact form message",
    html: "<h1>Order Confirmation</h1>",
  };
  return transporter.sendMail(mailOptions, (error, data) => {
    if (error) {
      return res.send(error.toString());
    }
    const data1 = JSON.stringify(data);
    return res.send(`Sent! ${data1}`);
  });
});
