'use strict';

let SettingsHelperCommon = require('../../common/helpers/SettingsHelper');

class SettingsHelper extends SettingsHelperCommon {
    /**
     * Gets all settings
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} section
     *
     * @return {Promise} promise
     */
    static getSettings(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        section = requiredParam('section')
    ) {
        let collection = 'settings';

        if(environment && environment != '*') {
            collection = environment + '.' + collection;
        }

        return MongoHelper.findOne(
            project,
            collection,
            {
                section: section
            }
        );
    }
    
    /**
     * Sets all settings
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} section
     * @param {Object} settings
     *
     * @return {Promise} promise
     */
    static setSettings(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        section = requiredParam('section'),
        settings = requiredParam('settings')
    ) {
        debug.log('Setting "' + section + '" to ' + JSON.stringify(settings), this, 3);
        
        let collection = 'settings';

        if(environment && environment != '*') {
            collection = environment + '.' + collection;
        }
        
        let newSettings = { section: section };

        for(let k in settings) {
            newSettings[k] = settings[k];
        }

        return MongoHelper.updateOne(
            project,
            collection,
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
