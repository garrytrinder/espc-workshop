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

        const searchQuery = query.parameters[0].value;
        const response = await axios.get(
          `http://registry.npmjs.com/-/v1/search?${querystring.stringify({
            text: searchQuery,
            size: 8,
          })}`);

        const attachments = [];
        response.data.objects.forEach((obj) => {
          const template = new ACData.Template(helloWorldCard);
          const card = template.expand({
            $root: {
              name: obj.package.name,
              description: obj.package.description,
            },
          });
          const preview = CardFactory.heroCard(obj.package.name);
          const attachment = { ...CardFactory.adaptiveCard(card), preview };
          attachments.push(attachment);
        });

        return {
          composeExtension: {
            type: "result",
            attachmentLayout: "list",
            attachments: attachments,
          },
        };
      });
  }
}
