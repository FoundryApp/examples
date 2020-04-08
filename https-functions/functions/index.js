const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const request = functions.https.onRequest(async (req, resp) => {
  const doc = await admin.firestore().collection('workspaces').doc('workspace1').get();
  console.log(doc.data());
  resp.send(req.body);
});

const call = functions.https.onCall(async (data) => {

  return data;
});

















exports.request = request;
exports.call = call;
