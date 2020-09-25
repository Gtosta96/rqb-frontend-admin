/**
 * Routes Paths
 */
export enum EPaths {
  ROOT = "/",
  LOGIN = "/login",
  LOGOUT = "/logout",

  USERS = "/users",
  USERS_BROKER_GROUP_ROUTING = "/users/broker-group-routing",

  AGENT_FIRMS = "/agent-firms",
  AGENT_COMMISSIONS = "/agent-firms/agent-commissions",

  BINDERS = "/binders",
  BINDER_AUTHORITY = "/binders/binder-authority",
  BROKERAGE_RATE = "/binders/brokerage_rate",

  BROKER_GROUPS = "/broker-groups",
  BROKER_GROUP_BINDERS = "/broker-groups/binders",
  BROKER_GROUP_USERS = "/broker-groups/users",
  BROKER_GROUP_ROUTES = "/broker-groups/routes",

  SURPLUS_LINES = "/surplus-lines",

  DOCUMENT_CLAUSES = "/document-clauses",
  DOCUMENT_TEMPLATES = "/document-templates",
  DOCUMENT_SCHEDULES = "/document-schedules",

  CLIENT_DOCUMENTS = "/client-documents",
  DOCUMENT_ATTRIBUTES = "/document-attributes"
}

/**
 * Paths Label used in the Breadcrumb/Sidebar Component
 */
export const PATHS_LABEL = {
  [EPaths.ROOT]: "Home",
  [EPaths.LOGIN]: "Login",
  [EPaths.LOGOUT]: "Logout",

  [EPaths.USERS]: "Users",
  [EPaths.USERS_BROKER_GROUP_ROUTING]: "Broker Group Routing",

  [EPaths.AGENT_FIRMS]: "Agent Firms",
  [EPaths.AGENT_COMMISSIONS]: "Agent Commissions",

  [EPaths.BINDERS]: "Binders",
  [EPaths.BINDER_AUTHORITY]: "Binder Authority",
  [EPaths.BROKERAGE_RATE]: "Brokerage Rate",

  [EPaths.BROKER_GROUPS]: "Broker Groups",
  [EPaths.BROKER_GROUP_BINDERS]: "Broker Groups Binders",
  [EPaths.BROKER_GROUP_USERS]: "Broker Groups Users",
  [EPaths.BROKER_GROUP_ROUTES]: "Broker Groups Routes",

  [EPaths.SURPLUS_LINES]: "Surplus Lines",

  [EPaths.DOCUMENT_CLAUSES]: "Document Clauses",
  [EPaths.DOCUMENT_TEMPLATES]: "Document Templates",
  [EPaths.DOCUMENT_SCHEDULES]: "Document Schedules",

  [EPaths.CLIENT_DOCUMENTS]: "Client Documents",
  [EPaths.DOCUMENT_ATTRIBUTES]: "Document Attributes"
};

/**
 * AWS PROVIDER COGNITO CONFIG
 */
export const AWS = {
  Auth: {
    region: process.env.REACT_APP_AWS_REGION,
    userPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_WEB_CLIENT_ID,
    identityPoolId: process.env.REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID,
    oauth: {
      domain: process.env.REACT_APP_AWS_COGNITO_OKTA_DOMAIN,
      redirectSignIn:
        process.env.NODE_ENV === "production"
          ? process.env.REACT_APP_AWS_COGNITO_OKTA_REDIRECT_SIGN_IN
          : "https://localhost:3000/login",
      redirectSignOut:
        process.env.NODE_ENV === "production"
          ? process.env.REACT_APP_AWS_COGNITO_OKTA_REDIRECT_SIGN_OUT
          : "https://localhost:3000/logout",
      scope: ["phone", "email", "profile", "openid"],
      responseType: "code"
    }
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
  return `http://localhost:5000`;
};

export const API = {
  user: makeApiURL(process.env.REACT_APP_API_HOST_USER),
  reference: makeApiURL(process.env.REACT_APP_API_HOST_REFERENCE),
  firm: makeApiURL(process.env.REACT_APP_API_HOST_FIRM),
  brokerGroup: makeApiURL(process.env.REACT_APP_API_HOST_BROKER_GROUP),
  binder: makeApiURL(process.env.REACT_APP_API_HOST_BINDER),
  document: makeApiURL(process.env.REACT_APP_API_HOST_DOCUMENT),
  questionnaire: makeApiURL(process.env.REACT_APP_API_HOST_QUESTIONNAIRE)
};

/**
 * ETC
 */
export const DEFAULT_FIRM_ID = 1; // BESSO FIRM ID HARDCODED
