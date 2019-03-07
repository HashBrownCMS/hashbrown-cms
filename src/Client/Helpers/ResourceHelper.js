'use strict';

/**
 * A helper class for accessing resources on the server
 *
 * @memberof HashBrown.Client.Helpers
 */
class ResourceHelper {
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
    static remove(category, id) {
        checkParam(category, 'category', String);
        checkParam(id, 'id', String);

        HashBrown.Helpers.EventHelper.trigger(category, id);  
        
        return HashBrown.Helpers.RequestHelper.request('delete', category + '/' + id);
    }

    /**
     * Gets a resource or a list of resources
     *
     * @param {Resource} model
     * @param {String} category
     * @param {String} id
     *
     * @returns {Promise} Result
     */
    static get(model, category, id = null) {
        checkParam(model, 'model', HashBrown.Models.Resource);
        checkParam(category, 'category', String);
    
        return HashBrown.Helpers.RequestHelper.request('get', category + (id ? '/' + id : ''))
        .then((result) => {
            if(!result) { throw new Error('Resource ' + category + (id ? '/' + id : '') + ' not found'); }

            if(typeof model === 'function') {
                if(!Array.isArray(result)) {
                    result = new model(result);

                } else {
                    for(let i in result) {
                        result[i] = new model(result[i]);
                    }
                }
            }

            return Promise.resolve(result);
        });
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
    static set(category, id, data) {
        checkParam(category, 'category', String);
        checkParam(category, 'id', String);
        checkParam(data, 'data', HashBrown.Models.Resource);

        HashBrown.Helpers.EventHelper.trigger(category, id);  

        return HashBrown.Helpers.RequestHelper.request('post', category + '/' + id, data.getObject());
    }
}

module.exports = ResourceHelper;
