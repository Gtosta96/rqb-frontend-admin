/**
 * PATHS
 */

export enum EPaths {
  ROOT = "/",
  LOGIN = "/login",
  USERS = "/users",
  USERS_BROKER_GROUP_ROUTING = "/users/broker-group-routing",
  AGENT_FIRMS = "/agent-firms",
  BINDERS = "/binders",
  BROKER_GROUPS = "/broker-groups",
  SURPLUS_LINES = "/surplus-lines"
}

export const PATHS_LABEL = {
  [EPaths.ROOT]: "Home",

  [EPaths.LOGIN]: "Login",

  [EPaths.USERS]: "Users",
  [EPaths.USERS_BROKER_GROUP_ROUTING]: "Broker Group Routing",

  [EPaths.AGENT_FIRMS]: "Agent Firms",
  [EPaths.BINDERS]: "Binders",
  [EPaths.BROKER_GROUPS]: "Broker Groups",
  [EPaths.SURPLUS_LINES]: "Surplus Lines"
};

/**
 * AWS PROVIDER COGNITO CONFIG
 */
export const AWS = {
  Auth: {
    region: process.env.REACT_APP_AWS_REGION,
    userPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_WEB_CLIENT_ID,
    identityPoolId: process.env.REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID
  }
};

/**
 * ENVIRONMENT
 */
type envs = "dev" | "uat" | "prod";
export const appEnvironment: envs = process.env.REACT_APP_ENDPOINT_ENVIRONMENT as envs;

/**
 * APIS
 */
const makeApiURL = (host: string | undefined) => {
  if (!appEnvironment || !host || host.includes("http")) {
    throw new Error("INVALID ENV/HOST RECEIVED");
  }

  return `https://${host}/${appEnvironment}`;
};

export const API = {
  submission: makeApiURL(process.env.REACT_APP_API_HOST_SUBMISSION),
  questionnaire: makeApiURL(process.env.REACT_APP_API_HOST_QUESTIONNAIRE),
  summary: makeApiURL(process.env.REACT_APP_API_HOST_SUMMARY),
  reference: makeApiURL(process.env.REACT_APP_API_HOST_REFERENCE),
  user: makeApiURL(process.env.REACT_APP_API_HOST_USER),
  document: makeApiURL(process.env.REACT_APP_API_HOST_DOCUMENT),
  endorsement: makeApiURL(process.env.REACT_APP_API_HOST_ENDORSEMENT),
  auditHistory: makeApiURL(process.env.REACT_APP_API_HOST_AUDIT_HISTORY),
  cognito: makeApiURL(process.env.REACT_APP_API_HOST_COGNITO),
  xpto: makeApiURL(process.env.REACT_APP_API_HOST_XPTO),
  brokerGroup: makeApiURL(process.env.REACT_APP_API_HOST_BROKER_GROUP)
};
