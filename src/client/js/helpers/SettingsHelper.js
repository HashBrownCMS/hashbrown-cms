'use strict';

let SettingsHelperCommon = require('../../../common/helpers/SettingsHelper');

class SettingsHelper extends SettingsHelperCommon {
    /**
     * Gets all settings
     *
     * @param {String} section
     *
     * @return {Promise} promise
     */
    static getSettings(section) {
        return apiCall('get', 'settings/' + section);
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
        return apiCall('post', 'settings/' + section, settings)
    }
}

module.exports = SettingsHelper;
