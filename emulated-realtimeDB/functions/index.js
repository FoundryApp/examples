const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const listReferenceChildren = functions.https.onRequest(async (req, resp) => {
  try {
    admin.database().ref().once('value', (snapshot) => {
      console.log(snapshot.val());
    });
  } catch (error) {
    console.log(error);
  }

  resp.send();
});

exports.listReferenceChildren = listReferenceChildren;
