'use strict';

/**
 * A helper class for accessing resources on the server
 *
 * @memberof HashBrown.Client.Service
 */
class ResourceService {
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

        let result = await HashBrown.Service.RequestService.request('get', category + '/' + id);
        
        if(!result) { throw new Error('Resource ' + category + '/' + id + ' not found'); }

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
     * @param {HashBrown.Entity.Resource.ResourceBase} data
     *
     * @returns {Promise} Result
     */
    static async set(category, id, data) {
        checkParam(category, 'category', String, true);
        checkParam(id, 'id', String, true);
        checkParam(data, 'data', Object, true);

        if(data instanceof HashBrown.Entity.Resource.ResourceBase) {
            data = data.getObject();
        }
        
        await HashBrown.Service.RequestService.request('post', category + '/' + id, data);
    
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
