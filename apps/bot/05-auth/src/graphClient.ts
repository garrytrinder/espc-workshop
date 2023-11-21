import { Client } from "@microsoft/microsoft-graph-client";
import { AppCredential } from "@microsoft/teamsfx";
import config from "./internal/config";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";
import "isomorphic-fetch";

export const getGraphClient = () => {
    const appCredential = new AppCredential(config.appAuthConfig);

    const authProvider = new TokenCredentialAuthenticationProvider(appCredential, {
        scopes: ["https://graph.microsoft.com/.default"],
    });

    return Client.initWithMiddleware({ authProvider });
}