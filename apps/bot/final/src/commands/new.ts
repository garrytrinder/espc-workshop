import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { CommandMessage, TeamsFxBotCommandHandler, TriggerPatterns } from "@microsoft/teamsfx";
import { TurnContext, Activity, CardFactory, MessageFactory } from "botbuilder";
import { getGraphClient } from "../graphClient";
import config from "../internal/config";

export class NewCommandHandler implements TeamsFxBotCommandHandler {
  triggerPatterns: TriggerPatterns = ["new"];

  async handleCommandReceived(context: TurnContext, message: CommandMessage): Promise<string | void | Partial<Activity>> {
      const newCard = await import("../adaptiveCards/new.json");
      const graphClient = getGraphClient();
      
      // get the site id from the site url and get the items from the Products list
      const { sharepointIds } = await graphClient.api(`/sites/${config.spoHostname}:/${config.spoSiteUrl}`).select("sharepointIds").get();
      const { value: items } = await graphClient.api(`/sites/${sharepointIds.siteId}/lists/Products/items?expand=fields&select=fields/Title`).get();
      const products = items.map((item) => {
          return {
              title: item.fields.Title,
              value: item.fields.Title
          }
      });

      const card = AdaptiveCards.declare(newCard).render({ products });
      return MessageFactory.attachment(CardFactory.adaptiveCard(card));
  }
}