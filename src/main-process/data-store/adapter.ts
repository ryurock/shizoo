const NeDb = require('nedb');
const Path = require('path');
const electron: typeof Electron = require('electron');

export class Adapter {
    static neDb() {
        return new NeDb({filename: Path.join(electron.app.getPath('home'), '.shizoo.db'), autoload: true });
    }
}