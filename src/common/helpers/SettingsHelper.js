'use strict';

let Promise = require('bluebird');

class SettingsHelper {
    /**
     * Gets all settings
     *
     * @param {String} section
     *
     * @return {Promise} promise
     */
    static getSettings(section) {
        return new Promise((callback) => {
            // Client mode
            if(window) {
                $.ajax({
                    url: '/api/settings/' + section + '?token=' + localStorage.getItem('token'),
                    type: 'GET',
                    success: (settings) => {
                        if(!settings || Array.isArray(settings)) {
                            settings = {};
                        }

                        settings.section = section;

                        callback(settings);
                    }
                });

            // Server mode
            } else {
                callback({});   
            }
        });
    }
    
    /**
     * Sets all settings
     * This method must be overridden by a plugin
     *
     * @param {String} section
     * @param {Object} settings
     *
     * @return {Promise} promise
     */
    static setSettings(section, settings) {
        return new Promise((callback) => {
            // Client mode
            if(window) {
                $.ajax({
                    url: '/api/settings/' + section + '?token=' + localStorage.getItem('token'),
                    type: 'POST',
                    data: settings,
                    success: () => {
                        callback();
                    }
                });

            // Server mode
            } else {
                callback({});   
            }
        });
    }
}

module.exports = SettingsHelper;
