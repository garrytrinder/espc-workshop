import { useContext, useState } from "react";
import { TeamsFxContext } from "./Context";
import { Body1, Button, Caption1, Card, CardFooter, CardHeader, CardPreview, Spinner } from "@fluentui/react-components";
import { Open16Regular, Share16Regular, Mail16Regular } from "@fluentui/react-icons";
import { useData } from "@microsoft/teamsfx-react";
import { app, sharing, mail } from "@microsoft/teams-js";
import { callFunction } from "../helpers";

export default function Tab() {
  const { themeString } = useContext(TeamsFxContext);
  const [needConsent, setNeedConsent] = useState(false);
  const teamsUserCredential = useContext(TeamsFxContext).teamsUserCredential;

  const { loading, data, error, reload } = useData(async () => {
    if (!teamsUserCredential) {
      throw new Error("TeamsFx SDK is not initialized.");
    }
    if (needConsent) {
      await teamsUserCredential!.login(["Sites.Read.All"]);
      setNeedConsent(false);
    }
    try {
      const functionRes = await callFunction(teamsUserCredential);
      return functionRes;
    } catch (error: any) {
      if (error.message.includes("The application may not be authorized.")) {
        setNeedConsent(true);
      }
    }
  });

  const sharingSupported = useData(async () => {
    await app.initialize();
    return sharing.isSupported();
  }).data;

  const mailSupported = useData(async () => {
    await app.initialize();
    return mail.isSupported();
  }).data;

  const teamsShare = async (file: any) => {
    try {
      await sharing.shareWebContent({
        content: [
          {
            type: "URL",
            url: file.webUrl,
            message: 'Hey, check out this file!',
            preview: true
          }
        ]
      })
    } catch (error) {
      console.log(error);
    }
  }

  const mailShare = async (file: any) => {
    try {
      await mail.composeMail({
        type: mail.ComposeMailType.New,
        subject: file.fields.FileLeafRef,
        message: `Hey, check out this file! ${file.webUrl}`,
        toRecipients: []
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      className={themeString === "default" ? "light" : themeString === "dark" ? "dark" : "contrast"}
    >
      <div className="container">
        {loading && (
          <pre className="fixed">
            <Spinner />
          </pre>
        )}
        {!loading && !!data && !error &&
          <div className="cards">
            {data.value.map((file: any) => (
              <Card key={file.id}>
                <CardPreview>
                  <img
                    src={file.thumbnails.c350x350_crop.url}
                    alt={file.fields.FileLeafRef}
                  />
                </CardPreview>
                <CardHeader
                  header={
                    <Body1>
                      <b>{file.fields.FileLeafRef}</b>
                    </Body1>
                  }
                  description={<Caption1>Contoso support script</Caption1>}
                />
                <CardFooter>
                  <Button appearance="primary" icon={<Open16Regular />} onClick={() => window.open(file.webUrl)}>
                    Open
                  </Button>
                  {sharingSupported &&
                    <Button icon={<Share16Regular />} onClick={() => teamsShare(file)}>Share</Button>
                  }
                  {mailSupported &&
                    <Button icon={<Mail16Regular />} onClick={() => mailShare(file)}>Share</Button>
                  }
                </CardFooter>
              </Card>
            ))}
          </div>
        }
      </div>
    </div>
  );
}
