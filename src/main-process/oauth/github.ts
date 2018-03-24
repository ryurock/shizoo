/// <reference path="../../../node_modules/electron/electron.d.ts" />
/// <reference path="../../../node_modules/@types/node/index.d.ts" />

import { BrowserWindow, EventEmitter } from "electron";
const electron: typeof Electron = require('electron');
const ipcMain: typeof Electron.ipcMain = electron.ipcMain;
const SimpleOAuth2 = require('simple-oauth2');

import { OAuthGithubClient } from './github/client';
import { resolve } from "path";

export class OAuthGithub {
    loginWindow: Electron.BrowserWindow = null;
    client: OAuthGithubClient = null;

    public constructor(){
        this.client = new OAuthGithubClient();
    }

    public async authorization() {
        this.loginWindow = new BrowserWindow({width: 400, height: 600});
        this.loginWindow.loadURL(this.client.authorizationUri());
        let token = await this.authorizedToken();

        this.loginWindow.close();
    }

    private async authorizedToken() {
        return new Promise((resolve, reject) => {
            const client: OAuthGithubClient = this.client;
            const loginWindow: BrowserWindow = this.loginWindow;
            const fetchAccessToken = async (url):Promise<any> => {
                const tokenState = await client.getToken(url);
                resolve(tokenState.token);
            };

            this.loginWindow.webContents.on('did-get-redirect-request', (event:Electron.Event, oldUrl:string, newUrl:string ) => {
                fetchAccessToken(newUrl);
            });

            this.loginWindow.webContents.on('will-navigate', (event:Electron.Event, url:string):void => {
                fetchAccessToken(url);
            });
        });
    }
}