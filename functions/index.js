const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
app.use(bodyParser.json());
const cors = require("cors")({origin: true});
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
// send message by alert of groups
exports.alertGroupEdited = functions.https.onCall(async (data, context) => {
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
  // for testing purposes
  console.log("The request object is:", JSON.stringify(req.body));
  // enable CORS using the `cors` express middleware.
  cors(req, res, () => {
    // get contact form data from the req and then assigned it to variables
    const email = req.body.email;
    const subject = req.body.subject;
    const message = req.body.message;
    // config the email message
    const mailOptions = {
      from: "regroup.info.emails@gmail.com",
      to: email,
      subject: subject,
      text: message,
    };
    // call the built in sendMail function
    return transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send({
          data:
              {
                "status": 500,
                "message": error.toString(),
              }},
        );
      }
      return res.status(200).send( {
        data:
        {
          "status": 200,
          "message": "sent",
        }},
      );
    },
    );
  });
});
