const functions = require('firebase-functions');
const admin = require('firebase-admin');

const checkUser = functions.https.onRequest(async (req, resp) => {
  const app = admin.initializeApp();
  const docs = await app.auth().getUser(req.body.userId);
  resp.send(docs.email);
});

exports.checkUser = checkUser;
