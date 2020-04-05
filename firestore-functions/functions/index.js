const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const notifyInvitedWorkspaceMembers = functions.firestore.document('workspaces/{workspaceId}').onCreate(async (snapshot) => {

});

const notifyWorkspaceMembers = functions.firestore.document('workspaces/{workspaceId}').onDelete(async (snapshot) => {

});

const notifyAddedWorkspaceMembers = functions.firestore.document('workspaces/{workspaceId}').onUpdate(async (change) => {
  const beforeMembers = change.before.data().members;
  const afterMembers = change.after.data().members;
  const newMembers = afterMembers.filter((member) => !beforeMembers.include(member));
  newMembers.map((member) => {
    const user = await admin.auth().getUser(member);
    if (user.email) {
      user.email
    }
  });
});

exports.notifyInvitedWorkspaceMembers = notifyInvitedWorkspaceMembers;
exports.notifyWorkspaceMembers = notifyWorkspaceMembers;
exports.notifyAddedWorkspaceMembers = notifyAddedWorkspaceMembers;
