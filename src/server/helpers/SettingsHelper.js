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
        environment = null,
        section = null
    ) {
        return function() {
            // If the requested section is "sync" itself, don't look for remote resource
            if(section === 'sync') {
                return Promise.resolve(null);
            }

            return SyncHelper.getResourceItem(project, environment, 'settings', section)
            .catch((e) => {
                debug.log(e.message, SettingsHelper);

                return Promise.resolve(null);  
            });
        }()
        .then((settings) => {
            // If the remote section was found, return it
            if(settings) {
                return Promise.resolve(settings);
            }

            // If not, get the local section instead
            let collection = 'settings';

            if(environment && environment != '*') {
                collection = environment + '.' + collection;
            }

            // Construct query
            let query = {};

            if(section) {
                query = { section: section };
            }

            return MongoHelper.findOne(
                project,
                collection,
                query
            );
        });
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
        
        return function () {
            if(section === 'sync') {
                return Promise.resolve(false);
            }

            return SettingsHelper.getSettings(project, '', 'sync')
            .then((settings) => {
                return Promise.resolve(settings && settings.enabled);  
            });
        }()
        .then((isRemote) => {
            if(isRemote) {
                return SyncHelper.setResourceItem(project, environment, section, settings);
            }
            
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
        });    
    }
}

module.exports = SettingsHelper;
