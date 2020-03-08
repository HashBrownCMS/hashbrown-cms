'use strict';

/**
 * Basic resource class
 *
 * @memberof HashBrown.Common.Entity
 */
class ResourceBase extends HashBrown.Entity.EntityBase {
    /**
     * Gets the category (API group) of this resource type
     */
    static get category() {
        throw new Error('The "category" getter must be overridden');
    }

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
        
        this.def(String, 'project');
        this.def(String, 'environment');
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
     * Gets a model by category
     *
     * @param {String} category
     * @param {Object} data
     *
     * @return {HashBrown.Entity.Resource.ResourceBase} Resource
     */
    static getModel(category, data) {
        checkParam(category, 'category', String, true);
        checkParam(data, 'data', Object);

        for(let name in HashBrown.Entity.Resource) {
            if(name.indexOf('Base') > -1) { continue; }

            let model = HashBrown.Entity.Resource[name];

            if(model.category !== category) { continue; }

            if(data) {
                return new model(data);
            } 
            
            return model;
        }

        throw new Error(`No resource model found for category "${category}"`);
    }
    
    /**
     * Checks the format of the params
     *
     * @params {Object} params
     *
     * @returns {Object} Params
     */
    static paramsCheck(params) {
        params = params || {}

        // Remove MongoDB id
        delete params._id;

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

        return params;
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
}

module.exports = ResourceBase;
