const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();


const getUserEmail = functions.https.onRequest(async (req, resp) => {
  const docs = await admin
    .auth()
    .getUser(req.body.userId);

  resp.json({ email: docs.email });
});


exports.getUserEmail = getUserEmail;
