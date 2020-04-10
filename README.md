# Foundry: Example projects

Here is an example project where we create a simple backend for managing users and their workspaces. In each directory we showcase a specific part of the Foundry functionality.

(go to directory/function and foundry go!)

## auth-functions

Here we add creating a default workspace for a new user and deleting user's data from Firestore when he is deleted from Firebase Auth.

- onCreate function `newUserWorkspace` creates a workspace in Firestore when a new user signs up

- onDelete function `userCleanup` cleans deleted user's document in collection `userInfos` in Firestore and automatically updates workspaces where the user was the owner

## emulated-auth

Here we show how to fill the Emulated Firebase Auth with custom users and with user from your production Firebase Auth.

- https function `getUserEmail` returns an email of a user specified in the field `collections` in the function request body

## emulated-firestore

Here we show how to fill the Emulated Firestore with custom documents and with documents from your production Firestore.

- https function `listCollectionsDocs` lists documents from the collections specified in the array `collections` in the function request body

## firestore-functions

Here we add the functionality around workspaces and Slack Notifications. When you create a workspace with some members, add members to an existing workspace or delete a workspace a relevant Slack Notification will be send.

- onCreate function `notifyMembersInNewWorkspace` sends a message to Slack mentioning all the members from a newly created workspace

- onUpdate function `notifyMembersAddedToWorkspace` sends a message to Slack mentioning all the members that were added to an existing workspace

- onDelete function `notifyMembersInDeletedWorkspace` sends a message to Slack mentioning all the members that were in a deleted workspace

## https-functions

Here we add custom API endpoints accessible by a https request or from the Firebase Client SDK.

- https function `askForWorkspaceInvite` allows anyone to send a REST request contacting the owner of a workspace specified in the request body field `workspaceId` through an email specified in the request body field `email`

- httpsCallable function `changeWorkspaceOwner` allows a user signed through Firebase Client SDK (or specified in the function config parameter `asUser`) to change ownership of their workspace by providing `workspaceId` and `newOwner` in the function body request
