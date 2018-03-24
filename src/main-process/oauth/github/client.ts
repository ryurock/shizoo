const SecretOAuth  = require('../../../../config/secret.json').oauth.github;
const queryString  = require('querystring');
const Url          = require('url');

export class OAuthGithubClient {
    credentials: {key: { key: string  } } = SecretOAuth;
    auth: { [key: string]: string } = {
        tokenHost: 'https://github.com',
        tokenPath: '/login/oauth/access_token',
        authorizePath: '/login/oauth/authorize'  
    };

    client: any = null;

    constructor(){
        this.client = require('simple-oauth2').create({
                auth: this.auth,
                client: this.credentials
        });
    }

    async getToken(url:string) {
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

    accessToken(tokenObject) {
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