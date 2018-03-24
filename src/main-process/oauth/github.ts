/// <reference path="../../../node_modules/electron/electron.d.ts" />
/// <reference path="../../../node_modules/@types/node/index.d.ts" />

import { BrowserWindow, EventEmitter } from "electron";
const electron: typeof Electron = require('electron');
const ipcMain: typeof Electron.ipcMain = electron.ipcMain;
const SimpleOAuth2 = require('simple-oauth2');
const eventEmitter = require('events').EventEmitter;

import { OAuthGithubClient } from './github/client';

export class OAuthGithub {
    loginWindow: Electron.BrowserWindow = null;
    client: OAuthGithubClient = null;
    authEvent: EventEmitter = null;
    
    constructor(){
        this.client = new OAuthGithubClient();
        this.authEvent = new eventEmitter();
    }

    async authorization() {
        this.loginWindow = new BrowserWindow({width: 400, height: 600});
        this.loginWindow.loadURL(this.client.authorizationUri());
        // this.didGetRedirectRequest();
        this.onAuthorization();
        this.authEvent.on('authorized', (accessToken:string) => {
            console.log(accessToken);
        });
    }

    onAuthorization() {
        const ev = this.authEvent;
        const client: OAuthGithubClient = this.client;
        const fetchAccessToken = async (url):Promise<any> => {
            const tokenState = await client.getToken(url);
            ev.emit('authorized', tokenState.token);
        };

        this.loginWindow.webContents.on('did-get-redirect-request', (event:Electron.Event, oldUrl:string, newUrl:string ) => {
            fetchAccessToken(newUrl);
        });

        this.loginWindow.webContents.on('will-navigate', (event:Electron.Event, url:string):void => {
            fetchAccessToken(url);
        });   
    }
}