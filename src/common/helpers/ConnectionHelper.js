'use strict';

class ConnectionHelper {
    /**
     * Gets all connections
     *
     * @returns {Promise(Array)} connections
     */
    static getAllConnections() {
        return new Promise((resolve, reject) => {
            resolve([]);
        });
    }
    
    /**
     * Gets the Template provider
     *
     * @return {Promise(Connection)} provider
     */
    static getTemplateProvider() {
        return new Promise((resolve, reject) => {
            this.getAllConnections()
            .then((connections) => {
                let foundProvider = false;

                for(let i in connections) {
                    if(connections[i].provideTemplates) {
                        foundProvider = true;

                        resolve(connections[i]);
                        break;
                    }
                }


                if(!foundProvider) {
                    reject(new Error('Found no connection with "provideTemplates" switched on'));
                }
            });            
        });
    }

    /**
     * Gets the Media provider
     *
     * @return {Promise(Connection)} provider
     */
    static getMediaProvider() {
        return new Promise((resolve, reject) => {
            this.getAllConnections()
            .then((connections) => {
                let foundProvider = false;

                for(let i in connections) {
                    if(connections[i].provideMedia) {
                        foundProvider = true;

                        resolve(connections[i]);
                        break;
                    }
                }

                if(!foundProvider) {
                    reject(new Error('Found no connection with "provideMedia" switched on'));
                }
            });            
        });
    }
}

module.exports = ConnectionHelper;
