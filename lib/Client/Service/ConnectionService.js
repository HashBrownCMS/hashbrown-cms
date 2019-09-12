'use strict';

/**
 * The client side connection helper
 *
 * @memberof HashBrown.Client.Service
 */
class ConnectionService extends require('Common/Service/ConnectionService') {
    /**
     * Gets all connections
     *
     * @return {Array} Connections
     */
    static async getAllConnections() {
        return await HashBrown.Service.ResourceService.getAll(HashBrown.Entity.Resource.Connection, 'connections');
    }
    
    /**
     * Gets a Connection by id
     *
     * @param {String} id
     *
     * @return {HashBrown.Entity.Resource.Connection} Connection
     */
    static async getConnectionById(id) {
        return await HashBrown.Service.ResourceService.get(HashBrown.Entity.Resource.Connection, 'connections', id);
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

        HashBrown.Service.EventService.trigger('resource');  
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
     * @return {HashBrown.Entity.Resource.Connection} Connection object
     */
    static async getMediaProvider() {
        let providers = await HashBrown.Service.SettingsService.getSettings(HashBrown.Context.projectId, HashBrown.Context.environment, 'providers');
        
        if(providers && providers.media) {
            return await this.getConnectionById(providers.media);
        } else {
            return null;
        }
    }
}

module.exports = ConnectionService;
