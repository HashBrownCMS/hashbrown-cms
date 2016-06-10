'use strict';

let MongoHelper = require('./MongoHelper');
let ProjectHelper = require('./ProjectHelper');

let SettingsHelperCommon = require('../../common/helpers/SettingsHelper');

class SettingsHelper extends SettingsHelperCommon {
    /**
     * Gets all settings
     *
     * @param {String} section
     * @param {String} project
     *
     * @return {Promise} promise
     */
    static getSettings(section, project) {
        return MongoHelper.findOne(
            project || ProjectHelper.currentProject,
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
     * @param {String} project
     *
     * @return {Promise} promise
     */
    static setSettings(section, settings, project) {
        return MongoHelper.updateOne(
            project || ProjectHelper.currentProject,
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
