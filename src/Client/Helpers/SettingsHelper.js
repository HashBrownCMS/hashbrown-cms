'use strict';

const SettingsHelperCommon = require('Common/Helpers/SettingsHelper');

/**
 * The client side settings helper
 *
 * @memberof HashBrown.Client.Helpers
 */
class SettingsHelper extends SettingsHelperCommon {
    /**
     * Gets all settings
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} section
     *
     * @return {Promise(Object)}  settings
     */
    static getSettings(project, environment = null, section = null) {
        checkParam(project, 'project', String);

        if(environment === '*') { environment = null; }

        let apiUrl = '/api/' + project + '/';

        if(environment) {
            apiUrl += environment + '/'; 
        }
       
        apiUrl += 'settings';

        if(section) {
            apiUrl += '/' + section;
        }

        return HashBrown.Helpers.RequestHelper.customRequest('get', apiUrl);
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
    static setSettings(project, environment = null, section = null, settings) {
        checkParam(project, 'project', String);
        checkParam(settings, 'settings', Object);

        if(environment === '*') { environment = null; }

        let apiUrl = '/api/' + project + '/';

        settings.usedBy = 'project';

        if(environment) {
            apiUrl += environment + '/'; 

            settings.usedBy = environment;
        }
       
        apiUrl += 'settings';

        if(section) {
            apiUrl += '/' + section;
        }

        return HashBrown.Helpers.RequestHelper.customRequest('post', apiUrl, settings);
    }
}

module.exports = SettingsHelper;
