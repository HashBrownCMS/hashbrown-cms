'use strict';

/**
 * A helper class for managing projects
 *
 * @memberof HashBrown.Server.Service
 */
class ProjectService {
    /**
     * Gets a list of all available project ids
     *
     * @returns {Array} Project ids
     */
    static async getAllProjectIds() {
        let allProjectIds = [];
        let allProjects = await this.getAllProjects();

        for(let project of allProjects) {
            allProjectIds.push(project.id);
        }
            
        return allProjectIds;
    }
    
    /**
     * Gets a list of all available projects
     *
     * @returns {Array} Projects
     */
    static async getAllProjects() {
        let allDatabases = await HashBrown.Service.DatabaseService.listDatabases();

        let allProjects = [];

        for(let db of allDatabases) {
            let project = await this.getProject(db);

            allProjects.push(project);
        }

        // Sort by name
        allProjects.sort((a, b) => {
            if(a.settings.info.name < b.settings.info.name) { return -1; }
            if(a.settings.info.name > b.settings.info.name) { return 1; }
            return 0;
        });

        return allProjects;
    }

    /**
     * Checks if a project exists
     *
     * @param {String} project
     *
     * @returns {Boolean} Whether the project exists
     */
    static async projectExists(project) {
        if(!project) { return false; }

        return await HashBrown.Service.DatabaseService.collectionExists(project, 'settings');
    }
    
    /**
     * Checks if an environment exists
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Boolean} Whether the environment exists
     */
    static async environmentExists(project, environment) {
        if(!environment) { return false; }
        
        let environments = await this.getAllEnvironments(project);

        return environments.indexOf(environment) > -1;
    }

    /**
     * Performs a check of the requested project
     *
     * @param {String} project
     */
    static async checkProject(project) {
        checkParam(project, 'project', String);

        // Check if project exists
        let projectExists = await this.projectExists(project);

        if(!projectExists) {
            throw new Error('Project "' + project + '" could not be found');
        }
        
        // Check environments format
        let environments = await HashBrown.Service.SettingsService.getSettings(project, 'environments');
        
        // If environment list could not be found, reconstruct it from old structure
        if(!environments || environments.constructor !== Object || Object.keys(environments).length < 1) {
            environments = {};

            let allSettings = await HashBrown.Service.DatabaseService.find(project, 'settings', {});
                
            for(let settings of allSettings) {
                if(!settings.usedBy || settings.usedBy === 'project') { continue; }
    
                let name = settings.usedBy;

                delete settings.usedBy;

                environments[name] = settings;
            }
        
            await HashBrown.Service.SettingsService.setSettings(project, 'environments', environments);
        }
    }

    /**
     * Toggles a Project settings "sync" section on/off
     *
     * @param {String} id
     * @param {Boolean} isEnabled
     */
    static async toggleProjectSync(id, isEnabled) {
        checkParam(id, 'id', String, true);

        let settings = await HashBrown.Service.DatabaseService.findOne(id, 'settings', { usedBy: 'project' });

        if(!settings) {
            settings = { usedBy: 'project' };
        }
        
        settings.sync = settings.sync || {};

        if(typeof isEnabled !== 'boolean') {
            isEnabled = !settings.sync.enabled;
        }

        settings.sync.enabled = isEnabled;
        
        await HashBrown.Service.DatabaseService.updateOne(
            id,
            'settings',
            { usedBy: 'project' },
            settings,
            { upsert: true }
        );
    }

    /**
     * Gets a Project object
     *
     * @param {String} id
     *
     * @returns {HashBrown.Entity.Project} Project
     */
    static async getProject(id) {
        await this.checkProject(id);

        let settings = await HashBrown.Service.SettingsService.getSettings(id) || {};
        let users = await HashBrown.Service.UserService.getAllUsers(id) || [];
        let backups = await HashBrown.Service.BackupService.getBackupsForProject(id) || [];
        let environments = await this.getAllEnvironments(id) || [];

        return new HashBrown.Entity.Project({
            id: id,
            backups: backups,
            settings: settings,
            environments: environments,
            users: users
        });
    }

    /**
     * Gets a list of all available environments
     *
     * @param {String} project
     *
     * @returns {Array} Environments
     */
    static async getAllEnvironments(project) {
        await this.checkProject(project);

        let environments = await HashBrown.Service.SettingsService.getSettings(project, 'environments');

        return Object.keys(environments);
    }

    /**
     * Deletes a project
     *
     * @param {String} id
     * @param {Boolean} makeBackup
     *
     * @returns {Promise} Promise
     */
    static async deleteProject(id, makeBackup = true) {
        checkParam(id, 'id', String);
        checkParam(makeBackup, 'makeBackup', Boolean);

        await this.checkProject(id);

        if(makeBackup) {
            await HashBrown.Service.BackupService.createBackup(id);
        }

        await HashBrown.Service.DatabaseService.dropDatabase(id);
    }

    /**
     * Adds an environment
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Promise} New environment
     */
    static async addEnvironment(project, environment) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);

        await this.checkProject(project);

        let sync = await HashBrown.Service.SettingsService.getSettings(project, 'sync');

        if(sync && sync.enabled) {
            throw new Error('Cannot add environments to a synced project');
        }
            
        debug.log('Adding environment "' + environment + '" to project "' + project + '"...', this);
  
        let environments = await this.getAllEnvironments(project);

        environments.push(environment);

        await HashBrown.Service.SettingsService.setSettings(project, 'environments', environments);
    }

    /**
     * Deletes an environment
     *
     * @param {String} project
     * @param {String} environment
     * @param {Boolean} makeBackup
     *
     * @returns {Promise} Promise
     */
    static async deleteEnvironment(project, environment, makeBackup = true) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(makeBackup, 'makeBackup', Boolean);

        await this.checkProject(project);

        let sync = await HashBrown.Service.SettingsService.getSettings(project, 'sync');

        if(sync && sync.enabled) {
            throw new Error('Cannot delete environments from a synced project');
        }
        
        debug.log('Deleting environment "' + environment + '" from project "' + project + '"...', this);

        if(makeBackup) {
            await HashBrown.Service.BackupService.createBackup(project);
        }

        // Iterate through collections and match them with the environment name
        let collections = await HashBrown.Service.DatabaseService.listCollections(project);
            
        for(let collection of collections) {
            if(!collection.name) { continue; }
            if(collection.name.indexOf(environment + '.') !== 0) { continue; }

            await HashBrown.Service.DatabaseService.dropCollection(project, collection.name);
        }
                
        debug.log('Deleted environment "' + environment + '" from project "' + project + '" successfully', this);
    }
    
    /**
     * Creates a new Project
     *
     * @param {String} name
     * @param {String} userId
     *
     * @returns {Promise} The new Project
     */
    static async createProject(name) {
        checkParam(name, 'name', String, true);
        
        let project = HashBrown.Entity.Project.create(name);
        let exists = await this.projectExists(project.id);

        if(exists === true) {
            throw new Error('A project by name "' + name + '" already exists');
        }

        await HashBrown.Service.DatabaseService.insertOne(project.id, 'settings', project.settings);

        return project;
    }
}

module.exports = ProjectService;
