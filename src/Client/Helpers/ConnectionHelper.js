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

        await HashBrown.Helpers.ResourceHelper.reloadResource('media');
    }
    
    /**
     * Starts a tour of the Connection section
     */
    static async startTour() {
        if(location.hash.indexOf('connections/') < 0) {
            location.hash = '/connections/';
        }
       
        await new Promise((resolve) => { setTimeout(() => { resolve(); }, 500); });
            
        await UI.highlight('.navbar-main__tab[data-route="/connections/"]', 'This the Connections section, where you will configure how HashBrown talks to the outside world.', 'right', 'next');

        await UI.highlight('.navbar-main__pane[data-route="/connections/"]', 'Here you will find all of your Connections. You can right click here to create a new Connection.', 'right', 'next');
        
        let editor = document.querySelector('.editor--connection');

        if(editor) {
            await UI.highlight('.editor--connection', 'This is the Connection editor, where you edit Connections.', 'left', 'next');
        } else {
            await UI.highlight('.page--environment__space--editor', 'This is where the Connection editor will be when you click a Connection.', 'left', 'next');
        }
    }

    /**
     * Gets the Media provider
     *
     * @return {HashBrown.Models.Connection} Connection object
     */
    static async getMediaProvider() {
        let providers = await HashBrown.Helpers.SettingsHelper.getSettings(HashBrown.Context.projectId, HashBrown.Context.environment, 'providers');
        
        if(providers.media) {
            return await this.getConnectionById(providers.media);
        } else {
            return null;
        }
    }
}

module.exports = ConnectionHelper;
