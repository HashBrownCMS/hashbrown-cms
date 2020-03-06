'use strict';

/**
 * The helper class for settings
 *
 * @memberof HashBrown.Server.Service
 */
class SettingsService extends require('Common/Service/SettingsService') {
    /**
     * Gets all settings
     *
     * @param {String} project
     * @param {String} section
     *
     * @return {Promise} Settings
     */
    static async getSettings(project, section = null) {
        checkParam(project, 'project', String, true);

        let settings = await HashBrown.Service.DatabaseService.findOne(project, 'settings');

        if(!settings) { settings = {}; }

        delete settings['usedBy'];
        
        if(section) { return settings[section] || {}; }

        return settings || {};
    }
    
    /**
     * Sets settings
     *
     * @param {String} project
     * @param {String} section
     * @param {Object} settings
     *
     * @return {Promise} promise
     */
    static async setSettings(project, section = null, settings) {
        checkParam(project, 'project', String);
        checkParam(settings, 'settings', Object);

        debug.log(`Setting ${project + (section ? `/${section}` : '')} to ${JSON.stringify(settings)}`, this, 3);
    
        // Check sync settings
        if(settings.sync && settings.sync.enabled) {
            HashBrown.Service.SyncService.validateSettings(settings.sync, project);
        }

        // First get the existing settings object
        let oldSettings = await this.getSettings(project);
        
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

        // Update the database
        await HashBrown.Service.DatabaseService.updateOne(
            project,
            'settings',
            query,
            newSettings,
            { upsert: true }
        );
    }
}

module.exports = SettingsService;
