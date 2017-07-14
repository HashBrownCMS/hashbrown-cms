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
     * @param {Boolean} upsert
     *
     * @returns {Array} scopes
     */
    getScopes(project, upsert) {
        if(!this.scopes) { 
            this.scopes = {};
        }

        if(!this.scopes[project] && upsert) {
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
        if(this.isAdmin) { return true; }

        if(!project) { return false; }
        if(!scope && !this.scopes[project]) { return false; }

        if(!Array.isArray(this.scopes[project])) {
            this.scopes[project] = [];
        }

        if(!scope) {
            return true;
        }

        return this.scopes[project].indexOf(scope) > -1;
    }

    /**
     * Removes a scope
     *
     * @param {String} project
     * @param {String|Boolean} scope
     */
    removeScope(project, scope) {
        if(!project) { return; }
        if(!this.scopes) { return; }
        if(!this.scopes[project]) { return; }

        if(scope) {
            var scopeIndex = this.scopes[project].indexOf(scope);

            this.scopes[project].splice(scopeIndex, 1);

        } else {
            delete this.scopes[project];

        }
    }

    /**
     * Grants a user a scope
     *
     * @param {String} project
     * @param {String} scope
     */
    giveScope(project, scope) {
        if(!project) { return; }

        if(!this.scopes) {
            this.scopes = {};
        }

        if(!this.scopes[project]) {
            this.scopes[project] = [];
        }

        if(!scope) { return; }
        if(this.scopes[project].indexOf(scope) > -1) { return; }

        this.scopes[project].push(scope);
    }
}

module.exports = User;
