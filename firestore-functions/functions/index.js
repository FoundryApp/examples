const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const notifyInvitedWorkspaceMembers = functions
  .firestore
  .document('workspaces/{workspaceId}')
  .onCreate(async (snapshot) => {
    console.log(snapshot.data());
    const members = snapshot.data().members;

  });


const notifyAddedWorkspaceMembers = functions
  .firestore
  .document('workspaces/{workspaceId}')
  .onUpdate(async (change) => {
    console.log(change.after.data());
    const beforeMembers = change.before.data().members;
    const afterMembers = change.after.data().members;
    const newMembers = afterMembers.filter((member) => !beforeMembers.include(member));
    return Promise.all(newMembers.map(async (member) => {
      const user = await admin.auth().getUser(member);
      if (user.email) {
        // user.email -> notify
      }
    }));
  });


const notifyWorkspaceMembers = functions
  .firestore
  .document('workspaces/{workspaceId}')
  .onDelete(async (snapshot) => {
    console.log(snapshot.data());
  });



exports.notifyInvitedWorkspaceMembers = notifyInvitedWorkspaceMembers;
exports.notifyWorkspaceMembers = notifyWorkspaceMembers;
exports.notifyAddedWorkspaceMembers = notifyAddedWorkspaceMembers;
