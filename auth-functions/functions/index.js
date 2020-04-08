const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const newUserWorkspace = functions.auth.user().onCreate(async (user) => {
  console.log(user);
  const workspaceRef = await admin.firestore()
    .collection('workspaces')
    .add({ owner: user.uid, name: user.displayName + 'Workspace' });
  const workspace = await workspaceRef.get();
  console.log(workspace.data());
});

const userCleanup = functions.auth.user().onDelete(async (user) => {
  console.log(user);
  const userWorkspaces = await admin.firestore()
    .collection('workspaces')
    .where('owner', '==', user.uid)
    .get();
  const batch = admin.firestore().batch();
  userWorkspaces.docs.forEach(doc => batch.delete(doc.ref));
  return batch.commit();
});

exports.newUserWorkspace = newUserWorkspace;
exports.userCleanup = userCleanup;
