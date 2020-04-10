# Foundry: Example projects

This repository is a set of example projects showing how Foundry can be used with Firebase. The overall theme is an app where you manage users and their workspaces.<br/>
Each directory is a separate Firebase Functions project showcasing different Foundry functionality.

How to try [Foundry CLI](https://github.com/FoundryApp/foundry-cli) with examples projects:

1. Install Foundry CLI by following [instructions](https://github.com/FoundryApp/foundry-cli#download-and-installation)
2. `git clone https://github.com/FoundryApp/examples.git`
3. `cd examples`
4. `cd auth-functions/functions` or any different example
5. `foundry go`

## [auth-functions](https://github.com/FoundryApp/examples/tree/master/auth-functions)

Showcas of [auth trigger](https://firebase.google.com/docs/functions/auth-events) functions: Create a default workspace for a new user and delete user's data from Firestore when the user is deleted from Firebase Auth.

- onCreate function `newUserWorkspace` creates a workspace in Firestore when a new user signs up

- onDelete function `userCleanup` cleans a document of just deleted user in collection `userInfos` in Firestore + automatically updates all workspaces where the user was the owner

## [emulated-auth](https://github.com/FoundryApp/examples/tree/master/emulated-auth)

Showcase of the emulated Firebase Auth users: Fill the emulated Firebase Auth with custom users and with users from your production Firebase Auth.

- https function `getUserEmail` returns an email of a user that is specified in the field `collections` in the function's request body

## [emulated-firestore](https://github.com/FoundryApp/examples/tree/master/emulated-firestore)

Showcase of the emulated Firestore database: Fill the emulated Firestore with custom documents and also with documents from your production Firestore database.

- https function `listCollectionsDocs` lists documents from the collections specified in array `collections` in the function's request body

## [firestore-functions](https://github.com/FoundryApp/examples/tree/master/firestore-functions)

Showcase of [Firestore trigger](https://firebase.google.com/docs/functions/firestore-events) functions: Functionality around workspaces and Slack notifications. When you create a workspace with a new  members, add members to an existing workspace, or delete a workspace, a relevant Slack notification will be sent.

- onCreate function `notifyMembersInNewWorkspace` sends a message to Slack mentioning all members from a newly created workspace

- onUpdate function `notifyMembersAddedToWorkspace` sends a message to Slack mentioning all members that were added to an existing workspace

- onDelete function `notifyMembersInDeletedWorkspace` sends a message to Slack mentioning all members that were in a deleted workspace

## [https-functions](https://github.com/FoundryApp/examples/tree/master/https-functions)

Showcase of [HTTPS](https://firebase.google.com/docs/functions/http-events) and [HTTPS Callable](https://firebase.google.com/docs/functions/callable) functions: Custom API endpoints accessible by a HTTPS request or from within a Firebase app using the Firebase Client SDK.

- https function `askForWorkspaceInvite` allows anyone to send a REST request asking the owner of a workspace for invite. The request's body expects 2 fields:
  - `workspaceId` - an ID of a workspace 
  - `email` - an email where the invite will be sent

- httpsCallable function `changeWorkspaceOwner` allows your Firebase app users to change ownership of their workspace. The functions expects 2 parameters:
  - `workspaceId` - an ID of workspace where the ownership change should happen
  - `newOwner` - an ID of user that will become new owner
