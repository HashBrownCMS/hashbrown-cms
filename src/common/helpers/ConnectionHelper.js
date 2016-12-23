'use strict';

class ConnectionHelper {
    /**
     * Gets all connections
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Promise(Array)} connections
     */
    static getAllConnections(
        project = requiredParam('project'),
        environment = requiredParam('environment')
    ) {
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
    static setTemplateProvider(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        id = requiredParam('id')
    ) {
        return SettingsHelper.getSettings(project, environment, 'providers')
        .then((providers) => {
            providers = providers || {};
            providers.template = id;

            SettingsHelper.setSettings(project, environment, 'providers', providers)
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
    static getTemplateProvider(
        project = requiredParam('project'),
        environment = requiredParam('environment')
    ) {
        return SettingsHelper.getSettings(project, environment, 'providers')
        
        // Previously, providers were set project-wide, so retrieve automatically if needed
        .then((providers) => {
            if(!providers) {
                return SettingsHelper.getSettings(project, null, 'providers');
            
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
                return Promise.reject(new Error('Template provider is not defined'));
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
    static setMediaProvider(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        id = requiredParam('id')
    ) {
        return SettingsHelper.getSettings(project, environment, 'providers')
        .then((providers) => {
            providers = providers || {};
            providers.media = id;

            SettingsHelper.setSettings(project, environment, 'providers', providers)
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
    static getMediaProvider(
        project = requiredParam('project'),
        environment = requiredParam('environment')
    ) {
        return SettingsHelper.getSettings(project, environment, 'providers')
        
        // Previously, providers were set project-wide, so retrieve automatically if needed
        .then((providers) => {
            if(!providers) {
                return SettingsHelper.getSettings(project, null, 'providers');
            
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
                return Promise.reject(new Error('Media provider is not defined'));
            }
        });
    }
}

module.exports = ConnectionHelper;
