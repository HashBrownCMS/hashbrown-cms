'use strict';

const Path = require('path');

/**
 * A class for deploying and retrieving data to and from a server
 *
 * @memberof HashBrown.Server.Entity
 */
class DeployerBase extends HashBrown.Entity.EntityBase {
    static get title() { return null; }
    static get alias() { return null; }
    
    get name() { return this.constructor.name; }
    get alias() { return this.constructor.alias; }
    
    /**
     * Constructor
     */
    constructor(params) {
        super(params);
    }
   
    /**
     * Adopts values into this entity
     *
     * @param {Object} params
     */
    adopt(params = {}) {
        checkParam(params, 'params', Object);
        checkParam(params.context, 'params.context', Object, true);
        checkParam(params.context.project, 'params.context.project', String, true);
        checkParam(params.context.environment, 'params.context.environment', String, true);
        
        params = params || {};

        delete params.title;
        delete params.name;
        delete params.alias;
        
        params.paths = params.paths || {};

        super.adopt(params);
        
        Object.seal(this.context);
    }

    /**
     * Structure
     */
    structure() {
        this.def(String, 'fileExtension');
        this.def(Object, 'paths', {
            media: '',
            content: ''
        });
        this.def(Object, 'context');
    }

    /**
     * Gets a copy of every field in this object as a mutable object
     *
     * @returns {Object} object
     */
    getObject() {
        let object = super.getObject();

        object.alias = this.alias;
        delete object.context;

        return object;
    }
    
    /**
     * Instantiates a new deployer
     *
     * @param {Object} params
     *
     * @return {HashBrown.Entity.Deployer} Instance
     */
    static new(params = {}) {
        checkParam(params, 'params', Object);

        params = params || {};

        let model = this.getByAlias(params.alias) || this;

        return new model(params);
    }

    /**
     * Gets a deployer by alias
     *
     * @string {String} alias
     *
     * @returns {HashBrown.Entity.Deployer} Deployer
     */
    static getByAlias(alias) {
        for(let name in HashBrown.Entity.Deployer) {
            let deployer = HashBrown.Entity.Deployer[name];

            if(deployer.alias !== alias) { continue; }

            return deployer;
        }
        
        return null;
    }
    
    /**
     * Gets the root path
     *
     * @returns {String} Root
     */
    getRootPath() {
        throw new Error('The method "getRootPath" must be overridden');
    }

    /**
     * Gets a deployment path
     *
     * @param {String} name
     * @param {String} filename
     * @param {Boolean} ignoreRoot
     *
     * @returns {String} Path
     */
    getPath(name, filename = '', ignoreRoot = false) {
        let path = '';
        
        if(this.paths[name]) {
            path = Path.join(path, this.paths[name]);
        }

        if(filename) {
            path = Path.join(path, filename);
        }
        
        if(!ignoreRoot) {
            path = Path.join(this.getRootPath(), path);
        }
      
        // If the path module removed doubles slashes for protocols, add them back
        path = (path || '').replace(/:\/([^\/])/, '://$1');

        return path;
    }

    /**
     * Tests this deployment
     *
     * @returns {Promise} Result
     */
    async test() {
        throw new Error('The "test" method must be overridden.');
    }
    
    /**
     * Renames a file
     *
     * @param {String} path
     * @param {String} name
     *
     * @returns {Promise} Result
     */
    renameFile(path, name) {
        return Promise.reject(new Error('The "renameFile" method should be overridden.'));
    }

    /**
     * Sets a file
     *
     * @param {String} path
     * @param {String} base64
     *
     * @returns {Promise} Result
     */
    setFile(path, content) {
        return Promise.reject(new Error('The "setFile" method should be overridden.'));
    }
    
    /**
     * Gets a file
     *
     * @param {String} path
     *
     * @returns {Promise} File
     */
    getFile(path) {
        return Promise.reject(new Error('The "getFile" method should be overridden.'));
    }
    
    /**
     * Removes a file
     *
     * @param {String} path
     *
     * @returns {Promise} Result
     */
    removeFile(path) {
        return Promise.reject(new Error('The "removeFile" method should be overridden.'));
    }
    
    /**
     * Gets a list of files
     *
     * @param {String} path
     *
     * @returns {Promise} Files
     */
    getFolder(path) {
        return Promise.reject(new Error('The "getFolder" method should be overridden.'));
    }
    
    /**
     * Removes a folder
     *
     * @param {String} path
     *
     * @returns {Promise} Result
     */
    removeFolder(path) {
        return Promise.reject(new Error('The "removeFolder" method should be overridden.'));
    }
    
}

module.exports = DeployerBase;
