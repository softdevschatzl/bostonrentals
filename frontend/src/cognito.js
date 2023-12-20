// cognito.js
/**
 * @fileoverview
 * 
 * Implements Cognito authentication.
 * 
 */
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'us-east-2_HuBSHpYMD',
  ClientId: '22gbg0ei7ieq779d8pp04qq9m'
};

function getUserPool() {
  return new CognitoUserPool(poolData);
}

// Implements Cognito authentication.
export function signIn(username, password) {
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

export function redirectToCognitoUI() {
  const cognitoDomain = 'https://alexanderrentals-login.auth.us-east-2.amazoncognito.com';
  const clientId = '22gbg0ei7ieq779d8pp04qq9m';
  const callbackUrl = encodeURIComponent('http://localhost:8080/callback'); // change to alexandersrentals.com.
  const responseType = 'token';

  const loginUrl = `${cognitoDomain}/login?response_type=${responseType}&client_id=${clientId}&redirect_uri=${callbackUrl}`;

  window.location.href = loginUrl;
}
