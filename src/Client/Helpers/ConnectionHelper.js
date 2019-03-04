'use strict';

const ConnectionHelperCommon = require('Common/Helpers/ConnectionHelper');

/**
 * The client side connection helper
 *
 * @memberof HashBrown.Client.Helpers
 */
class ConnectionHelper extends ConnectionHelperCommon {
    /**
     * Gets all connections
     *
     * @return {Promise} Array of Connections
     */
    static getAllConnections() {
        return Promise.resolve(resources.connections);
    }
    
    /**
     * Gets a Connection by id (sync)
     *
     * @param {string} id
     *
     * @return {Promise} Connection
     */
    static getConnectionByIdSync(id) {
        checkParam(id, 'id', String);

        for(let i in resources.connections) {
            let connection = resources.connections[i];

            if(connection.id == id) {
                return connection;
            }
        }
    }
    
    /**
     * Gets a Connection by id
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @return {Promise} Connection
     */
    static getConnectionById(project, environment, id) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(id, 'id', String);

        for(let i in resources.connections) {
            let connection = resources.connections[i];

            if(connection.id == id) {
                return Promise.resolve(connection);
            }
        }

        return Promise.reject(new Error('No Connection by id "' + id + '" was found'));
    }

    /**
     * Sets the Media provider
     *
     * @param {String} id
     *
     * @returns {Promise}
     */
    static setMediaProvider(id) {
        return super.setMediaProvider(
            HashBrown.Helpers.ProjectHelper.currentProject,
            HashBrown.Helpers.ProjectHelper.currentEnvironment,
            id
        ).then(() => {
            return HashBrown.Helpers.RequestHelper.reloadResource('media');  
        })
        .then(() => {
            HashBrown.Views.Navigation.NavbarMain.reload();  
        });
    }
    
    /**
     * Gets the Media provider
     *
     * @returns {Promise} Connection
     */
    static getMediaProvider() {
        return super.getMediaProvider(
            HashBrown.Helpers.ProjectHelper.currentProject,
            HashBrown.Helpers.ProjectHelper.currentEnvironment
        );
    }
}

module.exports = ConnectionHelper;
