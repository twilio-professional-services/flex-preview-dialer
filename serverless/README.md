# Before we get started…

- To develop and deploy Twilio functions you need Twilio CLI as described below
- A contact us/callback-form page. 
    - either use a static html form and copy it over to Twilio assets directory.I have created a form on [formstack](https://virtual_queue.formstack.com/)  trial account,and going to leave it here for a quick test. Don't abuse it, else it will be suspended. 
    - or point your existing form submission data to invoke the Twilio serverless function created using the steps below.

# Requirements

## Install the Twilio CLI

Via `npm` or `yarn`:

```sh-session
$ npm install -g twilio-cli
$ yarn global add twilio-cli
```

Via `homebrew`:

```sh-session
$ brew tap twilio/brew && brew install twilio
```

# Usage

```sh-session
$ twilio plugins:install @twilio-labs/plugin-serverless
$ twilio --help serverless
USAGE
  $ twilio serverless
...
```


You can use the Serverless Toolkit as a standalone tool in the form of the npm package twilio-run, however, you can also integrate it into the Twilio CLI via the Twilio Serverless plugin. The Twilio CLI covers hundreds of Twilio features and API endpoints, pair it with the Serverless plugin and you have a tool that provides all the functionality you need.

After installing the CLI, you have the twilio command available in your environment. Ensure that you are authorized by running the following command in your terminal:

twilio login
If you need more info on how to get started with the Twilio CLI check out the Twilio video tip “Introducing the Twilio CLI!”.

After a fresh installation, the Twilio CLI is missing the serverless commands. To add these commands, install the serverless plugin from within the Twilio CLI itself. Run the plugin:install command:

twilio plugins:install @twilio-labs/plugin-serverless
After the plugin installation finishes, new commands like twilio serverless:deploy and twilio serverless:start become available right at your fingertips. 🎉

A quick note about plugin; the Twilio CLI is not only able to install plugins but it also provides the functionality to keep plugins up-to-date. The serverless plugin is still pretty new – make sure to run twilio plugins:update now and then to receive updates.


# Start 

```sh-session
npm start
```

OR using twilio CLI

```sh-session
twilio serverless:start 
```

# deploy

```sh-session
twilio serverless:deploy
```


The output will look something like this 

```sh-session


Deploying functions & assets to the Twilio Runtime

Account         AC35f0*************
Token           f297****************************
Service Name    flex-virtual-queue
Environment     dev
Root Directory  <path>/plugin-flex-virtual-queue/serverless/flex-virtual-queue
Dependencies
Env Variables   VirtualQueueWorkflowSid, VirtualQueueTaskChannelSid, VirtualQueueWorkSpaceSid

✔ Serverless project successfully deployed

Deployment Details
Domain: flex-virtual-queue-<23423>-dev.twil.io
Service:
   flex-virtual-queue (ZSe5dbd73XXYYSFESDFsdfwer89f6)
Environment:
   dev (ZE4aeaf01e35ADSFSDAFFDSFASDF5114b6) 
Build SID:
   ZBffbe8b31ec0ZZZAWEFQWRWEREW@234330af4fd4
View Live Logs:
   https://www.twilio.com/console/assets/api/ZSeSAFSADF3242423XX6/environment/ZE4aeaf01e35asdfsadfk23423Ab6
Functions:
   https://flex-virtual-queue-<23423>-dev.twil.io/create-virtual-queue-task
Assets:
   https://flex-virtual-queue-<23423>-dev.twil.io/contact_us.html

   ```