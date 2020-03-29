
# Github page: 
https://abhijitmehta.github.io/plugin-flex-virtual-queue/

# setup

- setup the contact us page and related twilio function 
- setup Flex plugin

Once you finish the above steps, 
 - proceed to the your instance of [hosted flex](https://flex.twilio.com/agent-desktop/) to launch Flex 
 - in another tab, open the contact us form deployed at https://<your-asset-api-path>.twil.io/contact_us.htm
 


## Contact Us Page and Twilio Function

Read [serverless/flex-virtual-queue](serverless/flex-virtual-queue/README.md)


## Your custom Twilio Flex Plugin

Twilio Flex Plugins allow you to customize the appearance and behavior of [Twilio Flex](https://www.twilio.com/flex). If you want to learn more about the capabilities and how to use the API, check out our [Flex documentation](https://www.twilio.com/docs/flex).

### Setup

Make sure you have [Node.js](https://nodejs.org) as well as [`npm`](https://npmjs.com) installed.

Afterwards, install the dependencies by running `npm install`:

```bash
cd 

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


### Deploy to your twilio assets 

The primary new interface is an ```npm run deploy``` command. This command will build your plugin and deploy it to Twilio Assets from your CLI. You no longer need to drag-and-drop your plugin within the Twilio Console.

When you are ready to deploy your plugin, in your terminal run:
```bash
npm run deploy
```

This will publish your plugin as a Private Asset that is accessible by the Functions & Assets API. If you want to deploy your plugin as a Public Asset, you may pass --public to your deploy command:

```
npm run deploy --public
```

For more information on Public vs Private plugins, please see (Deploying Flex Plugins)[https://www.twilio.com/docs/flex/plugins/deploying]

The output of above deploye command should look something like this:

```bash
abhijitMehta> SKIP_PREFLIGHT_CHECK=true npm run deploy --public


> plugin-flex-virtual-queue@0.0.0 predeploy /Users/amehta/Workshop/virtual_queue/plugin-flex-virtual-queue
> npm run build


> plugin-flex-virtual-queue@0.0.0 prebuild /Users/amehta/Workshop/virtual_queue/plugin-flex-virtual-queue
> rimraf build && npm run bootstrap


> plugin-flex-virtual-queue@0.0.0 bootstrap /Users/amehta/Workshop/virtual_queue/plugin-flex-virtual-queue
> flex-plugin check-start


> plugin-flex-virtual-queue@0.0.0 build /Users/amehta/Workshop/virtual_queue/plugin-flex-virtual-queue
> flex-plugin build

Creating an optimized production build...
Compiled successfully.

File sizes after gzip:

  11.06 KB  build/plugin-flex-virtual-queue.js

The project was built assuming it is hosted at /.
You can control this with the homepage field in your package.json.

The build folder is ready to be deployed.
You may serve it with a static server:

  npm install -g serve
  serve -s build

Find out more about deployment here:

  bit.ly/CRA-deploy


> plugin-flex-virtual-queue@0.0.0 deploy /Users/amehta/Workshop/virtual_queue/plugin-flex-virtual-queue
> flex-plugin deploy

Uploading your Flex plugin to Twilio Assets

? Enter your Twilio Account Sid: AC35234sb96a8dfadsf8sadfdsa862
? Enter your Twilio Auth Token: [hidden]
✔ Fetching Twilio Runtime service
✔ Validating the new plugin bundle
✔ Uploading your plugin bundle
✔ Registering plugin with Flex
✔ Deploying a new build of your Twilio Runtime

🚀  Your plugin has been successfully deployed to your Flex project clickToDialTutorial (AC35234sb96a8dfadsf8sadfdsa862). It is hosted (privately) as a Twilio Asset on https://default-<sdf234>-20j3dc.twil.io/plugins/plugin-flex-virtual-queue/0.0.0/bundle.js.

Workshop/virtual_queue/plugin-flex-virtual-queue via ⬢ v12.16.1 took 53s 
abhijitMehta> 

```


