import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { AdaptiveCardResponse, InvokeResponseFactory, TeamsFxAdaptiveCardActionHandler } from "@microsoft/teamsfx";
import { QueryData } from "../cardModels";
import config from "../internal/config";

export class NewActionHandler implements TeamsFxAdaptiveCardActionHandler {
  triggerVerb: string = "new";
  adaptiveCardResponse: AdaptiveCardResponse = AdaptiveCardResponse.ReplaceForAll;

  async handleActionInvoked(context: any, actionData: any) {
      await fetch(`${config.botEndpoint}/api/notification`, { method: "POST", body: JSON.stringify(actionData) });
      
      const saveCard = await import("../adaptiveCards/save.json");
      const card = AdaptiveCards.declare<QueryData>(saveCard).render({ ...actionData });

      return InvokeResponseFactory.adaptiveCard(card);
  }
}