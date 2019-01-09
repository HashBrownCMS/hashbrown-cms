'use strict';

/**
 * A helper class for managing projects client side
 *
 * @memberof HashBrown.Client.Helpers
 */
class ProjectHelper {
    /**
     * Gets the current project id
     *
     * @return {String} Project id
     */
    static get currentProject() {
        let parts = location.pathname.substring(1).split('/');

        if(parts.indexOf('dashboard') > -1) { return null; }

        return parts[0];
    }
    
    /**
     * Gets the current environment name
     *
     * @return {String} Environment name
     */
    static get currentEnvironment() {
        let parts = location.pathname.substring(1).split('/');

        if(parts.indexOf('dashboard') > -1) { return null; }

        return parts[1];
    }
}

module.exports = ProjectHelper;
