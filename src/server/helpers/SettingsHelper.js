'use strict';

let SettingsHelperCommon = require('../../common/helpers/SettingsHelper');

class SettingsHelper extends SettingsHelperCommon {
    /**
     * Gets all settings
     *
     * @param {String} project
     * @param {String} section
     *
     * @return {Promise} promise
     */
    static getSettings(
        project = requiredParam('project'),
        section = requiredParam('section')
    ) {
        return MongoHelper.findOne(
            project,
            'settings',
            {
                section: section
            }
        );
    }
    
    /**
     * Sets all settings
     *
     * @param {String} project
     * @param {String} section
     * @param {Object} settings
     *
     * @return {Promise} promise
     */
    static setSettings(
        project = requiredParam('project'),
        section = requiredParam('section'),
        settings = requiredParam('settings')
    ) {
        let newSettings = { section: section };

        debug.log('Setting "' + section + '" to ' + JSON.stringify(settings), this);

        for(let k in settings) {
            newSettings[k] = settings[k];
        }

        return MongoHelper.updateOne(
            project,
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
