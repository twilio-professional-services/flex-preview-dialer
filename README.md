# Flex Preview Dialer Plugin

This plugin is meant to be a Preview Dialer that receives a CSV file and send tasks to agents right away or in a period of time previously scheduled. When the task is accepted by the agent, the outbound call is made automatically.

The Flex Preview Dialer plugin uses [Twilio Functions](https://www.twilio.com/docs/runtime) and the [Actions Framework StartOutboundCall action](https://assets.flex.twilio.com/releases/flex-ui/1.18.0/docs/Actions.html#.StartOutboundCall) to send tasks to available agents representing a call that needs to be made. When an agent accepts a preview task, the system-initiated outbound call (represented as a voice task) is automatically connected to that agent. This plugin customizes the Flex UI to include the following components:

<img width="700px" src="screenshots/preview-dialer-ui.png"/>

- A dropdown list for your outbound campaigns, populated from campaigns.json
- A CSV upload button, for uploading your contacts list
- Two outbound calling buttons:
   - "Call Now" to generate preview dialing tasks for each contact immediately
   - "Schedule" to set day and time intervals for the selected outbound campaign

## Prerequisites

To deploy this plugin, you will need:
- An active Twilio account. [Sign up](https://www.twilio.com/try-twilio) if you don't already have one
- A Flex instance (on flex.twilio.com) running v1.18.0 or higher where you have owner, admin, or developer permissions
- [TaskRouter Queues](https://www.twilio.com/docs/flex/routing/api/task-queue) you wish to use for outbound campaigns

## Configuration

### TaskRouter

Before using this plugin, you must first create the following changes to your Flex Task Assignment workspace.
- A [task channel](https://www.twilio.com/docs/taskrouter/api/task-channel) for your preview dialing tasks
- A workflow filter to a dedicated workflow, or an additional filter to your current workflow. 

<img width="700px" src="screenshots/preview-dialer-filter.png"/>

### Prerequisite Function

There is a single function located in the `serverless` directory that you are expected to implement in the [Twilio Functions Runtime](https://www.twilio.com/docs/runtime), or to replicate in your own backend application.

#### Required env variables in your Function

From the repo root directory, change into `serverless` and rename `.env.example`.
```
cd serverless && mv .env.example .env
```
Follow the instructions on the file and set your Flex project configuration values as environment variables.

#### Required npm package for your Function environment

This plugin uses a Twilio function to generate preview dialer tasks for each contact on your CSV file. If you use the [Twilio Functions Runtime](https://www.twilio.com/docs/runtime), you'll need to validate that the incoming requests to your serverless function are coming from a Flex front-end.

This plugin will send the Flex user's token along with the task information to transfer. Upon validating the token, it will initiate the preview task. This plugin expects that you've [configured your Twilio Functions Runtime](https://www.twilio.com/console/runtime/functions/configure) dependencies and added the `twilio-flex-token-validator` package.

![Twilio Token Validator Configuration](https://indigo-bombay-5783.twil.io/assets/twilio-function-validator.jpg)

---

## Run Locally

### Setup

Make sure you have [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed. 

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

Run the following command to start the bundling:

```bash
npm run build
```

Afterwards, you'll find in your project a `build` folder that contains a file with the name of your plugin project. For example `plugin-<plugin-name>.js`. Take this file and upload it to the Assets part of your Twilio Runtime.

### Twilio Serverless Deployment

#### Function and Assets Deployment via the Twilio CLI

One way to deploy the plugin function and assets to the [Twilio Runtime](https://www.twilio.com/docs/runtime) is to use the Twilio CLI and the Serverless Plugin. 

You can install the necessary dependencies with the following commands:

```
#Install the Twilio CLI
npm install twilio-cli -g

# Install the Serverless plugin
twilio plugins:install @twilio-labs/plugin-serverless
```
For more details, see the [Twilio CLI Quickstart](https://www.twilio.com/docs/twilio-cli/quickstart#warning-for-nodejs-developers) and [Install the Twilio Serverless Toolkit](https://www.twilio.com/docs/labs/serverless-toolkit/getting-started).

##### Serverless re-deployment checklist 

1. Set up all dependencies above: the TaskRouter workflow and the Twilio CLI packages.

2. Clone this repository.

3. Copy ./public/appConfig.example.js to ./public/appConfig.js and set the following:

- account SID
- Inside attributes: 
    - serviceBaseUrl: your Twilio Functions base url (this will be available after you deploy your functions). In local development environment, it could be your localhost base url.
    - campaigns: array of campaigns available to the preview dialer. The format should be as the following example (where the second campaign has a default schedule):
    
    ```
        campaigns: [
          { 
            name: "Default", 
          },
          { 
            name: "Collections", 
            schedule: { 
              week: ["Mon", "Wed"],
              startHour: "0100",
              endHour: "2200"
            } 
          },
          { 
            name: "Leads", 
          }
        ]
    ```

  **Note**: When deploying this plugin, you need to send the `serviceBaseUrl` and `campaigns` variables through the UI Configuration API. 

  ```
  curl https://flex-api.twilio.com/v1/Configuration -X POST -u ACxx:auth_token \
    -H 'Content-Type: application/json' \
    -d '{
        "account_sid": "ACxx",
        "attributes": {
            "serviceBaseUrl": "<value>",
            "campaigns": <array> 
        }
    }'
  ```
  For more details, see [Modifying Configuration for flex.twilio.com](https://www.twilio.com/docs/flex/ui-configuration-customization).
4. Copy `src/configs/campaigns.example.json` to `src/configs/campaigns.json` and set your campaigns.

5. Run `npm install`.

6. Copy `./serverless/.env.example` to `./serverless/.env` and populate the appropriate environment variables.

7.  Change into `./serverless/` then run `npm install` and then `twilio serverless:deploy`. Optionally, you can run locally with `twilio serverless:start --ngrok=""`

8. Change back to the root folder and run `npm start` to run locally or `npm run-script build` and deploy the generated `./build/flex-preview-dialer.js` to [Twilio Assets](https://www.twilio.com/console/assets/public) to install the plugin on your hosted Flex instance ((on flex.twilio.com). 

You can review your deployed resources in the Twilio Console by selecting your Flex project from the dropdown list on the upper left corner of the screen and navigating to **Functions > API**. To learn more about the Functions and Assets API, see [Functions & Assets (API Only): Beta limitations, known issues and limits](https://www.twilio.com/docs/runtime/functions-assets-api).
