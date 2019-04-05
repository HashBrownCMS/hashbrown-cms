'use strict';

/**
 * A helper class for accessing resources on the server
 *
 * @memberof HashBrown.Client.Helpers
 */
class ResourceHelper {
    /**
     * Clears the indexedDB
     *
     * @return {Promise} Result
     */
    static clearIndexedDb() {
        return new Promise((resolve, reject) => {
            try {
                let request = indexedDB.deleteDatabase('hb_' + HashBrown.Context.projectId + '_' + HashBrown.Context.environment);

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
                let request = indexedDB.open('hb_' + HashBrown.Helpers.ProjectHelper.currentProject + '_' + HashBrown.Helpers.ProjectHelper.currentEnvironment, 1);

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
     * Removes a resource
     *
     * @param {String} category
     * @param {String} id
     *
     * @returns {Promise} Result
     */
    static async remove(category, id) {
        checkParam(category, 'category', String);
        checkParam(id, 'id', String);

        await this.indexedDbTransaction('delete', category, id);

        HashBrown.Helpers.EventHelper.trigger(category, id);  
        
        return HashBrown.Helpers.RequestHelper.request('delete', category + '/' + id);
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
        checkParam(category, 'category', String);
        checkParam(category, 'id', String);
        checkParam(data, 'data', HashBrown.Models.Resource);

        await this.indexedDbTransaction('put', category, id, data);

        HashBrown.Helpers.EventHelper.trigger(category, id);  

        return HashBrown.Helpers.RequestHelper.request('post', category + '/' + id, data.getObject());
    }
}

module.exports = ResourceHelper;
