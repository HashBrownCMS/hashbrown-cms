'use strict';

const MongoHelper = require('Server/Helpers/MongoHelper');
const BackupHelper = require('Server/Helpers/BackupHelper');
const UserHelper = require('Server/Helpers/UserHelper');
const SyncHelper = require('Server/Helpers/SyncHelper');
const SettingsHelper = require('Server/Helpers/SettingsHelper');

const Project = require('Common/Models/Project');

/**
 * A helper class for managing projects
 *
 * @memberof HashBrown.Server.Helpers
 */
class ProjectHelper {
    /**
     * Gets a list of all available projects
     *
     * @returns {Promise} Array of Project objects
     */
    static getAllProjects() {
        return MongoHelper.listDatabases();
    }

    /**
     * Checks if a project exists
     *
     * @param {String} project
     *
     * returns {Promise} Promise
     */
    static projectExists(project) {
        return MongoHelper.databaseExists(project);
    }
    
    /**
     * Checks if an environment exists
     *
     * @param {String} project
     * @param {String} environment
     *
     * returns {Promise} Promise
     */
    static environmentExists(project, environment) {
        return this.getAllEnvironments(project)
        .then((environments) => {
            return Promise.resolve(environments.indexOf(environment) > -1);
        });
    }

    /**
     * Gets a Project object
     *
     * @param {String} id
     *
     * @returns {Promise} Project object
     */
    static getProject(id) {
        let settings;
        let users;
        let backups;

        return HashBrown.Helpers.SettingsHelper.getSettings(id)
        .then((foundSettings) => {
            settings = foundSettings || {};

            return HashBrown.Helpers.UserHelper.getAllUsers(id);
        })
        .then((foundUsers) => {
            users = foundUsers;

            return BackupHelper.getBackupsForProject(id);
        })
        .then((foundBackups) => {
            backups = foundBackups;

            return this.getAllEnvironments(id);
        })
        .then((foundEnvironments) => {
            let project = new Project({
                id: id,
                backups: backups,
                settings: settings,
                environments: foundEnvironments,
                users: users
            });

            return Promise.resolve(project);
        });
    }

    /**
     * Gets a list of all available environments
     *
     * @param {String} project
     *
     * @returns {Promise(Array)} environments
     */
    static getAllEnvironments(project) {
        // First attempt to get remote environments
        return SyncHelper.getResource(project, null, 'environments')
        .then((environments) => {
            // If remote environments were found, resolve immediately
            if(environments && Array.isArray(environments)) {
                return Promise.resolve(environments);
            }

            // If remote environments were not found, return local ones
            return MongoHelper.find(project, 'settings', {})
            .then((allSettings) => {
                let names = [];

                for(let setting of allSettings) {
                    if(!setting.usedBy || setting.usedBy === 'project') { continue; }

                    names.push(setting.usedBy);
                }

                if(names.length < 1) {
                    names.push('live');
                }

                return Promise.resolve(names);
            });
        });
    }

    /**
     * Deletes a project
     *
     * @param {String} name
     *
     * @returns {Promise} Promise
     */
    static deleteProject(
        id = requriedParam('id'),
        makeBackup = true
    ) {
        // Make backup first, if specified
        if(makeBackup) {
            return BackupHelper.createBackup(id)
            .then(() => {
                return MongoHelper.dropDatabase(id);
            });

        // If not, just drop the database
        } else {
            return MongoHelper.dropDatabase(id);
        }
    }

    /**
     * Adds an environment
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Promise} New environment
     */
    static addEnvironment(
        project = requiredParam('project'),
        environment = requiredParam('environment')
    ) {
        // Check is project is synced first
        return SettingsHelper.getSettings(project, null, 'sync')
        .then((sync) => {
            if(sync.enabled) {
                return Promise.reject(new Error('Cannot add environments to a synced project'));
            }
            
            debug.log('Adding environment "' + environment + '" to project "' + project + '"...', this);
       
            return MongoHelper.updateOne(
                project,
                'settings',
                { usedBy: environment },
                { upsert: true }
            );
        })
        .then(() => {
            return Promise.resolve(environment);  
        });
    }

    /**
     * Renames a project
     *
     * @param {String} oldName
     * @param {String} newName
     *
     * @return {Promise} Promise
     */
    static renameProject(
        oldName = requiredParam('oldName'),
        newName = requiredParam('newName')
    ) {
        // Check is project is synced first
        return SettingsHelper.getSettings(project, null, 'sync')
        .then((sync) => {
            if(sync.enabled) {
                return Promise.reject(new Error('Cannot rename a synced project'));
            }

            return MongoHelper.renameDatabase(oldName, newName);
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
    static deleteEnvironment(
        project = requiredParam('project'),
        environment = requiredParam('environment')
    ) {
        // Check is project is synced first
        return SettingsHelper.getSettings(project, null, 'sync')
        .then((sync) => {
            if(sync.enabled) {
                return Promise.reject(new Error('Cannot delete environments from a synced project'));
            }
        
            debug.log('Deleting environment "' + environment + '" from project "' + project + '"...', this);

            // Make a backup
            return BackupHelper.createBackup(project.id);
        })

        // Get all collections with the environment prefix
        .then(() => {
            return MongoHelper.listCollections(project);
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
                    return MongoHelper.dropCollection(project, collection.name)
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
            return MongoHelper.remove(project, 'settings', { usedBy: environment });
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
        if(!name || !userId) {
            return Promise.reject(new Error('Projects cannot be created without a name and user id specified. Provided "' + name + '" and "' + userId + '"'));
        }
            
        let project = Project.create(name);

        return UserHelper.getUserById(userId)
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

            return MongoHelper.insertOne(project.id, 'settings', project.settings);
        })
        .then(() => {
            return Promise.resolve(project);
        });
    }
}

module.exports = ProjectHelper;
