'use strict';

/**
 * A helper class for managing projects
 */
class ProjectHelper {
    /**
     * Sets the current project and environment
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Promise} promise
     */
    static setCurrent(project, environment) {
        return new Promise((resolve, reject) => {
            this.currentProject = project;
        
            // First check if the environment is enabled
            ProjectHelper.getAllEnvironments()
            .then((environments) => {
                if(environments.indexOf(environment) > -1) {
                    this.currentEnvironment = environment;

                    resolve();
                } else {
                    reject(new Error('Environment "' + environment + '" is not enabled'));

                }
            });
        });
    }

    /**
     * Gets a list of all available projects
     *
     * @returns {Promise(Array)} projects
     */
    static getAllProjects() {
        return new Promise((resolve, reject) => {
            MongoHelper.listDatabases()
            .then((databases) => {
                resolve(databases);
            }); 
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
}

module.exports = ProjectHelper;
