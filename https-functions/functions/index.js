const functions = require('firebase-functions');

const request = functions.https.onRequest(async (req, resp) => {

  resp.json(req.body);
});

const call = functions.https.onCall(async (data) => {

  return data;
});

exports.request = request;
exports.call = call;
