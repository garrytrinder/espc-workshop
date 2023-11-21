import { AdaptiveCardResponse, InvokeResponseFactory, TeamsFxAdaptiveCardActionHandler } from "@microsoft/teamsfx";
import { TurnContext } from "botbuilder";
import { QueryData } from "../cardModels";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { getGraphClient } from "../graphClient";
import { User } from "@microsoft/microsoft-graph-types";

export class AssignActionHandler implements TeamsFxAdaptiveCardActionHandler {
  triggerVerb: string = "assign";
  adaptiveCardResponse: AdaptiveCardResponse = AdaptiveCardResponse.ReplaceForAll;

  async handleActionInvoked(context: TurnContext, actionData: QueryData) {
    const client = getGraphClient();
    const user: User = await client.api(`/users/${actionData.agentId}`).get();

    const assignCard = await import("../adaptiveCards/assign.json");
    const card = AdaptiveCards.declare<QueryData>(assignCard).render({ agentName: user.displayName, ...actionData as QueryData });

    return InvokeResponseFactory.adaptiveCard(card);
  }
}