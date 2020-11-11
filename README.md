# Flex Preview Dialer Plugin

The Flex Preview Dialer Plugin includes the capability to upload a contacts list and programmatically generate a preview dialing task for each contact. Alongside the CSV upload, you can schedule outbound campaigns based on a JSON file and generate preview tasks for your agents immediately or at a specified later time and day.

The Flex Preview Dialer plugin uses [Twilio Functions](https://www.twilio.com/docs/runtime) and the [Actions Framework StartOutboundCall action](https://assets.flex.twilio.com/releases/flex-ui/1.18.0/docs/Actions.html#.StartOutboundCall) to send preview dialing tasks to available agents representing a call that needs to be made. When an agent accepts a preview task, the system-initiated outbound call (represented as a voice task) is automatically connected to _that_ agent. This plugin customizes the Flex UI to include the following components:


<p align="center">
    <img src="screenshots/preview-dialer-ui.png?raw=true" width="400" >
</p>

- A dropdown list for your outbound campaigns, populated from campaigns.json
- A CSV upload button, for uploading your contacts list
- Two outbound calling buttons:
   - "Call Now" to generate preview dialing tasks for each contact immediately
   - "Schedule" to set day and time intervals for the selected outbound campaign

## Prerequisites

To deploy this plugin, you will need:
- An active Twilio account. [Sign up](https://www.twilio.com/try-twilio) if you don't already have one
- A Flex instance (on flex.twilio.com) running v1.18.0 or higher where you have owner, admin, or developer permissions
- Twilio CLI along with the Flex CLI Plugin and Serverless Plugin. Run the following in a command shell:
   ```
     # Install the Twilio CLI
     npm install twilio-cli -g
     # Install the Serverless and Flex as Plugins
     twilio plugins:install @twilio-labs/plugin-serverless
     twilio plugins:install @twilio-labs/plugin-flex
   ```
- [TaskRouter Queues](https://www.twilio.com/docs/flex/routing/api/task-queue) you wish to use for outbound campaigns
- Outbound campaigns and contacts list management (the plugin includes CSV upload and scheduling components for demonstration purposes)

## Configuration

### TaskRouter

Before using this plugin, you must first add the following to your Flex Task Assignment workspace:
- A [task channel](https://www.twilio.com/docs/taskrouter/api/task-channel) for your preview dialing tasks
- A workflow filter to a dedicated workflow, or an additional filter to your current workflow. 

<img width="700px" src="screenshots/preview-dialer-filter.png"/>

### Prerequisite Function

There is a single function located in the `serverless` directory that you are expected to implement in the [Twilio Functions Runtime](https://www.twilio.com/docs/runtime), or to replicate in your own backend application.

### Required npm package for your Function environment

This plugin uses a Twilio function to generate preview dialer tasks for each contact on your CSV file. If you use the [Twilio Functions Runtime](https://www.twilio.com/docs/runtime), you'll need to validate that the incoming requests to your serverless function are coming from a Flex front-end.

This plugin will send the Flex user's token along with the task information to transfer. Upon validating the token, it will initiate the preview task. This plugin expects that you've [configured your Twilio Functions Runtime](https://www.twilio.com/console/runtime/functions/configure) dependencies and added the `twilio-flex-token-validator` package.

![Twilio Token Validator Configuration](https://indigo-bombay-5783.twil.io/assets/twilio-function-validator.jpg)

---

## Setup

Make sure you have [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed. Copy `public/appConfig.example.js` to `public/appConfig.js`.

Afterwards, install the dependencies by running `npm install`:

```bash
cd flex-preview-dialer

# If you use npm
npm install
```

### Development

In order to develop locally, you can use the Webpack Dev Server by running:

```bash
npm start
```

This will automatically start the Webpack Dev Server and open the browser for you. Your app will run on `http://localhost:3000`. To change the port, set the `PORT` environment variable:

```bash
PORT=8000 npm start
```

When you make changes to your code, the browser window will be automatically refreshed.

## Deployment

Once you are happy with your plugin, bundle it and deploy it to Twilio Flex.

### npm

Run the following command:

```bash
npm run deploy
```

Afterwards, you'll find in your project a `build` folder that contains a file with the name of your plugin project. For example `plugin-<plugin-name>.js`. Take this file and upload it to the Assets part of your Twilio Runtime.

### Twilio Serverless Deployment

1. Set up all dependencies above: the TaskRouter task channel, workflow filter, and the Twilio CLI packages.

2. Clone this repository.

3. Copy `public/appConfig.example.js` to `public/appConfig.js`.

4. Copy `src/configs/campaigns.example.json` to `src/configs/campaigns.json` and set your campaigns.

5. Run `npm install`.

6. Copy `./serverless/.env.example` to `./serverless/.env` and populate the appropriate environment variables.

7.  Change into `./serverless/` then run `twilio serverless:deploy`. Optionally, you can run locally with `twilio serverless:start --ngrok=""`

8. Copy and save the domain returned when you deploy a function.

9. From the root directory, copy `.env.example` to `.env.production`. 

10. Open the `.env.production` file in a text editor of your choice. Modify the `REACT_APP_SERVICE_BASE_URL` property to the Domain name you copied previously. Make sure to prefix it with "https://".

11. Run `twilio flex:plugins:deploy` to deploy the plugin.

The Flex Preview Dialer Plugin is now active on your contact center!

## Testing the plugin
1. Log in to the Flex instance where you deployed the plugin.
2. Change your status to "Available" on the upper right corner of the Flex UI. This enables you to receive incoming calls and messages (SMS or chat).
3. With your specific campaign selected from the Campaigns dropdown list, import a CSV file of Contacts. You can have two columns: Contact Name, and Destination (Phone Number). For example:

| Full Name | Destination Number |
|-----------|--------------------|
|Alice Cooper| 2065556666 |

4. To generate a preview task for each contact in the list:
  - Click "Call Now" to generate preview tasks for your campaign immediately.
  - Click "Schedule" to set up scheduling for your selected campaign. When specifying a schedule, note that the TaskRouter API utilizes Coordinated Universal Time (UTC).
5. To see the incoming preview tasks (displayed with the Campaign name and the phrase "Call to <destination_number_for_contact_row>", navigate to the Agent Desktop in your Flex Instance.

6. Upon clicking "Accept", you should see a connecting call to the destination number (which has been added as an attribute on the subsequent "voice" task).
**Tip:**  Flex users with `admin` or `developer` permissions can review generated tasks within the Twilio Console (**Tasks** page on your **Flex Task Assignment** workspace) or by running `twilio api:taskrouter:v1:workspaces:tasks:list --workspace-sid <flex_task-assignment_sid>` `admin` or `developer` in a command shell.


## Disclaimer
This software is to be considered "sample code", a Type B Deliverable, and is delivered "as-is" to the user. Twilio bears no responsibility to support the use or implementation of this software.
