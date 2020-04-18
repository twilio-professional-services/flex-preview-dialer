# Flex Preview Dialer Plugin

This plugin is meant to be a Preview Dialer that receives a CSV file and send tasks to agents right away or in a period of time previously scheduled. When the task is accepted by the agent, the outbound call is made automatically.   

## Flex plugin

A Twilio Flex Plugin allow you to customize the appearance and behavior of [Twilio Flex](https://www.twilio.com/flex). If you want to learn more about the capabilities and how to use the API, check out our [Flex documentation](https://www.twilio.com/docs/flex).

## How it works

This plugin uses Twilio Functions and the startOutboundCall action to send tasks to agents representing a call that needs to be made. When the task is accepted, the outbound call is automatically connected to the agent. 

### Call now

Using the *call now* button, the preview dialer tasks will be created for each contact on the list. Using TaskRouter, these tasks will be sent to available workers accordingly to their capacity on the Preview Dialer channel (more on that in the configuration section). 

### Schedule

Using the *schedule* button, you are able to set the days on the week and the interval of time that the calls can be made. Therefore, the preview dialer tasks will be created for each contact on the list but now with the schedule information. Using TaskRouter, these tasks will be sent to available workers accordingly to the schedule and their capacity on the Preview Dialer channel.

# Configuration

## Flex Plugin

This repository is a Flex plugin with some other assets. The following describing how you setup, develop and deploy your Flex plugin.

### Setup

Make sure you have [Node.js](https://nodejs.org) as well as [`npm`](https://npmjs.com) installed.

Afterwards, install the dependencies by running `npm install`:

```bash
# If you use npm
npm install
```

### Development

In order to develop locally, you can use the Webpack Dev Server by running:

```bash
npm start
```

This will automatically start up the Webpack Dev Server and open the browser for you. Your app will run on `http://localhost:8080`. If you want to change that you can do this by setting the `PORT` environment variable:

```bash
PORT=3000 npm start
```

When you make changes to your code, the browser window will be automatically refreshed.

### Deploy

Once you are happy with your plugin, you have to bundle it in order to deploy it to Twilio Flex.

Run the following command to start the bundling:

```bash
npm run build
```

Afterwards, you'll find in your project a `build/` folder that contains a file with the name of your plugin project. For example, `plugin-example.js`. Take this file and upload it into the Assets part of your Twilio Runtime.

Note: Common packages like `React`, `ReactDOM`, `Redux` and `ReactRedux` are not bundled with the build because they are treated as external dependencies so the plugin will depend on Flex to provide them globally.

## TaskRouter

Before using this plugin you must first create a dedicated TaskRouter workflow or just add the following filter to your current workflow. Make sure it is part of your Flex Task Assignment workspace.

<img width="700px" src="screenshots/preview-dialer-filter.png"/>

## Twilio Serverless 

You will need the [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart) and the [serverless plugin](https://www.twilio.com/docs/labs/serverless-toolkit/getting-started) to deploy the functions inside the ```serverless``` folder of this project. You can install the necessary dependencies with the following commands:

`npm install twilio-cli -g`

and then

`twilio plugins:install @twilio-labs/plugin-serverless`

# How to use

1. Setup all dependencies above: the workflow and Twilio CLI packages.

2. Clone this repository

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

  **Note**: when deploying this plugin, you need to send these variables through the UI Configuration API as following. If you need more information about it, please refer to this [documentation](https://www.twilio.com/docs/flex/ui-configuration-customization):

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

4.  run `npm install`

5. copy ./serverless/.env.sample to ./serverless/.env and populate the appropriate environment variables.

6.  cd into ./serverless/ then run `npm install` and then `twilio serverless:deploy` (optionally you can run locally with `twilio serverless:start --ngrok=""`

8. cd back to the root folder and run `npm start` to run locally or `npm run-script build` and deploy the generated ./build/plugin-dialpad.js to [twilio assests](https://www.twilio.com/console/assets/public) to include plugin with hosted Flex
