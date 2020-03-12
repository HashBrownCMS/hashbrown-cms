'use strict';

const Path = require('path');

/**
 * The Connection class
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
     * Gets a deployer
     *
     * @string {String} alias
     *
     * @returns {HashBrown.Entity.Deployer} Deployer
     */
    static getDeployer(alias) {
        for(let name in HashBrown.Entity.Deployer) {
            let deployer = HashBrown.Entity.Deployer[name];

            if(deployer.alias !== alias) { continue; }

            return deployer;
        }
        
        return null;
    }
    
    /**
     * Gets a processor
     *
     * @string {String} alias
     *
     * @returns {HashBrown.Entity.Processor} Processor
     */
    static getProcessor(alias) {
        for(let name in HashBrown.Entity.Processor) {
            let processor = HashBrown.Entity.Processor[name];

            if(processor.alias !== alias) { continue; }

            return processor;
        }

        return null;
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
        if(!params.processor) { params.processor = {}; }
        if(!params.deployer) { params.deployer = {}; }
        if(!params.deployer.paths) { params.deployer.paths = {}; }
        
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
