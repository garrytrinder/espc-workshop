const config = {
  botId: process.env.BOT_ID,
  botPassword: process.env.BOT_PASSWORD,
  appAuthConfig: {
    clientId: process.env.M365_CLIENT_ID,
    clientSecret: process.env.M365_CLIENT_SECRET,
    authorityHost: process.env.M365_AUTHORITY_HOST,
    tenantId: process.env.M365_TENANT_ID,
  },
  spoHostname: process.env.SPO_HOSTNAME,
  spoSiteUrl: process.env.SPO_SITE_URL,
  botEndpoint: process.env.BOT_ENDPOINT,
  storageConnectionString: process.env.STORAGE_CONNECTION_STRING,
  storageContainerName: process.env.STORAGE_CONTAINER_NAME,
};

export default config;
