'use strict';

const MAX_CACHE_TIME = 1000 * 60 * 5; // 5 minutes

/**
 * The base class for resources
 */
class ResourceBase extends require('Common/Entity/Resource/ResourceBase') {
    /**
     * Enables/disables memory caching
     * This should only be used with extremely frequently accessed resources
     *
     * @return {Boolean} Use caching
     */
    static get useCaching() { return false; }

    /**
     * Gets the context
     *
     * @return {HashBrown.Entity.Context} Context
     */
    get context() {
        return HashBrown.Client.context;
    }

    /**
     * Sets a cache object
     *
     * @param {String} key
     * @param {Object} options
     * @param {Object} data
     */
    static setCache(id, options, data) {
        checkParam(id, 'id', String, true);
        checkParam(options, 'options', Object);
        checkParam(data, 'data', Object);

        if(!this.useCaching) { return; }
        
        if(!this.cache) {
            this.cache = {};
        }

        let key = id + (options ? '_' + new URLSearchParams(options).toString() : '');

        if(!data) {
            delete this.cache[id];
        }

        if(data instanceof HashBrown.Entity.EntityBase) {
            data = data.getObject();
        }

        this.cache[key] = {
            expires: Date.now() + MAX_CACHE_TIME,
            data: data
        };
    }
    
    /**
     * Gets a cache object
     *
     * @param {String} key
     * @param {Object} options
     *
     * @return {Object} Data
     */
    static getCache(id, options) {
        checkParam(id, 'id', String, true);
        checkParam(options, 'options', Object);
        
        if(!this.useCaching) { return null; }

        if(!this.cache) { return null; }

        let key = id + (options ? '_' + new URLSearchParams(options).toString() : '');

        if(!this.cache[key] || !this.cache[key].data || this.cache[key].expires <= Date.now()) {
            delete this.cache[key];

            return null;
        }

        return this.cache[key].data;
    }

    /**
     * Gets an instance of this entity type
     *
     * @param {String} id
     * @param {Object} options
     *
     * @return {HashBrown.Entity.Resource.ResourceBase} Instance
     */
    static async get(id, options = {}) {
        checkParam(id, 'id', String);
        checkParam(options, 'options', Object, true);

        if(!id) { return null; }

        let resource = this.getCache(id, options);

        if(!resource) {
            try {
                resource = await HashBrown.Service.RequestService.request('get', this.category + '/' + id, null, options);
            } catch(e) {
                resource = null;
            }
        }
            
        if(!resource) { return null; }

        resource = this.new(resource);
        
        this.setCache(id, options, resource);

        return resource;
    }
    
    /**
     * Gets a list of instances of this entity type
     *
     * @param {Object} options
     *
     * @return {Array} Instances
     */
    static async list(options = {}) {
        let resources = await HashBrown.Service.RequestService.request('get', this.category, null, options);
        
        if(!resources) {
            throw new Error('Resource list ' + this.category + ' not found');
        }
   
        for(let i = resources.length - 1; i >= 0; i--) {
            if(!resources[i] || !resources[i].id) {
                resources.splice(i, 1);
                continue;
            }

            resources[i] = this.new(resources[i]);
          
            if(!resources[i]) {
                resources.splice(i, 1);
                continue;
            }

            this.setCache(resources[i].id, {}, resources[i]); 
        }

        return resources;
    }
    
    /**
     * Creates a new instance of this entity type
     *
     * @param {Object} data
     * @param {Object} options
     *
     * @return {HashBrown.Entity.Resource.ResourceBase} Instance
     */
    static async create(data = {}, options = {}) {
        checkParam(data, 'data', Object, true);
        checkParam(options, 'options', Object, true);
        
        let resource = await HashBrown.Service.RequestService.request('post', this.category + '/new', data, options);

        resource = this.new(resource);

        HashBrown.Service.EventService.trigger('resource', resource.id);  

        this.setCache(resource.id, {}, resource);

        return resource;
    }
    
    /**
     * Saves the current state of this entity
     *
     * @param {Object} options
     */
    async save(options = {}) {
        let id = HashBrown.Service.NavigationService.getRoute(1) || this.id;
        let data = this.getObject();

        await HashBrown.Service.RequestService.request('post', this.category + '/' + id, data, options);
        
        HashBrown.Service.EventService.trigger('resource', this.id);

        this.constructor.setCache(id, {}, data);
    }
    
    /**
     * Removes this entity
     */
    async remove() {
        let id = HashBrown.Service.NavigationService.getRoute(1) || this.id;
        
        await HashBrown.Service.RequestService.request('delete', this.category + '/' + id);
        
        // Cancel any editor instances displaying the deleted content
        if(location.hash == '#/' + this.category + '/' + id) {
            location.hash = '/' + this.category + '/';
        } 

        HashBrown.Service.EventService.trigger('resource', this.id);  

        this.constructor.setCache(id, {}, null);
    }
    
    /**
     * Pulls a synced resource
     */
    async pull() {
        let data = await HashBrown.Service.RequestService.request('post', this.category + '/' + this.id + '/pull');

        this.adopt(data);
    
        HashBrown.Service.EventService.trigger('resource', this.id);

        this.constructor.setCache(this.id, {}, data);
    }
    
    /**
     * Pushes a synced resource
     */
    async push() {
        await HashBrown.Service.RequestService.request('post', this.category + '/' + this.id + '/push');

        HashBrown.Service.EventService.trigger('resource', this.id);
    }
    
    /**
     * Submits a heartbeat on this resource
     *
     * @param {Object} options
     */
    async heartbeat(options = {}) {
        await HashBrown.Service.RequestService.request(
            'post',
            (options.category || this.category) + '/' + (options.id || this.id) + '/heartbeat'
        );
    }

    /**
     * Gets whether sync is enabled for this resource
     *
     * @return {Boolean} Is sync enabled
     */
    isSyncEnabled() {
        return this.sync &&
            this.context.project.settings &&
            this.context.project.settings.sync &&
            this.context.project.settings.sync.enabled &&
            (
                !this.isLocked ||
                this.sync.isRemote
            );
    }
}

module.exports = ResourceBase;
