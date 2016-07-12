'use strict';

/**
 * The base class for all controllers
 */
class Controller {
    /**
     * Initialises this controller
     */
    static init(app) {
        for(let method of this.getAllMethods()) {
            let path = '/api/:project/:environment/' + this.getPrefix() + '/' + method.name.replace(/post|get/,'').toLowerCase();
            let isGet = method.name.substring(0, 3).toLowerCase() === 'get';
            let isPost = method.name.substring(0, 4).toLowerCase() === 'post';

            if(isGet) {
                app.get(path, method);
            } else if(isPost) {
                app.post(path, method);
            }
        }
    }

    /**
     * Gets a list of all methods
     *
     * @returns {Array} methods
     */
    static getAllMethods() {
        let methods = [];

        for(let name of Object.getOwnPropertyNames(this)) {
            if(typeof this[name] === 'function') {
                methods[methods.length] = this[name];
            }
        }

        return methods;
    }

    /**
     * Gets the prefix for this controller
     *
     * @return {String} prefix
     */
    static getPrefix() {
        let name = this.name.replace('Controller', '').toLowerCase();
        let prefix = name;

        return prefix;
    }
}

module.exports = Controller;
