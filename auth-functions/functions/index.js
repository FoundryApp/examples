const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();


const newUserWorkspace = functions.auth.user().onCreate(async (user) => {
  const workspaceRef = await admin.firestore()
    .collection('workspaces')
    .add({ owner: user.uid, name: 'workspace-' + user.uid });

  const workspace = await workspaceRef.get();
  const workspaceData = workspace.data();
  console.log(`Default workspace for user "${user.uid}":`, workspaceData);
});



const userCleanup = functions.auth.user().onDelete(async (user) => {
  await admin
    .firestore()
    .collection('userInfos')
    .doc(user.uid)
    .delete();

  const userWorkspaces = await admin
    .firestore()
    .collection('workspaces')
    .where('owner', '==', user.uid)
    .get();

  const batch = admin
    .firestore()
    .batch();

  console.log(`User "${user.uid}" was the owner in the following workspaces:`)
  userWorkspaces.docs.forEach(doc => {
    batch.update(doc.ref, { isWithoutOwner: true, owner: null })
    console.log(doc.id);
  });

  return batch.commit();
});


exports.newUserWorkspace = newUserWorkspace;
exports.userCleanup = userCleanup;
