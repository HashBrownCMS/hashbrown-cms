'use strict';

class SettingsHelper {
    /**
     * Gets all settings
     *
     * @param {String} section
     *
     * @return {Promise(Object)}  settings
     */
    static getSettings(section) {
        return new Promise((resolve, reject) => {
            reject();
        });
    }
    
    /**
     * Sets all settings
     *
     * @param {String} section
     * @param {Object} settings
     *
     * @return {Promise} promise
     */
    static setSettings(section, settings) {
        return new Promise((resolve, reject) => {
            reject();
        });
    }
}

module.exports = SettingsHelper;
