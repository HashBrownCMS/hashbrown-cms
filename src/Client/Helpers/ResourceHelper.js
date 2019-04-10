'use strict';

/**
 * A helper class for accessing resources on the server
 *
 * @memberof HashBrown.Client.Helpers
 */
class ResourceHelper {
    /**
     * Gets the indexedDB name
     *
     * @return {String} Name
     */
    static getIndexedDbName() {
        if(HashBrown.Context.projectId && HashBrown.Context.environment) {
            return 'hb_' + HashBrown.Context.projectId + '_' + HashBrown.Context.environment;
        }

        if(HashBrown.Context.view) {
            return 'hb_' + HashBrown.Context.view;
        }
        
        throw new Error('Unknown context');
    }
        
    /**
     * Clears the indexedDB
     *
     * @return {Promise} Result
     */
    static clearIndexedDb() {
        return new Promise((resolve, reject) => {
            try {
                let request = indexedDB.deleteDatabase(this.getIndexedDbName());

                request.onsuccess = (e) => {
                    resolve(e.target.result);
                };
                
                request.onerror = (e) => {
                    reject(e);
                };

            } catch(e) {
                reject(e);

            }
        });
    }
    
    /**
     * Opens a connection to the indexedDB
     *
     * @param {String} action
     * @param {String} store
     * @param {Object} query
     *
     * @return {Promise} Result
     */
    static indexedDbTransaction(action, store, id = null, data = null) {
        checkParam(action, 'action', String);
        checkParam(store, 'store', String);
        checkParam(id, 'id', String);
        checkParam(data, 'data', Object);

        return new Promise((resolve, reject) => {
            try {
                let request = indexedDB.open(this.getIndexedDbName(), 1);

                request.onsuccess = (e) => {
                    resolve(e.target.result);
                };
                
                request.onerror = (e) => {
                    reject(new Error('Query ' + JSON.stringify(query) + ' with action "' + action + '" for store "' + store + '" failed. Error code: ' + e.target.errorCode));
                };

                request.onupgradeneeded = (e) => {
                    let db = e.target.result;
                    
                    db.createObjectStore('connections', { keyPath: 'id', autoIncrement: false });
                    db.createObjectStore('content', { keyPath: 'id', autoIncrement: false });
                    db.createObjectStore('schemas', { keyPath: 'id', autoIncrement: false });
                    db.createObjectStore('media', { keyPath: 'id', autoIncrement: false });
                    db.createObjectStore('forms', { keyPath: 'id', autoIncrement: false });
                    db.createObjectStore('users', { keyPath: 'id', autoIncrement: false });
                };

            } catch(e) {
                reject(e);

            }
        })
        .then((db) => {
            return new Promise((resolve, reject) => {
                try {
                    let objectStore = db.transaction([store], 'readwrite').objectStore(store);
                    let request = null;

                    if(action === 'put') {
                        data.id = id;
                        request = objectStore.put(data);
                    } else if(action === 'get') {
                        request = objectStore.get(id);
                    } else if(action === 'getAll') {
                        request = objectStore.getAll();
                    } else if(action === 'delete') {
                        request = objectStore.delete(id);
                    } else if(action === 'clear') {
                        request = objectStore.clear();
                    }

                    request.onsuccess = (e) => {
                        resolve(e.target.result);
                    };
                    
                    request.onerror = (e) => {
                        reject(new Error('Query ' + JSON.stringify(query) + ' with action "' + action + '" for store "' + store + '" failed. Error code: ' + e.target.errorCode));
                    };

                } catch(e) {
                    reject(e);

                }
            });
        });
    }

    /**
     * Preloads all resources
     */
    static async preloadAllResources() {
        $('.page--environment__spinner').toggleClass('hidden', false); 
        $('.page--environment__spinner__messages').empty();

        await this.clearIndexedDb();

        for(let resourceName of this.getResourceNames()) {
            let $msg = _.div({class: 'widget--spinner__message', 'data-name': resourceName}, resourceName);
            
            $('.page--environment__spinner__messages').append($msg);
        }
        
        for(let resourceName of this.getResourceNames()) {
            try {
                await this.getAll(null, resourceName);
            } catch(e) {
                debug.log(e.message, this);
            }
            
            $('.page--environment__spinner__messages [data-name="' + resourceName + '"]').toggleClass('loaded', true);
        }
       
        $('.page--environment__spinner').toggleClass('hidden', true);

        HashBrown.Helpers.EventHelper.trigger('resource');  
    }

    /**
     * Gets a list of all resource names
     *
     * @return {Array} Names
     */
    static getResourceNames() {
        return ['content', 'connections', 'forms', 'media', 'schemas', 'users'];
    }
   
    /**
     * Reloads a resource category
     *
     * @param {String} cateogry
     */
    static async reloadResource(category) {
        checkParam(category, 'category', String, true);

        await this.indexedDbTransaction('clear', category);

        await this.getAll(null, category);

        HashBrown.Helpers.EventHelper.trigger('resource');  
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

        await this.indexedDbTransaction('delete', category, id);

        await HashBrown.Helpers.RequestHelper.request('delete', category + '/' + id);
        
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

        let results = await this.indexedDbTransaction('getAll', category);

        if(!results || results.length < 2) {
            results = await HashBrown.Helpers.RequestHelper.request('get', category);
            
            if(!results) { throw new Error('Resource list ' + category + ' not found'); }
       
            for(let result of results) {
                if(!result.id) { continue; }

                await this.indexedDbTransaction('put', category, result.id, result);
            }
        }
            
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

        await HashBrown.Helpers.RequestHelper.request('post', category + '/pull/' + id);
    
        await this.reloadResource(category);
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

        await HashBrown.Helpers.RequestHelper.request('post', category + '/push/' + id);
    
        await this.reloadResource(category);

        HashBrown.Helpers.EventHelper.trigger('resource');  
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

        let result = await this.indexedDbTransaction('get', category, id);

        if(!result) {
            result = await HashBrown.Helpers.RequestHelper.request('get', category + '/' + id);
            
            if(!result) { throw new Error('Resource ' + category + '/' + id + ' not found'); }
        
            await this.indexedDbTransaction('put', category, id, result);
        }

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

        // Id has been changed, delete old reference
        if(data.id !== id) {
            await this.indexedDbTransaction('delete', category, id, data);

        // Id is unchanged, put the content
        } else {
            await this.indexedDbTransaction('put', category, id, data);
        
        }

        await HashBrown.Helpers.RequestHelper.request('post', category + '/' + id, data);
    
        HashBrown.Helpers.EventHelper.trigger('resource');  
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
    
        await this.indexedDbTransaction('put', category, resource.id, resource);

        HashBrown.Helpers.EventHelper.trigger('resource');  

        if(model) {
            resource = new model(resource);
        }

        return resource;
    }
}

module.exports = ResourceHelper;
