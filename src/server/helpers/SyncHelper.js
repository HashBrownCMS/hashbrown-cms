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
     * GET request
     *
     * @param {String} remoteResourceName
     *
     * @returns {Promise} Resource
     */
    static getResource(remoteResourceName) {
        return this.getSettings()
        .then((settings) => {
            if(settings) {
                let headers = {
                    'Accept': 'application/json'
                };
                
                restler.get(settings.url + remoteResourceName + '?token=' + settings.token, {
                    headers: headers
                }).on('complete', (data, response) => {
                    console.log(data);

                    return new Promise((resolve) => {
                        if(data instanceof Error) {
                            reject(data);
                        
                        } else {
                            resolve(data);
                        
                        }
                    });
                });

            } else {
                return new Promise((resolve) => {
                    resolve([]);
                });
            }
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

                        if(localResource.id == remoteResource.id) {
                            return new Promise((resolve, reject) => {
                                reject(new Error('Resource "' + remoteResource.id + '" in "' + remoteResourceName + '" is a duplicate. Please resolve by removing local item.'));
                            });
                        }
                    }
                }

                // Merge resources
                mergedResource = remoteResource.concat(localResource);
            
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
