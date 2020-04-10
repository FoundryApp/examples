const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();


const listCollectionsDocs = functions.https.onRequest(async (req, resp) => {
  try {
    for (const collection of req.body.collections) {
      console.log(`\n${collection} docs:`);
      const docs = await admin
        .firestore()
        .collection(collection)
        .get();

      docs.forEach((doc) => {
        console.log(' ', doc.id)
      });
    }
  } catch (error) {
    console.log(error);
  }

  resp.send();
});


exports.listCollectionsDocs = listCollectionsDocs;
