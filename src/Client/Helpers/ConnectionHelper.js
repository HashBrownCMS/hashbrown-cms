'use strict';

const ConnectionHelperCommon = require('Common/Helpers/ConnectionHelper');
const Connection = require('Common/Models/Connection');
const ProjectHelper = require('Client/Helpers/ProjectHelper');
const RequestHelper = require('Client/Helpers/RequestHelper');

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
    static getConnectionByIdSync(
        id = requiredParam('id')
    ) {
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
     * @param {string} id
     *
     * @return {Promise(Connection)} promise
     */
    static getConnectionById(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        id = requiredParam('id')
    ) {
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
            ProjectHelper.currentProject,
            ProjectHelper.currentEnvironment,
            id
        ).then(() => {
            return RequestHelper.reloadResource('media');  
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
            ProjectHelper.currentProject,
            ProjectHelper.currentEnvironment
        );
    }
    
    /**
     * Sets the Template provider
     *
     * @param {String} id
     *
     * @returns {Promise}
     */
    static setTemplateProvider(id) {
        return super.setTemplateProvider(
            ProjectHelper.currentProject,
            ProjectHelper.currentEnvironment,
            id
        ).then(() => {
            return RequestHelper.reloadResource('templates');  
        })
        .then(() => {
            HashBrown.Views.Navigation.NavbarMain.reload();  
        });
    }
    
    /**
     * Gets the Template provider
     *
     * @returns {Promise} Connection
     */
    static getTemplateProvider() {
        return super.getTemplateProvider(
            ProjectHelper.currentProject,
            ProjectHelper.currentEnvironment
        );
    }
}

module.exports = ConnectionHelper;
