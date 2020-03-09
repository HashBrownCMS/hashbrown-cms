'use strict';

/**
 * The base class for resources
 */
class ResourceBase extends require('Common/Entity/Resource/ResourceBase') {
    /**
     * Gets an instance of this entity type
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     * @param {Object} options
     *
     * @return {HashBrown.Entity.Resource.ResourceBase} Instance
     */
    static async get(project, environment, id, options = {}) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(id, 'id', String, true);
        checkParam(options, 'options', Object, true);

        let resource = await HashBrown.Service.DatabaseService.findOne(
            project,
            environment + '.' + this.category,
            {
                id: id
            }
        );
        
        if(!resource && !options.localOnly) {
            resource = await HashBrown.Service.SyncService.getResourceItem(
                project,
                environment,
                this.category,
                id
            );
        }

        return new this(resource);
    }
    
    /**
     * Gets a list of instances of this entity type
     *
     * @param {String} project
     * @param {String} environment
     * @param {Object} options
     *
     * @return {Array} Instances
     */
    static async list(project, environment, options = {}) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(options, 'options', Object, true);
        
        let sort = {};

        if(options.sortBy) {
            sort[options.sortBy] = 1;
        }

        let resources = await HashBrown.Service.DatabaseService.find(
            options.project,
            environment + '.' + this.category,
            {},
            {},
            sort
        );

        if(!options.localOnly) {
            resources = await HashBrown.Service.SyncService.mergeResource(
                project,
                environment,
                this.category,
                resources
            );
        }

        for(let i in resources) {
            resources[i] = new this(resources[i]);
        }

        return resources;
    }
    
    /**
     * Creates a new instance of this entity type
     *
     * @param {HashBrown.Entity.User} user
     * @param {String} project
     * @param {String} environment
     * @param {Object} data
     * @param {Object} options
     *
     * @return {HashBrown.Entity.Resource.ResourceBase} Instance
     */
    static async create(user, project, environment, data = {}, options = {}) {
        checkParam(user, 'user', HashBrown.Entity.User, true);
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(data, 'data', Object, true);
        checkParam(options, 'options', Object, true);

        data.createdBy = user.id;
        data.createdOn = new Date();
        data.updatedBy = user.id;
        data.updatedOn = new Date();
        data.viewedBy = user.id;
        data.viewedOn = new Date();

        data.id = this.createId();

        let resource = new this(data);

        await HashBrown.Service.DatabaseService.insertOne(
            project,
            environment + '.' + this.category,
            resource.getObject()
        );

        return resource;
    }
    
    /**
     * Saves the current state of this entity
     *
     * @param {HashBrown.Entity.User} user
     * @param {String} project
     * @param {String} environment
     * @param {Object} options
     */
    async save(user, project, environment, options = {}) {
        checkParam(user, 'user', HashBrown.Entity.User, true);
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(options, 'options', Object, true);

        if(this.isLocked) {
            throw new Error(`The resource ${this.id} (${this.getName()}) is locked`);
        }

        // Unset sync flags
        this.sync = {
            isRemote: false,
            hasRemote: false
        };

        this.updatedBy = user.id;
        this.updatedOn = new Date();

        // Insert into database
        await HashBrown.Service.DatabaseService.updateOne(
            project,
            environment + '.' + this.category,
            {
                id: this.id
            },
            this.getObject(),
            {
                upsert: true
            }
        );
    }
    
    /**
     * Removes this entity
     *
     * @param {HashBrown.Entity.User} user
     * @param {String} project
     * @param {String} environment
     * @param {Object} options
     */
    async remove(user, project, environment, options = {}) {
        checkParam(user, 'user', HashBrown.Entity.User, true);
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(options, 'options', Object, true);

        await HashBrown.Service.DatabaseService.removeOne(
            project,
            collection,
            {
                id: this.id
            }
        );
    }
    
    /**
     * Pulls a synced resource
     *
     * @param {String} project
     * @param {String} environment
     */
    async pull(project, environment) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);

        let remote = await HashBrown.Service.SyncService.getResourceItem(
            project,
            environment,
            this.category,
            this.id
        );
        
        if(!resource) {
            throw new Error(`Could not find remote resource ${this.category}/${this.id}`);
        }
        
        this.adopt(remote);
        
        await this.save(user, project, environment);
    }
    
    /**
     * Pushes a synced resource
     *
     * @param {String} project
     * @param {String} environment
     */
    async push(project, environment) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        
        await HashBrown.Service.SyncService.setResourceItem(
            project,
            environment,
            this.category,
            this.id,
            this.getObject()
        );
    }
    
    /**
     * Submits a heartbeat on this resource
     *
     * @param {String} project
     * @param {String} environment
     * @param {HashBrown.Entity.Resource.User} user
     */
    async heartbeat(project, environment, user) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(user, 'user', HashBrown.Entity.Resource.User, true);
        
        if(this.isLocked) { return; }

        await HashBrown.Service.DatabaseService.updateOne(
            project,
            environment + '.' + this.category,
            {
                id: this.id
            },
            {
                viewedBy: user.id,
                viewedOn: new Date()
            }
        );
    }
}

module.exports = ResourceBase;
