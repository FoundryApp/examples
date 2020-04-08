const functions = require('firebase-functions');
const admin = require('firebase-admin');


const hello = functions.https.onRequest(async (req, resp) => {
    // const docs = await admin.firestore().collection('foundryapp-auth-3070032769').get();
    // const docs = await admin.auth().getUser('jcMG7Nw4SScjvfcu7wNHkhF9o1z2');
    const app = admin.initializeApp();
    const docs = await app.auth().getUser('jcMG7Nw4SScjvfcu7wNHkhF9o1z2');
    console.log(docs);







    resp.send();
});



exports.hello = hello;