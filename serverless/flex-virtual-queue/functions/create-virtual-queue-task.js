exports.handler = function(context, event, callback) {
  const response = new Twilio.Response();
  const accountSid = context.ACCOUNT_SID;

  if (!event.your_contact_number) {
    response.setStatusCode(400);
    callback("Request not formed properly", response);
    return;
  }

  // Set the status code to 200 OK
  response.setStatusCode(200);

  // Set the Content-Type Header
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,OPTIONS"
  );
  response.appendHeader("Content-Type", "application/json");
  response.appendHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );

  const client = context.getTwilioClient();
  console.log("Creating Task of type", event.type);

  callBackData = event;

  const task = {
    attributes: JSON.stringify({
      to: callBackData.your_contact_number,
      direction: "outbound",
      name: "Callback request from " + callBackData.your_contact_number,
      type: "virtual_queue_14573869",
      formdata: callBackData
    }),
    workflowSid: context.VirtualQueueWorkflowSid,
    taskChannel: context.VirtualQueueTaskChannelSid
  };

  console.log("Creating Task of type", event.type, ". Task Details:", task);

  client.taskrouter
    .workspaces(context.VirtualQueueWorkSpaceSid)
    .tasks.create(task)
    .then(task => {
      // Set the response body
      response.setBody({
        taskSid: task.sid,
        task: task
      });

      callback(null, response);
    })
    .catch(e => {
      console.log("Error =>", e);
      callback(json.stringify(e), response);
    });
};
