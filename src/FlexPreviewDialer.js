import React from 'react';
import { FlexPlugin } from "flex-plugin";
import PreviewDialer from "./components/PreviewDialer/PreviewDialer";

const PLUGIN_NAME = "FlexPreviewDialer";

export default class FlexPreviewDialer extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {

    flex.OutboundDialerPanel.Content.add(<PreviewDialer key="preview-dialpad" flex={flex} manager={manager} />)

    flex.Actions.addListener("afterAcceptTask", (payload, abortFunction) => {
      
      const { type, destination } = payload.task.attributes;

      if (type === "preview-dialer") {

        flex.Actions.invokeAction("StartOutboundCall", {
          destination
        });

        flex.Actions.invokeAction("CompleteTask", { sid: payload.task.sid });
        
      }

      
    });

  }

}
