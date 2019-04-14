'use strict';

const SettingsHelperCommon = require('Common/Helpers/SettingsHelper');

/**
 * The helper class for settings
 *
 * @memberof HashBrown.Server.Helpers
 */
class SettingsHelper extends SettingsHelperCommon {
    /**
     * Gets all settings
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} section
     *
     * @return {Promise} Settings
     */
    static async getSettings(project, environment = null, section = null) {
        checkParam(project, 'project', String, true);

        // If the environment is a wildcard, just discard it
        if(environment === '*') {
            environment = null;
        }

        let settings = await HashBrown.Helpers.DatabaseHelper.findOne(project, 'settings', { usedBy: environment || 'project' });

        if(!settings) { settings = {}; }

        delete settings['usedBy'];
        
        if(section) { return settings[section] || {}; }

        return settings || {};
    }
    
    /**
     * Sets settings
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} section
     * @param {Object} settings
     * @param {Boolean} upsertEnvironment
     *
     * @return {Promise} promise
     */
    static async setSettings(project, environment = null, section = null, settings, upsertEnvironment = false) {
        checkParam(project, 'project', String);
        checkParam(settings, 'settings', Object);

        debug.log('Setting "' + section + '" to ' + JSON.stringify(settings), this, 3);
    
        // Check if the environment exists
        let environmentExists = await HashBrown.Helpers.ProjectHelper.environmentExists(project, environment);

        if(environment && !environmentExists && !upsertEnvironment) {
            throw new Error('Environment "' + environment + '" of project "' + project + '" could not be found');
        }

        // First get the existing settings object
        let oldSettings = await this.getSettings(project, environment);
        
        if(!oldSettings) {
            oldSettings = {};
        }
            
        // Construct query
        let query = {};
        let newSettings = oldSettings;

        // If a section was provided, only set that setting
        if(section) {
            newSettings[section] = settings;

            // The field isn't necessary here, so remove it if it was set somewhere
            delete newSettings[section].usedBy;

        // If not, replace all settings
        } else {
            newSettings = settings;
        }

        // Set the environment/project that this setting is used by
        if(environment) {
            newSettings.usedBy = environment;
            query.usedBy = environment;
        } else {
            newSettings.usedBy = 'project';
            query.usedBy = 'project';
        }
        
        // Update the database
        await HashBrown.Helpers.DatabaseHelper.updateOne(
            project,
            'settings',
            query,
            newSettings,
            { upsert: true }
        );
    }
}

module.exports = SettingsHelper;
