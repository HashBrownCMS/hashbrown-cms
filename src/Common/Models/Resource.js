'use strict';

const Entity = require('./Entity');

/**
 * Basic resource class
 *
 * @memberof HashBrown.Common.Models
 */
class Resource extends Entity {
    /**
     * Checks the format of the params
     *
     * @params {Object} params
     *
     * @returns {Object} Params
     */
    static paramsCheck(params) {
        params = params || {}

        // Remove MongoDB id
        delete params._id;

        // Convert from old sync variables
        params.sync = params.sync || {};

        if(typeof params.local !== 'undefined') {
            if(typeof params.sync.isRemote === 'undefined') {
                params.sync.hasRemote = params.local;
            }
            
            delete params.local;
        }

        if(typeof params.remote !== 'undefined') {
            if(typeof params.sync.isRemote === 'undefined') {
                params.sync.isRemote = params.remote;
            }
            
            delete params.remote;
        }

        // Convert from old "locked" state
        if(typeof params.locked !== 'undefined') {
            if(typeof params.isLocked === 'undefined') {
                params.isLocked = params.locked;
            }

            delete params.locked;
        }

        return params;
    }
}

module.exports = Resource;
