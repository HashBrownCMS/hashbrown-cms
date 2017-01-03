'use strict';

let Entity = require('./Entity');

class Password extends Entity {
    structure() {
        this.def(String, 'hash');
        this.def(String, 'salt');
    }
}

class User extends Entity {
    constructor(params) {
        super(params);
    }

    structure() {
        this.def(String, 'id');
        this.def(Boolean, 'isAdmin', false);
        this.def(Boolean, 'isCurrent', false);
        this.def(String, 'username');
        this.def(String, 'fullName');
        this.def(String, 'email');
        this.def(Object, 'scopes', {});
    }
    
    /**
     * Gets all project scopes
     *
     * @param {String} project
     *
     * @returns {Array} scopes
     */
    getScopes(project) {
        if(!this.scopes[project]) {
            this.scopes[project] = [];
        }

        return this.scopes[project];
    }

    /**
     * Checks if a user has a project scope
     *
     * @param {String} project
     * @param {String} scope
     *
     * @returns {Boolean} hasScope
     */
    hasScope(project, scope) {
        if(!scope && !this.scopes[project]) { return false; }

        if(!this.scopes[project]) {
            this.scopes[project] = [];
        }

        return this.scopes[project].indexOf(scope) > -1;
    }
}

module.exports = User;
