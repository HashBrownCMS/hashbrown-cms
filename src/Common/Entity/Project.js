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
     * Gets all environments
     *
     * @return {Array} Environment names
     */
    async getEnvironments() {
        throw new Error('Method "getEnvironments" must be overridden');
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
}

module.exports = Project;
