'use strict';

const CACHE_EXPIRATION_TIME = 1000 * 60;

let cache = {};

/**
 * A helper class for accessing resources on the server
 *
 * @memberof HashBrown.Client.Service
 */
class ResourceService {
    /**
     * Adds a resource to the cache
     *
     * @param {Object} resource
     */
    static setCached(id, resource) {
        checkParam(id, 'id', String, true);
        checkParam(resource, 'resource', Object);
        
        if(resource) {
            if(resource instanceof HashBrown.Entity.EntityBase) {
                resource = resource.getObject();
            }

            cache[id] = {
                expires: Date.now() + CACHE_EXPIRATION_TIME,
                data: resource
            };

        } else {
            delete cache[id];
        
        }
    }

    /**
     * Gets a resource from the cache
     *
     * @param {String} id
     *
     * @return {Object} Resource
     */
    static getCached(id) {
        checkParam(id, 'id', String, true);
        
        if(!cache[id]) { return null; }
        
        if(Date.now() > cache[id].expires) {
            this.setCached(id, null);
            return null;
        }

        let resource = cache[id].data;

        try {
            return JSON.parse(JSON.stringify(resource));
        
        } catch(e) {
            debug.error(e, this, true);
            
            return null;

        }
    }
    /**
     * Gets a list of all resource category names
     *
     * @return {Array} Names
     */
    static getResourceCategoryNames() {
        let names = {};

        for(let type of Object.values(HashBrown.Entity.Resource)) {
            if(!type || type === HashBrown.Entity.Resource.ResourceBase) { continue; }

            if(!type.category) { continue; }

            names[type.category] = true;
        }

        names = Object.keys(names);
        names.sort();

        return names;
    }

    /**
     * Lets the server know a resource is being worked on
     *
     * @param {HashBrown.Entity.Resource.ResourceBase} resource
     */
    static async heartbeat(resource = null) {
        checkParam(resource, 'resource', HashBrown.Entity.Resource.ResourceBase);

        if(!resource) { return; }

        let category = resource.constructor.category;

        if(!category) { return; }

        await HashBrown.Service.RequestService.request('post', category + '/heartbeat/' + resource.id);      
    }
    
    /**
     * Removes a resource
     *
     * @param {String} category
     * @param {String} id
     */
    static async remove(category, id) {
        checkParam(category, 'category', String, true);
        checkParam(id, 'id', String, true);
        
        this.setCached(id, null);
        
        await HashBrown.Service.RequestService.request('delete', category + '/' + id);
       
        // Cancel any editor instances displaying the deleted content
        if(location.hash == '#/' + category + '/' + id) {
            location.hash = '/' + category + '/';
        } 

        HashBrown.Service.EventService.trigger('resource', id);  
    }
    
    /**
     * Gets a list of resources
     *
     * @param {HashBrown.Entity.Resource.ResourceBase} model
     * @param {String} category
     *
     * @returns {Array} Result
     */
    static async getAll(model, category) {
        checkParam(model, 'model', HashBrown.Entity.Resource.ResourceBase);
        checkParam(category, 'category', String);

        let results = await HashBrown.Service.RequestService.request('get', category);
        
        if(!results) { throw new Error('Resource list ' + category + ' not found'); }
   
        if(typeof model === 'function') {
            for(let i in results) {
                if(!results[i].id) { continue; }

                this.setCached(results[i].id, results[i]);
                
                results[i] = new model(results[i]);
            }
        }

        return results;
    }
    
    /**
     * Pulls a synced resource
     *
     * @param {String} category
     * @param {String} id
     */
    static async pull(category, id) {
        checkParam(category, 'category', String, true);
        checkParam(id, 'id', String, true);
        
        this.setCached(id, null);
        
        await HashBrown.Service.RequestService.request('post', category + '/pull/' + id);
    
        HashBrown.Service.EventService.trigger('resource', id);  
    }
    
    /**
     * Pushes a synced resource
     *
     * @param {String} category
     * @param {String} id
     */
    static async push(category, id) {
        checkParam(category, 'category', String, true);
        checkParam(id, 'id', String, true);
        
        this.setCached(id, null);

        await HashBrown.Service.RequestService.request('post', category + '/push/' + id);
    
        HashBrown.Service.EventService.trigger('resource', id);  
    }

    /**
     * Gets a resource
     *
     * @param {HashBrown.Entity.Resource.ResourceBase} model
     * @param {String} category
     * @param {String} id
     *
     * @returns {HashBrown.Entity.Resource.ResourceBase} Result
     */
    static async get(model, category, id) {
        checkParam(model, 'model', HashBrown.Entity.Resource.ResourceBase);
        checkParam(category, 'category', String, true);
        checkParam(id, 'id', String, true);
        
        let result = this.getCached(id);

        if(!result) {
            result = await HashBrown.Service.RequestService.request('get', category + '/' + id);
        }
        
        if(!result) { throw new Error('Resource ' + category + '/' + id + ' not found'); }

        this.setCached(id, result);
        
        if(typeof model === 'function') {
            result = new model(result);
        }
        
        return result;
    }
    
    /**
     * Sets a resource
     *
     * @param {String} category
     * @param {String} id
     * @param {Object} resource
     */
    static async set(category, id, resource) {
        checkParam(category, 'category', String, true);
        checkParam(id, 'id', String, true);
        checkParam(resource, 'resource', Object, true);

        if(resource instanceof HashBrown.Entity.Resource.ResourceBase) {
            resource = resource.getObject();
        }
        
        await HashBrown.Service.RequestService.request('post', category + '/' + id, resource);
        
        this.setCached(id, resource);
    
        HashBrown.Service.EventService.trigger('resource', id);  
    }
    
    /**
     * Creates a new resource
     *
     * @param {String} category
     * @param {Resource} model
     * @param {String} query
     * @param {Object} data
     *
     * @returns {Resource} Result
     */
    static async new(model, category, query = '', data = null) {
        checkParam(model, 'model', HashBrown.Entity.Resource.ResourceBase);
        checkParam(category, 'category', String, true);
        checkParam(query, 'query', String);
        checkParam(data, 'data', Object);

        let resource = await HashBrown.Service.RequestService.request('post', category + '/new' + query, data);

        this.setCached(resource.id, resource);
    
        if(model) {
            resource = new model(resource);
        }

        HashBrown.Service.EventService.trigger('resource', resource.id);  

        return resource;
    }

    /**
     * Performs a custom query
     *
     * @param {String} method
     * @param {String} category
     * @param {String} action
     * @param {String} query
     * @param {Object} data
     *
     * @returns {*} Result
     */
    static async query(method, category, action, query, data) {
        checkParam(method, 'method', String, true);
        checkParam(category, 'category', String, true);
        checkParam(action, 'action', String, true);
        checkParam(query, 'query', String, true);

        let result = await HashBrown.Service.RequestService.request(method, category + '/' + action + query, data);

        return result;
    }
}

module.exports = ResourceService;
