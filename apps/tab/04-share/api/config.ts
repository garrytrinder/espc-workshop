const config = {
  authorityHost: process.env.M365_AUTHORITY_HOST,
  tenantId: process.env.M365_TENANT_ID,
  clientId: process.env.M365_CLIENT_ID,
  clientSecret: process.env.M365_CLIENT_SECRET,
  spoHostname: process.env.SPO_HOSTNAME,
  spoSiteUrl: process.env.SPO_SITE_URL,
};

export default config;
