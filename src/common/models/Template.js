'use strict';

let Entity = require('./Entity');

/**
 * The Template model
 */
class Template extends Entity {
    constructor(params) {
        super(params);
    }

    structure() {
        this.def(String, 'id');
        this.def(String, 'parentId');
        this.def(Boolean, 'remote', true);
        this.def(String, 'icon', 'code');
        this.def(String, 'name');
        this.def(String, 'type');
        this.def(String, 'remotePath');
        this.def(String, 'folder');
        this.def(String, 'markup');
    }

    /**
     * Updates id and remotePath from name
     */
    updateFromName() {
        this.id = this.name.substring(0, this.name.lastIndexOf('.')) || this.name;
    }
}

module.exports = Template;
