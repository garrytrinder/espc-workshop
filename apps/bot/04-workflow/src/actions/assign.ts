import { AdaptiveCardResponse, InvokeResponseFactory, TeamsFxAdaptiveCardActionHandler } from "@microsoft/teamsfx";
import { TurnContext } from "botbuilder";
import { QueryData } from "../cardModels";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";

export class AssignActionHandler implements TeamsFxAdaptiveCardActionHandler {
  triggerVerb: string = "assign";
  adaptiveCardResponse: AdaptiveCardResponse = AdaptiveCardResponse.ReplaceForAll;

  async handleActionInvoked(context: TurnContext, actionData: QueryData) {
    const assignCard = await import("../adaptiveCards/assign.json");
    const card = AdaptiveCards.declare<QueryData>(assignCard).render({ agentName: "Agent 47", ...actionData as QueryData });

    return InvokeResponseFactory.adaptiveCard(card);
  }
}