'use strict';

/**
 * The helper class for Connections
 *
 * @memberof HashBrown.Common.Service
 */
class ConnectionService {
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

        return HashBrown.Service.SettingsService.getSettings(project, environment, 'providers')
        .then((providers) => {
            providers = providers || {};
            providers.media = id;

            return HashBrown.Service.SettingsService.setSettings(project, environment, 'providers', providers)
        });
    }
}

module.exports = ConnectionService;
