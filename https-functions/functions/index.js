const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

admin.initializeApp();

async function sendEmail(text, to, from) {
  return sgMail.send({
    to,
    from,
    subject: 'Workspace email',
    text,
  });
}

const askForWorkspaceInvite = functions.https.onRequest(async (req, resp) => {
  if (!req.body.workspaceId) {
    resp.status(400).send('Workspace not specified');
    return;
  }
  if (!req.body.email) {
    resp.status(400).send('Email not specified');
    return;
  }
  const workspaceSnapshot = await admin.firestore().collection('workspaces').doc(req.body.workspaceId).get();
  const workspaceData = workspaceSnapshot.data();
  if (!workspaceData.owner) {
    resp.status(400).send('Workspace has no owner');
    return;
  }
  try {
    const ownerRecord = await admin.auth().getUser(workspaceData.owner);
    if (ownerRecord.email) {
      const messageToOwner = `User with email ${req.body.email} asked for invite into your workspace ${workspaceData.name}`;
      const messageToRequester = `Your invitation to the workspace ${workspaceData.name} was sent to ${ownerRecord.email}`;
      await sendEmail(messageToOwner, ownerRecord.email, req.body.email);
      await sendEmail(messageToRequester, req.body.email, ownerRecord.email);
      resp.status(200).json({
        message: 'Request has been sent to the workspace owner',
        ownerEmail: ownerRecord.email,
      });
      return;
    }
    resp.status(400).send('Could not contanct workspace owner');
  } catch (error) {
    console.log(error);
    resp.status(400).send('Workspace owner is not a valid user');
  }
});

const changeWorkspaceOwner = functions.https.onCall(async (data, context) => {
  const userId = context.auth.uid;
  const workspaceSnapshot = await admin.firestore().collection('workspaces').doc(data.workspaceId).get();
  if (!workspaceSnapshot.exists) {
    throw new functions.https.HttpsError('invalid-argument');
  }
  const workspaceData = workspaceSnapshot.data();
  if (userId === workspaceData.owner) {
    try {
      const newOwnerRecord = await admin.auth().getUser(data.newOwner);
      await admin.firestore().collection('workspaces').doc(data.workspaceId).update({ owner: data.newOwner })
    } catch (error) {
      throw new functions.https.HttpsError('invalid-argument');
    }
  } else {
    throw new functions.https.HttpsError('permission-denied');
  }
});

exports.changeWorkspaceOwner = changeWorkspaceOwner;
exports.askForWorkspaceInvite = askForWorkspaceInvite;
