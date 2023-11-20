import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { QueryData } from "./cardModels";
import { notificationApp } from "./internal/initialize";
import { NotificationTargetType } from "@microsoft/teamsfx";

// An Azure Function HTTP trigger.
//
// This endpoint is provided by your application to listen to events. You can configure
// your IT processes, other applications, background tasks, etc - to POST events to this
// endpoint.
//
// In response to events, this function sends Adaptive Cards to Teams. You can update the logic in this function
// to suit your needs. You can enrich the event with additional data and send an Adaptive Card as required.
//
// You can add authentication / authorization for this API. Refer to
// https://aka.ms/teamsfx-notification for more details.
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  // By default this function will iterate all the installation points and send an Adaptive Card
  // to every installation.
  if (req.body) {
    const pageSize = 100;
    let continuationToken: string | undefined = undefined;
    do {
      const pagedData = await notificationApp.notification.getPagedInstallations(
        pageSize,
        continuationToken
      );
      const installations = pagedData.data;
      continuationToken = pagedData.continuationToken;

      for (const target of installations) {
        if (target.type === NotificationTargetType.Channel) {
          // get the channels of the team
          const channels = await target.channels();
          for (const channel of channels) {
            // send notification to the channel "Support"
            if (channel.info.name === "Support") {
              await channel.sendAdaptiveCard(
                AdaptiveCards.declare<QueryData>(queryCard).render(req.body as QueryData)
              );
            }
          }
        }
      }
    } while (continuationToken);
  }

  context.res = {};
};

export default httpTrigger;
