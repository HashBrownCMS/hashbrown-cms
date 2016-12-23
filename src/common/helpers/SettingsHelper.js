'use strict';

class SettingsHelper {
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
        return Promise.resolve({});
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
        return Promise.resolve();
    }
}

module.exports = SettingsHelper;
