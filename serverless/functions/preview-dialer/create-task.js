const TokenValidator = require('twilio-flex-token-validator').functionValidator;

let path = Runtime.getFunctions()['dialpad-utils'].path;
let assets = require(path);

exports.handler = TokenValidator( async (context, event, callback) => {

  const client = context.getTwilioClient();

  const contacts = (event.contacts && JSON.parse(event.contacts)) || [];
  const schedule = (event.schedule && JSON.parse(event.schedule)) || null;

  const { campaign } = event;

  for(let i=0; i < contacts.length; i++) {
    
    const { destination, name } = contacts[i];

    await client.taskrouter
      .workspaces(context.TWILIO_WORKSPACE_SID)
      .tasks.create({

        attributes: JSON.stringify({
          type: "preview-dialer",
          name: `[${campaign}] Call to ${name}`,
          destination,
          schedule,
          info: {
            name,
            campaign
          }
        }),
        workflowSid: context.PREVIEW_DIALER_WORKFLOW_SID,
        taskChannel: context.PREVIEW_DIALER_TASK_CHANNEL_SID

      });

  }
  
  callback(null, assets.response("json", {}));

});
