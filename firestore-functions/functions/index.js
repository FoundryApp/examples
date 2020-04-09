const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { IncomingWebhook } = require('@slack/webhook');

const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);

admin.initializeApp();

async function notifyMember(userId, message) {
  const userInfoSnapshot = await admin.firestore().collection('userInfos').doc(userId).get();
  if (!userInfoSnapshot.exists) {
    console.log(`Could not find member with userId ${userId}`);
  }
  const userInfo = userInfoSnapshot.data();
  if (userInfo.slackName) {
    const text = `@${userInfo.slackName}${message}`;
    await webhook.send({
      text,
    });
    console.log(`Slack message: ${text}`);
  } else {
    console.log(`User with id ${userId} has no slackName`);
  }
}

const notifyMembersInNewWorkspace = functions
  .firestore
  .document('workspaces/{workspaceId}')
  .onCreate(async (snapshot) => {
    const workspaceData = snapshot.data();
    const message = ` was added to the new workspace ${workspaceData.name}`;
    const members = workspaceData.members || [];
    const notifyPromises = members.map(async (member) => notifyMember(member, message));
    return Promise.all(notifyPromises);
  });

const notifyMembersAddedToWorkspace = functions
  .firestore
  .document('workspaces/{workspaceId}')
  .onUpdate(async (change) => {
    const beforeMembers = change.before.data().members || [];
    const afterMembers = change.after.data().members || [];
    const newMembers = afterMembers.filter((member) => !beforeMembers.includes(member));
    const message = ` was added to the workspace ${change.after.data().name}`;
    const notifyPromises = newMembers.map(async (member) => notifyMember(member, message));
    return Promise.all(notifyPromises);
  });

const notifyMembersInDeletedWorkspace = functions
  .firestore
  .document('workspaces/{workspaceId}')
  .onDelete(async (snapshot) => {
    const workspaceData = snapshot.data();
    const members = workspaceData.members || [];
    const message = ` was member in a deleted workspace ${workspaceData.name}`;
    const notifyPromises = [...members, workspaceData.owner].map((member) => notifyMember(member, message));
    return Promise.all(notifyPromises);
  });


exports.notifyMembersInNewWorkspace = notifyMembersInNewWorkspace;
exports.notifyMembersAddedToWorkspace = notifyMembersAddedToWorkspace;
exports.notifyMembersInDeletedWorkspace = notifyMembersInDeletedWorkspace;
