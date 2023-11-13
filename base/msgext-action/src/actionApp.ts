import {
  TeamsActivityHandler,
  CardFactory,
  TurnContext,
  MessagingExtensionAction,
  MessagingExtensionActionResponse,
} from "botbuilder";

export class ActionApp extends TeamsActivityHandler {
  //Action
  public async handleTeamsMessagingExtensionSubmitAction(
    context: TurnContext,
    action: MessagingExtensionAction
  ): Promise<MessagingExtensionActionResponse> {
    // The user has chosen to create a card by choosing the 'Create Card' context menu command.
    const data = action.data;
    const attachment = CardFactory.adaptiveCard({
      $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
      type: "AdaptiveCard",
      version: "1.4",
      body: [
        {
          type: "TextBlock",
          text: `${data.title}`,
          wrap: true,
          size: "Large",
        },
        {
          type: "TextBlock",
          text: `${data.subTitle}`,
          wrap: true,
          size: "Medium",
        },
        {
          type: "TextBlock",
          text: `${data.text}`,
          wrap: true,
          size: "Small",
        },
      ],
    });
    return {
      composeExtension: {
        type: "result",
        attachmentLayout: "list",
        attachments: [attachment],
      },
    };
  }
}
