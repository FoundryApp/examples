const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

admin.initializeApp();


console.log(process.env.var1);
console.log(process.env.var2);


async function sendEmail(text, to, from) {
  return sgMail.send({
    to,
    from,
    subject: 'Workspace email',
    text,
  });
}






const askForWorkspaceInvite = functions.https.onRequest(async (req, resp) => {
  if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  } else {
    resp.status(500).send('Could not find SENDGRID_API_KEY env var');
    return;
  }

  if (!req.body.workspaceId) {
    resp.status(400).send('Workspace not specified');
    return;
  }

  if (!req.body.email) {
    resp.status(400).send('Email not specified');
    return;
  }

  const workspaceSnapshot = await admin
    .firestore()
    .collection('workspaces')
    .doc(req.body.workspaceId)
    .get();

  const workspaceData = workspaceSnapshot.data();

  if (!workspaceData.owner) {
    resp.status(400).send('Workspace has no owner');
    return;
  }

  try {
    const ownerRecord = await admin
      .auth()
      .getUser(workspaceData.owner);

    if (ownerRecord.email) {
      const messageToOwner = `User with email ${req.body.email} asked for invite into your workspace ${workspaceData.name}`;
      const messageToRequester = `Your invitation to the workspace ${workspaceData.name} was sent to ${ownerRecord.email}`;

      try {
        await sendEmail(messageToOwner, ownerRecord.email, req.body.email);
        await sendEmail(messageToRequester, req.body.email, ownerRecord.email);
      } catch (error) {
        resp.status(error.code).send(error.response.body);
        return;
      }

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

  const workspaceSnapshot = await admin
    .firestore()
    .collection('workspaces')
    .doc(data.workspaceId)
    .get();

  if (!workspaceSnapshot.exists) {
    throw new functions.https.HttpsError('invalid-argument', 'Workspace does not exist');
  }

  const workspaceData = workspaceSnapshot.data();

  console.log(workspaceData);
  if (userId === workspaceData.owner) {
    try {
      const newOwnerRecord = await admin
        .auth()
        .getUser(data.newOwner);

      await admin
        .firestore()
        .collection('workspaces')
        .doc(data.workspaceId)
        .update({ owner: data.newOwner })

    } catch (error) {
      throw new functions.https.HttpsError('invalid-argument', 'New owner is not a valid existing user');
    }
  } else {
    throw new functions.https.HttpsError('permission-denied', 'Current user is not the owner of the workspace');
  }
});

exports.changeWorkspaceOwner = changeWorkspaceOwner;
exports.askForWorkspaceInvite = askForWorkspaceInvite;
