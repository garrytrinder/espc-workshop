import { BotBuilderCloudAdapter } from "@microsoft/teamsfx";
import ConversationBot = BotBuilderCloudAdapter.ConversationBot;
import config from "./config";
import { AssignActionHandler } from "../actions/assign";
import { CloseActionHandler } from "../actions/close";
import { NewCommandHandler } from "../commands/new";
import { NewActionHandler } from "../actions/new";

// Create bot.
export const notificationApp = new ConversationBot({
  // The bot id and password to create CloudAdapter.
  // See https://aka.ms/about-bot-adapter to learn more about adapters.
  adapterConfig: {
    MicrosoftAppId: config.botId,
    MicrosoftAppPassword: config.botPassword,
    MicrosoftAppType: "MultiTenant",
  },
  // Enable notification
  notification: {
    enabled: true,
  },
  cardAction: {
    enabled: true,
    actions: [
      new AssignActionHandler(),
      new CloseActionHandler(),
      new NewActionHandler()
    ]
  },
  command: {
    enabled: true,
    commands: [
      new NewCommandHandler()
    ]
  }
});
