'use strict';

/**
 * A helper class for accessing resources on the server and in cache
 *
 * @memberof HashBrown.Client.Helpers
 */
class ResourceHelper {
    /**
     * Opens a connection to the indexedDB
     *
     * @return {Promise} Result
     */
    static openDb() {
        return new Promise((resolve, reject) => {
            let request = window.indexedDB.open('HashBrownCMS', 3);

            request.onsuccess = (e) => {
                resolve(e.target.result);
            };
            
            request.onerror = (e) => {
                reject(new Error('Query "' + query + '" failed. Error code: ' + e.target.errorCode));
            };
        });
    }
   
    /**
     * Gets a resource or a list of resources from cache
     *
     * @param {String} category
     * @param {String} id
     *
     * @returns {Promise} Result
     */
    static getCache(category, id) {
        checkParam(category, 'category', String);

        if(!this.cache) { return Promise.resolve(null); }
        if(!this.cache[category]) { return Promise.resolve([]); }
        if(!id) { return Promise.resolve(this.cache[category]); }
        if(!this.cache[category][id]) { return Promise.resolve(null); }
        
        return Promise.resolve(this.cache[category][id]);
    }

    /**
     * Sets a resource in cache
     *
     * @param {String} category
     * @param {String} id
     * @param {Entity} data
     *
     * @returns {Promise} Result
     */
    static setCache(category, id, data) {
        checkParam(category, 'category', String);
        checkParam(id, 'id', String);
        checkParam(data, 'data', HashBrown.Models.Entity);

        if(!this.cache) { this.cache = {}; }
        if(!this.cache[category]) { this.cache[category] = {}; }
      
        this.cache[category][id] = data;

        return Promise.resolve(data);
    }

    /**
     * Gets a resource or a list of resources
     *
     * @param {Entity} model
     * @param {String} category
     * @param {String} id
     *
     * @returns {Promise} Result
     */
    static get(model, category, id = null) {
        checkParam(model, 'model', HashBrown.Models.Entity);
        checkParam(category, 'category', String);
    
        return this.getCache(category, id)
        .then((result) => {
            if(result) { return Promise.resolve(result); }

            return HashBrown.Helpers.RequestHelper.request('get', category + (id ? '/' + id : ''))
            .then((result) => {
                if(!result) { throw new Error('Resource ' + category + (id ? '/' + id : '') + ' not found'); }

                if(id) {
                    this.setCache(category, id, new model(result));
                
                } else {
                    for(let i in result) {
                        this.setCache(category, result[i].id, new model(result[i]));
                    }
                }

                return this.getCache(category, id);
            });
        });
    }
    
    /**
     * Sets a resource
     *
     * @param {String} category
     * @param {String} id
     * @param {Entity} data
     *
     * @returns {Promise} Result
     */
    static set(category, id, data) {
        checkParam(category, 'category', String);
        checkParam(id, 'id', String);
        checkParam(data, 'data', HashBrown.Models.Entity);

        return HashBrown.Helpers.RequestHelper.request('post', category + '/' + id, data)
        .then(() => {
            return this.setCache(category, id, data);
        });
    }
}

module.exports = ResourceHelper;
