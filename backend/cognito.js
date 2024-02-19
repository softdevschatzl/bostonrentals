// cognito.js
/**
 * @fileoverview
 * 
 * Implements Cognito authentication.
 * 
 */
require('dotenv').config();
const { CognitoUserPool, CognitoUser, AuthenticationDetails } = require('amazon-cognito-identity-js');
const userPoolId = process.env.COGNITO_USER_POOL_ID;
const appClientId =   process.env.COGNITO_CLIENT_ID;

const poolData = {
  UserPoolId: userPoolId,
  ClientId: appClientId
};

function getUserPool() {
  return new CognitoUserPool(poolData);
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
    Pool: getUserPool(),
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

function redirectToCognitoUI() {
  const cognitoDomain = 'https://alexandersrentals-nosms.auth.us-east-2.amazoncognito.com';
  const clientId = process.env.COGNITO_CLIENT_ID;
  const callbackUrl = 'http://localhost:8080/'; // change to alexandersrentals.com.
  const responseType = 'code';

  const loginUrl = `${cognitoDomain}/login?response_type=${responseType}&client_id=${clientId}&redirect_uri=${callbackUrl}`;

  return loginUrl;
}

module.exports = {
  getUserPool,
  signIn,
  redirectToCognitoUI,
};
