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
function signIn(username, password) {
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
      onSuccess: (result) => resolve(result),
      onFailure: (err) => reject(err),
    });
  });
}

function redirectToCognitoUI() {
  const cognitoDomain = 'https://alexanderrentals-login.auth.us-east-2.amazoncognito.com';
  const clientId = '22gbg0ei7ieq779d8pp04qq9m';
  const callbackUrl = encodeURIComponent('http://localhost:8080/callback'); // change to alexandersrentals.com.
}
