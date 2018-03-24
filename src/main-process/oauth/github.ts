/// <reference path="../../../node_modules/electron/electron.d.ts" />
/// <reference path="../../../node_modules/@types/node/index.d.ts" />

import { BrowserWindow } from "electron";

const electron: typeof Electron = require('electron');
const ipcMain: typeof Electron.ipcMain = electron.ipcMain;

const SecretOAuth  = require('../../../config/secret.json').oauth.github;
import { OAuthGithubClient } from './github/client';

export class OAuthGithub {
    loginWindow: Electron.BrowserWindow = null;
    client: OAuthGithubClient = null;
    constructor(loginWindow: Electron.BrowserWindow){
        this.client = new OAuthGithubClient();
        this.loginWindow = loginWindow;
        this.loginWindow.loadURL(this.client.authorizationUri());
        this.didGetRedirectRequest();
        this.willNavigate();
    }

    didGetRedirectRequest() {
        const client: OAuthGithubClient = this.client;
        this.loginWindow.webContents.on('did-get-redirect-request', (event:Electron.Event, oldUrl:string, newUrl:string ) => {
            const fetchAccessToken = async ():Promise<any> => {
                const tokenObject:{} = await client.getToken(newUrl);
                const accessToken = client.accessToken(tokenObject);
                console.log(accessToken)
            };
            fetchAccessToken();
        });
    }


    willNavigate() {
        console.log('will-navigate');
        this.loginWindow.webContents.on('will-navigate', (event:Electron.Event, url:string):void => {
            console.log(url);
        })

    }

}