const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const newUserWorkspace = functions.auth.user().onCreate(async (user) => {
  console.log(user.email);
  const workspaceRef = await admin.firestore()
    .collection('workspaces')
    .add({ owner: user.uid, name: 'workspace' + user.uid });
  const workspace = await workspaceRef.get();
  console.log(workspace.data());
});

const userCleanup = functions.auth.user().onDelete(async (user) => {
  console.log(user.email);
  await admin.firestore().collection('userInfos').doc(user.uid).delete();
  const userWorkspaces = await admin.firestore()
    .collection('workspaces')
    .where('owner', '==', user.uid)
    .get();
  const batch = admin.firestore().batch();
  userWorkspaces.docs.forEach(doc => batch.update(doc.ref, { isWithoutOwner: true, owner: null }));
  return batch.commit();
});

exports.newUserWorkspace = newUserWorkspace;
exports.userCleanup = userCleanup;
