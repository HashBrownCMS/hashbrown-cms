'use strict';

/**
 * The project entity
 */
class Project extends require('Common/Entity/Project') {
    /**
     * Gets all projects
     *
     * @return {Array} Projects
     */
    static async list() {
        let list = await HashBrown.Service.RequestService.customRequest('get', '/api/projects');

        for(let i in list) {
            list[i] = this.new(list[i]);
        }

        return list;
    }
    
    /**
     * Gets a projects
     *
     * @param {String} id
     *
     * @return {HashBrown.Entity.Project} Project
     */
    static async get(id) {
        checkParam(id, 'id', String, true);

        let project = await HashBrown.Service.RequestService.customRequest('get', '/api/projects/' + id);

        project = this.new(project);

        return project;
    }
    
    /**
     * Creates a project
     *
     * @param {String} name
     *
     * @return {HashBrown.Entity.Project} Project
     */
    static async create(name) {
        checkParam(name, 'name', String, true);

        let project = await HashBrown.Service.RequestService.customRequest('post', '/api/projects/new', { name: name });

        project = this.new(project);

        return project;
    }
    
    /**
     * Removes this project
     */
    async remove() {
        await HashBrown.Service.RequestService.customRequest('delete', '/api/projects/' + this.id);
    }
    
    /**
     * Gets all users
     *
     * @return {Array} Users
     */
    async getUsers() {
        let users = await HashBrown.Service.RequestService.customRequest('get', '/api/projects/' + this.id + '/users');

        for(let i in users) {
            users[i] = HashBrown.Entity.User.new(users[i]);
        }

        return users;
    }

    /**
     * Gets all settings or a section
     *
     * @param {String} section
     *
     * @return {Object} Settings
     */
    async getSettings(section) {
        checkParam(section, 'section', String);

        let apiUrl = '/api/projects/' + this.id + '/settings';

        if(section) {
            apiUrl += '/' + section;
        }

        return await HashBrown.Service.RequestService.customRequest('get', apiUrl);
    }
    
    /**
     * Sets all settings or a section
     *
     * @param {Object} settings
     * @param {String} section
     */
    async setSettings(settings, section = '') {
        checkParam(settings, 'settings', Object, true);
        checkParam(section, 'section', String);

        let apiUrl = '/api/projects/' + this.id + '/settings';

        if(section) {
            apiUrl += '/' + section;
        }

        await HashBrown.Service.RequestService.customRequest('post', apiUrl, settings);
    }

    /**
     * Saves this entity
     */
    async save() {
        await this.setSettings(this.settings); 
    }
}

module.exports = Project;
