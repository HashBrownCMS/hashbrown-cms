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
        this.def(String, 'locale');
        
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
     * @param {String} projectId
     *
     * @returns {Array} Scopes
     */
    getScopes(projectId) {
        checkParam(projectId, 'projectId', String, true);

        if(!this.scopes) { 
            this.scopes = {};
        }

        return this.scopes[projectId];
    }
    
    /**
     * Sets all project scopes
     *
     * @param {String} projectId
     * @param {Array} scopes
     */
    setScopes(projectId, scopes) {
        checkParam(projectId, 'projectId', String, true);
        checkParam(scopes, 'scopes', Array, true);

        if(!this.scopes) {
            this.scopes = {};
        }

        this.scopes[projectId] = scopes;
    }
    

    /**
     * Checks if a user has a project scope
     *
     * @param {String} projectId
     * @param {String} scope
     *
     * @returns {Boolean} Has scope
     */
    hasScope(projectId, scope = '') {
        checkParam(projectId, 'projectId', String, true);
        checkParam(scope, 'scope', String);

        if(this.isAdmin) { return true; }

        if(!projectId) { return false; }
        if(!this.scopes[projectId]) { return false; }

        if(!Array.isArray(this.scopes[projectId])) {
            this.scopes[projectId] = [];
        }

        if(!scope || scope === 'content' || scope === 'media') { return true; }

        return this.scopes[projectId].indexOf(scope) > -1;
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
