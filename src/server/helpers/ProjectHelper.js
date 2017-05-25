'use strict';

let Project = require('../../common/models/Project');

/**
 * A helper class for managing projects
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
        return ProjectHelper.getAllEnvironments(project)
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

        return SettingsHelper.getSettings(id)
        .then((foundSettings) => {
            settings = foundSettings || {};

            return UserHelper.getAllUsers(id);
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
            let project = new Project();

            project.id = id;
            project.backups = backups;

            project.settings = settings;
            project.environments = foundEnvironments;

            // Sanity check
            if(!project.settings.languages) {
                project.settings.languages = [ 'en' ];
            }
            
            if(!project.settings.info) {
                project.settings.info = {
                    name: id
                };
            }

            project.users = users;
            
            return Promise.resolve(project.getObject());
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
        return MongoHelper.find(project, 'settings', {})
        .then((allSettings) => {
            let names = [];

            for(let setting of allSettings) {
                if(setting.usedBy === 'project') { continue; }

                names.push(setting.usedBy);
            }

            if(names.length < 1) {
                names.push('live');
            }

            return Promise.resolve(names);
        });
    }

    /**
     * Deletes a project
     *
     * @param {String} name
     *
     * @returns {Promise} Promise
     */
    static deleteProject(name) {
        // Make backup first
        return BackupHelper.createBackup(name)
        .then(() => {
            return MongoHelper.dropDatabase(name);
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
        debug.log('Deleting environment "' + environment + '" from project "' + project + '"...', this);

        // Make backup first
        return BackupHelper.createBackup(project)

        // Get all collections with the environment prefix
        .then(() => {
            return MongoHelper.listCollections(project);
        })

        // Iterate through collections and match them with the environemtn name
        .then((collections) => {
            function next() {
                let collection = collections.pop();

                // No more collections, resolve
                if(!collection) {
                    debug.log('Deleted environment "' + environment + '" from project "' + project + '" successfully', ProjectHelper);
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
        return new Promise((resolve, reject) => {
            if(name && userId) {
                let project = Project.create(name);

                MongoHelper.insertOne(project.id, 'settings', project.settings.info)
                .then(() => {
                    // The user that creates a project gets all scopes
                    return UserHelper.addUserProjectScope(userId, project.id, [ 'users', 'settings', 'connections', 'schemas' ]);
                })
                .then(resolve)
                .catch(reject);
            } else {
                reject(new Error('Projects cannot be created without a name and user id specified. Provided "' + name + '" and "' + userId + '"'));
            }
        });
    }
}

module.exports = ProjectHelper;
