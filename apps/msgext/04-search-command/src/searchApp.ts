import {
  TeamsActivityHandler,
  CardFactory,
  TurnContext,
  MessagingExtensionQuery,
  AttachmentLayoutTypes,
  CardImage,
  MessagingExtensionResponse,
} from "botbuilder";
import { MessageExtensionTokenResponse, OnBehalfOfCredentialAuthConfig, OnBehalfOfUserCredential, handleMessageExtensionQueryWithSSO, } from "@microsoft/teamsfx";
import config from "./config";
import { Client, ResponseType } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";
import "isomorphic-fetch";
import * as ACData from "adaptivecards-templating";
import productCard from "./adaptiveCards/product.json";

const oboAuthConfig: OnBehalfOfCredentialAuthConfig = {
  authorityHost: config.authorityHost,
  clientId: config.clientId,
  clientSecret: config.clientSecret,
  tenantId: config.tenantId,
};

const scopes = ["Sites.Read.All"];

const listFields = [
  "fields/id",
  "fields/Title",
  "fields/RetailCategory",
  "fields/PhotoSubmission",
  "fields/CustomerRating",
  "fields/ReleaseDate"
];

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
        // create credential and graph client
        const credential = new OnBehalfOfUserCredential(token.ssoToken, oboAuthConfig);
        const authProvider = new TokenCredentialAuthenticationProvider(credential, { scopes });
        const graphClient = Client.initWithMiddleware({ authProvider: authProvider });

        // get the site id from the site url and get the items from the Products list
        const { sharepointIds } = await graphClient.api(`/sites/${config.spoHostname}:/${config.spoSiteUrl}`).select("sharepointIds").get();
        const { value: items } = await graphClient.api(`/sites/${sharepointIds.siteId}/lists/Products/items?expand=fields&select=${listFields.join(",")}&$filter=startswith(fields/Title,'${query.parameters[0].value}')`).get();

        // get the drives from the site and find the Product Imagery drive
        const { value: drives } = await graphClient.api(`sites/${sharepointIds.siteId}/drives`).select(["id", "name"]).get();
        const { id: productImageryDriveId } = drives.find(drive => drive.name === "Product Imagery");

        const attachments = [];
        await Promise.all(items.map(async (item) => {
          const { PhotoSubmission: photoUrl, Title, RetailCategory } = item.fields;
          
          // get the photo from the drive and return thumbnails
          const fileName = photoUrl.split("/").reverse()[0];
          const { id: driveItemId } = await graphClient.api(`sites/${sharepointIds.siteId}/drives/${productImageryDriveId}/root:/${fileName}`).get();
          const { value: thumbnails } = await graphClient.api(`sites/${sharepointIds.siteId}/drives/${productImageryDriveId}/items/${driveItemId}/thumbnails`).get();

          // render adaptive card to send in message
          const template = new ACData.Template(productCard);
          const card = template.expand({
            $root: {
              ...item.fields,
              PhotoSubmission: thumbnails[0].large.url,
              spoHostname: config.spoHostname,
              spoSiteUrl: config.spoSiteUrl,
            },
          });

          // render thumbnail card to show in search results
          const cardImages: CardImage[] = [{ url: thumbnails[0].small.url, alt: Title }];
          const preview = CardFactory.thumbnailCard(Title, RetailCategory, cardImages);

          // create attachment using adaptive card and thumbnail card
          const attachment = { ...CardFactory.adaptiveCard(card), preview };
          attachments.push(attachment);
        }));

        return {
          composeExtension: {
            type: "result",
            attachmentLayout: AttachmentLayoutTypes.List,
            attachments,
          },
        } as MessagingExtensionResponse;
      });
  }
}
