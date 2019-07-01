'use strict';

const Path = require('path');

const Entity = require('./Entity');

/**
 * A class for deploying and retrieving data to and from a server
 *
 * @memberof HashBrown.Common.Models
 */
class Deployer extends Entity {
    static get title() { return 'Deployer'; }
    static get alias() { return 'deployer'; }
    
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.title = this.constructor.title;
        this.alias = this.constructor.alias;

        if(!this.paths) { this.paths = {}; }
    }
   
    /**
     * Parameter sanity check
     */
    static paramsCheck(params) {
        params = params || {};

        delete params.title;
        delete params.name;
        delete params.alias;

        return params;
    }

    /**
     * Structure
     */
    structure() {
        this.def(String, 'title');
        this.def(String, 'alias');
        this.def(Object, 'paths', {
            media: '',
            content: ''
        });
    }
}

module.exports = Deployer;
