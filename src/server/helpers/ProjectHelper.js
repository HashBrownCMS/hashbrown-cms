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
     */
    static setCurrent(project, environment) {
        this.currentProject = project;
        this.currentEnvironment = environment;
    }
}

module.exports = ProjectHelper;
