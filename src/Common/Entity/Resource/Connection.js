'use strict';

const Path = require('path');

/**
 * The connection class
 *
 * @memberof HashBrown.Common.Entity.Resource
 */
class Connection extends HashBrown.Entity.Resource.ResourceBase {
    static get icon() { return 'exchange'; }
    static get category() { return 'connections'; }

    /**
     * Structure
     */
    structure() {
        super.structure();

        this.def(String, 'name', 'New connection');
        this.def(String, 'url');
    }

    /**
     * Gets the human readable name
     *
     * @return {String} Name
     */
    getName() {
        return this.name || this.id;
    }

    /**
     * Constructs a URL from the member variable and an appendix
     *
     * @param {String} appendix
     *
     * @return {String} URL
     */
    getUrl(appendix = '') {
        if(!appendix) { return this.url; }

        if(typeof appendix === 'object') {
            appendix = appendix[window.language];
        }

        if(this.url[this.url.length - 1] !== '/') {
            this.url += '/';
        }

        if(appendix[0] === '/') {
            appendix = appendix.substring(1);
        }

        return this.url + appendix;
    }

    /**
     * Adopts values into this entity
     *
     * @param {Object} params
     */
    adopt(params = {}) {
        checkParam(params, 'params', Object);

        params = params || {};
        
        // Deployer and processor
        if(!params.deployer) { params.deployer = {}; }
        if(!params.deployer.paths) { params.deployer.paths = {}; }
        
        if(params.title) {
            params.name = params.title;
            delete params.title;
        }

        // Move file extension from processor to deployer
        if(params.processor && params.processor.fileExtension) {
            params.deployer.fileExtension = params.processor.fileExtension;
        }

        super.adopt(params);
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
