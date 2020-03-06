'use strict';

/**
 * The client side settings helper
 *
 * @memberof HashBrown.Client.Service
 */
class SettingsService extends require('Common/Service/SettingsService') {
    /**
     * Gets all settings
     *
     * @param {String} project
     * @param {String} section
     *
     * @return {Promise(Object)}  settings
     */
    static getSettings(project, section = null) {
        checkParam(project, 'project', String);

        let apiUrl = '/api/projects/' + project + '/settings';

        if(section) {
            apiUrl += '/' + section;
        }

        return HashBrown.Service.RequestService.customRequest('get', apiUrl);
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
    static setSettings(project, section = null, settings) {
        checkParam(project, 'project', String);
        checkParam(settings, 'settings', Object);

        let apiUrl = '/api/projects/' + project + '/settings';

        if(section) {
            apiUrl += '/' + section;
        }

        return HashBrown.Service.RequestService.customRequest('post', apiUrl, settings);
    }
}

module.exports = SettingsService;
