'use strict';

const Connection = require('Common/Models/Connection');

/**
 * The helper class for Connections
 *
 * @memberof HashBrown.Common.Helpers
 */
class ConnectionHelper {
    /**
     * Gets all connections
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Promise(Array)} connections
     */
    static getAllConnections(project, environment) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);

        return Promise.resolve();
    }
    
    /**
     * Sets the Template provider
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @return {Promise} Promise
     */
    static setTemplateProvider(project, environment, id = null) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);

        return HashBrown.Helpers.SettingsHelper.getSettings(project, environment, 'providers')
        .then((providers) => {
            providers = providers || {};
            providers.template = id;

            return HashBrown.Helpers.SettingsHelper.setSettings(project, environment, 'providers', providers)
        });
    }

    /**
     * Gets the Template provider
     *
     * @param {String} project
     * @param {String} environment
     *
     * @return {Promise} Connection object
     */
    static getTemplateProvider(project, environment) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);

        return HashBrown.Helpers.SettingsHelper.getSettings(project, environment, 'providers')
        
        // Previously, providers were set project-wide, so retrieve automatically if needed
        .then((providers) => {
            if(!providers) {
                return HashBrown.Helpers.SettingsHelper.getSettings(project, null, 'providers');
            
            } else {
                return Promise.resolve(providers);
            }
        })

        // Return requested provider
        .then((providers) => {
            providers = providers || {};

            if(providers.template) {
                return this.getConnectionById(project, environment, providers.template);  
            } else {
                return Promise.resolve(null);
            }
        });
    }

    /**
     * Sets the Media provider
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @return {Promise} Promise
     */
    static setMediaProvider(project, environment, id = null) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);

        return HashBrown.Helpers.SettingsHelper.getSettings(project, environment, 'providers')
        .then((providers) => {
            providers = providers || {};
            providers.media = id;

            return HashBrown.Helpers.SettingsHelper.setSettings(project, environment, 'providers', providers)
        });
    }

    /**
     * Gets the Media provider
     *
     * @param {String} project
     * @param {String} environment
     *
     * @return {Promise} Connection object
     */
    static getMediaProvider(project, environment) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);

        return HashBrown.Helpers.SettingsHelper.getSettings(project, environment, 'providers')
        
        // Previously, providers were set project-wide, so retrieve automatically if needed
        .then((providers) => {
            if(!providers) {
                return HashBrown.Helpers.SettingsHelper.getSettings(project, null, 'providers');
            
            } else {
                return Promise.resolve(providers);
            }
        })

        // Return requested provider
        .then((providers) => {
            providers = providers || {};

            if(providers.media) {
                return this.getConnectionById(project, environment, providers.media);
            } else {
                return Promise.resolve(null);
            }
        });
    }
}

module.exports = ConnectionHelper;
