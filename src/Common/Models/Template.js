'use strict';

const Resource = require('./Resource');

/**
 * The Template model
 *
 * @memberof HashBrown.Common.Models
 */
class Template extends Resource {
    constructor(params) {
        super(Template.paramsCheck(params));
    }
    
    /**
     * Checks the format of the params
     *
     * @params {Object} params
     *
     * @returns {Object} Params
     */
    static paramsCheck(params) {
        params = super.paramsCheck(params);

        delete params.remote;
        delete params.sync;
        delete params.isRemote;

        return params;
    }

    structure() {
        this.def(String, 'id');
        this.def(String, 'parentId');
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
