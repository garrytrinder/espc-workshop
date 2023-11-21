import { BearerTokenAuthProvider, TeamsUserCredential, createApiClient } from "@microsoft/teamsfx";
import config from "./config";
import * as axios from "axios";

const functionName = config.apiName || "myFunc";

export async function callFunction(teamsUserCredential: TeamsUserCredential) {
    try {
      const apiBaseUrl = config.apiEndpoint + "/api/";
      // createApiClient(...) creates an Axios instance which uses BearerTokenAuthProvider to inject token to request header
      const apiClient = createApiClient(
        apiBaseUrl,
        new BearerTokenAuthProvider(async () => (await teamsUserCredential.getToken(""))!.token)
      );
      // const response = await apiClient.get(functionName);
      const response = await apiClient.get("getScripts");
      return response.data;
    } catch (err: unknown) {
      if (axios.default.isAxiosError(err)) {
        let funcErrorMsg = "";
  
        if (err?.response?.status === 404) {
          funcErrorMsg = `There may be a problem with the deployment of Azure Function App, please deploy Azure Function (Run command palette "Teams: Deploy") first before running this App`;
        } else if (err.message === "Network Error") {
          funcErrorMsg =
            "Cannot call Azure Function due to network error, please check your network connection status and ";
          if (err.config?.url && err.config.url.indexOf("localhost") >= 0) {
            funcErrorMsg += `make sure to start Azure Function locally (Run "npm run start" command inside api folder from terminal) first before running this App`;
          } else {
            funcErrorMsg += `make sure to provision and deploy Azure Function (Run command palette "Teams: Provision" and "Teams: Deploy") first before running this App`;
          }
        } else {
          funcErrorMsg = err.message;
          if (err.response?.data?.error) {
            funcErrorMsg += ": " + err.response.data.error;
          }
        }
  
        throw new Error(funcErrorMsg);
      }
      throw err;
    }
  }