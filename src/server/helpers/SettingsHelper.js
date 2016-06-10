'use strict';

let MongoHelper = require('./MongoHelper');

let SettingsHelperCommon = require('../../common/SettingsHelper');

class SettingsHelper extends SettingsHelperCommon {
    /**
     * Gets all settings
     *
     * @param {String} section
     *
     * @return {Promise} promise
     */
    static getSettings(section) {
        return MongoHelper.findOne(
            'settings',
            {
                section: section
            }
        );
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
        return MongoHelper.updateOne(
            'settings',
            { 
                section: section
            },
            settings,
            {
                upsert: true
            }
        );
    }
}

module.exports = SettingsHelper;
