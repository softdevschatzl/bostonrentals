import AWS from 'aws-sdk';
import { CognitoUserPool } from 'amazon-cognito-identity-js';

let userPool;

async function configureAWS() {
  if (userPool) return userPool;

  try {
    const response = await fetch('/api/cognito-config');
    const config = await response.json();

    console.log('Cognito config: ', config);

    AWS.config.update({
      region: config.cognitoRegion,
    });

    const userPool = new CognitoUserPool({
      UserPoolId: config.cognitoUserPoolId,
      ClientId: config.cognitoClientId,
    });

    return userPool;
  } catch (error) {
    console.error('Failed to fetch AWS configuration.', error);
    throw error;
  }
}

export default configureAWS;