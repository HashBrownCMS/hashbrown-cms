'use strict';

let restler = require('restler');

/**
 * The helper class for all synchronisation services
 */
class SyncHelper {
    /**
     * Gets the sync settings
     *
     * @returns Promise
     */
    static getSettings() {
        return SettingsHelper.getSettings('sync');
    }

    /**
     * Gets a new token
     *
     * @param {String} username
     * @param {String} password
     *
     * @returns {Promise} New token
     */
    static renewToken(username, password) {
        return this.getSettings()
        .then((settings) => {
            debug.log('Renewing token for sync...', this);

            return new Promise((resolve, reject) => {
                let headers = {
                    'Accept': 'application/json'
                };
                    
                restler.post(settings.url + 'user/login?persist=true', {
                    headers: headers
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
     * GET request
     *
     * @param {String} remoteResourceName
     *
     * @returns {Promise} Resource
     */
    static getResource(remoteResourceName) {
        return this.getSettings()
        .then((settings) => {
            return new Promise((resolve, reject) => {
                if(settings && settings.enabled) {
                    let headers = {
                        'Accept': 'application/json'
                    };
                    
                    restler.get(settings.url + ProjectHelper.currentProject + '/' + ProjectHelper.currentEnvironment + '/' + remoteResourceName + '?token=' + settings.token, {
                        headers: headers
                    }).on('complete', (data, response) => {
                        if(data instanceof Error) {
                            reject(data);
                        
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
     * @param {String} remoteResourceName
     * @param {Array} localResource
     *
     * @return {Promise} Merged resource
     */
    static mergeResource(remoteResourceName, localResource) {
        return this.getResource(remoteResourceName)
        .then((remoteResource) => {
            let mergedResource;

            if(remoteResource) {
                // Look for duplicates
                for(let l in localResource) {
                    let localItem = localResource[l];

                    for(let r in remoteResource) {
                        let remoteItem = remoteResource[r];

                        remoteItem.locked = true;

                        if(localItem.id == remoteItem.id) {
                            return new Promise((resolve, reject) => {
                                reject(new Error('Resource "' + remoteItem.id + '" in "' + remoteResourceName + '" is a duplicate. Please resolve by removing local item.'));
                            });
                        }
                    }
                }

                // Merge resources
                if(remoteResource instanceof Array && localResource instanceof Array) {
                    mergedResource = remoteResource.concat(localResource);
                
                } else if(remoteResource instanceof Object && localResource instanceof Object) {
                    mergedResource = Object.assign(localResource, remoteResource);
                
                } else {
                    debug.log('Local and remote resources in "' + remoteResourceName + '" are not of same type', this);
                    debug.log('Response from remote: ' + remoteResource, this);

                    mergedResource = localResource;
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
