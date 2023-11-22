import { AdaptiveCardResponse, InvokeResponseFactory, TeamsFxAdaptiveCardActionHandler } from "@microsoft/teamsfx";
import { TurnContext } from "botbuilder";
import { QueryData } from "../cardModels";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";

export class CloseActionHandler implements TeamsFxAdaptiveCardActionHandler {
    triggerVerb: string = "close";
    adaptiveCardResponse: AdaptiveCardResponse = AdaptiveCardResponse.ReplaceForAll;

    async handleActionInvoked(context: TurnContext, actionData: QueryData) {
        const closeCard = await import("../adaptiveCards/close.json");
        const card = AdaptiveCards.declare<QueryData>(closeCard).render({ ...actionData });

        return InvokeResponseFactory.adaptiveCard(card);
    }
}