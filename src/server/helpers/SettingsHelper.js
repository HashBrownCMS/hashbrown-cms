'use strict';

let Promise = require('bluebird');

class SettingsHelper {
    /**
     * Gets all settings
     * This method must be overridden by a plugin
     *
     * @return {Promise} promise
     */
    static getSettings() {
        return new Promise(function(callback) {
            callback([]);   
        });
    }
    
    /**
     * Sets all settings
     * This method must be overridden by a plugin
     *
     * @param {Object} settings
     *
     * @return {Promise} promise
     */
    static setSettings(settings) {
        return new Promise(function(callback) {
            callback([]);   
        });
    }
}
