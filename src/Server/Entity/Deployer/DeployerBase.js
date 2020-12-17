'use strict';

const Path = require('path');

/**
 * A class for deploying and retrieving data to and from a server
 *
 * @memberof HashBrown.Server.Entity
 */
class DeployerBase extends HashBrown.Entity.EntityBase {
    static get alias() {
        if(this === DeployerBase) { return null; }

        return this.name.replace('Deployer', '').toLowerCase();
    }
    
    get alias() { return this.constructor.alias; }
    
    /**
     * Constructor
     */
    constructor(params) {
        params = params || {};
        
        checkParam(params.context, 'context', HashBrown.Entity.Context, true);
        checkParam(params.context.project, 'context.project', HashBrown.Entity.Project, true);
        checkParam(params.context.environment, 'context.environment', String, true);
        checkParam(params.context.user, 'context.user', HashBrown.Entity.User, true);
        
        super(params);
    }
   
    /**
     * Gets the human readable name
     *
     * @return {String} name
     */
    getName() {
        return this.alias;
    }

    /**
     * Adopts values into this entity
     *
     * @param {Object} params
     */
    adopt(params) {
        params = params || {};

        delete params.title;
        delete params.name;
        delete params.alias;
        
        super.adopt(params);
    }

    /**
     * Structure
     */
    structure() {
        this.def(String, 'path');
        this.def(HashBrown.Entity.Context, 'context');
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
     * Checks a string for illegal path components
     *
     * @param {String} name
     * @param {String} value
     */
    pathComponentCheck(name, value) {
        checkParam(name, 'name', String);
        checkParam(value, 'value', String);

        let values = [ '.' ];

        for(let v of values) {
            if(value === v) {
                throw new Error(`The value of "${name}" cannot be "${v}"`);
            }
        }

        let components = [ '..', '\\', '/', '*' ];

        for(let c of components) {
            if(value.indexOf(c) > -1) {
                throw new Error(`The value of "${name}" cannot contain "${c}"`);
            }
        }
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
     * @param {Array} parts
     *
     * @returns {String} Path
     */
    getPath(...parts) {
        let path = (parts || []).join('/');
        
        path = Path.join(this.getRootPath(), this.path, path);
    
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
