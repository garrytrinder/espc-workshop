import { default as axios } from "axios";
import * as querystring from "querystring";
import {
  TeamsActivityHandler,
  CardFactory,
  TurnContext,
  MessagingExtensionQuery,
} from "botbuilder";
import * as ACData from "adaptivecards-templating";
import helloWorldCard from "./adaptiveCards/helloWorldCard.json";
import { MessageExtensionTokenResponse, OnBehalfOfCredentialAuthConfig, handleMessageExtensionQueryWithSSO, } from "@microsoft/teamsfx";
import config from "./config";

const oboAuthConfig: OnBehalfOfCredentialAuthConfig = {
  authorityHost: config.authorityHost,
  clientId: config.clientId,
  clientSecret: config.clientSecret,
  tenantId: config.tenantId,
};

const scopes = ["Sites.Read.All"];

export class SearchApp extends TeamsActivityHandler {
  constructor() {
    super();
  }

  // Search.
  public async handleTeamsMessagingExtensionQuery(
    context: TurnContext,
    query: MessagingExtensionQuery
  ): Promise<any> {
    return await handleMessageExtensionQueryWithSSO(
      context,
      oboAuthConfig,
      config.initiateLoginEndpoint,
      scopes,
      async (token: MessageExtensionTokenResponse) => {
        const { ssoToken } = token;
        console.log(`Token: ${ssoToken}`);

        
      });
  }
}
