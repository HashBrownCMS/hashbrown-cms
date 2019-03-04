'use strict';

const Path = require('path');

const Entity = require('./Entity');

/**
 * A class for deploying and retrieving data to and from a server
 *
 * @memberof HashBrown.Common.Models
 */
class Deployer extends Entity {
    // Name and alias
    static get name() { return 'Deployer'; }
    static get alias() { return 'deployer'; }
    
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.name = this.constructor.name;
        this.alias = this.constructor.alias;

        if(!this.paths) { this.paths = {}; }
    }
    
    /**
     * Structure
     */
    structure() {
        this.def(String, 'name');
        this.def(String, 'alias');
        this.def(Object, 'paths', {
            media: '',
            content: ''
        });
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
        
        if(!ignoreRoot) {
            path = this.getRootPath();
        }
       
        if(this.paths[name]) {
            path = Path.join(path, this.paths[name]);
        }

        if(filename) {
            path = Path.join(path, filename);
        }
        
        return path;
    }

    /**
     * Tests this deployment
     *
     * @returns {Promise} Result
     */
    test() {
        return Promise.reject(new Error('The "test" method should be overridden.'));
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

module.exports = Deployer;
