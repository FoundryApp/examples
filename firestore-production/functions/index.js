const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const hello = functions.https.onRequest(async (req, resp) => {
    const docs = await admin.firestore().collection('workspaces').get();
    docs.forEach((doc) => console.log(doc.id));
    resp.send();
});

exports.hello = hello;