const config = {
  authorityHost: process.env.M365_AUTHORITY_HOST,
  botId: process.env.BOT_ID,
  botPassword: process.env.BOT_PASSWORD,
  clientId: process.env.M365_CLIENT_ID,
  clientSecret: process.env.M365_CLIENT_SECRET,
  initiateLoginEndpoint: process.env.INITIATE_LOGIN_ENDPOINT,
  tenantId: process.env.M365_TENANT_ID
};

export default config;
