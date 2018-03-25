/// <reference path="../../../node_modules/electron/electron.d.ts" />
/// <reference path="../../../node_modules/@types/node/index.d.ts" />

import { BrowserWindow, EventEmitter } from "electron";
const electron: typeof Electron = require('electron');
const ipcMain: typeof Electron.ipcMain = electron.ipcMain;
const SimpleOAuth2 = require('simple-oauth2');

import { OAuthGithubClient } from './github/client';
const DataStore = require('nedb');
import * as DB from '../data-store/index';


export class OAuthGithub {
    private loginWindow: Electron.BrowserWindow = null;
    private client: OAuthGithubClient = null;

    public constructor(){
        this.client = new OAuthGithubClient();
    }

    public async authorization(event: Electron.Event):Promise<any> {
        this.loginWindow = new BrowserWindow({width: 400, height: 600});
        this.loginWindow.loadURL(this.client.authorizationUri());
        const token:{} = await this.authorizedToken();
        const db:typeof DataStore = DB.Adapter.neDb();
        db.findOne({"token.access_token": token["access_token"]}, (err, doc) => {
            if ( doc == null ){
                db.insert({token: token});
            }
        });
        event.sender.send('asynchronous-reply', token);
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