'use strict';

/**
 * A helper class for managing projects
 *
 * @memberof HashBrown.Server.Helpers
 */
class ProjectHelper {
    /**
     * Gets a list of all available project ids
     *
     * @returns {Array} Project ids
     */
    static async getAllProjectIds() {
        let allDatabases = await HashBrown.Helpers.DatabaseHelper.listDatabases();

        let allProjects = [];

        for(let db of allDatabases) {
            if(!await this.projectExists(db)) { continue; }

            allProjects.push(db);
        }
            
        return allProjects;
    }
    
    /**
     * Gets a list of all available projects
     *
     * @returns {Array} Projects
     */
    static async getAllProjects() {
        let allDatabases = await HashBrown.Helpers.DatabaseHelper.listDatabases();

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

        return await HashBrown.Helpers.DatabaseHelper.collectionExists(project, 'settings');
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

        let projectExists = await this.projectExists(project);

        if(!projectExists) {
            throw new Error('Project "' + project + '" could not be found');
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

        let settings = await HashBrown.Helpers.DatabaseHelper.findOne(id, 'settings', { usedBy: 'project' });

        if(!settings) {
            settings = { usedBy: 'project' };
        }
        
        settings.sync = settings.sync || {};

        if(typeof isEnabled !== 'boolean') {
            isEnabled = !settings.sync.enabled;
        }

        settings.sync.enabled = isEnabled;
        
        await HashBrown.Helpers.DatabaseHelper.updateOne(
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
     * @returns {HashBrown.Models.Project} Project
     */
    static async getProject(id) {
        await this.checkProject(id);

        let settings = await HashBrown.Helpers.SettingsHelper.getSettings(id) || {};
        let users = await HashBrown.Helpers.UserHelper.getAllUsers(id) || [];
        let backups = await HashBrown.Helpers.BackupHelper.getBackupsForProject(id) || [];
        let environments = await this.getAllEnvironments(id) || [];

        return new HashBrown.Models.Project({
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

        let allSettings = await HashBrown.Helpers.DatabaseHelper.find(project, 'settings', {});
            
        let names = [];

        for(let setting of allSettings) {
            if(!setting.usedBy || setting.usedBy === 'project') { continue; }

            names.push(setting.usedBy);
        }

        // If we have some environments, return them
        if(names.length > 0) { return names; }

        // If we don't, make sure there is a "live" one
        // NOTE: Using the HashBrown.Helpers.DatabaseHelper directly here, since using the HashBrown.Helpers.SettingsHelper would create a cyclic call stack
        await HashBrown.Helpers.DatabaseHelper.insertOne(
            project,
            'settings',
            { usedBy: 'live' },
            { upsert: true }
        );

        return ['live'];  
    }

    /**
     * Deletes a project
     *
     * @param {String} id
     * @param {Boolean} makeBackup
     *
     * @returns {Promise} Promise
     */
    static deleteProject(id, makeBackup = true) {
        checkParam(id, 'id', String);

        return this.checkProject(id)
        .then(() => {
            // Make backup first, if specified
            if(makeBackup) {
                return HashBrown.Helpers.BackupHelper.createBackup(id)
                .then(() => {
                    return HashBrown.Helpers.DatabaseHelper.dropDatabase(id);
                });

            // If not, just drop the database
            } else {
                return HashBrown.Helpers.DatabaseHelper.dropDatabase(id);
            }
        });
    }

    /**
     * Adds an environment
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Promise} New environment
     */
    static addEnvironment(project, environment) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);

        return this.checkProject(project)
        .then(() => {
            // Check if project is synced first
            return HashBrown.Helpers.SettingsHelper.getSettings(project, null, 'sync');
        })
        .then((sync) => {
            if(sync.enabled) {
                return Promise.reject(new Error('Cannot add environments to a synced project'));
            }
            
            debug.log('Adding environment "' + environment + '" to project "' + project + '"...', this);
      
            return HashBrown.Helpers.SettingsHelper.setSettings(project, environment, null, {}, true);
        })
        .then(() => {
            return Promise.resolve(environment);  
        });
    }

    /**
     * Deletes an environment
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Promise} Promise
     */
    static deleteEnvironment(project, environment) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);

        return this.checkProject(project)
        .then(() => {
            // Check if project is synced first
            return HashBrown.Helpers.SettingsHelper.getSettings(project, null, 'sync');
        })
        .then((sync) => {
            if(sync.enabled) {
                return Promise.reject(new Error('Cannot delete environments from a synced project'));
            }
        
            debug.log('Deleting environment "' + environment + '" from project "' + project + '"...', this);

            // Make a backup
            return HashBrown.Helpers.BackupHelper.createBackup(project);
        })

        // Get all collections with the environment prefix
        .then(() => {
            return HashBrown.Helpers.DatabaseHelper.listCollections(project);
        })

        // Iterate through collections and match them with the environment name
        .then((collections) => {
            let next = () => {
                let collection = collections.pop();

                // No more collections, resolve
                if(!collection) {
                    debug.log('Deleted environment "' + environment + '" from project "' + project + '" successfully', this);
                    return Promise.resolve();
                }

                // This collection matches the environment name, drop it
                if(collection.name.indexOf(environment + '.') == 0) {
                    return HashBrown.Helpers.DatabaseHelper.dropCollection(project, collection.name)
                    .then(() => {
                        return next();
                    });
                }

                // This collection does not match the environment name, iterate again 
                return next();
            }

            return next();
        })
        
        // Remove environment settings settings
        .then(() => {
            return HashBrown.Helpers.DatabaseHelper.remove(project, 'settings', { usedBy: environment });
        });
    }
    
    /**
     * Creates a new Project
     *
     * @param {String} name
     * @param {String} userId
     *
     * @returns {Promise} The new Project
     */
    static createProject(name, userId) {
        checkParam(name, 'name', String);
        checkParam(userId, 'userId', String);
        
        if(!name || !userId) {
            return Promise.reject(new Error('Projects cannot be created without a name and user id specified. Provided "' + name + '" and "' + userId + '"'));
        }
            
        let project = HashBrown.Models.Project.create(name);

        return HashBrown.Helpers.UserHelper.getUserById(userId)
        .then((user) => {
            if(!user.isAdmin) {
                return Promise.reject(new Error('Only admins can create projects'));
            }
            
            return this.projectExists(project.id);
        })
        .then((exists) => {
            if(exists === true) {
                return Promise.reject('A project by name "' + name + '" already exists');
            }

            return HashBrown.Helpers.DatabaseHelper.insertOne(project.id, 'settings', project.settings);
        })
        .then(() => {
            return Promise.resolve(project);
        });
    }
}

module.exports = ProjectHelper;
