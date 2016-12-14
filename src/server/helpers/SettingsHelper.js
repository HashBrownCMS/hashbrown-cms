'use strict';

let SettingsHelperCommon = require('../../common/helpers/SettingsHelper');

class SettingsHelper extends SettingsHelperCommon {
    /**
     * Gets all settings
     *
     * @param {String} section
     * @param {String} projectName
     *
     * @return {Promise} promise
     */
    static getSettings(section, projectName) {
        return MongoHelper.findOne(
            projectName || ProjectHelper.currentProject,
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
     * @param {String} projectName
     *
     * @return {Promise} promise
     */
    static setSettings(section, settings, projectName) {
        let newSettings = { section: section };

        debug.log('Setting "' + section + '" to ' + JSON.stringify(settings), this);

        for(let k in settings) {
            newSettings[k] = settings[k];
        }

        return MongoHelper.updateOne(
            projectName || ProjectHelper.currentProject,
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
