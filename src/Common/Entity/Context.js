'use strict';

/**
 * A class for holding information about the current context
 *
 * @memberof HashBrown.Common.Entity
 */
class Context extends HashBrown.Entity.EntityBase {
    /**
     * Structure
     */
    structure() {
        this.def(HashBrown.Entity.User, 'user');
        this.def(HashBrown.Entity.Project, 'project');
        this.def(String, 'environment');
        this.def(Object, 'config', {});
        this.def(Object, 'i18n', {});
        this.def(Array, 'locales', [ 'en ']);
    }

    /**
     * Adopts values into this entity
     *
     * @param {Object} params
     */
    adopt(params) {
        params = params || {};

        if(params.project && params.project instanceof HashBrown.Entity.Project === false) {
            params.project = new HashBrown.Entity.Project(params.project);
        }
        
        if(params.user && params.user instanceof HashBrown.Entity.User === false) {
            params.user = new HashBrown.Entity.User(params.user);
        }

        super.adopt(params);
    }

    /**
     * Translates a string
     *
     * @param {String} string
     *
     * @return {String} Translated
     */
    translate(string) {
        if(!string || typeof string !== 'string' || !this.i18n || !this.i18n[string]) {
            return string;
        }

        return this.i18n[string];
    }
}

module.exports = Context;
