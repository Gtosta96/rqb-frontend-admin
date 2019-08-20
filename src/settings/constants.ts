/**
 * PATHS
 */
export enum EPaths {
  ROOT = "/",
  DASHBOARD = "/dashboard",
  LOGIN = "/login",

  USERS = "/users"
}

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
 * APIS
 */
const makeApiURL = (host: string | undefined) => {
  const env = process.env.REACT_APP_ENDPOINT_ENVIRONMENT;

  if (!env || !host || host.includes("http")) {
    throw new Error("INVALID ENV/HOST RECEIVED");
  }

  return `https://${host}/${env}`;
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
  cognito: makeApiURL(process.env.REACT_APP_API_HOST_COGNITO)
};
