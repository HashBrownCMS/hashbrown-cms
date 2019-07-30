'use strict';

/**
 * A helper class for accessing resources on the server
 *
 * @memberof HashBrown.Client.Helpers
 */
class ResourceHelper {
    /**
     * Gets a list of all resource names
     *
     * @return {Array} Names
     */
    static getResourceNames() {
        return ['content', 'connections', 'forms', 'media', 'schemas', 'users'];
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
        
        HashBrown.Views.Navigation.NavbarMain.setItemLoading(category, id);

        await HashBrown.Helpers.RequestHelper.request('delete', category + '/' + id);
       
        // Cancel any editor instances displaying the deleted content
        if(location.hash == '#/' + category + '/' + id) {
            location.hash = '/' + category + '/';
        } 

        HashBrown.Helpers.EventHelper.trigger('resource');  
    }
    
    /**
     * Gets a list of resources
     *
     * @param {HashBrown.Models.Resource} model
     * @param {String} category
     *
     * @returns {Array} Result
     */
    static async getAll(model, category) {
        checkParam(model, 'model', HashBrown.Models.Resource);
        checkParam(category, 'category', String);

        let results = await HashBrown.Helpers.RequestHelper.request('get', category);
        
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
        
        HashBrown.Views.Navigation.NavbarMain.setItemLoading(category, id);

        await HashBrown.Helpers.RequestHelper.request('post', category + '/pull/' + id);
    
        HashBrown.Helpers.EventHelper.trigger('resource', id);  

        location.hash = '/' + category + '/' + id;
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

        HashBrown.Views.Navigation.NavbarMain.setItemLoading(category, id);

        await HashBrown.Helpers.RequestHelper.request('post', category + '/push/' + id);
    
        HashBrown.Helpers.EventHelper.trigger('resource', id);  
    }

    /**
     * Gets a resource
     *
     * @param {HashBrown.Models.Resource} model
     * @param {String} category
     * @param {String} id
     *
     * @returns {HashBrown.Models.Resource} Result
     */
    static async get(model, category, id) {
        checkParam(model, 'model', HashBrown.Models.Resource);
        checkParam(category, 'category', String, true);
        checkParam(id, 'id', String, true);

        let result = await HashBrown.Helpers.RequestHelper.request('get', category + '/' + id);
        
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
     * @param {Resource} data
     *
     * @returns {Promise} Result
     */
    static async set(category, id, data) {
        checkParam(category, 'category', String, true);
        checkParam(id, 'id', String, true);
        checkParam(data, 'data', Object, true);

        if(data instanceof HashBrown.Models.Resource) {
            data = data.getObject();
        }
        
        HashBrown.Views.Navigation.NavbarMain.setItemLoading(category, id);

        await HashBrown.Helpers.RequestHelper.request('post', category + '/' + id, data);
    
        HashBrown.Helpers.EventHelper.triggerById('resource', 'navbar', id);  
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
        checkParam(model, 'model', HashBrown.Models.Resource);
        checkParam(category, 'category', String, true);
        checkParam(query, 'query', String);
        checkParam(data, 'data', Object);

        let resource = await HashBrown.Helpers.RequestHelper.request('post', category + '/new' + query, data);
    
        HashBrown.Helpers.EventHelper.triggerById('resource', 'navbar');  

        if(model) {
            resource = new model(resource);
        }

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

        let result = await HashBrown.Helpers.RequestHelper.request(method, category + '/' + action + query, data);

        HashBrown.Helpers.EventHelper.trigger('resource', 'navbar');  

        return result;
    }
}

module.exports = ResourceHelper;
