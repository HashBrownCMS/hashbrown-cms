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
}

module.exports = Deployer;
