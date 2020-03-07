'use strict';

/**
 * The base class for resources
 */
class ResourceBase extends require('Common/Entity/Resource/ResourceBase') {
    /**
     * Gets an instance of this entity type
     *
     * @param {Object} options
     *
     * @return {HashBrown.Entity.Resource.ResourceBase} Instance
     */
    static async get(options = {}) {
        let resource = await HashBrown.Service.RequestService.request('get', this.category + '/' + this.id);
        
        resource = new this(resource);
        
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
        let resources = await HashBrown.Service.RequestService.request('get', this.category);
        
        if(!resources) {
            throw new Error('Resource list ' + this.category + ' not found');
        }
   
        for(let i in resources) {
            resources[i] = new this(resources[i]);
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
        
        let query = new URLSearchParams(options).toString();
        let resource = await HashBrown.Service.RequestService.request('post', this.category + '/new' + query, data);

        resource = new this(resource);

        HashBrown.Service.EventService.trigger('resource', resource.id);  

        return resource;
    }
    
    /**
     * Saves the current state of this entity
     */
    async save() {
        let data = this.getObject();
        
        await HashBrown.Service.RequestService.request('post', this.category + '/' + this.id, data);
        
        HashBrown.Service.EventService.trigger('resource', this.id);
    }
    
    /**
     * Removes this entity
     */
    async remove() {
        await HashBrown.Service.RequestService.request('delete', this.category + '/' + this.id);
       
        // Cancel any editor instances displaying the deleted content
        if(location.hash == '#/' + this.category + '/' + this.id) {
            location.hash = '/' + this.category + '/';
        } 

        HashBrown.Service.EventService.trigger('resource', this.id);  
    }
    
    /**
     * Pulls a synced resource
     */
    async pull() {
        await HashBrown.Service.RequestService.request('post', this.category + '/pull/' + this.id);
    
        HashBrown.Service.EventService.trigger('resource', this.id);
    }
    
    /**
     * Pushes a synced resource
     */
    async push() {
        await HashBrown.Service.RequestService.request('post', this.category + '/push/' + this.id);

        HashBrown.Service.EventService.trigger('resource', this.id);
    }
    
    /**
     * Submits a heartbeat on this resource
     */
    async heartbeat() {
        await HashBrown.Service.RequestService.request('post', this.category + '/heartbeat/' + this.id);      
    }
}

module.exports = ResourceBase;
