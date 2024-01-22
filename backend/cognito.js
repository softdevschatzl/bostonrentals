// cognito.js
/**
 * @fileoverview
 * 
 * Implements Cognito authentication.
 * 
 */
require('dotenv').config();
const { CognitoUserPool, CognitoUser, AuthenticationDetails } = require('amazon-cognito-identity-js');
const userPoolId = process.env.USER_POOL_ID;
const appClientId = process.env.APP_CLIENT_ID;

const poolData = {
  UserPoolId: userPoolId,
  ClientId: appClientId
};

function getUserPool() {
  return new CognitoUserPool(poolData);
}

// Implements Cognito authentication.
function signIn(username, password) {
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
      onSuccess: (result) => resolve(result),
      onFailure: (err) => reject(err),
    });
  });
}

function redirectToCognitoUI() {
  const cognitoDomain = 'https://alexanderrentals-login.auth.us-east-2.amazoncognito.com';
  const clientId = process.env.APP_CLIENT_ID;
  const callbackUrl = 'http://localhost:8080/'; // change to alexandersrentals.com.
  const responseType = 'token';

  const loginUrl = `${cognitoDomain}/login?response_type=${responseType}&client_id=${clientId}&redirect_uri=${callbackUrl}`;

  return loginUrl;
}

module.exports = {
  getUserPool,
  signIn,
  redirectToCognitoUI,
};
