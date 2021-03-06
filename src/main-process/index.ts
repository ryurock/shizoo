/// <reference path="../../node_modules/electron/electron.d.ts" />

const electron = require('electron');
const ipcMain: typeof Electron.ipcMain = electron.ipcMain;
const BrowserWindow: typeof Electron.BrowserWindow = electron.BrowserWindow;
const app: Electron.App = electron.app;
import {OAuthGithub} from './oauth/github';

class MyApplication {
    mainWindow: Electron.BrowserWindow = null;
    oAuthGithub: OAuthGithub = null;

    constructor(public app: Electron.App){
        this.app.on('window-all-closed', this.onWindowAllClosed);
        this.app.on('ready', this.onReady);
    }

    onWindowAllClosed(){
        if(process.platform != 'darwin'){
            this.app.quit();
        }
    }

    onReady(){
        this.mainWindow = new BrowserWindow({
            width: 1024,
            height: 600,
            minWidth: 500,
            minHeight: 200,
            acceptFirstMouse: true
        });
        this.mainWindow.loadURL('file://' + __dirname + '/../../index.html');
        this.mainWindow.webContents.openDevTools();
        ipcMain.on('asynchronous-message', (event: Electron.Event, arg: string) => {
            if (arg == "oauth-github") {
               let oAuthGithub = new OAuthGithub();
               oAuthGithub.authorization(event);
            }
        })

        this.mainWindow.on('closed', () => {
            this.mainWindow = null;
        });
    }
}

const myapp = new MyApplication(app);