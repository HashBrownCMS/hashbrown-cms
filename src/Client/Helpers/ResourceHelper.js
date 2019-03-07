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
                let request = window.indexedDB.open('HashBrownCMS', 1);

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
     * Gets a resource or a list of resources from cache
     *
     * @param {Resource} model
     * @param {String} category
     * @param {String} id
     *
     * @returns {Promise} Result
     */
    static getCache(model, category, id) {
        checkParam(model, 'model', HashBrown.Models.Resource);
        checkParam(category, 'category', String);

        return this.indexedDbTransaction('get', category, id)
        .then((data) => {
            if(!data) { return Promise.resolve(null); }

            if(!Array.isArray(data)) { return Promise.resolve(new model(data));  }

            for(let i in data) {
                data[i] = new model(data[i]);
            }

            return Promise.resolve(data);
        })
        .catch((e) => {
            return Promise.resolve(null);  
        });
    }

    /**
     * Sets a resource in cache
     *
     * @param {String} category
     * @param {String} id
     * @param {Resource} data
     *
     * @returns {Promise} Result
     */
    static setCache(category, id, data) {
        checkParam(category, 'category', String);
        checkParam(id, 'id', String);
        checkParam(data, 'data', HashBrown.Models.Resource);

        return this.removeCache(category, id)
        .then(() => {
            return this.indexedDbTransaction('put', category, id, data.getObject());
        });
    }
    
    /**
     * Removes a resource from cache
     *
     * @param {String} category
     * @param {String} id
     *
     * @returns {Promise} Result
     */
    static removeCache(category, id, data) {
        checkParam(category, 'category', String);
        checkParam(id, 'id', String);

        return this.indexedDbTransaction('delete', category, id);
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

        return HashBrown.Helpers.RequestHelper.request('delete', category + '/' + id)
        .then(() => {
            return this.removeCache(category, id);
        });
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
    
        return this.getCache(model, category, id)
        .then((result) => {
            if(result) { return Promise.resolve(result); }

            return HashBrown.Helpers.RequestHelper.request('get', category + (id ? '/' + id : ''))
            .then((result) => {
                if(!result) { throw new Error('Resource ' + category + (id ? '/' + id : '') + ' not found'); }

                if(!Array.isArray(result)) {
                    result = new model(result);

                    this.setCache(category, result.id, result);
                
                    return Promise.resolve(result);

                } else {
                    for(let i in result) {
                        result[i] = new model(result[i]);
                        
                        this.setCache(category, result[i].id, result[i]);
                    }
                }

                return Promise.resolve(result);
            });
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

        return HashBrown.Helpers.RequestHelper.request('post', category + '/' + id, data)
        .then(() => {
            return this.setCache(category, id, data);
        });
    }
}

module.exports = ResourceHelper;
