'use strict';

/**
 * The base class for resources
 */
class ResourceBase extends require('Common/Entity/Resource/ResourceBase') {
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

        let resource = await HashBrown.Service.RequestService.request('get', this.category + '/' + id, null, options);
        
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
    }
    
    /**
     * Pulls a synced resource
     */
    async pull() {
        let data = await HashBrown.Service.RequestService.request('post', this.category + '/' + this.id + '/pull');

        this.adopt(data);
    
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

    /**
     * Gets whether sync is enabled for this resource
     *
     * @return {Boolean} Is sync enabled
     */
    isSyncEnabled() {
        return this.sync &&
            HashBrown.Context.project.settings.sync.enabled &&
            (
                !this.isLocked ||
                this.sync.isRemote
            );
    }
}

module.exports = ResourceBase;
