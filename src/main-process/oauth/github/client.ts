const SecretOAuth  = require('../../../../config/secret.json').oauth.github;
const queryString  = require('querystring');
const Url          = require('url');
const SimpleOAuth2 = require('simple-oauth2');

export class OAuthGithubClient {
    credentials: {key: { key: string  } } = SecretOAuth;
    auth: { [key: string]: string } = {
        tokenHost: 'https://github.com',
        tokenPath: '/login/oauth/access_token',
        authorizePath: '/login/oauth/authorize'  
    };

    client: typeof SimpleOAuth2 = SimpleOAuth2.create({
        auth: this.auth,
        client: this.credentials
    });

    constructor() {
    }

    async getToken(url:string):Promise<any> {
        const query = queryString.parse(Url.parse(url).query);
        const options: { [key:string]: string } = {
            code: query.code,
            redirect_uri: "https://localhost/oauth2callback",
            scope: "notifications"
        }
        try {
            const result: typeof Promise  = await this.client.authorizationCode.getToken(options);
            return this.client.accessToken.create(result);
        } catch(error) {
            console.log(error);
        }
    }

    accessToken(tokenObject):typeof SimpleOAuth2.AccessToken {
        return this.client.accessToken.create(tokenObject);
    }

    authorizationUri(): string {
        return this.client.authorizationCode.authorizeURL({
            redirect_uri: 'https://localhost/oauth2callback',
            scope: 'notifications,repo',
            state: '3(#0/!~'
        });
    }
}