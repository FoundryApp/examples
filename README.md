# Foundry: Example projects

This repository is a set of example projects showing how [Foundry](https://github.com/foundryapp/foundry-cli) can be used with Firebase. The overall theme is an app where you manage users and their workspaces.<br/>
Each directory is a separate Firebase Functions project showcasing different Foundry functionality.

Some projects integrate third party services like Slack or Sendgrid. You may want to [join our Slack community](https://join.slack.com/t/community-foundry/shared_invite/zt-dcpyblnb-JSSWviMFbRvjGnikMAWJeA) where we provide API keys so you don't have to create an account with these services.

How to try [Foundry](https://github.com/FoundryApp/foundry-cli) with example projects:

1. Install Foundry CLI by following [instructions](https://github.com/FoundryApp/foundry-cli#download-and-installation)
2. `git clone https://github.com/FoundryApp/examples.git`
3. `cd examples`
4. `cd auth-functions/functions` or any different example
5. `foundry go`

## [auth-functions](https://github.com/FoundryApp/examples/tree/master/auth-functions)

Showcase of [auth trigger](https://firebase.google.com/docs/functions/auth-events) functions: Create a default workspace for a new user and delete the user's data from Firestore when the user is deleted from Firebase Auth.

- onCreate function `newUserWorkspace` creates a workspace in Firestore when a new user signs up

- onDelete function `userCleanup` cleans a document of just deleted user in collection `userInfos` in Firestore + automatically updates all workspaces where the user was the owner

## [emulated-auth](https://github.com/FoundryApp/examples/tree/master/emulated-auth)

Showcase of the emulated Firebase Auth users: Fill the emulated Firebase Auth with custom users and with users from your production Firebase Auth.

- https function `getUserEmail` returns an email of a user that is specified in the field `collections` in the function's request body

## [emulated-firestore](https://github.com/FoundryApp/examples/tree/master/emulated-firestore)

Showcase of the emulated Firestore database: Fill the emulated Firestore with custom documents and also with documents from your production Firestore database.

- https function `listCollectionsDocs` lists documents from the collections specified in array `collections` in the function's request body

## [firestore-functions](https://github.com/FoundryApp/examples/tree/master/firestore-functions)

Showcase of [Firestore trigger](https://firebase.google.com/docs/functions/firestore-events) functions: Functionality around workspaces and Slack notifications. When you create a workspace with new members, add members to an existing workspace, or delete a workspace, a relevant Slack notification will be sent.

Functions in this project send Slack notifications and need an env variable named `SLACK_WEBHOOK_URL` to be set.</br>
You can either [get the webhook URL we created](https://community-foundry.slack.com/archives/C011MS19WKV/p1586556666001400) for this project from our Slack community or [create your own webhook URL](https://slack.com/intl/en-cz/help/articles/115005265063-Incoming-Webhooks-for-Slack).</br>
After getting an webhook URL run the command `foundry env-set SLACK_WEBHOOK_URL=<the webhook URL>`.

- onCreate function `notifyMembersInNewWorkspace` sends a message to Slack mentioning all members from a newly created workspace

- onUpdate function `notifyMembersAddedToWorkspace` sends a message to Slack mentioning all members that were added to an existing workspace

- onDelete function `notifyMembersInDeletedWorkspace` sends a message to Slack mentioning all members that were in a deleted workspace

## [https-functions](https://github.com/FoundryApp/examples/tree/master/https-functions)

Showcase of [HTTPS](https://firebase.google.com/docs/functions/http-events) and [HTTPS Callable](https://firebase.google.com/docs/functions/callable) functions: Custom API endpoints accessible by an HTTPS request or from within a Firebase app using the Firebase Client SDK.

Function `askForWorkspaceInvite` sends emails via Sendgrid and needs an env variable named `SENDGRID_API_KEY` to be set.</br>
You can either [get the API key we created](https://community-foundry.slack.com/archives/C011MS19WKV/p1586556606000800) for this project from our Slack community or [create your own Sendgrid API key](https://app.sendgrid.com/guide/integrate/langs/nodejs).</br>
After getting an API key run the command `foundry env-set SENDGRID_API_KEY=<the API key>`.

- https function `askForWorkspaceInvite` allows anyone to send a REST request asking the owner of a workspace for an invite. The request's body expects 2 fields:
  - `workspaceId` - an ID of a workspace
  - `email` - an email where the invite will be sent

- httpsCallable function `changeWorkspaceOwner` allows your Firebase app users to change ownership of their workspace. The functions expects 2 parameters:
  - `workspaceId` - an ID of workspace where the ownership change should happen
  - `newOwner` - an ID of user that will become a new owner
