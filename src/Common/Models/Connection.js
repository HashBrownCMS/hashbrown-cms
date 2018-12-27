'use strict';

const Path = require('path');

const Processor = require('./Processor');
const Deployer = require('./Deployer');
const Resource = require('./Resource');

/**
 * The Connection class
 *
 * @memberof HashBrown.Common.Models
 */
class Connection extends Resource {
    /**
     * Structure
     */
    structure() {
        this.def(String, 'id');
        this.def(String, 'title');
        this.def(String, 'url');
        this.def(Boolean, 'isLocked');
        
        // Sync
        this.def(Object, 'sync');
    }

    /**
     * Checks the format of the params
     *
     * @params {Object} params
     *
     * @returns {Object} Params
     */
    static paramsCheck(params) {
        // Deployer and processor
        if(!params.processor) { params.processor = {}; }
        if(!params.deployer) { params.deployer = {}; }
        if(!params.deployer.paths) { params.deployer.paths = {}; }
        
        return super.paramsCheck(params);
    }

    /**
     * Creates a new Connection object
     *
     * @return {Connection} connection
     */
    static create() {
        return new Connection({
            id: Connection.createId(),
            title: 'New connection'
        });
    }

    /**
     * Gets the remote URL
     *
     * @param {Boolean} withSlash
     *
     * @returns {String} URL
     */
    getRemoteUrl(withSlash = false) {
        let url = this.url;

        if(!withSlash && url[url.length - 1] == '/') {
            url = url.substring(0, url.length - 1);

        } else if(withSlash && url[url.length - 1] != '/') {
            url += '/';
        
        }

        return url;
    }
}

module.exports = Connection;
