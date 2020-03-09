'use strict';

const Path = require('path');

/**
 * The project class
 */
class Project extends require('Common/Entity/Project') {
    /**
     * Gets all projects
     *
     * @return {Array} Projects
     */
    static async list() {
        let databases = await HashBrown.Service.DatabaseService.listDatabases();
        let list = [];

        for(let database of databases) {
            let project = await this.get(database);

            list.push(project);
        }

        // Sort by name
        list.sort((a, b) => {
            a = a.getName();
            b = b.getName();

            if(a < b) { return -1; }
            if(a > b) { return 1; }

            return 0;
        });

        return list;
    }

    /**
     * Gets a project by id
     *
     * @param {String} id
     *
     * @return {HashBrown.Entity.Project} Project
     */
    static async get(id) {
        checkParam(id, 'id', String, true);
        
        let exists = await HashBrown.Service.DatabaseService.databaseExists(id);

        if(!exists) { return null; }


        let project = new this({
            id: id,
            settings: await HashBrown.Service.DatabaseService.findOne(id, 'settings', {}) || {}
        });

        return project;
    }

    /**
     * Creates a new project
     *
     * @param {String} name
     *
     * @return {HashBrown.Entity.Project} Project
     */
    static async create(name) {
        checkParam(name, 'name', String, true);

        let data = {
            id: this.createId(),
            settings: {
                info: {
                    name: name
                }
            }
        };

        await HashBrown.Service.DatabaseService.insertOne(project.id, 'settings', data);

        return project;
    }

    /**
     * Removes this project
     */
    async remove() {
        let storagePath = Path.join(APP_ROOT, 'storage', this.id);

        await HashBrown.Service.FileService.remove(storagePath);

        await HashBrown.Service.DatabaseService.dropDatabase(this.id);
    }

    /**
     * Gets all users for this project
     *
     * @param {Object} options
     *
     * @return {Array} Users
     */
    async getUsers(options = {}) {
        let query = {};

        let projectScopeQuery = {};
        projectScopeQuery['scopes.' + this.getName()] = { $exists: true };

        let isAdminQuery = { isAdmin: true };

        query['$or'] = [
            projectScopeQuery,
            isAdminQuery
        ];

        let users = await HashBrown.Service.DatabaseService.find(
            'users',
            'users',
            query,
            {
                tokens: 0,
                password: 0
            }
        );

        for(let i in users) {
            users[i] = new HashBrown.Entity.User(users[i]);
        }  

        users = users.sort((a, b) => {
            a = a.getName();
            b = b.getName();

            a = a.toLowerCase();
            b = b.toLowerCase();

            if(a < b) { return -1; }
            if(a > b) { return 1; }

            return 0;
        });

        return users;
    }

    /**
     * Gets settings
     *
     * @param {String} section
     *
     * @return {*} Settings
     */
    async getSettings(section) {
        checkParam(section, 'section', String);

        let settings = await HashBrown.Service.DatabaseService.findOne(this.id, 'settings', {});

        if(!settings) { return null; }

        if(section) {
            if(!settings[section]) { return null; }

            return settings[section];
        }

        return settings;
    }
    
    /**
     * Sets settings for an environment
     *
     * @param {String} environment
     * @param {Object} settings
     */
    async setEnvironmentSettings(environment, settings) {
        checkParam(environment, 'environment', String, true);
        checkParam(settings, 'settings', Object, true);

        let settings = await this.getSettings('environments');

        if(!settings || !settings[environment]) {
            throw new Error(`Environment ${environment} in project ${this.getName()} not found`);
        }
        
        settings[environment] = settings;

        await this.setSettings('environments', settings);
    }
    
    /**
     * Gets settings for an environment
     *
     * @param {String} environment
     *
     * @return {Object} Settings
     */
    async getEnvironmentSettings(environment) {
        checkParam(environment, 'environment', String, true);

        let settings = await this.getSettings('environments');

        if(!settings || !settings[environment]) {
            throw new Error(`Environment ${environment} in project ${this.getName()} not found`);
        }

        return settings[environment];
    }

    /**
     * Gets all environment names
     *
     * @return {Array} Environment names
     */
    async getEnvironments() {
        let environments = await this.getSettings('environments');
        
        // Reconstruct environment list from old structure
        if(!environments || environments.constructor !== Object || Object.keys(environments).length < 1) {
            environments = {};

            let settings = await HashBrown.Service.DatabaseService.find(this.id, 'settings', {});
                
            for(let entry of settings) {
                if(!entry.usedBy || entry.usedBy === 'project') { continue; }
    
                let name = entry.usedBy;

                delete entry.usedBy;

                environments[name] = entry;
            }
        
            await this.setSettings(this.id, 'environments', environments);
        }

        if(Object.keys(environments).length < 1) {
            environments['live'] = {};
        }

        return Object.keys(environments);
    }
}

module.exports = Project;
