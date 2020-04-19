'use strict';

/**
 * The base class for resources
 */
class ResourceBase extends require('Common/Entity/Resource/ResourceBase') {
    /**
     * Structure
     */
    structure() {
        super.structure();

        this.def(HashBrown.Entity.Context, 'context');
    }

    /**
     * Constructor
     *
     * @param {Object} params
     */
    constructor(params) {
        params = params || {};
        
        checkParam(params.context, 'context', HashBrown.Entity.Context, true);
        checkParam(params.context.project, 'context.project', HashBrown.Entity.Project, true);
        checkParam(params.context.environment, 'context.environment', String, true);
        checkParam(params.context.user, 'context.user', HashBrown.Entity.User, true);

        super(params);
    }
    
    /**
     * Gets an instance of this entity type
     *
     * @param {String} id
     * @param {HashBrown.Entity.Context} context
     * @param {Object} options
     *
     * @return {HashBrown.Entity.Resource.ResourceBase} Instance
     */
    static async get(context, id, options = {}) {
        checkParam(context, 'context', HashBrown.Entity.Context, true);
        checkParam(id, 'id', String, true);
        checkParam(options, 'options', Object, true);

        // Get the resource from database
        let resource = await HashBrown.Service.DatabaseService.findOne(
            context.project.id,
            context.environment + '.' + this.module,
            {
                id: id
            }
        );
      
        // Make sure it's not locked
        if(resource) {
            resource.isLocked = false;
        }

        // If the resource was not found locally, attempt remote fetch
        if(!resource && !options.localOnly) {
            let sync = await context.project.getSyncSettings();

            if(sync) {
                options.token = sync.token;

                resource = await HashBrown.Service.RequestService.request(
                    'get',
                    sync.url + '/api/' + sync.project + '/' + context.environment + '/' + this.module + '/' + id,
                    options
                );

                if(resource) {
                    resource.isLocked = true;
                    resource.sync.isRemote = true;
                }
            }
        }

        if(!resource) { return null; }

        resource.context = context;
        
        resource = this.new(resource);
        
        // Ensure modification date
        if(!resource.updatedOn && !resource.isLocked) {
            resource.updatedOn = resource.createdOn || new Date();

            await resource.save();
        }

        return resource;
    }
    
    /**
     * Gets a list of instances of this entity type
     *
     * @param {HashBrown.Entity.Context} context
     * @param {Object} options
     *
     * @return {Array} Instances
     */
    static async list(context, options = {}) {
        checkParam(context, 'context', HashBrown.Entity.Context, true);
        checkParam(options, 'options', Object, true);
        
        // Get local resources
        let resources = await HashBrown.Service.DatabaseService.find(
            context.project.id,
            context.environment + '.' + this.module,
            options
        );

        // Make sure they're not locked
        for(let resource of resources) {
            resource.isLocked = false;
        }

        // Attempt remote fetch and merge with local
        if(!options.localOnly) {
            let sync = await context.project.getSyncSettings();

            if(sync) {
                let allResources = {};

                for(let resource of resources) {
                    if(!resource || !resource.id) { continue; }

                    allResources[resource.id] = resource;
                }

                options.token = sync.token;

                let remoteResources = await HashBrown.Service.RequestService.request(
                    'get',
                    sync.url + '/api/' + sync.project + '/' + context.environment + '/' + this.module,
                    options
                );

                for(let resource of remoteResources) {
                    if(!resource || !resource.id || allResources[resource.id]) { continue; }

                    resource.isLocked = true;
                    resource.sync.isRemote = true;

                    allResources[resource.id] = resource;
                }

                resources = Object.values(allResources);
            }
        }

        // Post process
        for(let i = resources.length - 1; i >= 0; i--) {
            // Include context
            resources[i].context = context;
            
            // Apply model
            resources[i] = this.new(resources[i]);
        
            // Exclude null resources
            if(!resources[i]) {
                resources.splice(i, 1);
                continue;
            }

            // Ensure modification date
            if(!resources[i].updatedOn && !resources[i].isLocked) {
                resources[i].updatedOn = resources[i].createdOn || new Date();

                await resources[i].save();
            }
        }

        // Sort resources if specified
        if(options.sortBy) {
            resources = resources.sort((a, b) => {
                a = options.sortBy === 'name' ? a.getName() : a[options.sortBy];
                b = options.sortBy === 'name' ? b.getName() : b[options.sortBy];

                return a > b ? 1 : a < b ? -1 : 0;
            }) 
        }

        return resources;
    }
    
