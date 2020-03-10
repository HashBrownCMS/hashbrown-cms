'use strict';

const Path = require('path');

/**
 * The helper class for all synchronisation services
 *
 * @memberof HashBrown.Server.Service
 */
class SyncService {
    /**
     * Parses a URL
     *
     * @param {String} base
     * @param {Array} parts
     *
     * @returns {String} URL
     */
    static parseUrl(base, ...parts) {
        let url = new URL(base);
        
        return url.protocol + '//' + url.hostname + (url.port ? ':' + url.port : '') + '/' + Path.join('api', parts.filter((x) => { return !!x; }).join('/'));
    }

    /**
     * Gets a new token
     *
     * @param {String} project
     * @param {String} username
     * @param {String} password
     * @param {String} overrideUrl
     *
     * @returns {String} New token
     */
    static async renewToken(projectId, username, password, overrideUrl = '') {
        checkParam(projectId, 'projectId', String, true);
        checkParam(username, 'username', String, true);
        checkParam(password, 'password', String, true);
        checkParam(overrideUrl, 'overrideUrl', String);

        let project = await HashBrown.Entity.Project.get(projectId);

        if(!project) {
            throw new Error(`Project ${projectId} not found`);
        }

        let settings = await project.getSettings('sync') || {};

        if(overrideUrl) { settings.url = overrideUrl; }

        this.validateSettings(settings, project, true);

        let url = this.parseUrl(settings.url, 'user', 'login') + '?persist=true';

        debug.log('Renewing sync token for ' + project + '...', this);

        let postData = {
            username: username,
            password: password
        };
            
        try {
            if(project == settings.project) { throw new Error('Cyclic sync'); }
            
            let data = await HashBrown.Service.RequestService.request('post', url, postData);

            debug.log('Sync token renewed successfully', this);
            
            return data;

        } catch(e) {
            throw new Error('Unable to renew token via ' + url + '. Reason: ' + (e.message || 'unknown') + '.');

        }
    }
   
    /**
     * Validates the sync settings
     *
     * @param {Object} settings
     * @param {String} project
     * @param {Boolean} justUrl
     *
     * @returns {Boolean} Whether the settings are valid
     */
    static validateSettings(settings, project, justUrl) {
        if(!settings) { throw new Error('Sync settings incomplete'); }

        if(settings.project == project) { throw new Error('Cyclic sync'); }

        if(!settings.url || settings.url.indexOf('http') !== 0) { throw new Error('Sync url not valid'); }
        
        if(justUrl) { return; }
        if(settings && settings.token && settings.project) { return; }
    
        throw new Error('Sync settings incomplete');
    }

