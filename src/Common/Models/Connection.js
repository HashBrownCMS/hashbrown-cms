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
     * Constructor
     */
    constructor(params) {
        super(Connection.paramsCheck(params));
    }

    /**
     * Structure
     */
    structure() {
        this.def(String, 'id');
        this.def(String, 'title');
        this.def(String, 'url');
        this.def(Boolean, 'useLocal');
        this.def(Boolean, 'isLocked');

        this.def(Processor, 'processor');
        this.def(Deployer, 'deployer');
        
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
        // Backwards compatibility: Convert from old structure
        if(params.type) {
            params = this.getPresetSettings(params.type.toLowerCase().replace(/ /g, '-'), params.settings);
        }

        // Paths
        if(!params.paths) { params.paths = {}; }
        if(!params.paths.templates) { params.paths.templates = {}; }
       
        // Deployer and processor
        if(!params.processor) { params.processor = {}; }
        if(!params.deployer) { params.deployer = {}; }
        
        return super.paramsCheck(params);
    }

    /**
     * Gets preset settings
     *
     * @param {String} preset
     * @param {Object} oldSettings
     */
    static getPresetSettings(preset, oldSettings) {
        oldSettings = oldSettings || {};

        let settings;

        switch(preset) {
            case 'github-pages':
                settings = {
                    useLocal: oldSettings.isLocal || false,
                    url: oldSettings.url || '',
                    processor: {
                        type: 'Jekyll'
                    },
                    deployer: {
                        type: 'GitHub',
                        token: oldSettings.token || '',
                        org: oldSettings.org || '',
                        repo: oldSettings.repo || '',
                        branch: oldSettings.branch || '',
                    },
                    paths: {
                        templates: {
                            partial: '/_includes/partials/',
                            page: '/_layouts/'
                        },
                        content: '/content/',
                        media: '/media/'
                    }
                };
                break;

            case 'hashbrown-driver':
                settings = {
                    url: oldSettings.url || '',
                    processor: {
                        type: 'json'
                    },
                    deployer: {
                        type: 'api',
                        token: oldSettings.token || ''
                    },
                    paths: {
                        templates: {
                            partial: '/hashbrown/api/templates/partial/',
                            page: '/hashbrown/api/templates/page/'
                        },
                        content: '/hashbrown/api/content/',
                        media: '/hashbrown/api/media/'
                    }
                };
                break;
        }

        return settings;
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
