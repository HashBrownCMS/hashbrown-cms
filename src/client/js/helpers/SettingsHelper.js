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
        environment = null,
        section = null
    ) {
        let apiUrl = '/api/' + project + '/';

        if(environment && environment !== '*') {
            apiUrl += environment + '/'; 
        }
       
        apiUrl += 'settings';

        if(section) {
            apiUrl += '/' + section;
        }

        return customApiCall('get', apiUrl)

        // Cache settings client-side
        .then((settings) => {
            this.updateCache(project, environment, section, settings);

            return Promise.resolve(settings || {});
        });
    }
    
    /**
     * Cache update
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} section
     * @param {Object} settings
     */
    static updateCache(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        section = requiredParam('section'),
        settings = requiredParam('settings')
    ) {
        // Sanity check
        this.cache = this.cache || {};
        this.cache[project] = this.cache[project] || {};

        if(environment) {
            this.cache[project][environment] = this.cache[project][environment] || {};
            this.cache[project][environment][section] = this.cache[project][environment][section] || {};
            this.cache[project][environment][section] = settings;
        
        } else if(section) {
            this.cache[project][section] = this.cache[project][section] || {};
            this.cache[project][section] = settings;
        
        } else {
            this.cache[project] = settings;

        }
    }

    /**
     * Gets cached settings
     *
     * @param {String} section
     *
     * @returns {Object} Settings
     */
    static getCachedSettings(
        project = requiredParam('project'),
        environment = null,
        section = null,
    ) {
        if(!environment) {
            environment = '*';
        }

        if(!this.cache) { return {}; }
        if(!this.cache[project]) { return {}; }
        if(!this.cache[project][environment]) { return {}; }
        if(!this.cache[project][environment][section]) { return {}; }
        
        return this.cache[project][environment][section];
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
        let apiCall;

        if(!environment || environment == '*') {
            apiCall = customApiCall('post', '/api/' + project + '/settings/' + section, settings);
        } else {
            apiCall = customApiCall('post', '/api/' + project + '/' + environment + '/settings/' + section, settings);
        }

        return apiCall

        // Cache new settings
        .then(() => {
            this.updateCache(project, environment, section, settings);

            return Promise.resolve();
        })
    }
}

module.exports = SettingsHelper;
