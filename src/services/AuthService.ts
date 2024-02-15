import { Amplify } from 'aws-amplify';
import { fetchAuthSession, signIn, signOut } from 'aws-amplify/auth';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
//@ts-ignore
import outputs from 'outputs.json';

const awsRegion = 'eu-west-1';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: outputs.AuthStack.SpaceUserPoolId,
      userPoolClientId: outputs.AuthStack.SpaceUserPoolClientId,
    }
  }
})

export class AuthService {
  public jwtToken: string | undefined;
  private user: any;
  private temporaryCredentials: object | undefined;

  public isAuthorized() {
    if(this.user) {
      console.log('AUTHSERVICE, IF condition', this.user);
      return true;
    }
    console.log('AUTHSERVICE, ELSE condition', this.user);
    return false;
  }

  public async login(username: string, password: string): Promise<Object | undefined> {
    try {
     await signIn({ username, password, options: { authFlowType: 'USER_PASSWORD_AUTH' }});
     this.user = await fetchAuthSession();
     this.jwtToken = this.user?.tokens?.idToken?.toString();
     console.log('USER', this.user);
     return this.user;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public async logout() {
    try {
      await signOut({ global: true });
      this.user = undefined;
      console.log('AFTER SIGNOUT', this.user)
    } catch (error) {
      console.log(error);
    }
  } 

  public getUserName() {
    return this.user?.tokens?.signInDetails?.loginId;
  }

  public async getTemporaryCredentials() {
    if(this.temporaryCredentials) {
      return this.temporaryCredentials
    } else {
      this.temporaryCredentials = await this.generateTemporaryCredentials();
      return this.temporaryCredentials;
    }
  }

  private async generateTemporaryCredentials() {
    const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/${outputs.AuthStack.SpaceUserPoolId}`;
    const cognitoIdentity = new CognitoIdentityClient({
        credentials: fromCognitoIdentityPool({
            clientConfig: {
                region: awsRegion
            },
            identityPoolId: outputs.AuthStack.SpaceIdentityPoolId,
            logins: {
                [cognitoIdentityPool]: this.jwtToken!
            }
        })
    });
    const credentials = await cognitoIdentity.config.credentials();
    return credentials;
}
}