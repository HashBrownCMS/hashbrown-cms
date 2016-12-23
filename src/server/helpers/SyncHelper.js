'use strict';

let restler = require('restler');

/**
 * The helper class for all synchronisation services
 */
class SyncHelper {
    /**
     * Gets a new token
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} username
     * @param {String} password
     *
     * @returns {Promise} New token
     */
    static renewToken(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        username = requiredParam('username'),
        password = requiredParam('password')
    ) {
        return SettingsHelper.getSettings(project, environment, 'sync')
        .then((settings) => {
            debug.log('Renewing token for sync...', this);

            return new Promise((resolve, reject) => {
                let headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=utf-8'
                };
                
                let postData = {
                    username: username,
                    password: password
                };
                    
                restler.post(settings.url + 'user/login?persist=true', {
                    headers: headers,
                    data: JSON.stringify(postData)
                }).on('complete', (data, response) => {
                    if(typeof data !== 'string' || data.length !== 40) {
                        reject(data);
                    
                    } else {
                        resolve(data);
                    
                    }
                });
            });
        });
    }
    
    /**
     * Get resource item
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} remoteResourceName
     * @param {String} remoteItemName
     *
     * @returns {Promise} Resource
     */
    static getResourceItem(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        remoteResourceName = requiredParam('remoteResourceName'),
        remoteItemName = requiredParam('remoteItemName')
    ) {
        return SettingsHelper.getSettings(project, environment, 'sync')
        .then((settings) => {
            return new Promise((resolve, reject) => {
                if(settings && settings.enabled && settings[remoteResourceName]) {
                    let headers = {
                        'Accept': 'application/json'
                    };
                    
                    restler.get(settings.url + settings.project + '/' + settings.environment + '/' + remoteResourceName + '/' + remoteItemName + '?token=' + settings.token, {
                        headers: headers
                    }).on('complete', (data, response) => {
                        if(data instanceof Error) {
                            reject(data);

                        } else if(typeof data === 'string') {
                            reject(new Error(data));
                        
                        } else {
                            if(data instanceof Object) {
                                data.locked = true;
                                data.remote = true;
                            }

                            resolve(data);
                        
                        }
                    });

                } else {
                    resolve(null);
                }
            });
        });
    }

    /**
     * Set resource item
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} remoteResourceName
     * @param {String} remoteItemName
     * @param {Object} remoteItemData
     *
     * @returns {Promise} Promise
     */
    static setResourceItem(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        remoteResourceName = requiredParam('remoteResourceName'),
        remoteItemName = requiredParam('remoteItemName'),
        remoteItemData = requiredParam('remoteItemData')
    ) {
        return SettingsHelper.getSettings(project, environment, 'sync')
        .then((settings) => {
            return new Promise((resolve, reject) => {
                if(settings && settings.enabled && settings[remoteResourceName]) {
                    let headers = {
                        'Content-Type': 'application/json'
                    };
                    
                    restler.post(settings.url + settings.project + '/' + settings.environment + '/' + remoteResourceName + '/' + remoteItemName + '?token=' + settings.token, {
                        headers: headers,
                        data: JSON.stringify(remoteItemData)
                    }).on('complete', (data, response) => {
                        if(data instanceof Error) {
                            reject(data);

                        } else if(typeof data === 'string') {
                            reject(new Error(data));
                        
                        } else {
                            resolve();
                        
                        }
                    });

                } else {
                    reject(new Error('Sync isn\'t enabled for "' + remoteResourceName + '"'));
                }
            });
        });
    }

    /**
     * Get resource
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} remoteResourceName
     * @param {Object} params
     *
     * @returns {Promise} Resource
     */
    static getResource(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        remoteResourceName = requiredParam('remoteResourceName'),
        params = {}
    ) {
        return SettingsHelper.getSettings(project, environment, 'sync')
        .then((settings) => {
            return new Promise((resolve, reject) => {
                if(settings && settings.enabled && settings[remoteResourceName]) {
                    params.token = settings.token;

                    let headers = {
                        'Accept': 'application/json'
                    };
                  
                    let now = Date.now();

                    restler.get(settings.url + settings.project + '/' + settings.environment + '/' + remoteResourceName, {
                        headers: headers,
                        query: params
                    }).on('complete', (data, response) => {
                        if(data instanceof Error) {
                            reject(data);
                        
                        } else if(typeof data === 'string') {
                            reject(new Error(data));
           
                        } else {
                            resolve(data);
                        
                        }
                    });

                } else {
                    resolve([]);
                }
            });
        });
    }

    /**
     * Merges a resource with a synced one
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} remoteResourceName
     * @param {Array} localResource
     * @param {Object} params
     *
     * @return {Promise} Merged resource
     */
    static mergeResource(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        remoteResourceName = requiredParam('remoteResourceName'),
        localResource = requiredParam('localResource'),
        params = {}
    ) {
        return this.getResource(project, environment, remoteResourceName, params)
        .then((remoteResource) => {
            let mergedResource;

            if(remoteResource) {
                // Cache ids to look for duplicates
                let remoteIds = {};
                let duplicateIds = {};
                
                for(let r in remoteResource) {
                    let remoteItem = remoteResource[r];

                    if(!remoteItem) {
                        debug.log('"' + r + '" in remote resource "' + remoteResourceName + '" is null', this);

                    } else if(typeof remoteItem !== 'object') {
                        debug.log('"' + r + '" in remote resource "' + remoteResourceName + '" is not an object: ' + remoteItem, this);

                    } else {
                        remoteItem.locked = true;
                        remoteItem.remote = true;

                        remoteIds[remoteItem.id] = true;

                    }
                }

                // Look for duplicates and flag local nodes
                for(let l in localResource) {
                    let localItem = localResource[l];

                    if(remoteIds[localItem.id] == true) {
                        localItem.local = true;
                        duplicateIds[localItem.id] = true;
                    }
                }

                // Merge resources
                if(remoteResource instanceof Array && localResource instanceof Array) {
                    mergedResource = [];
                    
                    for(let v of remoteResource) {
                        if(duplicateIds[v.id] == true) { continue; }

                        mergedResource[mergedResource.length] = v;
                    }
                    
                    for(let v of localResource) {
                        mergedResource[mergedResource.length] = v;
                    }
                
                } else if(remoteResource instanceof Object && localResource instanceof Object) {
                    mergedResource = {};
                    
                    for(let k in remoteResource) {
                        mergedResource[k] = remoteResource[k];
                    }
                    
                    for(let k in localResource) {
                        mergedResource[k] = localResource[k];
                    }
                
                } else {
                    return Promise.reject(new Error('Local and remote resources in "' + remoteResourceName + '" are not of same type'));
                
                }
            
            } else {
                mergedResource = localResource;

            }

            return new Promise((resolve) => {
                resolve(mergedResource);
            });
        });
    }
}

module.exports = SyncHelper;