    /**
     * Get resource item
     *
     * @param {String} projectId
     * @param {String} environment
     * @param {String} remoteResourceName
     * @param {String} remoteItemName
     *
     * @returns {Object} Resource
     */
    static async getResourceItem(projectId, environment, remoteResourceName, remoteItemName) {
        checkParam(projectId, 'projectId', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(remoteResourceName, 'remoteResourceName', String, true);
        checkParam(remoteItemName, 'remoteItemName', String);

        if(!remoteItemName) {
            return this.getResource(project, environment, remoteResourceName);
        }
        
        let project = await HashBrown.Entity.Project.get(projectId);

        if(!project) {
            throw new Error(`Project ${projectId} not found`);
        }

        let settings = await project.getSettings('sync') || {};

        if(!settings.enabled) { return ''; }
        
        let url = this.parseUrl(settings.url, settings.project, environment, remoteResourceName, remoteItemName);

        try {
            this.validateSettings(settings, projectId);
            
            debug.log('Requesting remote resource item via ' + url + ' on behalf of project ' + project + '...', this, 3);
        
            let data = await HashBrown.Service.RequestService.request('get', url + '?token=' + settings.token);

            if(data instanceof Object) {
                data.isLocked = true;

                data.sync = {
                    isRemote: true,
                    hasRemote: false
                };
            }
            
            debug.log('Remote resource item retrieved successfully via ' + url, this, 3);
                
            return data;

        } catch(e) {
            let project = await HashBrown.Entity.Project.get(project);
            let settings = await project.getSettings('sync');
            
            settings.enabled = false;

            await project.setSettings(settings, 'sync');
            
            throw new Error('Unable to get resource item via ' + url + '. Reason: ' + (e.message || 'unknown') + '. Disabling sync to avoid infinite loops.');
        }
    }

    /**
     * Set resource item
     *
     * @param {String} projectId
     * @param {String} environment
     * @param {String} remoteResourceName
     * @param {String} remoteItemName
     * @param {Object} remoteItemData
     */
    static async setResourceItem(projectId, environment, remoteResourceName, remoteItemName, remoteItemData) {
        checkParam(projectId, 'projectId', String), true;
        checkParam(environment, 'environment', String, true);
        checkParam(remoteResourceName, 'remoteResourceName', String, true);
        checkParam(remoteItemName, 'remoteItemName', String, true);
        checkParam(remoteItemData, 'remoteItemData', Object, true);

        let project = await HashBrown.Entity.Project.get(projectId);

        if(!project) {
            throw new Error(`Project ${projectId} not found`);
        }
        
        let settings = await project.getSettings('sync') || {};

        if(!settings.enabled) { return; }

        let url = this.parseUrl(settings.url, settings.project, environment, remoteResourceName, remoteItemName);
        
        try {
            this.validateSettings(settings, projectId);

            debug.log('Posting remote resource item via ' + url + ' on behalf of project ' + project + '...', this, 3);
           
            let headers = {
                'Content-Type': 'application/json'
            };
      
            // Send the API request, and make sure to create/upsert any resources that do not yet exist on the remote 
            let data = await HashBrown.Service.RequestService.request('post', url + '?create=true&token=' + settings.token, remoteItemData);

            debug.log('Remote resource item ' + remoteItemName + ' posted successfully', this, 3);
                
        } catch(e) {
            throw new Error('Unable to set resource item via ' + url + '. Reason: ' + (e.message || 'unknown') + '.');
        }
    }

    /**
     * Get resource
     *
     * @param {String} projectId
     * @param {String} environment
     * @param {String} remoteResourceName
     * @param {Object} params
     *
     * @returns {Object} Resource
     */
    static async getResource(projectId, environment, remoteResourceName, params = {}) {
        checkParam(projectId, 'projectId', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(remoteResourceName, 'remoteResourceName', String, true);

        let project = await HashBrown.Entity.Project.get(projectId);

        if(!project) {
            throw new Error(`Project ${projectId} not found`);
        }
        
        let settings = await project.getSettings('sync') || {};

        if(!settings.enabled) { return null; }

        let url = this.parseUrl(settings.url, settings.project, environment, remoteResourceName);
        
        try {
            this.validateSettings(settings, projectId);

            debug.log('Requesting remote resource via ' + url + ' on behalf of project ' + project + '...', this, 3);
            
            params.token = settings.token;

            let data = await HashBrown.Service.RequestService.request('get', url, params);

            debug.log('Remote resource retrieved successfully via ' + url, this, 3);
                    
            return data;
        
        } catch(e) {
            let project = await HashBrown.Entity.Project.get(project);
            let settings = await project.getSettings('sync');
            
            settings.enabled = false;

            await project.setSettings(settings, 'sync');

            throw new Error('Unable to get resource via ' + url + '. Reason: ' + (e.message || 'unknown') + '. Disabling sync to avoid infinite loops.');
        }
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
     * @return {Object} Merged resource
     */
    static async mergeResource(project, environment, remoteResourceName, localResource, params = {}) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(remoteResourceName, 'remoteResourceName', String);
        checkParam(localResource, 'localResource', Array);

        let remoteResource = await this.getResource(project, environment, remoteResourceName, params);

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
                    remoteItem.isLocked = true;

                    remoteItem.sync = {
                        isRemote: true,
                        hasRemote: false
                    };

                    remoteIds[remoteItem.id] = true;
                }
            }

            // Look for duplicates and flag local nodes
            for(let l in localResource) {
                let localItem = localResource[l];

                if(remoteIds[localItem.id] == true) {
                    localItem.isLocked = false;

                    localItem.sync = {
                        isRemote: false,
                        hasRemote: true
                    };

                    duplicateIds[localItem.id] = true;
                }
            }

            // Make sure remote resource is array
            if(remoteResource instanceof Object && remoteResource instanceof Array === false) {
                remoteResource = Object.values(remoteResource);   
            }
            
            if(remoteResource instanceof Array === false) {
                throw new Error('The remote resource "' + remoteResourceName + '" was not an array');
            }
            
            // Make sure local resource is array
            if(localResource instanceof Object && remoteResource instanceof Array === false) {
                localResource = Object.values(localResource);   
            }

            if(localResource instanceof Array === false) {
                throw new Error('The local resource "' + remoteResourceName + '" was not an array');
            }

            // Merge resources
            mergedResource = [];
            
            for(let v of remoteResource) {
                if(duplicateIds[v.id] == true) { continue; }

                mergedResource[mergedResource.length] = v;
            }
            
            for(let v of localResource) {
                mergedResource[mergedResource.length] = v;
            }
        
        } else {
            mergedResource = localResource;

        }

        return mergedResource;
    }
}

module.exports = SyncService;
