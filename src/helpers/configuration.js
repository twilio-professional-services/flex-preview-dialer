export const getAttributes = manager => {
   const file = require("../configs/campaigns.json");
    return {
        serviceBaseUrl: manager.serviceConfiguration.attributes.serviceBaseUrl,
        campaigns: file.campaigns || [ { name: "Default" } ]
    }
}
