'use strict';

let SettingsHelperCommon = require('../../common/helpers/SettingsHelper');

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
            ProjectHelper.currentProject,
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
        let newSettings = { section: section };

        debug.log('Setting "' + section + '" to ' + JSON.stringify(settings), this);

        for(let k in settings) {
            newSettings[k] = settings[k];
        }

        return MongoHelper.updateOne(
            ProjectHelper.currentProject,
            'settings',
            { 
                section: section
            },
            newSettings,
            {
                upsert: true
            }
        );
    }
}

module.exports = SettingsHelper;
