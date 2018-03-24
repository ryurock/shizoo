const EventEmitter = require('events').EventEmitter;

export class OAuthGithubEvents {
    private emitter: typeof EventEmitter;
    constructor() {
        this.emitter = new EventEmitter();
    }
}