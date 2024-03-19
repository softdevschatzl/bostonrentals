// cognito.js
/**
 * @fileoverview
 * 
 * Implements Cognito authentication.
 * 
 */
const { CognitoUserPool, CognitoUser, AuthenticationDetails } = require('amazon-cognito-identity-js');
const AWS = require('aws-sdk');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

const secretName = "AlexandersRentalsSecrets";
const region = "us-east-2";

const secretsManagerClient = new SecretsManagerClient({ region: region });

async function getSecrets() {
  try {
    const response = await secretsManagerClient.send(new GetSecretValueCommand({ SecretId: secretName }));
    const secrets = JSON.parse(response.SecretString);
    return secrets;
  } catch (err) {
    console.error('getSecrets error:', err);
    throw err;
  }
}

async function initializeCognito() {
  const secrets = await getSecrets();
  
  const poolData = {
    UserPoolId: secrets.COGNITO_USER_POOL_ID,
    ClientId: secrets.COGNITO_CLIENT_ID,
  };
  return new CognitoUserPool(poolData);
}

let userPool = initializeCognito();

async function init() {
  if (!userPool) {
    userPool = await initializeCognito();
  }
}

// Implements Cognito authentication.
function signIn(username, password, callback) {
  const authenticationData = {
    Username: username,
    Password: password,
  };
  const authenticationDetails = new AuthenticationDetails(authenticationData);

  const userData = {
    Username: username,
    Pool: userPool,
  };
  const cognitoUser = new CognitoUser(userData);

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        const accessToken = result.getAccessToken().getJwtToken();
        const idToken = result.getIdToken().getJwtToken();
        // Get and securely store the refreshToken.
        callback(null, { accessToken, idToken });
      },
      onFailure: (err) => {
        console.error('signIn error:', err);
        callback(err, null);
      },
    });
  });
}

async function redirectToCognitoUI() {
  const secrets = await getSecrets();

  const cognitoDomain = 'https://alexandersrentals-nosms.auth.us-east-2.amazoncognito.com';
  const clientId = secrets.COGNITO_CLIENT_ID;
  const callbackUrl = 'https://alexandersrentals.com/';
  const responseType = 'code';

  const loginUrl = `${cognitoDomain}/login?client_id=${clientId}&response_type=${responseType}&scope=email+openid+profile&redirect_uri=${callbackUrl}`;

  console.log('loginUrl:', loginUrl);
  return loginUrl;
}

module.exports = {
  init,
  signIn,
  redirectToCognitoUI,
};
