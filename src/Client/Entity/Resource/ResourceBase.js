'use strict';

const CACHE_TIME_MINUTES = 1;

/**
 * The base class for resources
 */
class ResourceBase extends require('Common/Entity/Resource/ResourceBase') {
    /**
     * Sets a cache item
     *
     * @param {String} id
     * @param {HashBrown.Entity.Resource.ResourceBase} resource
     */
    static setCache(id, resource = null) {
        checkParam(id, 'id', String, true);
        checkParam(resource, 'resource', HashBrown.Entity.Resource.ResourceBase);
        
        if(!this.cache) {
            this.cache = {};
        }

        if(!resource) {
            delete this.cache[id];
        
        } else {
            this.cache[id] = {
                id: id,
                data: resource.getObject(),
                expires: Date.now() + (CACHE_TIME_MINUTES * 60000)
            };
        }
    }
    
    /**
     * Gets a cache item
     *
     * @param {String} id
     *
     * @return {HashBrown.Entity.Resource.ResourceBase} Resource
     */
    static getCache(id) {
        checkParam(id, 'id', String, true);
        
        if(!this.cache || !this.cache[id]) { return null; }
        
        if(!this.cache[id].expires || this.cache[id].expires <= Date.now()) {
            this.setCache(id, null);
            return null;
        }

        return this.cache[id].data;
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

        let resource = this.getCache(id);
        
        if(!resource) {
            resource = await HashBrown.Service.RequestService.request('get', this.category + '/' + id, null, options);
        }
        
        if(!resource) { return null; }

        resource = this.new(resource);
        
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
   
        for(let i in resources) {
            if(!resources[i] || !resources[i].id) { continue; }

            resources[i] = this.new(resources[i]);
            
            this.setCache(resources[i].id, resources[i]);
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

        this.setCache(resource.id, resource);

        HashBrown.Service.EventService.trigger('resource', resource.id);  

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
        
        this.constructor.setCache(this.id, this);
        
        HashBrown.Service.EventService.trigger('resource', this.id);
    }
    
    /**
     * Removes this entity
     */
    async remove() {
        let id = HashBrown.Service.NavigationService.getRoute(1) || this.id;
        
        await HashBrown.Service.RequestService.request('delete', this.category + '/' + id);
        
        this.constructor.setCache(this.id, null);
       
        // Cancel any editor instances displaying the deleted content
        if(location.hash == '#/' + this.category + '/' + id) {
            location.hash = '/' + this.category + '/';
        } 

        HashBrown.Service.EventService.trigger('resource', this.id);  
    }
    
    /**
     * Pulls a synced resource
     */
    async pull() {
        let data = await HashBrown.Service.RequestService.request('post', this.category + '/' + this.id + '/pull');

        this.adopt(data);
        this.constructor.setCache(this.id, this.new(data));
    
        HashBrown.Service.EventService.trigger('resource', this.id);
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
     */
    async heartbeat() {
        await HashBrown.Service.RequestService.request('post', this.category + '/' + this.id + '/heartbeat');      
    }
}

module.exports = ResourceBase;
