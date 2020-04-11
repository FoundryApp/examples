const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { IncomingWebhook } = require('@slack/webhook');

admin.initializeApp();

const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);


async function notifyMembers(userIds, message) {
  const slackNames = [];

  for (const userId of userIds) {
    const userInfoSnapshot = await admin
      .firestore()
      .collection('userInfos')
      .doc(userId)
      .get();

    if (!userInfoSnapshot.exists) {
      console.log(`Could not find member with userId "${userId}"`);
      continue;
    }

    const userInfo = userInfoSnapshot.data();
    console.log(userInfo);
    if (userInfo.slackName) {
      slackNames.push(`@${userInfo.slackName}`);
    } else {
      console.log(`User "${userId}" has no slackName`);
    }
  }

  if (slackNames.length > 0) {
    const text = slackNames.join(', ') + message;
    await webhook.send({
      text,
    });
    console.log(`Slack message: ${text}`);
  }
}


const notifyMembersInNewWorkspace = functions
  .firestore
  .document('workspaces/{workspaceId}')
  .onCreate(async (snapshot) => {
    const workspaceData = snapshot.data();

    const members = workspaceData.members || [];

    const message = ` added to a new workspace "${workspaceData.name}"`;

    return notifyMembers(members, message);
  });


const notifyMembersAddedToWorkspace = functions
  .firestore
  .document('workspaces/{workspaceId}')
  .onUpdate(async (change) => {
    const workspaceBeforeData = change.before.data();
    const workspaceAfterData = change.after.data();
    const membersBefore = workspaceBeforeData.members || [];
    const membersAfter = workspaceAfterData.members || [];
    const newMembers = membersAfter.filter((member) => !membersBefore.includes(member));

    const message = ` added to an existing workspace "${change.after.data().name}"`;

    return notifyMembers(newMembers, message);
  });

const notifyMembersInDeletedWorkspace = functions
  .firestore
  .document('workspaces/{workspaceId}')
  .onDelete(async (snapshot) => {
    const workspaceData = snapshot.data();

    const members = workspaceData.members || [];

    const message = ` was/were in a deleted workspace "${workspaceData.name}"`;

    return notifyMembers(members, message);
  });


exports.notifyMembersInNewWorkspace = notifyMembersInNewWorkspace;
exports.notifyMembersAddedToWorkspace = notifyMembersAddedToWorkspace;
exports.notifyMembersInDeletedWorkspace = notifyMembersInDeletedWorkspace;
