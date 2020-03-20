'use strict';

/**
 * A model for Users
 *
 * @memberof HashBrown.Common.Entity.Resource
 */
class User extends HashBrown.Entity.EntityBase {
    constructor(params) {
        super(params);
    }

    structure() {
        this.def(String, 'id');

        this.def(Boolean, 'isAdmin', false);
        
        this.def(String, 'username');
        this.def(String, 'fullName');
        this.def(String, 'email');
        this.def(String, 'theme');
        
        this.def(Object, 'scopes', {});
    }

    /**
     * Gets a human readable name
     *
     * @return {String} Name
     */
    getName() {
        return this.fullName || this.username || this.id;
    }

    /**
     * Gets all project scopes
     *
     * @param {String} project
     *
     * @returns {Array} scopes
     */
    getScopes(project) {
        checkParam(project, 'project', String, true);

        if(!this.scopes) { 
            this.scopes = {};
        }

        if(!this.scopes[project]) {
            this.scopes[project] = [];
        }

        return this.scopes[project];
    }
    
    /**
     * Sets all project scopes
     *
     * @param {String} project
     * @param {Array} scopes
     */
    setScopes(project, scopes) {
        checkParam(project, 'project', String, true);
        checkParam(scopes, 'scopes', Array, true);

        if(!this.scopes) {
            this.scopes = {};
        }

        this.scopes[project] = scopes;
    }
    

    /**
     * Checks if a user has a project scope
     *
     * @param {String} project
     * @param {String} scope
     *
     * @returns {Boolean} Has scope
     */
    hasScope(project, scope = '') {
        checkParam(project, 'project', String, true);
        checkParam(scope, 'scope', String);
        
        if(this.isAdmin) { return true; }

        if(!project) { return false; }
        if(!scope && !this.scopes[project]) { return false; }

        if(!Array.isArray(this.scopes[project])) {
            this.scopes[project] = [];
        }

        if(!scope || scope === 'content' || scope === 'media') { return true; }

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
