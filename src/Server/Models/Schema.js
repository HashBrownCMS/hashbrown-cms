'use strict';

const SchemaCommon = require('Common/Models/Schema');

/**
 * A model for Schemas
 *
 * @memberof HashBrown.Server.Models
 */
class Schema extends SchemaCommon {
    constructor(properties) {
        super(properties);
    }
}

module.exports = Schema;
