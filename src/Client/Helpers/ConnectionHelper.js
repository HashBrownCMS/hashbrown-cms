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
        return HashBrown.Helpers.RequestHelper.request('get', 'connections');
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
     * @param {String} id
     *
     * @return {Promise} Connection
     */
    static getConnectionById(id) {
        if(!id) { return Promise.resolve(null); }

        return HashBrown.Helpers.ResourceHelper.get(HashBrown.Models.Connection, 'connections', id);
    }

    /**
     * Sets the Media provider
     *
     * @param {String} id
     *
     * @returns {Promise}
     */
    static async setMediaProvider(id) {
        await super.setMediaProvider(HashBrown.Context.projectId, HashBrown.Context.environment, id);

        await HashBrown.Helpers.ResourceHelper.preloadAllResources();
        
        HashBrown.Views.Navigation.NavbarMain.reload();  
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
