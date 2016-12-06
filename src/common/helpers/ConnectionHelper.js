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
     * Sets the Template provider
     *
     * @param {String} id
     *
     * @return {Promise} Promise
     */
    static setTemplateProvider(id) {
        return SettingsHelper.getSettings('providers')
        .then((providers) => {
            providers = providers || {};
            providers.template = id;

            SettingsHelper.setSettings('providers', providers)
        });
    }

    /**
     * Gets the Template provider
     *
     * @return {Promise} Connection object
     */
    static getTemplateProvider() {
        return new Promise((resolve, reject) => {
            SettingsHelper.getSettings('providers')
            .then((providers) => {
                providers = providers || {};

                if(providers.template) {
                    return this.getConnectionById(providers.template);  
                } else {
                    return Promise.reject(new Error('Template provider is not defined'));
                }
            })
            .then(resolve)
            .catch(reject);
        });
    }

    /**
     * Sets the Media provider
     *
     * @param {String} id
     *
     * @return {Promise} Promise
     */
    static setMediaProvider(id) {
        return SettingsHelper.getSettings('providers')
        .then((providers) => {
            providers = providers || {};
            providers.media = id;

            SettingsHelper.setSettings('providers', providers)
        });
    }

    /**
     * Gets the Media provider
     *
     * @return {Promise} Connection object
     */
    static getMediaProvider() {
        return new Promise((resolve, reject) => {
            SettingsHelper.getSettings('providers')
            .then((providers) => {
                providers = providers || {};

                if(providers.media) {
                    return this.getConnectionById(providers.media);
                } else {
                    return Promise.reject(new Error('Media provider is not defined'));
                }
            })
            .then(resolve)
            .catch(reject);
        });
    }
}

module.exports = ConnectionHelper;
