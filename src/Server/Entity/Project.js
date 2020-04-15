'use strict';

const Path = require('path');

/**
 * The project class
 */
class Project extends require('Common/Entity/Project') {
    /**
     * Gets all project ids
     *
     * @return {Array} Project ids
     */
    static async listIds() {
        return await HashBrown.Service.DatabaseService.listDatabases();
    }

    /**
     * Gets all projects
     *
     * @return {Array} Projects
     */
    static async list() {
        let list = await this.listIds();

        for(let i in list) {
            list[i] = await this.get(list[i]);
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

        let project = this.new({
            id: id
        });

        project.settings = await project.getSettings();
        project.environments = await project.getEnvironments();
        project.users = await project.getUsers();
        project.backups = await project.getBackups();

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

        let id = this.createId();
        let settings = { name: name };

        await HashBrown.Service.DatabaseService.insertOne(
            id,
            'settings',
            settings
        );

        return this.new({ id: id, settings: settings });
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
            users[i] = HashBrown.Entity.User.new(users[i]);
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
     * Gets a new sync token
     *
     * @param {String} username
     * @param {String} password
     * @param {String} url
     *
     * @return {String} Token
     */
    async getSyncToken(username, password, url) {
        checkParam(username, 'username', String, true);
        checkParam(password, 'password', String, true);
        checkParam(url, 'url', String, true);

        let token = await HashBrown.Service.RequestService.request(
            'post',
            url + '/api/user/login',
            {
                persist: true,
                username: username,
                password: password
            }
        );

        return token;
    }
   
    /**
     * Gets sync settings
     *
     * @param {Boolean} skipValidation
     *
     * @return {Object} Settings
     */
    async getSyncSettings(skipValidation = false) {
        checkParam(skipValidation, 'skipValidation', Boolean);

        let sync = (await HashBrown.Service.DatabaseService.findOne(
            this.id,
            'settings',
            {
                environment: { $exists: false }
            }
        ) || {}).sync;

        if(skipValidation) { return sync; }

        if(!sync || !sync.enabled) { return null; }

        if(
            !sync.project ||
            !sync.url ||
            !sync.token ||
            sync.project === this.id
        ) {
            throw new Error('Invalid sync settings');
        }

        try {
            new URL(sync.url);
        
        } catch(e) {
            throw new Error('Invalid sync URL');

        }

        return sync;
    }

    /**
     * Gets settings
     *
     * @param {String} section
     *
     * @return {*} Settings
     */
    async getSettings(section = '') {
        checkParam(section, 'section', String);
        
        let sync = await this.getSyncSettings();
        
        if(section === 'sync') { return sync; }

        // Get settings from local database
        let settings = await HashBrown.Service.DatabaseService.findOne(
            this.id,
            'settings',
            {
                environment: { $exists: false }
            }
        );
        
        // Attempt remote fetch of project settings
        if(sync) {
            let remoteSettings = await HashBrown.Service.RequestService.request(
                'get',
                sync.url + '/api/projects/' + sync.project + '/settings',
                { token: sync.token }
            );

            if(remoteSettings) {
                if(remoteSettings.name) {
                    settings.name += ' (' + remoteSettings.name + ')';
                }

                delete remoteSettings.name;
                delete remoteSettings.sync;

                // Merge remote settings with local ones, respecting overrides
                for(let key in remoteSettings) {
                    if(settings[key] && Object.keys(settings[key]).length > 0) { continue; }
                    
                    settings[key] = remoteSettings[key];
                }
            }
        }

        if(!settings) { return null; }
       
        if(section) {
            return settings[section] || {};
        }

        return settings;
    }

    /**
     * Sets settings
     *
     * @param {Object} settings
     * @param {String} section
     */
    async setSettings(settings, section = '') {
        checkParam(settings, 'settings', Object, true);
        checkParam(section, 'section', String);
        
        if(section) {
            let oldSettings = await HashBrown.Service.DatabaseService.findOne(this.id, 'settings', {});

            if(!oldSettings) {
                oldSettings = {};
            }

            if(!oldSettings[section]) {
                oldSettings[section] = {};
            }

            oldSettings[section] = settings;

            settings = oldSettings;
        }
            
        await HashBrown.Service.DatabaseService.updateOne(this.id, 'settings', {}, settings);

        return settings;
    }
    
    /**
     * Creates a backup for this project
     *
     * @return {String} Timestamp
     */
    async createBackup() {
        return await HashBrown.Service.DatabaseService.dump(this.id);
    }
    
    /**
     * Gets all backups
     *
     * @return {Array} Backup timestamps
     */
    async getBackups() {
        let path = Path.join(APP_ROOT, 'storage', this.id, 'dump', '*.hba');
        let files = await HashBrown.Service.FileService.list(path);
        
        for(let i in files) {
            files[i] = Path.basename(files[i], '.hba');
        }

        return files;
    }

    /**
     * Gets a backup
     */
    async getBackup(timestamp) {
        throw new Error('Method "getBackup" must be overridden');
    }
    
    /**
     * Removes a backup
     *
     * @param {String} timestamp
     */
    async removeBackup(timestamp) {
        checkParam(timestamp, 'timestamp', String, true);
        
        let path = Path.join(APP_ROOT, 'storage', this.id, 'dump', timestamp + '.hba');

        if(!HashBrown.Service.FileService.exists(path)) {
            throw new Error(`Backup ${timestamp} not found for project ${this.getName()}`);
        }

        await HashBrown.Service.FileService.remove(path);
    }
    
    /**
     * Restores a backup
     *
     * @param {String} timestamp
     */
    async restoreBackup(timestamp) {
        checkParam(timestamp, 'timestamp', String, true);

        await HashBrown.Service.DatabaseService.restore(this.id, timestamp);

        await HashBrown.Service.MigrationService.migrate();
    }
    
    /**
     * Adds a backup
     *
     * @param {String} timestamp
     * @param {Buffer} data
     */
    async addBackup(timestamp, data) {
        checkParam(timestamp, 'timestamp', String, true);
        checkParam(data, 'data', Buffer, true);
        
        let path = Path.join(APP_ROOT, 'storage', this.id, 'dump', timestamp + '.hba');

        await HashBrown.Service.FileService.write(path, data);
    }
    
    /**
     * Adds a new environment
     *
     * @param {String} name
     */
    async addEnvironment(name) {
        checkParam(name, 'name', String, true);
        
        let sync = await this.getSyncSettings();

        if(sync) {
            throw new Error('Cannot add environments to synced projects');
        }

        if(name.length < 2) {
            throw new Error('Environment name must be at least 2 characters long');
        }

        let environments = await this.getEnvironments();

        if(environments.indexOf(name) > -1) {
            throw new Error(`Environment ${name} already exists`);
        }

        await HashBrown.Service.DatabaseService.insertOne(this.id, 'settings', { environment: name });
    }
    
    /**
     * Gets settings for an environment
     *
     * @param {String} environment
     * @param {String} section
     *
     * @return {Object} Settings
     */
    async getEnvironmentSettings(environment, section = '') {
        checkParam(environment, 'environment', String, true);
        checkParam(section, 'section', String);
        
        let sync = await this.getSyncSettings();

        if(sync) {
            return await HashBrown.Service.RequestService.request(
                'get',
                sync.url + '/api/projects/' + sync.project + '/environments/' + environment,
                { token: sync.token }
            );
        }

        let settings = await HashBrown.Service.DatabaseService.findOne(
            this.id,
            'settings',
            {
                environment: environment
            }
        );

        if(!settings) { return null; }

        if(section) {
            return settings[section] || {};
        }

        return settings;
    }
    
    /**
     * Sets settings for an environment
     *
     * @param {String} environment
     * @param {Object} settings
     * @param {String} section
     */
    async setEnvironmentSettings(environment, settings, section = '') {
        checkParam(environment, 'environment', String, true);
        checkParam(settings, 'settings', Object, true);
        checkParam(section, 'section', String);

        let sync = await this.getSyncSettings();

        if(sync) {
            throw new Error('Cannot set environment settings on synced projects');
        }
        
        let existingSettings = await this.getEnvironmentSettings(environment);

        if(!existingSettings) {
            throw new Error(`Environment ${environment} in project ${this.getName()} not found`);
        }
        
        if(section) {
            existingSettings[section] = settings;
            settings = existingSettings;
        }

        return await HashBrown.Service.DatabaseService.mergeOne(
            this.id,
            'settings',
            {
                environment: environment
            },
            settings
        );
    }
    
    /**
     * Removes an environment
     *
     * @param {String} name
     */
    async removeEnvironment(name) {
        checkParam(name, 'name', String, true);

        let sync = await this.getSyncSettings();

        if(sync) {
            throw new Error('Cannot remove environments on synced projects');
        }
        
        await HashBrown.Service.DatabaseService.remove(this.id, 'settings', { environment: name });
    }
    
    /**
     * Gets all environment names
     *
     * @return {Array} Environment names
     */
    async getEnvironments() {
        let sync = await this.getSyncSettings();

        if(sync) {
            return await HashBrown.Service.RequestService.request(
                'get',
                sync.url + '/api/projects/' + sync.project + '/environments',
                { token: sync.token }
            );
        }

        let collections = await HashBrown.Service.DatabaseService.find(
            this.id,
            'settings',
            {
                environment: { $exists: true }
            }
        );
        
        let environments = [];

        for(let collection of collections) {
            let name = collection.environment;

            if(!name || environments.indexOf(name) > -1) { continue; }

            environments.push(name);
        }

        environments.sort();
       
        if(environments.length < 1) {
            await HashBrown.Service.DatabaseService.insertOne(
                this.id,
                'settings',
                {
                    environment: 'live'
                }
            );

            environments.push('live');
        }

        return environments;
    }

    /**
     * Performs a series of unit test
     *
     * @param {HashBrown.Entity.Context} context
     * @param {Function} report
     */
    static async test(context, report) {
        checkParam(context, 'context', HashBrown.Entity.Context, true);
        checkParam(report, 'report', Function, true);
        
        report(`Get project ${context.project.getName()}`);

        let project = await this.get(context.project.id);
        
        report(`Add environment to project ${project.getName()}`);
        
        await project.addEnvironment('testenvironment');
        
        report(`Remove environment from project ${project.getName()}`);
        
        await project.removeEnvironment('testEnvironment');
        
        report(`Get all environments from project ${project.getName()}`);
        
        await project.getEnvironments();
        
        report(`Get all users from project ${project.getName()}`);
        
        await project.getUsers();
        
        report(`Get backups for project ${project.getName()}`);
        
        await project.getBackups();

        report(`Create backup for project ${project.getName()}`); 
        
        let timestamp = await project.createBackup();

        report(`Restore backup ${timestamp} on project ${project.getName()}`);
        
        await project.restoreBackup(timestamp);
        
        report(`Remove backup ${timestamp} from project ${project.getName()}`);
    
        await project.removeBackup(timestamp);
    }
}

module.exports = Project;
