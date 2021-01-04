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
        if(this.settings && this.settings.name) {
            return this.settings.name;
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
        if(!params.settings.sync) { params.settings.sync = {}; }

        if(params.settings.languages) {
            params.settings.locales = params.settings.languages;
        }

        if(!params.settings.locales || params.settings.locales.length < 1) { params.settings.locales = [ 'en' ]; }

        if(params.settings.info && params.settings.info.name) {
            params.settings.name = params.settings.info.name;
            delete params.settings.info;
        }

        super.adopt(params);
    }

    /**
     * Structure
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
     * @param {String} section
     */
    async setEnvironmentSettings(environment, settings, section) {
        throw new Error('Method "getEnvironmentSettings" must be overridden');
    }
    
    /**
     * Gets settings for an environment
     *
     * @param {String} environment
     * @param {String} section
     *
     * @return {Object} Settings
     */
    async getEnvironmentSettings(environment, section) {
        throw new Error('Method "getEnvironmentSettings" must be overridden');
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
     * Gets all locales
     *
     * @return {Array} Locale names
     */
    async getLocales() {
        let locales = await this.getSettings('locales');

        if(!locales || !Array.isArray(locales) || locales.length < 1) {
            return [ 'en' ];
        }

        return locales;
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
