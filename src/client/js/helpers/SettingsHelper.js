'use strict';

let SettingsHelperCommon = require('../../../common/helpers/SettingsHelper');

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
    static getSettings(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        section = requiredParam('section')
    ) {
        if(!environment || environment == '*') {
            return customApiCall('get', '/api/' + project + '/settings/' + section);
        } else {
            return customApiCall('get', '/api/' + project + '/' + environment + '/settings/' + section);
        }
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
        if(!environment || environment == '*') {
            return customApiCall('post', '/api/' + project + '/settings/' + section, settings);
        } else {
            return customApiCall('post', '/api/' + project + '/' + environment + '/settings/' + section, settings);
        }
    }
}

module.exports = SettingsHelper;
