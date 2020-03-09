'use strict';

const Path = require('path');

/**
 * The Connection class
 *
 * @memberof HashBrown.Common.Entity.Resource
 */
class Connection extends HashBrown.Entity.Resource.ResourceBase {
    static get category() { return 'connections'; }

    /**
     * Structure
     */
    structure() {
        super.structure();

        this.def(String, 'title');
        this.def(String, 'url');
    }

    /**
     * Gets the human readable name
     *
     * @return {String} Name
     */
    getName() {
        return this.title || this.id;
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
