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
            list[i] = new this(list[i]);
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

        project = new this(project);

        return project;
    }
    
    /**
     * Creates a projects
     *
     * @param {String} name
     *
     * @return {HashBrown.Entity.Project} Project
     */
    static async create(name) {
        checkParam(name, 'name', String, true);

        let project = await HashBrown.Service.RequestService.customRequest('post', '/api/projects/new', { name: name });

        project = new this(project);

        return project;
    }
    
    /**
     * Removes this projects
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
            users[i] = new HashBrown.Entity.User(users[i]);
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

        let apiUrl = '/api/projects/' + this. + '/settings';

        if(section) {
            apiUrl += '/' + section;
        }

        return await HashBrown.Service.RequestService.customRequest('get', apiUrl);
    }
    
    /**
     * Sets all settings or a section
     *
     * @param {String} section
     * @param {Object} settings
     */
    async setSettings(section, settings) {
        checkParam(section, 'section', String);
        checkParam(settings, 'settings', Object, true);

        let apiUrl = '/api/projects/' + project + '/settings';

        if(section) {
            apiUrl += '/' + section;
        }

        await HashBrown.Service.RequestService.customRequest('post', apiUrl, settings);
    }

    /**
     * Saves this entity
     */
    await save() {
        await this.setSettings(this.settings); 
    }
}

module.exports = Project;
