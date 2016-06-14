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
        return new Promise((resolve) => {
            $.ajax({
                url: apiUrl('settings/' + section),
                type: 'GET',
                success: (settings) => {
                    resolve(settings || {});
                }
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
        return new Promise((resolve) => {
            $.ajax({
                url: apiUrl('settings/' + section),
                type: 'POST',
                data: settings,
                success: () => {
                    resolve();
                }
            }); 
        });
    }
}

module.exports = SettingsHelper;
