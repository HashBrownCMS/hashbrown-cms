'use strict';

let Project = require('../../common/models/Project');

/**
 * A helper class for managing projects
 */
class ProjectHelper {
    /**
     * Sets the current project and environment
     *
     * @param {String} projectName
     * @param {String} environmentName
     *
     * @returns {Promise} Promise
     */
    static setCurrent(projectName, environmentName) {
        return new Promise((resolve, reject) => {
            // First check if the project exists
            this.getProject(projectName)
            .then((project) => {
                this.currentProject = project.name;

                // Then check if the environment is enabled
                if(project.settings.environments.names.indexOf(environmentName) > -1) {
                    this.currentEnvironment = environmentName;

                    resolve();

                } else {
                    reject(new Error('Environment "' + environment + '" is does not exist in project "' + project.name + '"'));

                }
            })
            .catch(reject);
        });
    }

    /**
     * Gets a list of all available projects
     *
     * @returns {Promise} Array of Project objects
     */
    static getAllProjects() {
        return new Promise((resolve, reject) => {
            MongoHelper.listDatabases()
            .then(resolve)
            .catch(reject); 
        });
    }

    /**
     * Gets a Project object
     *
     * @param {String} name
     *
     * @returns {Promise} Project object
     */
    static getProject(name) {
        return new Promise((resolve, reject) => {
            MongoHelper.find(name, 'settings', {})
            .then((settings) => {
                /*if(!Array.isArray(settings) || settings.length < 1) {
                    reject(new Error('Project "' + name + '" does not exist'));

                } else {*/
                    UserHelper.getAllUsers(name)
                    .then((users) => {
                        let project = new Project();

                        project.name = name;

                        for(let section of (settings || [])) {
                            project.settings[section.section] = section;
                        }

                        // Sanity check
                        if(!project.settings.language) {
                            project.settings.language = {
                                section: 'language',
                                selected: [ 'en' ]
                            };
                        }
                        
                        if(!project.settings.environments) {
                            project.settings.environments = {
                                section: 'environments',
                                names: [ 'live' ]
                            };
                        }
                    
                        project.users = users;

                        resolve(project.getObject());
                    });
               /* }*/
            })
            .catch(reject);
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
        return new Promise((resolve, reject) => {
            SettingsHelper.getSettings('environments')
            .then((environments) => {
                // There should always be at least one environment available
                if(!environments) {
                    environments = [ 'live' ];
                }

                resolve(environments);
            });
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
                name = (name || '').toLowerCase();
                name = name.replace(/[^a-z_.]/g, '');

                MongoHelper.insertOne(name, 'settings', {})
                .then(() => {
                    // The user that creates a project gets all scopes
                    return UserHelper.addUserProjectScope(userId, name, [ 'users', 'settings', 'connections', 'schemas' ]);
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
