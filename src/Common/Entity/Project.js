'use strict';

/**
 * The Project class
 *
 * @memberof HashBrown.Common.Entity
 */
class Project extends HashBrown.Entity.EntityBase {
    /**
     * Gets the human readable name
     *
     * @return {String} Name
     */
    getName() {
        if(this.settings && this.settings.info && this.settings.info.name) {
            return this.settings.info.name;
        }

        return this.id;
    }

    /**
     * Adopts values into this entity
     *
     * @param {Object} params
     */
    adopt(params) {
        checkParam(params, 'params', Object);

        params = params || {};

        if(!params.id) { throw new Error('No id was provided for the Project constructor'); }

        if(!params.settings) { params.settings = {}; }
        if(!params.settings.info) { params.settings.info = {}; }
        if(!params.settings.info.name) { params.settings.info.name = params.id; }
        if(!params.settings.languages) { params.settings.languages = [ 'en' ]; }
        if(!params.settings.sync) { params.settings.sync = {}; }

        // Delete old values
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

        super.adopt(params);
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

        await this.setSettings(environments, 'environments');
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
     * Gets sync settings
     *
     * @param {Boolean} skipValidation
     *
     * @return {Object} Settings
     */
    async getSyncSettings(skipValidation = false) {
        checkParam(skipValidation, 'skipValidation', Boolean);

        let sync = await this.getSettings('sync') || {};

        if(skipValidation) { return sync; }

        if(!sync.enabled) { return null; }

        if(
            !sync.project ||
            !sync.url ||
            !sync.token ||
            sync.project === this.id
        ) {
            throw new Error('Invalid sync settings');
        }

        try {
            new URL(sync.url);
        
        } catch(e) {
            throw new Error('Invalid sync URL');

        }

        return sync;
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
     * Adds a new environment
     *
     * @param {String} name
     */
    async addEnvironment() {
        throw new Error('Method "addEnvironment" must be overridden');
    }
    
    /**
     * Removes an environment
     *
     * @param {String} name
     */
    async removeEnvironment() {
        throw new Error('Method "removeEnvironment" must be overridden');
    }

    /**
     * Gets all environment names
     *
     * @return {Array} Environment names
     */
    async getEnvironments() {
        throw new Error('Method "getEnvironments" must be overridden');
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

        let environments = await this.getEnvironments();

        return environments.indexOf(environment) > -1;
    }

    /**
     * Sets all settings or a section
     *
     * @param {Object} settings
     * @param {String} section
     */
    async setSettings() {
        throw new Error('Method "setSettings" must be overridden');
    }

    /**
     * Gets all settings or a section
     *
     * @param {String} section
     *
     * @return {Object} Settings
     */
    async getSettings() {
        throw new Error('Method "getSettings" must be overridden');
    }
}

module.exports = Project;
