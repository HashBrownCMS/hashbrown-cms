'use strict';

/**
 * The Project class
 *
 * @memberof HashBrown.Common.Entity
 */
class Project extends HashBrown.Entity.EntityBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(Project.checkParams(params));
    }

    /**
     * Gets the human readable name
     *
     * @return {String} Name
     */
    getName() {
        if(this.settings && this.settings.info && this.settings.info.name) {
            return this.settings && this.settings.info && this.settings.info.name;
        }

        return this.id;
    }

    /**
     * Performs a sanity check of the params
     *
     * @param {Object} params
     *
     * @returns {Object} Params
     */
    static checkParams(params) {
        params = params || {};

        if(!params.id) { throw new Error('No id was provided for the Project constructor'); }

        if(!params.settings) { params.settings = {}; }
        if(!params.settings.info) { params.settings.info = {}; }
        if(!params.settings.info.name) { params.settings.info.name = params.id; }
        if(!params.settings.languages) { params.settings.languages = [ 'en' ]; }
        if(!params.settings.sync) { params.settings.sync = {}; }

        // Delete old flags
        delete params.useAutoBackup;
        delete params.backupStorage;

        // Restore from old languages structure
        if(!Array.isArray(params.settings.languages)) {
            let languages = [];
            
            for(let key in params.settings.languages) {
                if(key === 'section') { continue; }

                languages.push(params.settings.languages[key]);
            }

            params.settings.languages = languages;
        }

        return params;
    }

    /**
     * Defines the structure of this project
     */
    structure() {
        this.def(String, 'id');
        this.def(Array, 'users', []);
        this.def(Object, 'settings', {});
        this.def(Array, 'environments', []);
        this.def(Array, 'backups', []);
    }

    /**
     * Creates a database safe name
     *
     * @param {String} name
     *
     * @returns {String} Safe name
     */
    static safeName(name) {
        return name.toLowerCase().replace('.', '_').replace(/[^a-z_]/g, '');
    }

    /**
     * Gets all users
     *
     * @return {Array} Users
     */
    async getUsers() {
        throw new Error('Method "getUsers" must be overridden');
    }
    
    /**
     * Gets all backups
     *
     * @return {Array} Backup timestamps
     */
    async getBackups() {
        throw new Error('Method "getBackups" must be overridden');
    }

    /**
     * Gets a backup
     */
    async getBackup(timestamp) {
        throw new Error('Method "getBackup" must be overridden');
    }
    
    /**
     * Removes a backup
     */
    async removeBackup(timestamp) {
        throw new Error('Method "removeBackup" must be overridden');
    }
    
    /**
     * Restores a backup
     */
    async restoreBackup(timestamp) {
        throw new Error('Method "restoreBackup" must be overridden');
    }
    
    /**
     * Adds a backup
     */
    async addBackup() {
        throw new Error('Method "addBackup" must be overridden');
    }
   
    /**
     * Creates a new backup
     *
     * @return {Number} Timestamp
     */
    async createBackup() {
        throw new Error('Method "createBackup" must be overridden');
    }
    
    /**
     * Sets settings for an environment
     *
     * @param {String} environment
     * @param {Object} settings
     */
    async setEnvironmentSettings(environment, settings) {
        checkParam(environment, 'environment', String, true);
        checkParam(settings, 'settings', Object, true);

        let environments = await this.getSettings('environments');

        if(!environments || !environments[environment]) {
            throw new Error(`Environment ${environment} in project ${this.getName()} not found`);
        }
        
        environments[environment] = settings;

        await this.setSettings('environments', environments);
    }
    
    /**
     * Gets settings for an environment
     *
     * @param {String} environment
     *
     * @return {Object} Settings
     */
    async getEnvironmentSettings(environment) {
        checkParam(environment, 'environment', String, true);

        let settings = await this.getSettings('environments');

        if(!settings || !settings[environment]) {
            throw new Error(`Environment ${environment} in project ${this.getName()} not found`);
        }

        return settings[environment];
    }
    
    /**
     * Gets all languages
     *
     * @return {Array} Language names
     */
    async getLanguages() {
        let languages = await this.getSettings('languages');

        if(languages.length < 1) {
            languages.push('en');
        }

        return languages;
    }

    /**
     * Gets all environment names
     *
     * @return {Array} Environment names
     */
    async getEnvironments() {
        let environments = await this.getSettings('environments');
        
        // Reconstruct environment list from old structure
        if(!environments || environments.constructor !== Object || Object.keys(environments).length < 1) {
            environments = {};

            let settings = await HashBrown.Service.DatabaseService.find(this.id, 'settings', {});
                
            for(let entry of settings) {
                if(!entry.usedBy || entry.usedBy === 'project') { continue; }
    
                let name = entry.usedBy;

                delete entry.usedBy;

                environments[name] = entry;
            }
        
            await this.setSettings(this.id, 'environments', environments);
        }

        if(Object.keys(environments).length < 1) {
            environments['live'] = {};
        }

        return Object.keys(environments);
    }

    /**
     * Checks whether this project has an environment
     *
     * @param {String} environment
     *
     * @return {Boolean} Has environment
     */
    async hasEnvironment(environment) {
        checkParam(environment, 'environment', String, true);

        let environments = this.getEnvironments();

        return environments.indexOf(environment) > -1;
    }
}

module.exports = Project;