    /**
     * Creates a new instance of this entity type
     *
     * @param {HashBrown.Entity.Context} context
     * @param {Object} data
     * @param {Object} options
     *
     * @return {HashBrown.Entity.Resource.ResourceBase} Instance
     */
    static async create(context, data = {}, options = {}) {
        checkParam(context, 'context', HashBrown.Entity.Context, true);
        checkParam(data, 'data', Object, true);
        checkParam(options, 'options', Object, true);

        data.createdBy = context.user.id;
        data.createdOn = new Date();
        data.updatedBy = context.user.id;
        data.updatedOn = new Date();
        data.viewedBy = context.user.id;
        data.viewedOn = new Date();

        data.id = this.createId();
            
        data.context = context;
        
        let resource = this.new(data);

        await HashBrown.Service.DatabaseService.insertOne(
            context.project.id,
            context.environment + '.' + this.module,
            resource.getObject()
        );

        return resource;
    }
    
    /**
     * Saves the current state of this entity
     *
     * @param {Object} options
     */
    async save(options = {}) {
        checkParam(options, 'options', Object, true);

        // Check if this resource is locked
        if(this.isLocked) {
            throw new Error(`The resource ${this.id} (${this.getName()}) is locked`);
        }

        // If the id has been changed, check for duplicate ids
        if(options.id && options.id !== this.id) {
            let existingResource = await this.constructor.get(this.context, this.id);

            if(existingResource) {
                throw new HashBrown.Http.Exception(`A resource with the id "${this.id}" already exists`, 403);
            }
        }

        // Unset sync flags
        this.sync = {
            isRemote: false,
            hasRemote: false
        };

        if(this.context.user) {
            this.updatedBy = this.context.user.id;
            this.updatedOn = new Date();
        }

        // Insert into database
        await HashBrown.Service.DatabaseService.updateOne(
            this.context.project.id,
            this.context.environment + '.' + this.module,
            {
                id: options.id || this.id
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
     * @param {Object} options
     */
    async remove(options = {}) {
        checkParam(options, 'options', Object, true);

        await HashBrown.Service.DatabaseService.removeOne(
            this.context.project.id,
            this.context.environment + '.' + this.module,
            {
                id: this.id
            }
        );
    }
    
    /**
     * Pulls a synced resource
     */
    async pull() {
        let sync = await this.context.project.getSyncSettings();

        if(!sync) {
            throw new Error('Sync not enabled or unconfigured for this project');
        }

        let resource = await HashBrown.Service.RequestService.request(
            'get',
            sync.url + '/api/' + sync.project + '/' + this.context.environment + '/' + this.module + '/' + this.id,
            { token: sync.token }
        );
        
        if(!resource) {
            throw new Error(`Could not find remote resource ${this.module}/${this.id}`);
        }
        
        this.adopt(resource);
        
        await this.save();
    }
    
    /**
     * Pushes a synced resource
     */
    async push() {
        let sync = await this.context.project.getSyncSettings();

        if(!sync) {
            throw new Error('Sync not enabled or unconfigured for this project');
        }

        await HashBrown.Service.RequestService.request(
            'post',
            sync.url + '/api/' + sync.project + '/' + this.context.environment + '/' + this.module + '/' + this.id + '?token=' + sync.token + '&create=true',
            this.getObject()
        );

        await this.remove();
    }
    
    /**
     * Submits a heartbeat on this resource
     */
    async heartbeat() {
        if(this.isLocked) { return; }

        await HashBrown.Service.DatabaseService.updateOne(
            this.context.project.id,
            this.context.environment + '.' + this.module,
            {
                id: this.id
            },
            {
                viewedBy: this.context.user.id,
                viewedOn: new Date()
            }
        );
    }

    /**
     * Gets a mutable object of this entity
     *
     * @return {Object} Object
     */
    getObject() {
        let object = super.getObject();

        delete object.context;

        return object;
    }
}

module.exports = ResourceBase;
