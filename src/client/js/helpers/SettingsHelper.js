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
        return new Promise((callback) => {
            $.getJSON(apiUrl('settings/' + section), (settings) => {
                callback(settings);
            });
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
        return new Promise((callback) => {
            $.post(apiUrl('settings/' + section), settings, () => {
                callback();
            });
        });
    }
}

module.exports = SettingsHelper;
