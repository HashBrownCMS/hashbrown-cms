'use strict';

/**
 * Basic resource class
 *
 * @memberof HashBrown.Common.Entity
 */
class ResourceBase extends HashBrown.Entity.EntityBase {
    /**
     * Structure
     */
    structure() {
        this.def(String, 'id');

        this.def(String, 'createdBy');
        this.def(Date, 'createdOn');

        this.def(String, 'updatedBy');
        this.def(Date, 'updatedOn');

        this.def(String, 'viewedBy');
        this.def(Date, 'viewedOn');
        
        this.def(Boolean, 'isLocked', false);
        this.def(Object, 'sync', {});
    }

    /**
     * Gets the human readable name of this resource
     *
     * @return {String} Name
     */
    getName() {
        throw new Error('The "getName" method must be overridden');
    }
    
    /**
     * Adopts values into this entity
     *
     * @param {Object} params
     */
    adopt(params = {}) {
        checkParam(params, 'params', Object);

        params = params || {};
    
        // Remove MongoDB id
        delete params._id;

        // Remove icon
        delete params.icon;

        // Convert from old sync variables
        params.sync = params.sync || {};

        if(typeof params.local !== 'undefined') {
            if(typeof params.sync.isRemote === 'undefined') {
                params.sync.hasRemote = params.local;
            }
            
            delete params.local;
        }

        if(typeof params.remote !== 'undefined') {
            if(typeof params.sync.isRemote === 'undefined') {
                params.sync.isRemote = params.remote;
            }
            
            delete params.remote;
        }

        // Convert from old "locked" state
        if(typeof params.locked !== 'undefined') {
            if(typeof params.isLocked === 'undefined') {
                params.isLocked = params.locked;
            }

            delete params.locked;
        }

        super.adopt(params);
    }

    /**
     * Gets an instance of this entity type
     *
     * @param {Object} options
     *
     * @return {HashBrown.Entity.Resource.ResourceBase} Instance
     */
    static async get(options = {}) {
        throw new Error('The "get" method must be overridden');
    }
    
    /**
     * Gets a list of instances of this entity type
     *
     * @param {Object} options
     *
     * @return {Array} Instances
     */
    static async list(options = {}) {
        throw new Error('The "list" method must be overridden');
    }
    
    /**
     * Creates a new instance of this entity type
     *
     * @param {Object} data
     * @param {Object} options
     *
     * @return {HashBrown.Entity.Resource.ResourceBase} Instance
     */
    static async create(data = {}, options = {}) {
        throw new Error('The "create" method must be overridden');
    }
    
    /**
     * Saves the current state of this entity
     */
    async save() {
        throw new Error('The "save" method must be overridden');
    }
    
    /**
     * Removes this entity
     */
    async remove() {
        throw new Error('The "remove" method must be overridden');
    }
    
    /**
     * Pulls a synced resource
     */
    async pull() {
        throw new Error('The "pull" method must be overridden');
    }
    
    /**
     * Pushes a synced resource
     */
    async push() {
        throw new Error('The "push" method must be overridden');
    }
    
    /**
     * Submits a heartbeat on this resource
     */
    async heartbeat() {
        throw new Error('The "heartbeat" method must be overridden');
    }

    /**
     * Gets the user that created this resource
     *
     * @return {HashBrown.Entity.User} User
     */
    async getCreatedBy() {
        if(!this.createdBy) { return null; }

        return await HashBrown.Entity.User.get(this.createdBy);
    }
    
    /**
     * Gets the user that last updated this resource
     *
     * @return {HashBrown.Entity.User} User
     */
    async getUpdatedBy() {
        if(!this.updatedBy) { return null; }

        return await HashBrown.Entity.User.get(this.updatedBy);
    }
    
    /**
     * Gets the user that last viewed this resource
     *
     * @return {HashBrown.Entity.User} User
     */
    async getViewedBy() {
        if(!this.viewedBy) { return null; }

        return await HashBrown.Entity.User.get(this.viewedBy);
    }
}

module.exports = ResourceBase;
