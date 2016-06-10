'use strict';

// Helpers
let MongoHelper = require('./MongoHelper');
let SettingsHelper = require('./SettingsHelper');

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
        return new Promise((callback) => {
            this.currentProject = project;
        
            // First check if the environment is enabled
            SettingsHelper.getSettings('environments', project)
            .then((environments) => {
                // There should always be at least one environment available
                if(!environments) {
                    environments = [ 'live' ];
                }

                if(environments.indexOf(environment) > -1) {
                    this.currentEnvironment = environment;

                    callback();
                } else {
                    throw 'Environment "' + environment + '" is not enabled';

                }
            });
        });
    }
}

module.exports = ProjectHelper;
