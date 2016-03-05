'use strict';

class Controller {
    constructor(app) {
        this.app = app;
    }

    getPrefix() {
        let name = this.constructor.name.replace('Controller', '').toLowerCase();
        let prefix = '/' + name;

        return prefix;
    }

    get(url, handler) {
        this.app.get(this.getPrefix(), handler);
    }
    
    post(url, handler) {
        this.app.post(this.getPrefix(), handler);
    }
}

module.exports = Controller;
